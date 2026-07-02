import { cartService } from '../services/cart.service.js';

export const getCart = async (request, response, next) => {
  try {
    const cart = await cartService.getCart(request.user);
    response.json({ cart });
  } catch (error) {
    next(error);
  }
};

export const syncCart = async (request, response, next) => {
  try {
    const cart = await cartService.syncCart(request.user, request.body);
    response.json({ cart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (request, response, next) => {
  try {
    const cart = await cartService.clearCart(request.user);
    response.json({ cart });
  } catch (error) {
    next(error);
  }
};
