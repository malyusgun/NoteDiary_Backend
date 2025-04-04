import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import ApiError from '../exceptions/ApiError';
import { UserDTO } from './dto/user.dto';
import { Request, Response } from 'express';
import { IUserDB } from './interfaces/user.interfaces';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('confirm')
  async confirmMail(@Body() dto: UserDTO) {
    try {
      return await this.userService.confirmMail(dto);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Get(':uuid/code')
  getConfirmMailCode(@Req() req: Request) {
    try {
      const userUuid = req.originalUrl.split('/')[2];
      return this.userService.getConfirmMailCode(userUuid);
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Post('registration')
  async registration(@Body() body: IUserDB, @Res() res: Response) {
    try {
      const userData = (await this.userService.registration(
        body,
      )) as unknown as { createdUser: IUserDB };

      res.cookie('access_token', userData.createdUser.access_token, {
        httpOnly: true,
      });
      res.cookie('refresh_token', userData.createdUser.refresh_token, {
        httpOnly: true,
      });
      delete userData.createdUser.access_token;
      delete userData.createdUser.refresh_token;

      return userData;
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const userData = (await this.userService.login(req.body)) as IUserDB;
      res.cookie('access_token', userData.access_token, { httpOnly: true });
      res.cookie('refresh_token', userData.refresh_token, { httpOnly: true });
      delete userData.access_token;
      delete userData.refresh_token;

      return userData;
    } catch (e) {
      console.log('error: ', e);
      // @ts-ignore
      res.status(e?.status).json(e);
    }
  }

  @Patch(':uuid/refresh')
  refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const refresh_token = req.cookies.refresh_token;
      const new_access_token = this.userService.refresh(refresh_token);

      res.cookie('access_token', new_access_token, { httpOnly: true });

      return 'Successfully refresh';
    } catch (e) {
      console.log('error: ', e);
      // @ts-ignore
      res.status(e?.status).json(e);
    }
  }

  @Delete()
  async logout(@Body() dto: UserDTO, @Res() res: Response) {
    try {
      await this.userService.logout(dto);

      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      return 'Successfully longed out';
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Get(':uuid')
  async getUser(@Req() req: Request) {
    try {
      const userUuid = req.url.split('/')[2];
      const user = await this.userService.getUser(userUuid);
      delete user.access_token;
      delete user.refresh_token;

      return user;
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Patch(':uuid')
  async editUser(@Body() dto: UserDTO) {
    try {
      const user = await this.userService.editUser(dto);
      delete user.access_token;
      delete user.refresh_token;

      return user;
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }

  @Delete(':uuid/destroyAccount')
  async deleteUser(@Body() dto: UserDTO) {
    try {
      const user = await this.userService.deleteUser(dto);
      delete user.access_token;
      delete user.refresh_token;

      return user;
    } catch (e) {
      console.log('error: ', e);
      return ApiError.throwServerError();
    }
  }
}
