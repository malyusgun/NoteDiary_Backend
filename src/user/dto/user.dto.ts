import { SheetDTO } from '../../sheet/dto/sheet.dto';

export class UserDTO {
  nick_name: string;
  email: string;
  password: string;
  user_uuid?: string;
  favorite_color: string;
  user_sheets: SheetDTO[];
}
