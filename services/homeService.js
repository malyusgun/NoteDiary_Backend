import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class HomeService {
  async getEntities() {
    return prisma.home_entity.findMany({
      orderBy: [{ entity_order: 'asc' }]
    });
  }
  async createEntity(body) {
    console.log('body: ', body);
    return prisma.home_entity.create({ data: body });
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
    console.log('currentEntity: ', currentEntity);
    const nextEntity =
      body.direction === 'up'
        ? allEntities.reverse().find((entity) => entity.entity_order < currentEntity.entity_order)
        : allEntities.find((entity) => entity.entity_order > currentEntity.entity_order);
    console.log('nextEntity: ', nextEntity);
    await prisma.home_entity.update({
      where: {
        entity_uuid: currentEntity.entity_uuid
      },
      data: {
        entity_order: nextEntity.entity_order
      }
    });
    // await Home_entity.upsert({...currentEntity, entity_order: nextEntity.entity_order});
    await prisma.home_entity.update({
      where: {
        entity_uuid: nextEntity.entity_uuid
      },
      data: {
        entity_order: currentEntity.entity_order
      }
    });
    // await Home_entity.upsert({...nextEntity, entity_order: currentEntity.entity_order});
    return body;
  }
}

export default new HomeService();
