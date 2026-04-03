import {Router} from 'express';
import * as spawnerController from '../controllers/spawner.controller';

const router = Router();

// router.post('/list', spawnerService.list);
// router.post('/view', spawnerService.view);
// router.post('/list-galaxies', spawnerService.listGalaxies);
router.get('/health', spawnerController.health);
router.get('/status', spawnerController.status);
router.get('/livez', spawnerController.livez);
router.get('/readyz', spawnerController.readyz);


export default router;
