import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import path from 'node:path';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'node:crypto';
import { SheetDTO, EditSheetBackgroundDTO } from './dto/sheet.dto';
import { UserService } from '../user/user.service';
import { EntityDBDTO } from '../entities/dto/entities.dto';
import { ISheetDB } from './interfaces/sheet.interfaces';

@Injectable()
export class SheetService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  // the only method for buffer connection
  async getSheetBackground(sheet_uuid: string) {
    const backgroundInfo = await this.prisma.sheet.findFirst({
      where: {
        sheet_uuid: sheet_uuid,
      },
    });
    if (backgroundInfo?.background_path) {
      const file = fs.readFileSync(backgroundInfo.background_path);
      return Buffer.from(file);
    }
  }

  async createSheet(dto: SheetDTO) {
    if (!dto.sheet_uuid) {
      dto.sheet_uuid = randomUUID();
    }
    dto.sheet_icon = 'page';
    dto.sheet_children = [];
    dto.sheet_entities = [];
    await this.userService.addUserSheet(dto as ISheetDB, dto.user_uuid);
    return this.prisma.sheet.create({ data: dto as ISheetDB });
  }

  async addSheetEntity(dto: EntityDBDTO, sheet_uuid: string) {
    const sheet = (await this.prisma.sheet.findFirst({
      where: {
        sheet_uuid,
      },
    })) as ISheetDB;

    const newEntity = dto.entity_type + '$' + dto.entity_uuid;
    if (sheet.sheet_entities?.length) {
      sheet.sheet_entities.push(newEntity);
    } else sheet.sheet_entities = [newEntity];
    await this.prisma.sheet.update({
      data: sheet,
      where: {
        sheet_uuid,
      },
    });
  }

  async editSheet(dto: SheetDTO) {
    return this.prisma.sheet.update({
      where: {
        sheet_uuid: dto.sheet_uuid,
      },
      data: dto,
    });
  }

  async editSheetBackground(dto: EditSheetBackgroundDTO) {
    const response = await fetch(dto.background_url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imagePath = path.join(
      path.resolve(),
      `/public/images/backgrounds/homeBackground.jpg`,
    );
    fs.writeFileSync(imagePath, buffer);
    const currentSheet = (await this.prisma.sheet.findFirst({
      where: {
        sheet_uuid: dto.sheet_uuid,
      },
    })) as ISheetDB;
    return this.prisma.sheet.update({
      where: {
        sheet_uuid: dto.sheet_uuid,
      },
      data: { ...currentSheet, background_path: imagePath },
    });
  }

  async deleteSheet(dto: SheetDTO) {
    await this.userService.deleteUserSheet(dto.sheet_uuid!, dto.user_uuid);
    return this.prisma.sheet.delete({
      where: {
        sheet_uuid: dto.sheet_uuid,
      },
    });
  }

  async deleteSheetEntity(sheet_uuid: string, entity_uuid: string) {
    const newState = (await this.prisma.sheet.findFirst({
      where: {
        sheet_uuid: sheet_uuid,
      },
    })) as ISheetDB;
    newState.sheet_entities = newState.sheet_entities.filter(
      (entity: string) => entity.split('$')[1] !== entity_uuid,
    );
    await this.prisma.sheet.update({
      data: { ...newState },
      where: {
        sheet_uuid: sheet_uuid,
      },
    });
  }

  async deleteSheetBackground(sheet_uuid: string) {
    const sheet = (await this.prisma.sheet.findFirst({
      where: {
        sheet_uuid: sheet_uuid,
      },
    })) as ISheetDB;

    delete sheet.background_path;

    const imagePath = path.join(
      path.resolve(),
      `/public/images/backgrounds/homeBackground.jpg`,
    );
    fs.unlink(imagePath, (err) => {
      if (err) throw err;
    });
    await this.prisma.sheet.update({
      data: sheet,
      where: {
        sheet_uuid: sheet_uuid,
      },
    });
  }
}
