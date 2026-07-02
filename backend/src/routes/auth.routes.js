import { Router } from 'express';
import { signUp, signIn, signOut, getSession } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/signup', authLimiter, signUp);
router.post('/signin', authLimiter, signIn);
router.post('/signout', signOut);
router.get('/session', getSession);
router.get('/me', requireAuth, (request, response) => {
  response.json({
    user: {
      id: request.user.id,
      name: request.user.name,
      email: request.user.email,
      role: request.user.role,
      createdAt: request.user.createdAt,
    },
  });
});

export const authRouter = router;
