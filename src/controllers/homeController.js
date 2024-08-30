import HomeService from '../services/homeService.js';

class HomeController {
  async getHomeBackground() {
    try {
      return await HomeService.getHomeBackground();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async changeHomeBackground(req) {
    try {
      return await HomeService.changeHomeBackground(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async removeHomeBackground() {
    try {
      await HomeService.removeHomeBackground();
    } catch (error) {
      console.log(error);
    }
  }
  async getEntities() {
    try {
      return await HomeService.getEntities();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async createEntity(req) {
    try {
      return await HomeService.createEntity(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async createImage(req) {
    try {
      return await HomeService.createImage(req);
    } catch (error) {
      console.log(error);
    }
  }
  async editEntity(req) {
    try {
      return await HomeService.editEntity(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async cropImage(req) {
    try {
      return await HomeService.cropImage(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteEntity(req) {
    try {
      return await HomeService.deleteEntity(req.body);
    } catch (error) {
      console.log(error);
    }
  }
  async changeOrderEntity(req) {
    try {
      return await HomeService.changeOrderEntity(req.body);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new HomeController();
