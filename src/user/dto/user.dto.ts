import { SheetDBDTO } from '../../sheet/dto/sheet.dto';

export interface IUserDB {
  user_uuid: string;
  nick_name: string;
  password: string;
  email: string;
  favorite_color: string;
  user_sheets: string;
  access_token?: string;
  refresh_token?: string;
}

export interface UserDTO {
  nick_name: string;
  email: string;
  password: string;
  user_uuid?: string;
  favorite_color: string;
  user_sheets: SheetDBDTO[];
}

export interface IUserAuth {
  user_uuid: string;
  code: string;
  nick_name: string;
  email: string;
  password: string;
  codeDieTime: string;
}

export interface IError {
  status: number;
  message: string;
}

export interface ITokenPayload {
  user_uuid: string;
  password: string;
}
