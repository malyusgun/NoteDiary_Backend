import { PrismaClient } from '@prisma/client';
import { ISheet, IUser } from '../interface/requests';
import { randomUUID } from 'node:crypto';
import SheetsService from './sheetsService';
import EntitiesService from './entitiesService';
import { IEntityDB, IUserDB } from '../interface/database';

const prisma = new PrismaClient();

class UsersService {
  async createUser(body: IUser) {
    body.user_uuid = randomUUID();
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

    const homeSheet = await SheetsService.createSheet({
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

export default new UsersService();
