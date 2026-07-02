import { orderService } from '../services/order.service.js';

export const checkout = async (request, response, next) => {
  try {
    const order = await orderService.checkout(request.body, request.user);
    response.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

export const getOrderByNumber = async (request, response, next) => {
  try {
    const order = await orderService.getByOrderNumber(request.params.orderNumber);
    response.json({ order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (request, response, next) => {
  try {
    const orders = await orderService.listForUser(request.user);
    response.json({ orders });
  } catch (error) {
    next(error);
  }
};
