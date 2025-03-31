import { Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import ApiError from '../exceptions/ApiError';
import { UserDTO } from './dto/user.dto';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('confirm')
  async confirmMail(dto: UserDTO) {
    try {
      return await this.userService.confirmMail(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Get('')
  getConfirmMailCode(@Req() req: Request) {
    try {
      const userUuid = req.originalUrl.split('/')[2];
      return this.userService.getConfirmMailCode(userUuid);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  async registration(req: Request) {
    try {
      const userData = await this.userService.registration(req.body);
      res.cookie('access_token', userData.createdUser.access_token, {
        httpOnly: true,
      });
      res.cookie('refresh_token', userData.createdUser.refresh_token, {
        httpOnly: true,
      });

      delete userData.createdUser.access_token;
      delete userData.createdUser.refresh_token;

      res.json(userData);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  async login(req: Request) {
    try {
      const userData = (await this.userService.login(req.body)) as IUserDB;
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

  refresh(req: Request) {
    try {
      const refresh_token = req.cookies.refresh_token;
      const new_access_token = this.userService.refresh(refresh_token);
      res.cookie('access_token', new_access_token, { httpOnly: true });
      res.json('Successfully refresh');
    } catch (e) {
      console.log('error: ', e);
      // @ts-ignore
      res.status(e?.status).json(e);
    }
  }

  async logout(req: Request) {
    try {
      await this.userService.logout(req.body);
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      res.json('Successfully longed out');
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  async getUser(req: Request) {
    try {
      const userUuid = req.url.split('/')[2];
      const user = await this.userService.getUser(userUuid);
      delete user.access_token;
      delete user.refresh_token;
      res.json(user);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  async editUser(req: Request) {
    try {
      const user = await this.userService.editUser(
        req.body as unknown as UserDTO,
      );

      delete user.access_token;
      delete user.refresh_token;
      res.json(user);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  async deleteUser(req: Request) {
    try {
      const user = await this.userService.deleteUser(
        req.body as unknown as UserDTO,
      );

      delete user.access_token;
      delete user.refresh_token;
      res.json(user);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }
}
