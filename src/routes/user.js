import { Router } from 'express';
import controllers from '../controllers';

const router = Router();

router.get('/', controllers.userController.getAllUsers);

router.get('/:userId', controllers.userController.getUser);

export default router;