import { Router } from 'express';
import { clearCart, getCart, syncCart } from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, getCart);
router.put('/', requireAuth, syncCart);
router.delete('/', requireAuth, clearCart);

export const cartRouter = router;
