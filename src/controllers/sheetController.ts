import SheetService from '../services/sheetService';
import { IEditSheetBackground, ISheet } from '../interfaces/requests';
import { Request, Response } from 'express';

class SheetController {
  async createSheet(req: Request, res: Response) {
    try {
      const sheet = await SheetService.createSheet(req.body as unknown as ISheet);
      res.json(sheet);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async getSheetBackground(req: Request, res: Response) {
    try {
      const sheetUuid = req.url.split('/')[2];
      const sheetBackground = await SheetService.getSheetBackground(sheetUuid);
      res.json(sheetBackground);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async editSheet(req: Request, res: Response) {
    try {
      const sheet = await SheetService.editSheet(req.body as unknown as ISheet);
      res.json(sheet);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async editSheetBackground(req: Request, res: Response) {
    try {
      const sheetBackground = await SheetService.editSheetBackground(req.body as unknown as IEditSheetBackground);
      res.json(sheetBackground);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async deleteSheet(req: Request, res: Response) {
    try {
      const sheet = await SheetService.deleteSheet(req.body as unknown as ISheet);
      res.json(sheet);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async deleteSheetBackground(req: Request, res: Response) {
    try {
      const sheetBackground = await SheetService.deleteSheetBackground(req.body as unknown as string);
      res.json(sheetBackground);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }
}

export default new SheetController();
