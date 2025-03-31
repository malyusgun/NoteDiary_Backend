import path from 'node:path';
import fs from 'node:fs';
import { UserDTO, IUserAuth } from '../dto/user.dto';

export const getUserDataFromAuthFile = (user_uuid: string): IUserAuth => {
  const usersDataFile = path.join(path.resolve(), `/public/auth.txt`);
  const fileContent = fs.readFileSync(usersDataFile).toString();
  const targetChunk = fileContent
    .split('/@$@/')
    .find((chunk) => chunk.includes(user_uuid))!;
  return convertUserData(targetChunk, 'from') as IUserAuth;
};

export const convertUserData = (
  body: UserDTO | string,
  convertType: 'to' | 'from',
  code?: string,
) => {
  if (convertType === 'to' && typeof body === 'object') {
    const codeDieTime = Date.now() + 1000 * 60 * 5;
    return `${body.user_uuid}/@#@/${code}/@#@/${body.nick_name}/@#@/${body.email}/@#@/${body.password}/@#@/${codeDieTime}/@$@/`;
  }
  if (typeof body === 'string') {
    const chunks = body.split('/@#@/');
    return {
      user_uuid: chunks[0],
      code: chunks[1],
      nick_name: chunks[2],
      email: chunks[3],
      password: chunks[4],
      codeDieTime: chunks[5],
    };
  }
};
