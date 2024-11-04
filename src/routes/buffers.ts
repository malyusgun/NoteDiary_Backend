import EntitiesController from '../controllers/entitiesController';
import { Router } from 'express';

const router = Router();

router.post('/sheets/:uuid/entities/image', EntitiesController.createImage);
router.post('/sheets/:uuid/entities/crop', EntitiesController.createImageForCrop);

export default router;
