import {Router} from 'express';
import * as shipController from '../controllers/ship.controller';

const router = Router();

router.get('/health', shipController.health);
router.get('/status', shipController.status);
router.get('/livez', shipController.livez);
router.get('/readyz', shipController.readyz);

export default router;
