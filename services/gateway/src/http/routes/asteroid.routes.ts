import {Router} from 'express';
import * as spawnController from '../controllers/spawn.controller';

const router = Router();

// router.post('/list', spawnService.list);
// router.post('/view', spawnService.view);
// router.post('/list-galaxies', spawnService.listGalaxies);
router.get('/health', spawnController.health);
router.get('/status', spawnController.status);
router.get('/livez', spawnController.livez);
router.get('/readyz', spawnController.readyz);


export default router;
