import { Router } from 'express';
import controllers from '../controllers';

const router = Router();

router.get('/', controllers.messageController.getAllMessages);

router.get('/:messageId', controllers.messageController.getMessage);

router.post('/', controllers.messageController.createMessage);

router.delete('/:messageId', controllers.messageController.createMessage);

export default router;