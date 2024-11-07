import EntitiesController from '../controllers/entitiesController';
import SheetController from '../controllers/sheetController';
import UserController from '../controllers/userController';
import { Router } from 'express';
// @ts-ignore
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// users
router.post('/users/confirm', UserController.confirmMail);
router.get('/users/:uuid/code', UserController.getConfirmMailCode);

router.post('/users', authMiddleware, UserController.registration);
router.get('/users/:uuid', authMiddleware, UserController.getUser);
router.patch('/users/:uuid', authMiddleware, UserController.editUser);
router.patch('/users/:uuid/refresh', authMiddleware, UserController.refreshToken);
router.delete('/users/:uuid', authMiddleware, UserController.logout);

// sheets
router.post('/sheets', authMiddleware, SheetController.createSheet);
router.get('/sheets/:uuid/background', authMiddleware, SheetController.getSheetBackground);
router.patch('/sheets/:uuid', authMiddleware, SheetController.editSheet);
router.patch('/sheets/:uuid/background', authMiddleware, SheetController.editSheetBackground);
router.delete('/sheets/:uuid', authMiddleware, SheetController.deleteSheet);
router.delete('/sheets/:uuid/background', authMiddleware, SheetController.deleteSheetBackground);

// entities
router.post('/sheets/:uuid/entities', authMiddleware, EntitiesController.createEntity);
router.get('/sheets/:uuid/entities', authMiddleware, EntitiesController.getEntities);
router.patch('/sheets/:uuid/entities', authMiddleware, EntitiesController.changeEntitiesOrder);
router.patch('/sheets/:uuid/entities/:uuid', authMiddleware, EntitiesController.editEntity);
router.patch('/sheets/:uuid/entities/crop/:uuid', authMiddleware, EntitiesController.cropImage);
router.patch(
  '/sheets/:uuid/entities/defaultImageSize/:uuid',
  authMiddleware,
  EntitiesController.returnOriginalSizeImage
);
router.delete('/sheets/:uuid/entities/:uuid', authMiddleware, EntitiesController.deleteEntity);

export default router;

// export const websocketRoute = async (req: any) => {
//   switch (req.event) {
//     // create
//     case 'createUser':
//       const createdUserData = await UserController.createUser(req);
//       submitToUsers('createEntity', createdUserData.startEntity);
//       submitToUsers('createSheet', createdUserData.homeSheet);
//       submitToUsers('createUser', createdUserData.createdUser);
//       break;
//     case 'createSheet':
//       const createdSheet = await SheetController.createSheet(req);
//       submitToUsers('createSheet', createdSheet);
//       break;
//     case 'createEntity':
//       const createdEntity = await EntitiesController.createEntity(req);
//       submitToUsers('createEntity', createdEntity);
//       break;
//     // read
//     case 'getUser':
//       const userInfo = await UserController.getUser(req);
//       submitToUsers('getUser', userInfo);
//       break;
//     case 'getSheet':
//       const sheetInfo = await SheetController.getSheet(req);
//       submitToUsers('getSheet', sheetInfo);
//       break;
//     case 'getSheetBackground':
//       const homeBackground = await SheetController.getSheetBackground(req);
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
//       const editedUser = await UserController.editUser(req);
//       submitToUsers('editUser', editedUser);
//       break;
//     case 'editSheet':
//       const editedSheet = await SheetController.editSheet(req);
//       submitToUsers('editSheet', editedSheet);
//       break;
//     case 'editSheetBackground':
//       await SheetController.editSheetBackground(req);
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
//       const deletedUser = await UserController.deleteUser(req);
//       submitToUsers('deleteUser', deletedUser);
//       break;
//     case 'deleteSheet':
//       const deletedSheet = await SheetController.deleteSheet(req);
//       submitToUsers('deleteSheet', deletedSheet);
//       break;
//     case 'deleteSheetBackground':
//       await SheetController.deleteSheetBackground(req);
//       break;
//     case 'deleteEntity':
//       const deletedEntity = await EntitiesController.deleteEntity(req);
//       submitToUsers('deleteEntity', deletedEntity);
//       break;
//   }
// };
