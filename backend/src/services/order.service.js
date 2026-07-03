import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { badRequest, notFound, unauthorized } from '../lib/errors.js';
import { cartRepository } from '../repositories/cart.repository.js';
import { orderRepository } from '../repositories/order.repository.js';

const orderItemSchema = z.object({
  productId: z.number().int().positive('Select a valid product'),
  productName: z.string().trim().min(2, 'Product name is required'),
  unitPrice: z.number().positive('Product price must be greater than zero'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, 'Full name must be at least 2 characters long'),
  customerEmail: z.string().trim().email('Enter a valid email address').optional(),
  shippingAddress: z.string().trim().min(5, 'Shipping address must be at least 5 characters long'),
  city: z.string().trim().min(2, 'City is required'),
  postalCode: z.string().trim().min(3, 'Postal code is required'),
  items: z.array(orderItemSchema).min(1, 'Add at least one item before checking out'),
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
