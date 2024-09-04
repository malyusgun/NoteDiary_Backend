import { bot } from '../telegramBot';
import { PrismaClient } from '@prisma/client';

export const validateMessage = async (
  response: any,
  command: string,
  alternateCommand: string,
  chatId: number | string
) => {
  const regExp = /[a-zA-Zа-яА-Я]/g;
  const isValid = regExp.test(response);
  if (isValid) {
    await bot.sendMessage(chatId, command);
  } else {
    await bot.sendMessage(chatId, alternateCommand);
  }
};

const prisma = new PrismaClient({});
export const createPrismaEntity = async (body: any) => {
  switch (body.entity_type) {
    case 'divider':
      return prisma.divider.create({ data: { ...body } });
    case 'paragraph':
      return prisma.paragraph.create({ data: { ...body } });
    case 'image':
      return prisma.image.create({ data: { ...body } });
    // case 'table':
    //   return prisma.table.create({ data: { ...body } });
  }
};
export const getPrismaEntity = async (body: any) => {
  switch (body.entity_type) {
    case 'divider':
      return prisma.divider.findFirst({
        where: {
          entity_uuid: body.entity_uuid
        }
      });
    case 'paragraph':
      return prisma.paragraph.findFirst({
        where: {
          entity_uuid: body.entity_uuid
        }
      });
    case 'image':
      return prisma.image.findFirst({
        where: {
          entity_uuid: body.entity_uuid
        }
      });
    // case 'table':
    //   return prisma.table.findFirst({
    //       where: {
    //         entity_uuid: body.entity_uuid
    //       }
    //     });
  }
};
export const updatePrismaEntity = async (body: any) => {
  switch (body.entity_type) {
    case 'divider':
      return prisma.divider.update({
        where: {
          entity_uuid: body.entity_uuid
        },
        data: { ...body }
      });
    case 'paragraph':
      return prisma.paragraph.update({
        where: {
          entity_uuid: body.entity_uuid
        },
        data: { ...body }
      });
    case 'image':
      delete body.imageUrl;
      return prisma.image.update({
        where: {
          entity_uuid: body.entity_uuid
        },
        data: { ...body }
      });
    // case 'table':
    //   return prisma.table.update({
    //       where: {
    //         entity_uuid: body.entity_uuid
    //       },
    //       data: { ...body }
    //     });
  }
};
export const deletePrismaEntity = async (body: any) => {
  switch (body.entity_type) {
    case 'divider':
      return prisma.divider.delete({
        where: {
          entity_uuid: body.entity_uuid
        }
      });
    case 'paragraph':
      return prisma.paragraph.delete({
        where: {
          entity_uuid: body.entity_uuid
        }
      });
    case 'image':
      return prisma.image.delete({
        where: {
          entity_uuid: body.entity_uuid
        }
      });
    // case 'table':
    //   return prisma.table.delete({
    //       where: {
    //         entity_uuid: body.entity_uuid
    //       }
    //       }
    //     });
  }
};
