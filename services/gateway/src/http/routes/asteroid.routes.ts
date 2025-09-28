import {Router} from 'express';
import * as asteroidController from '../controllers/asteroid.controller';

const router = Router();

// router.post('/list', asteroidService.list);
// router.post('/view', asteroidService.view);
// router.post('/list-galaxies', asteroidService.listGalaxies);
router.get('/health', asteroidController.health);
router.get('/status', asteroidController.status);
router.get('/livez', asteroidController.livez);
router.get('/readyz', asteroidController.readyz);


export default router;
