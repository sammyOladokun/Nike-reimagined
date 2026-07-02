import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { badRequest, notFound, unauthorized } from '../lib/errors.js';
import { cartRepository } from '../repositories/cart.repository.js';
import { orderRepository } from '../repositories/order.repository.js';

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(2),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
});

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email().optional(),
  shippingAddress: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(3),
  items: z.array(orderItemSchema).min(1),
});

const toDecimal = (value) => new Prisma.Decimal(value.toFixed(2));

const serializeOrder = (order) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: order.status,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  shippingAddress: order.shippingAddress,
  city: order.city,
  postalCode: order.postalCode,
  subtotal: order.subtotal.toString(),
  shippingFee: order.shippingFee.toString(),
  total: order.total.toString(),
  createdAt: order.createdAt,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    unitPrice: item.unitPrice.toString(),
    quantity: item.quantity,
  })),
});

const checkout = async (payload, user) => {
  const data = checkoutSchema.parse(payload);

  const customerEmail = user?.email ?? data.customerEmail;

  if (!customerEmail) {
    throw badRequest('Customer email is required for guest checkout');
  }

  const subtotalValue = data.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const shippingFeeValue = subtotalValue > 0 ? 0 : 0;
  const totalValue = subtotalValue + shippingFeeValue;

  const order = await orderRepository.create({
    userId: user?.id ?? null,
    customerName: data.customerName,
    customerEmail,
    shippingAddress: data.shippingAddress,
    city: data.city,
    postalCode: data.postalCode,
    subtotal: toDecimal(subtotalValue),
    shippingFee: toDecimal(shippingFeeValue),
    total: toDecimal(totalValue),
    orderNumber: `ORD-${nanoid(10).toUpperCase()}`,
    items: data.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitPrice: toDecimal(item.unitPrice),
      quantity: item.quantity,
    })),
  });

  if (user?.id) {
    await cartRepository.clearByUserId(user.id);
  }

  return serializeOrder(order);
};

const getByOrderNumber = async (orderNumber) => {
  const order = await orderRepository.findByOrderNumber(orderNumber);

  if (!order) {
    throw notFound('Order not found');
  }

  return serializeOrder(order);
};

const listForUser = async (user) => {
  if (!user) {
    throw unauthorized('Authentication required');
  }

  const orders = await orderRepository.findByUserId(user.id);

  return orders.map(serializeOrder);
};

export const orderService = {
  checkout,
  getByOrderNumber,
  listForUser,
};
