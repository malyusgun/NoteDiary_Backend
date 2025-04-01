import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { ISheetDB } from '../sheet/interfaces/sheet.interfaces';
import { EntityDBDTO } from './dto/entities.dto';
import {
  createPrismaEntity,
  deletePrismaEntity,
  getImagePathByUuid,
  getPrismaEntity,
  updatePrismaEntity,
} from './helpers/entities.helpers';
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

  async createEntity(dto: EntityDBDTO) {
    if (!dto.entity_uuid) dto.entity_uuid = randomUUID();

    if (dto.entity_type === 'image') {
      const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
      const originalImagePath = path.join(
        path.resolve(),
        `/public/images/originalImage.jpg`,
      );
      fs.writeFileSync(imagePath, this.buffer!);
      const newImagePath = getImagePathByUuid(dto.entity_uuid);
      const newOriginalImagePath = getImagePathByUuid(dto.entity_uuid, true);

      fs.renameSync(imagePath, newImagePath);
      fs.renameSync(originalImagePath, newOriginalImagePath);
      dto.image_path = newImagePath;
    }

    const sheet_uuid = dto.sheet_uuid!;
    delete dto.sheet_uuid;
    const createdEntity = (await createPrismaEntity(dto)) as EntityDBDTO;
    await this.sheetService.addSheetEntity(dto, sheet_uuid);

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

  cropImage(dto: EntityDBDTO) {
    const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
    fs.writeFileSync(imagePath, this.buffer!);
    fs.unlinkSync(dto.image_path!);
    fs.renameSync(imagePath, dto.image_path!);

    delete dto.image_url;
    return this.prisma.image.update({
      where: {
        entity_uuid: dto.entity_uuid,
      },
      data: { ...dto },
    });
  }

  async returnOriginalSizeImage(dto: EntityDBDTO) {
    dto.image_path = getImagePathByUuid(dto.entity_uuid, true);
    const newState = await this.prisma.image.update({
      where: {
        entity_uuid: dto.entity_uuid,
      },
      data: { ...dto },
    });
    const file = fs.readFileSync(dto.image_path);
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

  async deleteEntity(dto: EntityDBDTO) {
    await deletePrismaEntity(dto);
    if (dto.image_path) {
      fs.unlink(dto.image_path, (err) => {
        if (err) throw err;
      });
      const originalImagePath = getImagePathByUuid(dto.entity_uuid, true);
      if (fs.existsSync(originalImagePath)) {
        fs.unlink(originalImagePath, (err) => {
          if (err) throw err;
        });
      }
    }
    await this.sheetService.deleteSheetEntity(dto.sheet_uuid!, dto.entity_uuid);
    return {
      entity_uuid: dto.entity_uuid,
    };
  }
}
