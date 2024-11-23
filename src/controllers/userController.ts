import { IUser } from '../interfaces/requests';
import UserService from '../services/userService';
import { Request, Response } from 'express';
import { IUserDB } from '../interfaces/database';

class UserController {
  async confirmMail(req: Request, res: Response) {
    try {
      const data = await UserService.confirmMail(req.body);
      res.json(data);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  getConfirmMailCode(req: Request, res: Response) {
    try {
      const userUuid = req.url.split('/')[2];
      const code = UserService.getConfirmMailCode(userUuid);
      res.json(code);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async registration(req: Request, res: Response) {
    try {
      const userData = await UserService.registration(req.body);
      res.cookie('access_token', userData.createdUser.access_token, { httpOnly: true });
      res.cookie('refresh_token', userData.createdUser.refresh_token, { httpOnly: true });

      delete userData.createdUser.access_token;
      delete userData.createdUser.refresh_token;

      res.json(userData);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const userData = (await UserService.login(req.body)) as IUserDB;
      res.cookie('access_token', userData.access_token, { httpOnly: true });
      res.cookie('refresh_token', userData.refresh_token, { httpOnly: true });
      delete userData.access_token;
      delete userData.refresh_token;

      res.json(userData);
    } catch (e) {
      console.log('error: ', e);
      // @ts-ignore
      res.status(e?.status).json(e);
    }
  }

  refresh(req: Request, res: Response) {
    try {
      const refresh_token = req.cookies.refresh_token;
      const new_access_token = UserService.refresh(refresh_token);
      res.cookie('access_token', new_access_token, { httpOnly: true });
      res.json('Successfully refresh');
    } catch (e) {
      console.log('error: ', e);
      // @ts-ignore
      res.status(e?.status).json(e);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      await UserService.logout(req.body);
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      res.json('Successfully longed out');
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const userUuid = req.url.split('/')[2];
      const user = await UserService.getUser(userUuid);
      delete user.access_token;
      delete user.refresh_token;
      res.json(user);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async editUser(req: Request, res: Response) {
    try {
      const user = await UserService.editUser(req.body as unknown as IUser);

      delete user.access_token;
      delete user.refresh_token;
      res.json(user);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await UserService.deleteUser(req.body as unknown as IUser);

      delete user.access_token;
      delete user.refresh_token;
      res.json(user);
    } catch (e) {
      console.log('error: ', e);
      res.status(500).json(e);
    }
  }
}
export default new UserController();
