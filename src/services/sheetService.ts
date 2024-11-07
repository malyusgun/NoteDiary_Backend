import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import path from 'node:path';
import { ISheet, IEditSheetBackground } from '../interfaces/requests';
import { randomUUID } from 'node:crypto';
import UserService from './userService';
import { IEntityDB, ISheetDB } from '../interfaces/database';

const prisma = new PrismaClient();

class SheetService {
  // the only method for buffer connection
  async getSheetBackground(sheet_uuid: string) {
    const backgroundInfo = await prisma.sheet.findFirst({
      where: {
        sheet_uuid: sheet_uuid
      }
    });
    if (backgroundInfo?.background_path) {
      const file = fs.readFileSync(backgroundInfo.background_path);
      return Buffer.from(file);
    }
  }

  async createSheet(body: ISheet) {
    if (!body.sheet_uuid) {
      body.sheet_uuid = randomUUID();
    }
    body.sheet_icon = 'page';
    body.sheet_navigation_order = '1';
    body.sheet_entities = [];
    await UserService.addUserSheet(body, body.user_uuid);
    return prisma.sheet.create({ data: body as ISheetDB });
  }

  async getSheet(sheet_uuid: string) {
    return prisma.sheet.findFirst({
      where: {
        sheet_uuid: sheet_uuid
      }
    });
  }

  async addSheetEntity(body: IEntityDB, sheet_uuid: string) {
    const sheet = (await prisma.sheet.findFirst({
      where: {
        sheet_uuid
      }
    })) as ISheetDB;

    const newEntity = body.entity_type + '$' + body.entity_uuid;
    if (sheet.sheet_entities?.length) {
      sheet.sheet_entities.push(newEntity);
    } else sheet.sheet_entities = [newEntity];
    await prisma.sheet.update({
      data: sheet,
      where: {
        sheet_uuid
      }
    });
  }

  async editSheet(body: ISheet) {
    return prisma.sheet.update({
      where: {
        sheet_uuid: body.sheet_uuid
      },
      data: body
    });
  }

  async editSheetBackground(body: IEditSheetBackground) {
    const response = await fetch(body.background_url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imagePath = path.join(path.resolve(), `/public/images/backgrounds/homeBackground.jpg`);
    fs.writeFileSync(imagePath, buffer);
    const currentSheet = (await prisma.sheet.findFirst({
      where: {
        sheet_uuid: body.sheet_uuid
      }
    })) as ISheetDB;
    return prisma.sheet.update({
      where: {
        sheet_uuid: body.sheet_uuid
      },
      data: { ...currentSheet, background_path: imagePath }
    });
  }

  async deleteSheet(sheet: ISheet) {
    await UserService.deleteUserSheet(sheet.sheet_uuid!, sheet.user_uuid);
    return prisma.sheet.delete({
      where: {
        sheet_uuid: sheet.sheet_uuid
      }
    });
  }

  async deleteSheetEntity(sheet_uuid: string, entity_uuid: string) {
    const newState = (await prisma.sheet.findFirst({
      where: {
        sheet_uuid: sheet_uuid
      }
    })) as ISheetDB;
    newState.sheet_entities = newState.sheet_entities.filter((entity: string) => entity.split('$')[1] !== entity_uuid);
    await prisma.sheet.update({
      data: { ...newState },
      where: {
        sheet_uuid: sheet_uuid
      }
    });
  }

  async deleteSheetBackground(sheet_uuid: string) {
    const sheet = (await prisma.sheet.findFirst({
      where: {
        sheet_uuid: sheet_uuid
      }
    })) as ISheetDB;
    const { background_path, ...newState } = sheet;
    const imagePath = path.join(path.resolve(), `/public/images/backgrounds/homeBackground.jpg`);
    fs.unlink(imagePath, (err) => {
      if (err) throw err;
    });
    await prisma.sheet.update({
      data: newState,
      where: {
        sheet_uuid: sheet_uuid
      }
    });
  }
}

export default new SheetService();
