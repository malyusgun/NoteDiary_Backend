import { IUser } from '../interface/requests';
import UsersService from '../services/usersService';
import { Request, Response } from 'express';

class UsersController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await UsersService.createUser(req.body as IUser);
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const userUuid = req.url.split('/')[2];
      const user = await UsersService.getUser(userUuid);
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const user = await UsersService.editUser(req.body as unknown as IUser);
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await UsersService.deleteUser(req.body as unknown as IUser);
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
export default new UsersController();
