import { IUser } from '../interfaces/requests';
import UserService from '../services/userService';
import { Request, Response } from 'express';

class UserController {
  confirmMail(req: Request, res: Response) {
    try {
      const code = UserService.confirmMail(req.body);
      res.json(code);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  getConfirmMailCode(req: Request, res: Response) {
    try {
      const userUuid = req.url.split('/')[3];
      const code = UserService.getConfirmMailCode(userUuid);
      res.json(code);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async registration(req: Request, res: Response) {
    try {
      const tokens = await UserService.registration(req.body);
    } catch (e) {}
  }

  async getUser(req: Request, res: Response) {
    try {
      const userUuid = req.url.split('/')[2];
      const user = await UserService.getUser(userUuid);
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const user = await UserService.editUser(req.body as unknown as IUser);
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await UserService.deleteUser(req.body as unknown as IUser);
      res.json(user);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
export default new UserController();
