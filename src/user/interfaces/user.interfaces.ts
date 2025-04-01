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

export interface IError {
  status: number;
  message: string;
}

export interface ITokenPayload {
  user_uuid: string;
  password: string;
}