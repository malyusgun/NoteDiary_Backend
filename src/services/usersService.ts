import { PrismaClient } from '@prisma/client';
import { IBodyPage, IBodyUser } from '../interface/requests';
import { randomUUID } from 'node:crypto';
import PagesService from './pagesService';
import EntitiesService from './entitiesService';

const prisma = new PrismaClient();

class UsersService {
  async createUser(body: IBodyUser) {
    body.user_uuid = randomUUID();
    const entityUuid = randomUUID();
    await prisma.user.create({ data: body });
    const homePage = await PagesService.createPage({
      user_uuid: body.user_uuid,
      page_title: 'Home page',
      page_navigation_order: '-1'
    });
    const startEntity = await EntitiesService.createEntity({
      entity_uuid: entityUuid,
      page_uuid: homePage.page_uuid,
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
      entity_order: 1
    });
    const editedHomePage = await prisma.page.findFirst({
      where: {
        page_uuid: homePage.page_uuid
      }
    });
    const createdUser = await prisma.user.findFirst({
      where: {
        user_uuid: body.user_uuid
      }
    });
    return {
      createdUser,
      homePage: editedHomePage,
      startEntity
    };
  }
  async getUser(body: IBodyUser) {
    return prisma.user.findFirst({
      where: {
        user_uuid: body.user_uuid
      }
    });
  }
  async addUserPage(page_uuid: string, user_uuid: string) {
    const user = await prisma.user.findFirst({
      where: {
        user_uuid: user_uuid
      }
    });
    if (user?.pages_uuid) {
      user.pages_uuid.push(page_uuid);
    } else user.pages_uuid = [page_uuid];
    return prisma.user.update({
      data: user,
      where: {
        user_uuid: user.user_uuid
      }
    });
  }
  async editUser(body: IBodyUser) {
    return prisma.user.update({
      data: body,
      where: {
        user_uuid: body.user_uuid
      }
    });
  }
  async deleteUser(body: IBodyUser) {
    return prisma.user.delete({
      where: {
        user_uuid: body.user_uuid
      }
    });
  }
  async deleteUserPage(page_uuid: string, user_uuid: string) {
    const currentUser = await prisma.user.findFirst({
      where: {
        user_uuid: user_uuid
      }
    });
    const pages = JSON.parse(currentUser.pages_uuid);
    pages.filter((uuid: string) => uuid !== page_uuid);
    currentUser.pages_uuid = JSON.stringify(pages);
    return prisma.user.update({
      data: currentUser,
      where: {
        user_uuid: currentUser.user_uuid
      }
    });
  }
}

export default new UsersService();
