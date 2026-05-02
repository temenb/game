import {Router} from 'express';
import * as engineController from '../controllers/engine.controller';

const router = Router();

router.get('/health', engineController.health);
router.get('/status', engineController.status);
router.get('/livez', engineController.livez);
router.get('/readyz', engineController.readyz);

export default router;
