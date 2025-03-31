import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { ISheetDB } from '../sheet/interfaces';
import { EntityDBDTO } from './dto/entities.dto';
import {
  createPrismaEntity,
  deletePrismaEntity,
  getImagePathByUuid,
  getPrismaEntity,
  updatePrismaEntity,
} from './helpers';
import { SheetService } from '../sheet/sheet.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EntitiesService {
  constructor(
    private prisma: PrismaService,
    private sheetService: SheetService,
  ) {}
  buffer: Buffer | undefined;

  // the only methods for buffer
  createImage(body: Buffer) {
    try {
      const originalImagePath = path.join(
        path.resolve(),
        `/public/images/originalImage.jpg`,
      );
      const imagesPath = path.join(path.resolve(), `/public`);
      if (!fs.existsSync(imagesPath)) {
        fs.mkdirSync(imagesPath);
        fs.mkdirSync(path.join(imagesPath, '/images'));
      }
      fs.writeFileSync(originalImagePath, body);
      this.buffer = body;
    } catch (e) {
      console.log('error: ', e);
    }
  }

  createImageForCrop(body: Buffer) {
    const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
    this.buffer = body;
    fs.writeFileSync(imagePath, body);
  }

  async createEntity(body: EntityDBDTO) {
    if (!body.entity_uuid) body.entity_uuid = randomUUID();

    if (body.entity_type === 'image') {
      const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
      const originalImagePath = path.join(
        path.resolve(),
        `/public/images/originalImage.jpg`,
      );
      fs.writeFileSync(imagePath, this.buffer!);
      const newImagePath = getImagePathByUuid(body.entity_uuid);
      const newOriginalImagePath = getImagePathByUuid(body.entity_uuid, true);

      fs.renameSync(imagePath, newImagePath);
      fs.renameSync(originalImagePath, newOriginalImagePath);
      body.image_path = newImagePath;
    }

    const sheet_uuid = body.sheet_uuid!;
    delete body.sheet_uuid;
    const createdEntity = (await createPrismaEntity(body)) as EntityDBDTO;
    await this.sheetService.addSheetEntity(body, sheet_uuid);

    return createdEntity;
  }

  async getEntities(sheet_uuid: string) {
    const sheetInfo = (await this.prisma.sheet.findFirst({
      where: {
        sheet_uuid: sheet_uuid,
      },
    })) as ISheetDB;
    if (sheetInfo.sheet_entities.length) {
      const entities: EntityDBDTO[] = [];
      for (const sheetEntity of sheetInfo.sheet_entities) {
        const entityToPush = (await getPrismaEntity(
          sheetEntity,
        )) as EntityDBDTO;
        entities.push(entityToPush);
      }
      const imageEntities: Buffer[][] = [];
      entities.forEach((entity) => {
        if (!entity?.image_width) return;

        const imagePath = path.join(
          path.resolve(),
          `/public/images/${entity.entity_uuid}.jpg`,
        );
        const file = fs.readFileSync(imagePath);
        const buffer = Buffer.from(file);
        imageEntities.push([buffer]);

        const originalImagePath = path.join(
          path.resolve(),
          `/public/images/original${entity.entity_uuid}.jpg`,
        );
        const originalFile = fs.readFileSync(originalImagePath);
        const originalBuffer = Buffer.from(originalFile);
        imageEntities.push([originalBuffer]);
      });
      return {
        entities: entities,
        imageEntities: imageEntities,
      };
    } else
      return {
        entities: [],
        entitiesImages: [],
      };
  }

  cropImage(body: EntityDBDTO) {
    const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
    fs.writeFileSync(imagePath, this.buffer!);
    fs.unlinkSync(body.image_path!);
    fs.renameSync(imagePath, body.image_path!);

    delete body.image_url;
    return this.prisma.image.update({
      where: {
        entity_uuid: body.entity_uuid,
      },
      data: { ...body },
    });
  }

  async returnOriginalSizeImage(body: EntityDBDTO) {
    body.image_path = getImagePathByUuid(body.entity_uuid, true);
    const newState = await this.prisma.image.update({
      where: {
        entity_uuid: body.entity_uuid,
      },
      data: { ...body },
    });
    const file = fs.readFileSync(body.image_path);
    const buffer = Buffer.from(file);
    return { buffer: [buffer], entity: newState };
  }

  async editEntity(body: EntityDBDTO) {
    return updatePrismaEntity(body);
  }

  async changeEntitiesOrder(body: { main: EntityDBDTO; target: EntityDBDTO }) {
    const mainEntity = body.main;
    const targetEntity = body.target;
    const mainEntityOrder = mainEntity.entity_order;
    mainEntity.entity_order = targetEntity.entity_order;
    targetEntity.entity_order = mainEntityOrder;
    await updatePrismaEntity({ ...mainEntity });
    await updatePrismaEntity({ ...targetEntity });
    return {
      main: mainEntity,
      target: targetEntity,
    };
  }

  async deleteEntity(body: EntityDBDTO) {
    await deletePrismaEntity(body);
    if (body.image_path) {
      fs.unlink(body.image_path, (err) => {
        if (err) throw err;
      });
      const originalImagePath = getImagePathByUuid(body.entity_uuid, true);
      if (fs.existsSync(originalImagePath)) {
        fs.unlink(originalImagePath, (err) => {
          if (err) throw err;
        });
      }
    }
    await this.sheetService.deleteSheetEntity(
      body.sheet_uuid!,
      body.entity_uuid,
    );
    return {
      entity_uuid: body.entity_uuid,
    };
  }
}
