import {Router} from 'express';
import * as falloutController from '../controllers/fallout.controller';

const router = Router();

// router.post('/list', spawnerService.list);
// router.post('/view', spawnerService.view);
// router.post('/list-galaxies', spawnerService.listGalaxies);
router.get('/health', falloutController.health);
router.get('/status', falloutController.status);
router.get('/livez', falloutController.livez);
router.get('/readyz', falloutController.readyz);


export default router;
