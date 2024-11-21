import { PrismaClient } from '@prisma/client';
import { ISheet, IUser } from '../interfaces/requests';
import { IEntityDB, IUserDB } from '../interfaces/database';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import * as fs from 'node:fs';
import SheetService from './sheetService';
import EntitiesService from './entitiesService';
import tokenService from './tokenService';
import { convertUserData, getUserDataFromAuthFile } from '../helpers';
import { IError, ITokenPayload } from '../interfaces';
import sendActivationMail from './mailService';
import ApiError from '../exceptions/ApiError';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

class UserService {
  async confirmMail(body: IUser) {
    body.user_uuid = randomUUID();
    const usersDataFile = path.join(path.resolve(), `/public/auth.txt`);
    if (!fs.existsSync(usersDataFile)) {
      fs.writeFileSync(usersDataFile, '');
    }
    let fileContent = fs.readFileSync(usersDataFile).toString();

    let code = (Math.random() * 1000000).toFixed();
    while (code.length < 6) {
      code = '0' + code;
    }
    const userInfo = convertUserData(body, 'to', code);
    fs.writeFileSync(usersDataFile, fileContent + userInfo);
    await sendActivationMail(body.email, code);
    return {
      code,
      user_uuid: body.user_uuid
    };
  }

  getConfirmMailCode(user_uuid: string) {
    const userData = getUserDataFromAuthFile(user_uuid);
    // code expired, 5 minutes have passed
    if (Date.now() >= +userData.codeDieTime) {
      return 'expired';
    }
    return userData.code;
  }

  async registration(body: IUser) {
    const userData = { ...body };
    const tokens = tokenService.generateTokens({
      user_uuid: body.user_uuid!,
      password: body.password
    });
    let userDataDB = { ...userData, access_token: '', refresh_token: '' };
    userDataDB.access_token = tokens.accessToken;
    userDataDB.refresh_token = tokens.refreshToken;
    return await this.createUser(userDataDB as unknown as IUserDB);
  }

  refresh(refresh_token: string) {
    const refreshResult = tokenService.validateRefreshToken(refresh_token);
    if (!refreshResult) {
      throw ApiError.throwUnauthorizedException();
    }
    const mainUserData = { ...(refreshResult as JwtPayload) };
    delete mainUserData.exp;
    delete mainUserData.iat;
    return tokenService.generateAccessToken(mainUserData as ITokenPayload);
  }

  async login(body: IUser): Promise<IUserDB | IError> {
    let userDataDB = await this.getUser(body.nick_name, true);
    if (body.password !== userDataDB.password) {
      return ApiError.throwForbiddenException();
    }
    const tokens = tokenService.generateTokens({
      user_uuid: userDataDB.user_uuid,
      password: userDataDB.password
    });

    userDataDB.access_token = tokens.accessToken;
    userDataDB.refresh_token = tokens.refreshToken;
    return userDataDB;
  }

  async logout(body: IUser) {
    const userDataDB = (await prisma.user.findFirst({
      where: {
        nick_name: body.nick_name
      }
    })) as unknown as IUserDB;
    let userDataWithoutTokens = {
      ...userDataDB,
      user_sheets: JSON.stringify(body.user_sheets)
    } as IUserDB;
    delete userDataWithoutTokens.access_token;
    delete userDataWithoutTokens.refresh_token;
    await prisma.user.update({
      where: {
        user_uuid: userDataWithoutTokens.user_uuid
      },
      data: userDataWithoutTokens
    });
    return true;
  }

  async createUser(body: IUserDB) {
    const homeSheetUuid = randomUUID();
    const userSheets = [
      {
        sheet_uuid: homeSheetUuid,
        sheet_title: 'Home page',
        sheet_icon: 'home',
        sheet_navigation_order: '0'
      }
    ];

    const createdUser = (await prisma.user.create({
      data: { ...body, user_sheets: JSON.stringify(userSheets) }
    })) as IUserDB;
    const startEntity = {
      entity_uuid: randomUUID(),
      sheet_uuid: homeSheetUuid,
      entity_type: 'paragraph',
      title: 'Home, sweet home...',
      text:
        'This is your start page.\nWhat can you do? Turn on the "Edit mode" in the upper right corner and see what happens.\n' +
        'Create new something by press the button on the bottom (with plus).\nCheck the Menu by button in the upper left corner.\n' +
        'Note your notes, create something helpful for you and do everything you want!',
      paragraph_size: 'half',
      font_size: '24',
      entity_position: 'center',
      entity_title_position: 'center',
      entity_order: 1
    };

    const homeSheet = await SheetService.createSheet({
      user_uuid: body.user_uuid,
      sheet_uuid: homeSheetUuid,
      sheet_title: 'Home page',
      sheet_navigation_order: '0'
    });

    await EntitiesService.createEntity(startEntity as IEntityDB);

    return {
      createdUser,
      homeSheet,
      startEntity
    };
  }

  async getUser(uniqueKey: string, isNickName?: boolean) {
    if (isNickName) {
      return prisma.user.findFirst({
        where: {
          nick_name: uniqueKey
        }
      }) as unknown as IUserDB;
    }
    return prisma.user.findFirst({
      where: {
        user_uuid: uniqueKey
      }
    }) as unknown as IUserDB;
  }

  async addUserSheet(sheet: ISheet, user_uuid: string) {
    const user = (await prisma.user.findFirst({
      where: {
        user_uuid: user_uuid
      }
    })) as unknown as IUserDB;
    const userSheets = JSON.parse(user.user_sheets);
    userSheets.push(sheet);
    user.user_sheets = JSON.stringify(userSheets);

    return prisma.user.update({
      data: user as IUserDB,
      where: {
        user_uuid: user.user_uuid
      }
    });
  }

  async editUser(body: IUser) {
    return prisma.user.update({
      data: { ...body, user_sheets: JSON.stringify(body.user_sheets) },
      where: {
        user_uuid: body.user_uuid
      }
    }) as unknown as IUserDB;
  }

  async deleteUser(body: IUser) {
    const imagesPath = path.join(path.resolve(), `/public/images`);
    const images = fs.readdirSync(imagesPath);
    images.forEach((image) => {
      if (image.includes(body.user_uuid!)) fs.unlinkSync(path.resolve(imagesPath, image));
    });
    return prisma.user.delete({
      where: {
        user_uuid: body.user_uuid
      }
    }) as unknown as IUserDB;
  }

  async deleteUserSheet(sheet_uuid: string, user_uuid: string) {
    const currentUser = (await prisma.user.findFirst({
      where: {
        user_uuid: user_uuid
      }
    })) as IUserDB;

    let userSheets = JSON.parse(currentUser.user_sheets);
    userSheets = userSheets.filter((sheet: ISheet) => sheet.sheet_uuid !== sheet_uuid);
    currentUser.user_sheets = JSON.stringify(userSheets);

    return prisma.user.update({
      data: currentUser,
      where: {
        user_uuid: currentUser.user_uuid
      }
    });
  }
}

export default new UserService();
