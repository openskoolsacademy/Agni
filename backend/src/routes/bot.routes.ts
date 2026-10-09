import { Router } from 'express';
import {
  getBots,
  createBot,
  getBot,
  updateBot,
  deleteBot,
  getPublicBotConfig,
  updateBotSettings,
  getAllowedDomains,
  addAllowedDomain,
  deleteAllowedDomain,
} from '../controllers/bot.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';
import { verifyBotDomain } from '../middleware/domain.middleware.js';

const router = Router();

// Public endpoint for embed widget to retrieve its appearance and greetings
router.get('/:id/config', verifyBotDomain, getPublicBotConfig);

// Protected admin endpoints
router.use(authGuard);

router.get('/', getBots);
router.post('/', createBot);
router.get('/:id', getBot);
router.put('/:id', updateBot);
router.delete('/:id', deleteBot);

// Settings
router.put('/:id/settings', updateBotSettings);

// Domain protection
router.get('/:id/domains', getAllowedDomains);
router.post('/:id/domains', addAllowedDomain);
router.delete('/:id/domains/:domainId', deleteAllowedDomain);

export default router;
