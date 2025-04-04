import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { UserDTO } from './dto/user.dto';
import {
  convertUserData,
  getUserDataFromAuthFile,
  getUserSheets,
} from './helpers/user.helpers';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../prisma.service';
import { EntitiesService } from '../entities/entities.service';
import ApiError from '../exceptions/ApiError';
import { IError, ITokenPayload, IUserDB } from './interfaces/user.interfaces';
import { JwtPayload } from 'jsonwebtoken';
import { ISheetDB } from '../sheet/interfaces/sheet.interfaces';
import { EntityDBDTO } from '../entities/dto/entities.dto';

@Injectable()
export class UserService {
  constructor(
    private mailService: MailService,
    private entitiesService: EntitiesService,
    private tokenService: TokenService,
    private prisma: PrismaService,
  ) {}

  async confirmMail(dto: UserDTO) {
    dto.user_uuid = randomUUID();
    const usersDataFile = path.join(path.resolve(), `/public/auth.txt`);
    if (!fs.existsSync(usersDataFile)) {
      fs.writeFileSync(usersDataFile, '');
    }
    const fileContent = fs.readFileSync(usersDataFile).toString();

    let code = (Math.random() * 1000000).toFixed();
    while (code.length < 6) {
      code = '0' + code;
    }
    const userInfo = convertUserData(dto, 'to', code) as string;
    fs.writeFileSync(usersDataFile, fileContent + userInfo);
    await this.mailService.sendActivationMail(dto.email, code);
    return {
      code,
      user_uuid: dto.user_uuid,
    };
  }

  getConfirmMailCode(user_uuid: string) {
    const userData = getUserDataFromAuthFile(user_uuid);
    // code expired, 5 minutes have passed
    if (Date.now() >= +userData.codeDieTime) {
      return 'expired';
    }
    return userData.code;
  }

  async registration(body: IUserDB) {
    const userData = { ...body };
    const tokens = this.tokenService.generateTokens({
      user_uuid: body.user_uuid!,
      password: body.password,
    });
    let userDataDB = { ...userData, access_token: '', refresh_token: '' };
    userDataDB.access_token = tokens.accessToken;
    userDataDB.refresh_token = tokens.refreshToken;
    return await this.createUser(userDataDB);
  }

  refresh(refresh_token: string) {
    const refreshResult = this.tokenService.validateRefreshToken(refresh_token);
    if (!refreshResult) {
      throw ApiError.throwUnauthorizedException();
    }
    const mainUserData = { ...(refreshResult as JwtPayload) };
    delete mainUserData.exp;
    delete mainUserData.iat;
    return this.tokenService.generateAccessToken(mainUserData as ITokenPayload);
  }

  async login(dto: UserDTO): Promise<IUserDB | IError> {
    let userDataDB = await this.getUser(dto.nick_name, true);

    const userSheets = await getUserSheets(dto.user_uuid!);
    const user = { ...userDataDB, user_sheets: userSheets };

    if (dto.password !== user.password) {
      return ApiError.throwForbiddenException();
    }
    const tokens = this.tokenService.generateTokens({
      user_uuid: user.user_uuid,
      password: user.password,
    });
    user.access_token = tokens.accessToken;
    user.refresh_token = tokens.refreshToken;
    return user;
  }

  async logout(dto: UserDTO) {
    const userDataDB = (await this.prisma.user.findFirst({
      where: {
        nick_name: dto.nick_name,
      },
    })) as unknown as IUserDB;

    delete userDataDB.access_token;
    delete userDataDB.refresh_token;
    await this.prisma.user.update({
      where: {
        user_uuid: userDataDB.user_uuid,
      },
      data: userDataDB,
    });
    return true;
  }

  async createUser(body: IUserDB) {
    const homeSheetUuid = randomUUID();
    const userSheets = [
      {
        user_uuid: body.user_uuid,
        sheet_uuid: homeSheetUuid,
        sheet_title: 'Home page',
        sheet_icon: 'home',
        sheet_children: [],
      },
    ];

    const createdUser = await this.prisma.user.create({
      data: body,
    });
    const startEntity = {
      entity_uuid: randomUUID(),
      sheet_uuid: homeSheetUuid,
      entity_type: 'paragraph',
      title: 'Home, sweet home...',
      text:
        'This is your start page.\nWhat can you do? Turn on the "Edit mode" in the upper right corner and see what happens.\n' +
        'Create new something by press the button on the bottom (with plus).\nCheck the Menu by button in the upper left corner.\n' +
        'Note your notes, create something helpful for you and do everything you want!',
      paragraph_size: 'half',
      font_size: '24',
      entity_position: 'center',
      entity_title_position: 'center',
      entity_order: 1,
    };

    const homeSheet = {
      user_uuid: body.user_uuid,
      sheet_uuid: homeSheetUuid,
      sheet_title: 'Home page',
      sheet_icon: 'home',
      sheet_children: [],
    };
    await this.prisma.sheet.create({ data: homeSheet as unknown as ISheetDB });
    await this.entitiesService.createEntity(startEntity as EntityDBDTO);

    return {
      createdUser: { ...createdUser, user_sheets: userSheets },
      homeSheet,
      startEntity,
    };
  }

  async getUser(uniqueKey: string, isNickName?: boolean) {
    // если запрос идёт по user_nickName с метода login (где доступа к user_uuid нет),
    // где userSheets получаются позже после вызова этого метода
    if (isNickName) {
      return this.prisma.user.findFirst({
        where: {
          nick_name: uniqueKey,
        },
      }) as unknown as IUserDB;
    }

    // uniqueKey = user_uuid
    const userSheets = await getUserSheets(uniqueKey);
    const userDataDB = this.prisma.user.findFirst({
      where: {
        user_uuid: uniqueKey,
      },
    }) as unknown as IUserDB;
    return { ...userDataDB, user_sheets: userSheets };
  }

  async addUserSheet(user_uuid: string) {
    const user = (await this.prisma.user.findFirst({
      where: {
        user_uuid: user_uuid,
      },
    })) as unknown as IUserDB;

    return this.prisma.user.update({
      data: user as IUserDB,
      where: {
        user_uuid: user.user_uuid,
      },
    });
  }

  async editUser(dto: UserDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        user_uuid: dto.user_uuid,
      },
    });

    const updatedUser = { ...user, ...dto };
    const { user_sheets, ...newState } = updatedUser;

    const updatedUserDB = (await this.prisma.user.update({
      data: newState,
      where: {
        user_uuid: dto.user_uuid,
      },
    })) as unknown as IUserDB;
    return { ...updatedUserDB, user_sheets };
  }

  async deleteUser(dto: UserDTO) {
    const imagesPath = path.join(path.resolve(), `/public/images`);
    const images = fs.readdirSync(imagesPath);
    images.forEach((image) => {
      if (image.includes(dto.user_uuid!))
        fs.unlinkSync(path.resolve(imagesPath, image));
    });
    return this.prisma.user.delete({
      where: {
        user_uuid: dto.user_uuid,
      },
    }) as unknown as IUserDB;
  }

  async deleteUserSheet(sheet_uuid: string, user_uuid: string) {
    const currentUser = (await this.prisma.user.findFirst({
      where: {
        user_uuid: user_uuid,
      },
    })) as IUserDB;

    this.prisma.sheet.delete({
      where: {
        sheet_uuid,
      },
    });

    return this.prisma.user.update({
      data: currentUser,
      where: {
        user_uuid: currentUser.user_uuid,
      },
    });
  }
}
