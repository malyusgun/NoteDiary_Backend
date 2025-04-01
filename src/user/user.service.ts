import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { UserDTO } from './dto/user.dto';
import {
  convertUserData,
  getUserDataFromAuthFile,
} from './helpers/user.helpers';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../prisma.service';
import { EntitiesService } from '../entities/entities.service';
import ApiError from '../exceptions/ApiError';
import { IError, ITokenPayload, IUserDB } from './interfaces/user.interfaces';
import { JwtPayload } from 'jsonwebtoken';
import { ISheetDB } from '../sheet/interfaces/sheet.interfaces';
import { EntityDBDTO } from '../entities/dto/entities.dto';

@Injectable()
export class UserService {
  constructor(
    private mailService: MailService,
    private entitiesService: EntitiesService,
    private tokenService: TokenService,
    private prisma: PrismaService,
  ) {}

  async confirmMail(dto: UserDTO) {
    dto.user_uuid = randomUUID();
    const usersDataFile = path.join(path.resolve(), `/public/auth.txt`);
    if (!fs.existsSync(usersDataFile)) {
      fs.writeFileSync(usersDataFile, '');
    }
    const fileContent = fs.readFileSync(usersDataFile).toString();

    let code = (Math.random() * 1000000).toFixed();
    while (code.length < 6) {
      code = '0' + code;
    }
    const userInfo = convertUserData(dto, 'to', code) as string;
    fs.writeFileSync(usersDataFile, fileContent + userInfo);
    await this.mailService.sendActivationMail(dto.email, code);
    return {
      code,
      user_uuid: dto.user_uuid,
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

  async registration(dto: UserDTO) {
    const userData = { ...dto };
    const tokens = this.tokenService.generateTokens({
      user_uuid: dto.user_uuid!,
      password: dto.password,
    });
    let userDataDB = { ...userData, access_token: '', refresh_token: '' };
    userDataDB.access_token = tokens.accessToken;
    userDataDB.refresh_token = tokens.refreshToken;
    return await this.createUser(userDataDB);
  }

  refresh(refresh_token: string) {
    const refreshResult = this.tokenService.validateRefreshToken(refresh_token);
    if (!refreshResult) {
      throw ApiError.throwUnauthorizedException();
    }
    const mainUserData = { ...(refreshResult as JwtPayload) };
    delete mainUserData.exp;
    delete mainUserData.iat;
    return this.tokenService.generateAccessToken(mainUserData as ITokenPayload);
  }

  async login(dto: UserDTO): Promise<IUserDB | IError> {
    let userDataDB = await this.getUser(dto.nick_name, true);
    if (dto.password !== userDataDB.password) {
      return ApiError.throwForbiddenException();
    }
    const tokens = this.tokenService.generateTokens({
      user_uuid: userDataDB.user_uuid,
      password: userDataDB.password,
    });
    userDataDB.access_token = tokens.accessToken;
    userDataDB.refresh_token = tokens.refreshToken;
    return userDataDB;
  }

  async logout(dto: UserDTO) {
    const userDataDB = (await this.prisma.user.findFirst({
      where: {
        nick_name: dto.nick_name,
      },
    })) as unknown as IUserDB;
    let userDataWithoutTokens = {
      ...userDataDB,
      user_sheets: JSON.stringify(dto.user_sheets),
    };
    delete userDataWithoutTokens.access_token;
    delete userDataWithoutTokens.refresh_token;
    await this.prisma.user.update({
      where: {
        user_uuid: userDataWithoutTokens.user_uuid,
      },
      data: userDataWithoutTokens,
    });
    return true;
  }

  async createUser(dto: UserDTO) {
    const homeSheetUuid = randomUUID();
    const userSheets = [
      {
        user_uuid: dto.user_uuid,
        sheet_uuid: homeSheetUuid,
        sheet_title: 'Home page',
        sheet_icon: 'home',
        sheet_children: [],
      },
    ];

    const createdUser = await this.prisma.user.create({
      data: { ...dto, user_sheets: JSON.stringify(userSheets) },
    });
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
      entity_order: 1,
    };

    const homeSheet = {
      user_uuid: dto.user_uuid,
      sheet_uuid: homeSheetUuid,
      sheet_title: 'Home page',
      sheet_icon: 'home',
      sheet_children: [],
    };
    await this.prisma.sheet.create({ data: homeSheet as unknown as ISheetDB });
    await this.entitiesService.createEntity(startEntity as EntityDBDTO);

    return {
      createdUser,
      homeSheet,
      startEntity,
    };
  }

  async getUser(uniqueKey: string, isNickName?: boolean) {
    if (isNickName) {
      return this.prisma.user.findFirst({
        where: {
          nick_name: uniqueKey,
        },
      }) as unknown as IUserDB;
    }
    return this.prisma.user.findFirst({
      where: {
        user_uuid: uniqueKey,
      },
    }) as unknown as IUserDB;
  }

  async addUserSheet(sheet: ISheetDB, user_uuid: string) {
    const user = (await this.prisma.user.findFirst({
      where: {
        user_uuid: user_uuid,
      },
    })) as unknown as IUserDB;
    const userSheets = JSON.parse(user.user_sheets);
    userSheets.push(sheet);
    user.user_sheets = JSON.stringify(userSheets);
    return this.prisma.user.update({
      data: user as IUserDB,
      where: {
        user_uuid: user.user_uuid,
      },
    });
  }

  async editUser(dto: UserDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        user_uuid: dto.user_uuid,
      },
    });
    return this.prisma.user.update({
      data: { ...user, ...dto, user_sheets: JSON.stringify(dto.user_sheets) },
      where: {
        user_uuid: dto.user_uuid,
      },
    }) as unknown as IUserDB;
  }

  async deleteUser(dto: UserDTO) {
    const imagesPath = path.join(path.resolve(), `/public/images`);
    const images = fs.readdirSync(imagesPath);
    images.forEach((image) => {
      if (image.includes(dto.user_uuid!))
        fs.unlinkSync(path.resolve(imagesPath, image));
    });
    return this.prisma.user.delete({
      where: {
        user_uuid: dto.user_uuid,
      },
    }) as unknown as IUserDB;
  }

  async deleteUserSheet(sheet_uuid: string, user_uuid: string) {
    const currentUser = (await this.prisma.user.findFirst({
      where: {
        user_uuid: user_uuid,
      },
    })) as IUserDB;

    let userSheets = JSON.parse(currentUser.user_sheets);
    userSheets = userSheets.filter(
      (sheet: ISheetDB) => sheet.sheet_uuid !== sheet_uuid,
    );
    currentUser.user_sheets = JSON.stringify(userSheets);

    return this.prisma.user.update({
      data: currentUser,
      where: {
        user_uuid: currentUser.user_uuid,
      },
    });
  }
}
