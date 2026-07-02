import { Router } from 'express';
import { checkout, getMyOrders, getOrderByNumber } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/checkout', authLimiter, checkout);
router.get('/mine', requireAuth, getMyOrders);
router.get('/:orderNumber', getOrderByNumber);

export const orderRouter = router;
