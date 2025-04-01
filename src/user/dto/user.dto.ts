import { SheetDTO } from '../../sheet/dto/sheet.dto';

export class UserDTO {
  nick_name: string;
  email: string;
  password: string;
  user_uuid?: string;
  favorite_color: string;
  user_sheets: SheetDTO[];
}

export interface IUserAuth {
  user_uuid: string;
  code: string;
  nick_name: string;
  email: string;
  password: string;
  codeDieTime: string;
}
