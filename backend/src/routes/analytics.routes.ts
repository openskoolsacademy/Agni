import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authGuard);

router.get('/:botId', getAnalytics);

export default router;
