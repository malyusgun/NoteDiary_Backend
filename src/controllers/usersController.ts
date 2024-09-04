import { IBodyUser, IWSRequest } from '../interface/requests';
import UsersService from '../services/usersService';

class UsersController {
  async createUser(req: IWSRequest<'createUser', IBodyUser>) {
    return UsersService.createUser(req.body);
  }
  async getUser(req: IWSRequest<'getUser', IBodyUser>) {
    return UsersService.getUser(req.body);
  }
  async editUser(req: IWSRequest<'editUser', IBodyUser>) {
    return UsersService.editUser(req.body);
  }
  async deleteUser(req: IWSRequest<'deleteUser', IBodyUser>) {
    return UsersService.deleteUser(req.body);
  }
}
export default new UsersController();
