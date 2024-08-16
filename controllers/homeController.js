import HomeService from "../services/homeService.js";

class HomeController {
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
  async editEntity(req) {
    try {
      return await HomeService.editEntity(req.body);
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
