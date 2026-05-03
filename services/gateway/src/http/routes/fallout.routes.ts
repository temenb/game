import {Router} from 'express';
import * as falloutController from '../controllers/fallout.controller';

const router = Router();

router.get('/health', falloutController.health);
router.get('/status', falloutController.status);
router.get('/livez', falloutController.livez);
router.get('/readyz', falloutController.readyz);


export default router;
