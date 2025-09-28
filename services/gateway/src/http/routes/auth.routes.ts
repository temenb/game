import {Router} from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.get('/health', authController.health);
router.get('/status', authController.status);
router.get('/livez', authController.livez);
router.get('/readyz', authController.readyz);
router.get('/anonymous-sign-in', authController.anonymousSignIn);

export default router;

