import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

class HomeService {
  async getEntities() {
    const entitiesDB = await prisma.home_entity.findMany({
      orderBy: [{ entity_order: 'asc' }]
    });
    const entitiesImages = [];
    const entitiesToReturn = entitiesDB.map((entity) => {
      if (!entity.image_width) return entity;
      const imagePath = path.join(path.resolve(), `/public/images/${entity.entity_uuid}.jpg`);
      const file = fs.readFileSync(imagePath);
      console.log('file in readFile: ', file);
      // const blob = new Blob([file], { type: 'image/jpeg' });
      // console.log('blob: ', blob);
      const buffer = Buffer.from(file, 'base64');
      entitiesImages.push(buffer);
      console.log('entitiesImages', entitiesImages);
      return entity;
    });
    return {
      entities: entitiesToReturn,
      entitiesImages: entitiesImages
    };
  }
  async getHomeBackgroundUrl() {
    return prisma.setting.findFirst({
      where: {
        setting_name: 'homeBackgroundUrl'
      }
    });
  }
  async createEntity(body) {
    if (body.image_blob) {
      const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
      let newImagePath = imagePath.split('\\');
      newImagePath.splice(-1);
      console.log('1 newImagePath', newImagePath);
      newImagePath.push(`${body.entity_uuid}.jpg`);
      console.log('2 newImagePath', newImagePath);
      newImagePath = newImagePath.join('\\');
      console.log('3 newImagePath', newImagePath);
      fs.rename(imagePath, newImagePath, function (err) {
        if (err) console.log('ERROR in fs.rename: ' + err);
      });
      delete body.image_blob;
      body.image_path = newImagePath;
      console.log('body image: ', body);
    }
    return prisma.home_entity.create({ data: { ...body } });
  }
  async createImageEntity(body) {
    const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
    fs.writeFileSync(imagePath, body);
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
