import {Home_entity} from "../models/index.js";

class HomeService {
    async getEntities() {
        return await Home_entity.findAll({
            order: [
                ['entity_order', 'ASC']
            ]
        });
    }
    async createEntity(body) {
        return Home_entity.create(body);
    }
    async editEntity(body) {
        return Home_entity.upsert({...body});
    }
    async deleteEntity(body) {
        const deletedEntity = await Home_entity.findOne({
            where: {
                entity_uuid: body.entity_uuid
            }
        })
        await Home_entity.destroy({
            where: {
                entity_uuid: body.entity_uuid
            }
        });
        return deletedEntity;
    }
    async changeOrderEntity(body) {
        const allEntities = await Home_entity.findAll({
            order: [
                ['entity_order', 'ASC']
            ]
        });
        const currentEntity = allEntities.find(entity => entity.entity_uuid === body.entity_uuid);
        console.log('currentEntity: ', currentEntity);
        const nextEntity = body.direction === 'up'
            ? allEntities
                .reverse()
                .find(entity => entity.entity_order < currentEntity.entity_order)
            : allEntities
                .find(entity => entity.entity_order > currentEntity.entity_order);
        console.log('nextEntity: ', nextEntity);
        await Home_entity.update({
            entity_order: nextEntity.entity_order,
        }, {
            where: {
                entity_uuid: currentEntity.entity_uuid
            }
        });
        // await Home_entity.upsert({...currentEntity, entity_order: nextEntity.entity_order});
        await Home_entity.update({
            entity_order: currentEntity.entity_order,
        }, {
            where: {
                entity_uuid: nextEntity.entity_uuid
            }
        });
        // await Home_entity.upsert({...nextEntity, entity_order: currentEntity.entity_order});
        return body;
    }
}

export default new HomeService;