import SheetsService from '../services/sheetsService';
import { IEditSheetBackground, ISheetUuid, ISheet, IUser } from '../interface/requests';
import UsersService from '../services/usersService';
import { Request, Response } from 'express';

class SheetsController {
  async createSheet(req: Request, res: Response) {
    try {
      const sheet = await SheetsService.createSheet(req.body as unknown as ISheet);
      res.json(sheet);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async getSheetBackground(req: Request, res: Response) {
    try {
      const sheetUuid = req.url.split('/')[2];
      const sheetBackground = await SheetsService.getSheetBackground(sheetUuid);
      res.json(sheetBackground);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async editSheet(req: Request, res: Response) {
    try {
      const sheet = await SheetsService.editSheet(req.body as unknown as ISheet);
      res.json(sheet);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async editSheetBackground(req: Request, res: Response) {
    try {
      const sheetBackground = await SheetsService.editSheetBackground(req.body as unknown as IEditSheetBackground);
      res.json(sheetBackground);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async deleteSheet(req: Request, res: Response) {
    try {
      const sheet = await SheetsService.deleteSheet(req.body as unknown as ISheet);
      res.json(sheet);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async deleteSheetBackground(req: Request, res: Response) {
    try {
      const sheetBackground = await SheetsService.deleteSheetBackground(req.body as unknown as string);
      res.json(sheetBackground);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }
}

export default new SheetsController();
