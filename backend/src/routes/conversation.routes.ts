import { Router } from 'express';
import {
  getConversations,
  getConversationDetail,
  deleteConversation,
} from '../controllers/conversation.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authGuard);

router.get('/:botId', getConversations);
router.get('/detail/:id', getConversationDetail);
router.delete('/detail/:id', deleteConversation);

export default router;
