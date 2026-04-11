import { Router } from 'express';
import { upload } from '../../middlewares/upload';
import * as uploadController from './upload.controller';

const router = Router();

router.post('/', upload.single('image'), uploadController.uploadImage);

export const uploadRoutes = router;
