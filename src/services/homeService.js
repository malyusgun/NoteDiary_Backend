import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

class HomeService {
  async getHomeBackground() {
    const backgroundInfo = await prisma.setting.findFirst({
      where: {
        setting_name: 'homeBackground'
      }
    });
    if (backgroundInfo?.setting_value) {
      const file = fs.readFileSync(backgroundInfo.setting_value);
      return Buffer.from(file, 'base64');
    }
  }
  async changeHomeBackground(body) {
    const response = await fetch(body.setting_value);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = body.extension.split('/')[1];
    const imagePath = path.join(path.resolve(), `/public/images/backgrounds/homeBackground.jpg`);
    fs.writeFileSync(imagePath, buffer);

    delete body.extension;
    body.setting_value = imagePath;
    const homeBackground = await prisma.setting.findFirst({
      where: {
        setting_name: 'homeBackground'
      }
    });
    if (homeBackground) {
      return prisma.setting.update({
        where: {
          setting_name: 'homeBackground'
        },
        data: { ...body }
      });
    }
    return prisma.setting.create({ data: { ...body } });
  }
  async removeHomeBackground() {
    const imagePath = path.join(path.resolve(), `/public/images/backgrounds/homeBackground.jpg`);
    fs.unlink(imagePath, (err) => {
      if (err) throw err;
    });
    await prisma.setting.delete({
      where: {
        setting_name: 'homeBackground'
      }
    });
  }
  async getEntities() {
    const entitiesDB = await prisma.home_entity.findMany({
      orderBy: [{ entity_order: 'asc' }]
    });
    const entitiesImages = [];
    const entitiesToReturn = entitiesDB.map((entity) => {
      if (!entity.image_width) return entity;
      const imagePath = path.join(path.resolve(), `/public/images/${entity.entity_uuid}.jpg`);
      const file = fs.readFileSync(imagePath);
      const buffer = Buffer.from(file, 'base64');
      entitiesImages.push(buffer);
      return entity;
    });
    return {
      entities: entitiesToReturn,
      entitiesImages: entitiesImages
    };
  }
  async createEntity(body) {
    if (body.image_buffer) {
      const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
      let newImagePath = imagePath.split('/');
      newImagePath.splice(-1);
      newImagePath.push(`${body.entity_uuid}.jpg`);
      newImagePath = newImagePath.join('/');
      fs.rename(imagePath, newImagePath, function (err) {
        if (err) console.log('ERROR in fs.rename: ' + err);
      });
      delete body.image_buffer;
      body.image_path = newImagePath;
    }
    return prisma.home_entity.create({ data: { ...body } });
  }
  // единственная функция, срабатывающая по сокету для файлов
  async createImage(body) {
    const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
    fs.writeFileSync(imagePath, body);
  }
  async cropImage(body) {
    const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
    fs.unlink(body.image_path, (err) => {
      if (err) throw err;
    });
    fs.rename(imagePath, body.image_path, function (err) {
      if (err) throw err;
    });
    delete body.imageUrl;
    return prisma.home_entity.update({
      where: {
        entity_uuid: body.entity_uuid
      },
      data: { ...body }
    });
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
    if (body.image_width)
      fs.unlink(body.image_path, (err) => {
        if (err) throw err;
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
}

export default new HomeService();
