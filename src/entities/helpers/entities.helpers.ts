import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import { EntityDBDTO } from '../dto/entities.dto';
import {
  ITableColumnProgressBar,
  ITableColumnSelect,
} from '../interfaces/entities.interfaces';

const prisma = new PrismaClient({});

export const createPrismaEntity = async (body: EntityDBDTO) => {
  switch (body.entity_type) {
    case 'divider':
      return prisma.divider.create({ data: { ...body } });
    case 'paragraph':
      return prisma.paragraph.create({ data: { ...body } });
    case 'image':
      return prisma.image.create({ data: { ...body } });
    case 'table': {
      const entity_uuid = body.entity_uuid;
      // заполняем таблицу table_columns_options в БД
      await Promise.all(
        body.table_columns!.map(async (column, index: number) => {
          const options = column.options;

          // если список или прогрессБар - создаём в соответствующей таблице данные со свойства options.options
          // и удаляем свойство перед добавлением options в таблицу table_columns_options
          if (column.type === 'select') {
            await prisma.select_options.create({
              data: {
                entity_uuid,
                column_index: index,
                ...((
                  options! as {
                    options: unknown;
                  }
                ).options! as ITableColumnSelect),
              } as ITableColumnSelect,
            });
            delete (
              options as {
                options: unknown;
              }
            ).options;
          } else if (column.type === 'progressBar') {
            await prisma.progressbar_gaps.create({
              data: {
                entity_uuid,
                column_index: index,
                ...((
                  options! as {
                    options: unknown;
                  }
                ).options! as ITableColumnProgressBar),
              } as ITableColumnProgressBar,
            });
            delete (
              options as {
                options: unknown;
              }
            ).options;
          }
          // сохраняем данные со свойства options колонки в table_columns_options
          await prisma.table_columns_options.create({
            data: {
              entity_uuid,
              column_index: index,
              ...options,
            },
          });
          delete column.options;
        }),
      );
      // какого бы типа данные в колонках не были - сохраняем данные о всех колонках в БД
      await prisma.table_columns.createMany({
        data: [...body.table_columns!].map((column, index) => ({
          entity_uuid,
          column_index: index,
          ...column,
        })),
      });
      delete body.table_columns;

      return prisma.table.create({
        data: { ...(body as Omit<EntityDBDTO, 'table_data'>) },
      });
    }
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
    case 'table': {
      const tableInfo = await prisma.table.findFirst({
        where: {
          entity_uuid: uuid,
        },
      });
      if (!tableInfo) return {};
      // преобразование строки с БД в массив массивов для передачи фронтенду
      const table_data = !tableInfo.table_data
        ? [[]]
        : (tableInfo.table_data
            .split('$({rowSpace})')
            .map((row) => row.split('$({itemSpace})')) as unknown[][]);

      const tableColumns = await prisma.table_columns.findMany({
        where: {
          entity_uuid: uuid,
        },
      });
      const tableColumnsOptions = await prisma.table_columns_options.findMany({
        where: {
          entity_uuid: uuid,
        },
      });
      await Promise.all(
        tableColumns.map(async (column, index) => {
          const options = tableColumnsOptions.find(
            (item) => item.column_index === index,
          )!;
          if (column.type === 'select') {
            options['options'] = await prisma.select_options.findFirst({
              where: {
                entity_uuid: uuid,
                column_index: index,
              },
            });
          } else if (column.type === 'progressBar') {
            options['options'] = await prisma.select_options.findFirst({
              where: {
                entity_uuid: uuid,
                column_index: index,
              },
            });
          }
          return {
            ...column,
            options,
          };
        }),
      );
      return {
        ...tableInfo,
        table_data,
        table_columns: tableColumns,
      };
    }
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
    case 'table': {
      if (body.table_data) {
        await prisma.table_columns.updateMany({
          where: {
            entity_uuid: body.entity_uuid,
          },
          // преобразование из массива массивов с фронтенда в строку для передачи в БД
          data: body.table_data
            .map((row) => {
              return row.join('$({itemSpace})');
            })
            .join('$({rowSpace})'),
        });
      }

      delete body.table_data;
      return prisma.table.update({
        where: {
          entity_uuid: body.entity_uuid,
        },
        data: { ...(body as Omit<EntityDBDTO, 'table_data'>) },
      });
    }
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
