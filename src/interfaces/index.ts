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
