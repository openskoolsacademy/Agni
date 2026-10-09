import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rate-limit.middleware.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/me', authGuard, getCurrentUser);

export default router;
