import EntitiesService from '../services/entitiesService';
import { ISheetUuid, IChangeEntitiesOrder, IUser } from '../interface/requests';
import { IEntityDB } from '../interface/database';
import UsersService from '../services/usersService';
import { Request, Response } from 'express';

class EntitiesController {
  // two only methods for buffer connection
  async createImage(req: Request, res: Response) {
    try {
      const entity = await EntitiesService.createImage(req.body as unknown as Buffer);
      res.json(entity);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async createImageForCrop(req: Request, res: Response) {
    try {
      const entity = await EntitiesService.createImageForCrop(req.body as unknown as Buffer);
      res.json(entity);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async createEntity(req: Request, res: Response) {
    try {
      const entity = await EntitiesService.createEntity(req.body as unknown as IEntityDB);
      res.json(entity);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async getEntities(req: Request, res: Response) {
    try {
      const sheetUuid = req.url.split('/')[2];
      const entities = await EntitiesService.getEntities(sheetUuid);
      res.json(entities);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async editEntity(req: Request, res: Response) {
    try {
      const entity = await EntitiesService.editEntity(req.body as unknown as IEntityDB);
      res.json(entity);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async cropImage(req: Request, res: Response) {
    try {
      const entityImage = await EntitiesService.cropImage(req.body as unknown as IEntityDB);
      res.json(entityImage);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async returnOriginalSizeImage(req: Request, res: Response) {
    try {
      const entityImage = await EntitiesService.returnOriginalSizeImage(req.body as unknown as IEntityDB);
      res.json(entityImage);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async changeEntitiesOrder(req: Request, res: Response) {
    try {
      const entities = await EntitiesService.changeEntitiesOrder(req.body as unknown as IChangeEntitiesOrder);
      res.json(entities);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async deleteEntity(req: Request, res: Response) {
    try {
      const entity = await EntitiesService.deleteEntity(req.body as unknown as IEntityDB);
      res.json(entity);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }
}

export default new EntitiesController();
