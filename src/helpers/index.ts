import { bot } from '../telegramBot';
import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import { IUser } from '../interfaces/requests';
import fs from 'node:fs';
import { IUserAuth } from '../interfaces';

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
  const chunks = body.split('$');
  const type = chunks[0];
  const uuid = chunks[1];

  switch (type) {
    case 'divider':
      return prisma.divider.findFirst({
        where: {
          entity_uuid: uuid
        }
      });
    case 'paragraph':
      return prisma.paragraph.findFirst({
        where: {
          entity_uuid: uuid
        }
      });
    case 'image':
      return prisma.image.findFirst({
        where: {
          entity_uuid: uuid
        }
      });
    // case 'table':
    //   return prisma.table.findFirst({
    //       where: {
    //         entity_uuid: uuid
    //       }
    //     });
  }
};

export const getImagePathByUuid = (entity_uuid: string, isOriginal?: boolean) => {
  const imagePath = path.join(path.resolve(), `/public/images/image.jpg`);
  let newImagePath;
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
      delete body.image_url;
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

export const getUserDataFromAuthFile = (user_uuid: string): IUserAuth => {
  const usersDataFile = path.join(path.resolve(), `/public/auth.txt`);
  let fileContent = fs.readFileSync(usersDataFile).toString();
  const targetChunk = fileContent.split('$').find((chunk) => chunk.includes(user_uuid))!;
  return convertUserData(targetChunk, 'from') as IUserAuth;
};

export const convertUserData = (body: IUser | string, convertType: 'to' | 'from', code?: string) => {
  if (convertType === 'to' && typeof body === 'object') {
    return `${body.user_uuid}@${code}@${body.nick_name}@${body.email}@${body.password}$`;
  }
  if (typeof body === 'string') {
    const chunks = body.split('@');
    return {
      user_uuid: chunks[0],
      code: chunks[1],
      nick_name: chunks[2],
      email: chunks[3],
      password: chunks[4]
    };
  }
};
