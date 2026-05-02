import {Router} from 'express';
import * as profileController from '../controllers/profile.controller';

const router = Router();

router.get('/health', profileController.health);
router.get('/status', profileController.status);
router.get('/livez', profileController.livez);
router.get('/readyz', profileController.readyz);

export default router;
