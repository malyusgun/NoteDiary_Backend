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

const prisma = new PrismaClient();

class UserService {
  confirmMail(body: IUser) {
    body.user_uuid = randomUUID();
    const usersDataFile = path.join(path.resolve(), `/public/auth.txt`);
    if (!fs.existsSync(usersDataFile)) {
      fs.writeFileSync(usersDataFile, '');
    }
    let fileContent = fs.readFileSync(usersDataFile).toString();

    const code = (Math.random() * 1000000).toFixed();
    const userInfo = convertUserData(body, 'to', code);
    fs.writeFileSync(usersDataFile, fileContent + userInfo);
    return code;
  }

  getConfirmMailCode(user_uuid: string) {
    const userData = getUserDataFromAuthFile(user_uuid);
    return userData.code;
  }

  async registration(body: IUser) {
    const tokens = tokenService.generateTokens({
      user_uuid: body.user_uuid!,
      password: body.password
    });
    let userDataDB = { ...body, access_token: '', refresh_token: '' };
    userDataDB.access_token = tokens.accessToken;
    userDataDB.refresh_token = tokens.refreshToken;
    return await this.createUser(userDataDB as unknown as IUserDB);
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

    const createdUser = await prisma.user.create({ data: { ...body, user_sheets: JSON.stringify(userSheets) } });
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

  async getUser(user_uuid: string) {
    return prisma.user.findFirst({
      where: {
        user_uuid
      }
    });
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
    });
  }
  async deleteUser(body: IUser) {
    return prisma.user.delete({
      where: {
        user_uuid: body.user_uuid
      }
    });
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
