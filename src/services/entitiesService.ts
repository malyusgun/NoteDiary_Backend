import { PrismaClient } from '@prisma/client';
import * as fs from 'node:fs';
import path from 'node:path';
import { IEntity, IPageEntity } from '../interface/database';
import { randomUUID } from 'node:crypto';
import {
  createPrismaEntity,
  updatePrismaEntity,
  getPrismaEntity,
  deletePrismaEntity
} from '../helpers';
import PagesService from './pagesService';
const prisma = new PrismaClient();

class EntitiesService {
  async createEntity(body: IEntity) {
    if (!body.entity_uuid) body.entity_uuid = randomUUID();
    if (body?.image_buffer) {
      const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
      let newImagePath;
      if (process.platform.includes('win')) {
        newImagePath = imagePath.split('\\');
      } else {
        newImagePath = imagePath.split('/');
      }
      newImagePath.splice(-1);
      console.log('body in createEntity: ', body, 'body.entity_uuid: ', body.entity_uuid);
      newImagePath.push(`${body.entity_uuid}.jpg`);
      if (process.platform.includes('win')) {
        newImagePath = newImagePath.join('\\');
      } else {
        newImagePath = newImagePath.join('/');
      }
      fs.rename(imagePath, newImagePath, function (err) {
        if (err) console.log('ERROR in fs.rename: ' + err);
      });
      delete body.image_buffer;
      body.image_path = newImagePath;
    }
    const page_uuid = body.page_uuid!;
    delete body.page_uuid;
    const createdEntity = createPrismaEntity(body);
    await PagesService.addPageEntity(body, page_uuid);
    return createdEntity;
  }
  // единственная функция, срабатывающая по сокету для файлов
  async createImage(body: Buffer) {
    const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
    fs.writeFileSync(imagePath, body);
  }
  async getEntities(page_uuid: string) {
    const pageInfo = await prisma.page.findFirst({
      where: {
        page_uuid: page_uuid
      }
    });
    const pageEntities = pageInfo.page_entities;
    if (pageEntities) {
      const entitiesToReturn: IEntity[] = [];
      for (const pageEntity of pageEntities) {
        const entityToPush = await getPrismaEntity(pageEntity);
        entitiesToReturn.push(entityToPush);
      }
      const entitiesImages: Buffer[] = [];
      entitiesToReturn.forEach((entity) => {
        if (!entity?.image_width) return;
        const imagePath = path.join(path.resolve(), `/public/images/${entity.entity_uuid}.jpg`);
        const file = fs.readFileSync(imagePath);
        const buffer = Buffer.from(file);
        entitiesImages.push(buffer);
      });
      return {
        entities: entitiesToReturn,
        entitiesImages: entitiesImages
      };
    } else
      return {
        entities: [],
        entitiesImages: []
      };
  }
  async cropImage(body: IEntity) {
    const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
    fs.unlink(body.image_path!, (err) => {
      if (err) throw err;
    });
    fs.rename(imagePath, body.image_path!, function (err) {
      if (err) throw err;
    });
    delete body.imageUrl;
    return prisma.image.update({
      where: {
        entity_uuid: body.entity_uuid
      },
      data: { ...body }
    });
  }
  async editEntity(body: IEntity) {
    return updatePrismaEntity(body);
  }
  async changeEntitiesOrder(body: { main: IEntity; target: IEntity }) {
    const mainEntity = body.main;
    const targetEntity = body.target;
    const mainEntityOrder = mainEntity.entity_order;
    mainEntity.entity_order = targetEntity.entity_order;
    targetEntity.entity_order = mainEntityOrder;
    await updatePrismaEntity({ ...mainEntity });
    await updatePrismaEntity({ ...targetEntity });
    return {
      main: mainEntity,
      target: targetEntity
    };
  }
  async deleteEntity(body: IEntity) {
    await deletePrismaEntity(body);
    if (body.image_path)
      fs.unlink(body.image_path, (err) => {
        if (err) throw err;
      });
    await PagesService.deletePageEntity(body.page_uuid, body.entity_uuid);
    return {
      entity_uuid: body.entity_uuid
    };
  }
}

export default new EntitiesService();
