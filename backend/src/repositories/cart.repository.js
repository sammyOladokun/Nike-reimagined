import { prisma } from '../lib/prisma.js';

const getByUserId = async (userId) =>
  prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

const getOrCreateByUserId = async (userId) => {
  const existingCart = await getByUserId(userId);

  if (existingCart) {
    return existingCart;
  }

  return prisma.cart.create({
    data: { userId },
    include: { items: true },
  });
};

const replaceItems = async (cartId, items) =>
  prisma.$transaction(async (transaction) => {
    await transaction.cartItem.deleteMany({
      where: { cartId },
    });

    if (items.length > 0) {
      await transaction.cartItem.createMany({
        data: items.map((item) => ({
          cartId,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return transaction.cart.findUniqueOrThrow({
      where: { id: cartId },
      include: { items: true },
    });
  });

const clearByUserId = async (userId) => {
  const cart = await getOrCreateByUserId(userId);

  return replaceItems(cart.id, []);
};

export const cartRepository = {
  getByUserId,
  getOrCreateByUserId,
  replaceItems,
  clearByUserId,
};
