import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

class HomeService {
  async getEntities() {
    return prisma.home_entity.findMany({
      orderBy: [{ entity_order: 'asc' }]
    });
  }
  async getHomeBackgroundUrl() {
    return prisma.setting.findFirst({
      where: {
        setting_name: 'homeBackgroundUrl'
      }
    });
  }
  async createEntity(body) {
    let pathOfImage = '';
    if (body.image_url) {
      console.log('body.image_url', body.image_url);
      // const response = await fetch(body.image_url);
      // const blob = await body.image_url.blob();
      const arrayBuffer = new ArrayBuffer(body.image_url);
      // const arrayBuffer = await body.image_url.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      pathOfImage = path.join(path.resolve(), `/public/images/${body.entity_uuid}`);
      console.log('pathOfImage', pathOfImage);
      fs.writeFile(pathOfImage, buffer, () => console.log('Written!'));
    }
    return prisma.home_entity.create({ data: { ...body, image_url: pathOfImage } });
  }
  async editEntity(body) {
    return prisma.home_entity.update({
      where: {
        entity_uuid: body.entity_uuid
      },
      data: { ...body }
    });
  }
  async deleteEntity(body) {
    const deletedEntity = await prisma.home_entity.findFirst({
      where: {
        entity_uuid: body.entity_uuid
      }
    });
    await prisma.home_entity.delete({
      where: {
        entity_uuid: body.entity_uuid
      }
    });
    return deletedEntity;
  }
  async changeOrderEntity(body) {
    const allEntities = await prisma.home_entity.findMany({
      orderBy: [{ entity_order: 'asc' }]
    });
    const currentEntity = allEntities.find((entity) => entity.entity_uuid === body.entity_uuid);
    const nextEntity =
      body.direction === 'up'
        ? allEntities.reverse().find((entity) => entity.entity_order < currentEntity.entity_order)
        : allEntities.find((entity) => entity.entity_order > currentEntity.entity_order);
    await prisma.home_entity.update({
      where: {
        entity_uuid: currentEntity.entity_uuid
      },
      data: {
        entity_order: nextEntity.entity_order
      }
    });
    await prisma.home_entity.update({
      where: {
        entity_uuid: nextEntity.entity_uuid
      },
      data: {
        entity_order: currentEntity.entity_order
      }
    });
    return body;
  }
  async changeHomeBackgroundUrl(body) {
    const homeBackgroundUrl = await prisma.setting.findFirst({
      where: {
        setting_name: 'homeBackgroundUrl'
      }
    });
    if (homeBackgroundUrl) {
      return prisma.setting.update({
        where: {
          setting_name: 'homeBackgroundUrl'
        },
        data: { ...body }
      });
    }
    return prisma.setting.create({ data: { ...body } });
  }
}

export default new HomeService();
