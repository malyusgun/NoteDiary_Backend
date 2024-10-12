import EntitiesService from '../services/entitiesService';
import { IBodyPageUuid, IChangeEntitiesOrder, IWSRequest } from '../interface/requests';
import { IEntity } from '../interface/database';

class EntitiesController {
  async createEntity(req: IWSRequest<'createEntities', IEntity>) {
    try {
      return await EntitiesService.createEntity(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async createImage(req: Buffer, isCropImageNow: boolean) {
    try {
      return await EntitiesService.createImage(req, isCropImageNow);
    } catch (error) {
      console.log(error);
    }
  }
  async getEntities(req: IWSRequest<'getEntities', IBodyPageUuid>) {
    try {
      return await EntitiesService.getEntities(req.body.page_uuid);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async editEntity(req: IWSRequest<'editEntity', IEntity>) {
    try {
      return await EntitiesService.editEntity(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async cropImage(req: IWSRequest<'cropImage', IEntity>) {
    try {
      return await EntitiesService.cropImage(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async returnOriginalSizeImage(req: IWSRequest<'returnOriginalSizeImage', IEntity>) {
    try {
      return await EntitiesService.returnOriginalSizeImage(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async changeEntitiesOrder(req: IChangeEntitiesOrder) {
    try {
      return await EntitiesService.changeEntitiesOrder(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteEntity(req: IWSRequest<'deleteEntity', IEntity>) {
    try {
      return await EntitiesService.deleteEntity(req.body);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new EntitiesController();
