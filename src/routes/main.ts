import EntitiesController from '../controllers/entitiesController';
import SheetsController from '../controllers/sheetsController';
import UsersController from '../controllers/usersController';
import { Router } from 'express';

const router = Router();

// users
router.post('/users', UsersController.createUser);
router.get('/users/:uuid', UsersController.getUser);
router.patch('/users/:uuid', UsersController.editUser);
router.delete('/users/:uuid', UsersController.deleteUser);

// sheets
router.post('/sheets', SheetsController.createSheet);
router.get('/sheets/:uuid/background', SheetsController.getSheetBackground);
router.patch('/sheets/:uuid', SheetsController.editSheet);
router.patch('/sheets/:uuid/background', SheetsController.editSheetBackground);
router.delete('/sheets/:uuid', SheetsController.deleteSheet);
router.delete('/sheets/:uuid/background', SheetsController.deleteSheetBackground);

// entities
router.post('/sheets/:uuid/entities', EntitiesController.createEntity);
router.get('/sheets/:uuid/entities', EntitiesController.getEntities);
router.patch('/sheets/:uuid/entities', EntitiesController.changeEntitiesOrder);
router.patch('/sheets/:uuid/entities/:uuid', EntitiesController.editEntity);
router.patch('/sheets/:uuid/entities/crop/:uuid', EntitiesController.cropImage);
router.patch('/sheets/:uuid/entities/defaultImageSize/:uuid', EntitiesController.returnOriginalSizeImage);
router.delete('/sheets/:uuid/entities/:uuid', EntitiesController.deleteEntity);

export default router;

// export const websocketRoute = async (req: any) => {
//   switch (req.event) {
//     // create
//     case 'createUser':
//       const createdUserData = await UsersController.createUser(req);
//       submitToUsers('createEntity', createdUserData.startEntity);
//       submitToUsers('createSheet', createdUserData.homeSheet);
//       submitToUsers('createUser', createdUserData.createdUser);
//       break;
//     case 'createSheet':
//       const createdSheet = await SheetsController.createSheet(req);
//       submitToUsers('createSheet', createdSheet);
//       break;
//     case 'createEntity':
//       const createdEntity = await EntitiesController.createEntity(req);
//       submitToUsers('createEntity', createdEntity);
//       break;
//     // read
//     case 'getUser':
//       const userInfo = await UsersController.getUser(req);
//       submitToUsers('getUser', userInfo);
//       break;
//     case 'getSheet':
//       const sheetInfo = await SheetsController.getSheet(req);
//       submitToUsers('getSheet', sheetInfo);
//       break;
//     case 'getSheetBackground':
//       const homeBackground = await SheetsController.getSheetBackground(req);
//       submitFilesToUsers(homeBackground);
//       break;
//     case 'getSheetEntities':
//       const getSheetEntitiesData = await EntitiesController.getEntities(req);
//       getSheetEntitiesData.entitiesImages.forEach((entityBuffer: Buffer) => {
//         submitFilesToUsers(entityBuffer);
//       });
//       submitToUsers('getSheetEntities', getSheetEntitiesData.entities);
//       break;
//     // update
//     case 'editUser':
//       const editedUser = await UsersController.editUser(req);
//       submitToUsers('editUser', editedUser);
//       break;
//     case 'editSheet':
//       const editedSheet = await SheetsController.editSheet(req);
//       submitToUsers('editSheet', editedSheet);
//       break;
//     case 'editSheetBackground':
//       await SheetsController.editSheetBackground(req);
//       submitToUsers('editSheetBackground', { ...req });
//       break;
//     case 'editEntity': {
//       const editedHomeEntity = await EntitiesController.editEntity(req);
//       submitToUsers('editEntity', editedHomeEntity);
//       break;
//     }
//     case 'cropImage': {
//       await EntitiesController.cropImage(req);
//       break;
//     }
//     case 'returnOriginalSizeImage': {
//       const result = await EntitiesController!.returnOriginalSizeImage(req);
//       submitFilesToUsers(result.buffer);
//       submitToUsers('returnOriginalSizeImage', result.entity);
//       break;
//     }
//     case 'changeEntitiesOrder':
//       const changedEntitiesOrders = await EntitiesController.changeEntitiesOrder(req);
//       submitToUsers('changeEntitiesOrder', changedEntitiesOrders);
//       break;
//     // delete
//     case 'deleteUser':
//       const deletedUser = await UsersController.deleteUser(req);
//       submitToUsers('deleteUser', deletedUser);
//       break;
//     case 'deleteSheet':
//       const deletedSheet = await SheetsController.deleteSheet(req);
//       submitToUsers('deleteSheet', deletedSheet);
//       break;
//     case 'deleteSheetBackground':
//       await SheetsController.deleteSheetBackground(req);
//       break;
//     case 'deleteEntity':
//       const deletedEntity = await EntitiesController.deleteEntity(req);
//       submitToUsers('deleteEntity', deletedEntity);
//       break;
//   }
// };
