import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import path from 'node:path';
import { IBodyPage, IBodyPageUuid, IEditPageBackground } from '../interface/requests';
import { randomUUID } from 'node:crypto';
import UsersService from './usersService';
import { IEntity } from '../interface/database';

const prisma = new PrismaClient();

class PagesService {
  async createPage(body: IBodyPage) {
    body.page_uuid = randomUUID();
    body.page_icon = 'page';
    await UsersService.addUserPage(body.page_uuid, body.user_uuid);
    return prisma.page.create({ data: body });
  }
  async getPage(body: IBodyPageUuid) {
    return prisma.page.findFirst({
      where: {
        page_uuid: body.page_uuid
      }
    });
  }
  async getPageBackground(page_uuid: string) {
    const backgroundInfo = await prisma.page.findFirst({
      where: {
        page_uuid: page_uuid
      }
    });
    if (backgroundInfo?.background_path) {
      const file = fs.readFileSync(backgroundInfo.background_path);
      return Buffer.from(file);
    }
  }
  async addPageEntity(body: IEntity, page_uuid: string) {
    const page = await prisma.page.findFirst({
      where: {
        page_uuid
      }
    });
    let pageEntities = page.page_entities;
    const newEntity = {
      entity_type: body.entity_type,
      entity_uuid: body.entity_uuid
    };
    if (pageEntities?.length) {
      pageEntities.push(newEntity);
    } else pageEntities = [newEntity];
    page.page_entities = pageEntities;
    await prisma.page.update({
      data: page,
      where: {
        page_uuid
      }
    });
  }
  async editPage(body: IBodyPageUuid) {
    return prisma.page.update({
      where: {
        page_uuid: body.page_uuid
      },
      data: body
    });
  }
  async editPageBackground(body: IEditPageBackground) {
    const response = await fetch(body.background_url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imagePath = path.join(path.resolve(), `/public/images/backgrounds/homeBackground.jpg`);
    fs.writeFileSync(imagePath, buffer);
    const currentPage = await prisma.page.findFirst({
      where: {
        page_uuid: body.page_uuid
      }
    });
    if (currentPage) {
      return prisma.page.update({
        where: {
          page_uuid: body.page_uuid
        },
        data: { ...currentPage, background_path: imagePath }
      });
    }
  }
  async deletePage(page: IBodyPage) {
    await UsersService.deleteUserPage(page.page_uuid!, page.user_uuid);
    return prisma.page.delete({
      where: {
        page_uuid: page.page_uuid
      }
    });
  }
  async deletePageBackground(page_uuid: string) {
    const imagePath = path.join(path.resolve(), `/public/images/backgrounds/homeBackground.jpg`);
    fs.unlink(imagePath, (err) => {
      if (err) throw err;
    });
    await prisma.page.delete({
      where: {
        page_uuid: page_uuid
      }
    });
  }
}

export default new PagesService();
