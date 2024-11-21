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
router.post('/users/registration', UserController.registration);
router.post('/users/login', UserController.login);
router.patch('/users/:uuid/refresh', UserController.refresh);
router.delete('/users', authMiddleware, UserController.logout);

router.get('/users/:uuid', authMiddleware, UserController.getUser);
router.patch('/users/:uuid', authMiddleware, UserController.editUser);
router.delete('/users/:uuid/destroyAccount', authMiddleware, UserController.deleteUser);

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
