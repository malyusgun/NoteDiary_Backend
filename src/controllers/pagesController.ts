import PagesService from '../services/pagesService';
import { IEditPageBackground, IBodyPageUuid, IWSRequest, IBodyPage } from '../interface/requests';

class PagesController {
  async createPage(req: IWSRequest<'createPage', IBodyPage>) {
    try {
      return await PagesService.createPage(req.body);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getPage(req: IWSRequest<'getPage', IBodyPageUuid>) {
    try {
      return await PagesService.getPage(req.body);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getPageBackground(req: IWSRequest<'deletePageBackground', IBodyPageUuid>) {
    try {
      return await PagesService.getPageBackground(req.body.page_uuid);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async editPage(req: IWSRequest<'editPage', IBodyPage>) {
    try {
      return await PagesService.editPage(req.body);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async editPageBackground(req: IWSRequest<'editPageBackground', IEditPageBackground>) {
    try {
      return await PagesService.editPageBackground(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async deletePage(req: IWSRequest<'deletePage', IBodyPage>) {
    try {
      return PagesService.deletePage(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async deletePageBackground(req: IWSRequest<'deletePageBackground', IBodyPageUuid>) {
    try {
      await PagesService.deletePageBackground(req.body.page_uuid);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new PagesController();
