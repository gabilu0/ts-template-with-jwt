import { Router } from 'express';
import { getCurrentUser, updateCurrentUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/user', authMiddleware, getCurrentUser);
router.put('/user', authMiddleware, updateCurrentUser);

export default router;