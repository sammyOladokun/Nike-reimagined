import { prisma } from '../lib/prisma.js';

const create = async ({ userId, customerName, customerEmail, shippingAddress, city, postalCode, subtotal, shippingFee, total, items, orderNumber }) =>
  prisma.order.create({
    data: {
      orderNumber,
      userId,
      customerName,
      customerEmail,
      shippingAddress,
      city,
      postalCode,
      subtotal,
      shippingFee,
      total,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
      user: true,
    },
  });

const findByOrderNumber = async (orderNumber) =>
  prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      items: true,
      user: true,
    },
  });

const findByUserId = async (userId) =>
  prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      items: true,
    },
  });

export const orderRepository = {
  create,
  findByOrderNumber,
  findByUserId,
};
