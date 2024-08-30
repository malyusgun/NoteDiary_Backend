import HomeController from '../controllers/homeController.js';
import { submitFilesToUsers, submitToUsers } from '../index.js';

export const websocketRoute = async (req) => {
  switch (req.event) {
    case 'getHomeBackground':
      const homeBackground = await HomeController.getHomeBackground();
      submitFilesToUsers(homeBackground);
      break;
    case 'changeHomeBackground':
      await HomeController.changeHomeBackground(req);
      submitToUsers('changeHomeBackground', { ...req.body });
      break;
    case 'removeHomeBackground':
      await HomeController.removeHomeBackground();
      break;
    case 'getHomeEntities':
      const getHomeEntitiesData = await HomeController.getEntities();
      getHomeEntitiesData.entitiesImages.forEach((entityBuffer) => {
        submitFilesToUsers(entityBuffer);
      });
      submitToUsers('getHomeEntities', getHomeEntitiesData.entities);
      break;
    case 'createHomeEntity':
      const createdHomeEntity = await HomeController.createEntity(req);
      submitToUsers('createHomeEntity', createdHomeEntity);
      break;
    case 'editHomeEntity': {
      const editedHomeEntity = await HomeController.editEntity(req);
      submitToUsers('editHomeEntity', editedHomeEntity);
      break;
    }
    case 'cropImage': {
      const editedHomeEntity = await HomeController.cropImage(req);
      submitToUsers('editHomeEntity', editedHomeEntity);
      break;
    }
    case 'deleteHomeEntity':
      const deletedHomeEntity = await HomeController.deleteEntity(req);
      submitToUsers('deleteHomeEntity', deletedHomeEntity);
      break;
    case 'changeOrderHomeEntity':
      await HomeController.changeOrderEntity(req);
      submitToUsers('changeOrderHomeEntity', { ...req.body });
      break;
  }
};
