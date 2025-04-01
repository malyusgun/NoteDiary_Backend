import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import { EntityDBDTO } from '../dto/entities.dto';

const prisma = new PrismaClient({});

export const createPrismaEntity = async (body: EntityDBDTO) => {
  switch (body.entity_type) {
    case 'divider':
      return prisma.divider.create({ data: { ...body } });
    case 'paragraph':
      return prisma.paragraph.create({ data: { ...body } });
    case 'image':
      return prisma.image.create({ data: { ...body } });
    case 'table':
      return prisma.table.create({ data: { ...body } });
  }
};

export const getPrismaEntity = async (body: string) => {
  const chunks = body.split('$');
  const type = chunks[0];
  const uuid = chunks[1];

  switch (type) {
    case 'divider':
      return prisma.divider.findFirst({
        where: {
          entity_uuid: uuid,
        },
      });
    case 'paragraph':
      return prisma.paragraph.findFirst({
        where: {
          entity_uuid: uuid,
        },
      });
    case 'image':
      return prisma.image.findFirst({
        where: {
          entity_uuid: uuid,
        },
      });
    case 'table':
      return prisma.table.findFirst({
        where: {
          entity_uuid: uuid,
        },
      });
  }
};

export const getImagePathByUuid = (
  entity_uuid: string,
  isOriginal?: boolean,
): string => {
  const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
  let newImagePath: string | string[] | null = null;
  if (process.platform.includes('win')) {
    newImagePath = imagePath.split('\\');
  } else {
    newImagePath = imagePath.split('/');
  }
  newImagePath.splice(-1);
  if (isOriginal) {
    newImagePath.push(`original${entity_uuid}.jpg`);
  } else {
    newImagePath.push(`${entity_uuid}.jpg`);
  }
  if (process.platform.includes('win')) {
    newImagePath = newImagePath.join('\\');
  } else {
    newImagePath = newImagePath.join('/');
  }
  return newImagePath;
};

export const updatePrismaEntity = async (body: EntityDBDTO) => {
  switch (body.entity_type) {
    case 'divider':
      return prisma.divider.update({
        where: {
          entity_uuid: body.entity_uuid,
        },
        data: { ...body },
      });
    case 'paragraph':
      return prisma.paragraph.update({
        where: {
          entity_uuid: body.entity_uuid,
        },
        data: { ...body },
      });
    case 'image':
      delete body.image_url;
      return prisma.image.update({
        where: {
          entity_uuid: body.entity_uuid,
        },
        data: { ...body },
      });
    case 'table':
      return prisma.table.update({
        where: {
          entity_uuid: body.entity_uuid,
        },
        data: { ...body },
      });
  }
};

export const deletePrismaEntity = async (body: EntityDBDTO) => {
  switch (body.entity_type) {
    case 'divider':
      return prisma.divider.delete({
        where: {
          entity_uuid: body.entity_uuid,
        },
      });
    case 'paragraph':
      return prisma.paragraph.delete({
        where: {
          entity_uuid: body.entity_uuid,
        },
      });
    case 'image':
      return prisma.image.delete({
        where: {
          entity_uuid: body.entity_uuid,
        },
      });
    case 'table':
      return prisma.table.delete({
        where: {
          entity_uuid: body.entity_uuid,
        },
      });
  }
};
