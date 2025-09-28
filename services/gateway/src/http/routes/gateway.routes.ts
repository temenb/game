import {Router} from 'express';
import * as healthController from '../controllers/health.controller';
import {fullHealth} from "../../services/health.service";

const router = Router();

router.get('/health', healthController.health);
router.get('/full-health', healthController.fullHealth);
router.get('/status', healthController.status);
router.get('/livez', healthController.livez);
router.get('/readyz', healthController.readyz);

export default router;
