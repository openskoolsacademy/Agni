import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller.js';
import { verifyBotDomain } from '../middleware/domain.middleware.js';
import { chatRateLimiter } from '../middleware/rate-limit.middleware.js';

const router = Router();

router.post('/', chatRateLimiter, verifyBotDomain, handleChat);

export default router;
