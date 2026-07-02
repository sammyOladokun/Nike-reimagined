import { z } from 'zod';
import { unauthorized } from '../lib/errors.js';
import { cartRepository } from '../repositories/cart.repository.js';

const cartItemsSchema = z.object({
  items: z.record(z.coerce.number().int().nonnegative()),
});

const serializeCart = (cart) => {
  const items = {};

  for (const item of cart.items) {
    items[item.productId] = item.quantity;
  }

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    updatedAt: cart.updatedAt,
  };
};

const normalizeItems = (itemsRecord) =>
  Object.entries(itemsRecord)
    .map(([productId, quantity]) => ({
      productId: Number(productId),
      quantity,
    }))
    .filter((item) => item.productId > 0 && item.quantity > 0);

const getCart = async (user) => {
  if (!user) {
    throw unauthorized('Authentication required');
  }

  const cart = await cartRepository.getOrCreateByUserId(user.id);
  return serializeCart(cart);
};

const syncCart = async (user, payload) => {
  if (!user) {
    throw unauthorized('Authentication required');
  }

  const data = cartItemsSchema.parse(payload);
  const cart = await cartRepository.getOrCreateByUserId(user.id);
  const updatedCart = await cartRepository.replaceItems(cart.id, normalizeItems(data.items));

  return serializeCart(updatedCart);
};

const clearCart = async (user) => {
  if (!user) {
    throw unauthorized('Authentication required');
  }

  const cart = await cartRepository.clearByUserId(user.id);
  return serializeCart(cart);
};

export const cartService = {
  getCart,
  syncCart,
  clearCart,
};
