import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

router.post('/user', register);
router.post('/user/login', login);

export default router;