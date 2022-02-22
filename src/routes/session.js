import { Router } from 'express';
import controllers from '../controllers';

const router = Router();

router.get('/', controllers.sessionController.getSession)

export default router;