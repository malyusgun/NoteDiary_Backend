import EntitiesController from '../controllers/entitiesController';
import { submitFilesToUsers, submitToUsers } from '../index';
import PagesController from '../controllers/pagesController';
import UsersController from '../controllers/usersController';

export const websocketRoute = async (req: any) => {
  switch (req.event) {
    // create
    case 'createUser':
      const createdUserData = await UsersController.createUser(req);
      submitToUsers('createEntity', createdUserData.startEntity);
      submitToUsers('createPage', createdUserData.homePage);
      submitToUsers('createUser', createdUserData.createdUser);
      break;
    case 'createPage':
      const createdPage = await PagesController.createPage(req);
      submitToUsers('createPage', createdPage);
      break;
    case 'createEntity':
      const createdEntity = await EntitiesController.createEntity(req);
      submitToUsers('createEntity', createdEntity);
      break;
    // read
    case 'getUser':
      const userInfo = await UsersController.getUser(req);
      submitToUsers('getUser', userInfo);
      break;
    case 'getPage':
      const pageInfo = await PagesController.getPage(req);
      submitToUsers('getPage', pageInfo);
      break;
    case 'getPageBackground':
      const homeBackground = await PagesController.getPageBackground(req);
      submitFilesToUsers(homeBackground);
      break;
    case 'getPageEntities':
      const getPageEntitiesData = await EntitiesController.getEntities(req);
      getPageEntitiesData.entitiesImages.forEach((entityBuffer: Buffer) => {
        submitFilesToUsers(entityBuffer);
      });
      submitToUsers('getPageEntities', getPageEntitiesData.entities);
      break;
    // update
    case 'editUser':
      const editedUser = await UsersController.editUser(req);
      submitToUsers('editUser', editedUser);
      break;
    case 'editPage':
      const editedPage = await PagesController.editPage(req);
      submitToUsers('editPage', editedPage);
      break;
    case 'editPageBackground':
      await PagesController.editPageBackground(req);
      submitToUsers('editPageBackground', { ...req.body });
      break;
    case 'editEntity': {
      const editedHomeEntity = await EntitiesController.editEntity(req);
      submitToUsers('editEntity', editedHomeEntity);
      break;
    }
    case 'cropImage': {
      const editedEntity = await EntitiesController.cropImage(req);
      submitToUsers('editEntity', editedEntity);
      break;
    }
    case 'changeEntitiesOrder':
      const changedEntitiesOrders = await EntitiesController.changeEntitiesOrder(req);
      submitToUsers('changeEntitiesOrder', changedEntitiesOrders);
      break;
    // delete
    case 'deleteUser':
      const deletedUser = await UsersController.deleteUser(req);
      submitToUsers('deleteUser', deletedUser);
      break;
    case 'deletePage':
      const deletedPage = await PagesController.deletePage(req);
      submitToUsers('deletePage', deletedPage);
      break;
    case 'deletePageBackground':
      await PagesController.deletePageBackground(req);
      break;
    case 'deleteEntity':
      const deletedEntity = await EntitiesController.deleteEntity(req);
      submitToUsers('deleteEntity', deletedEntity);
      break;
  }
};
