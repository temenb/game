import {Router} from 'express';
import * as pawnController from '../controllers/pawn.controller';

const router = Router();

router.get('/health', pawnController.health);
router.get('/status', pawnController.status);
router.get('/livez', pawnController.livez);
router.get('/readyz', pawnController.readyz);

export default router;
