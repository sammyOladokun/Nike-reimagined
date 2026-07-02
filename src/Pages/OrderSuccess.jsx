import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-[#138695]">Order placed</p>
      <h1 className="mt-4 text-4xl font-bold">Thanks for your order.</h1>
      {order ? (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Order number</p>
          <p className="mt-2 text-2xl font-bold">{order.orderNumber}</p>
          <p className="mt-4 text-gray-600">
            We’ve saved your order and sent it into the backend flow. This is the exact point where a production order
            confirmation would continue into payment, fulfillment, and email notifications.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-gray-600">
            <p><span className="font-semibold text-gray-900">Customer:</span> {order.customerName}</p>
            <p><span className="font-semibold text-gray-900">Email:</span> {order.customerEmail}</p>
            <p><span className="font-semibold text-gray-900">Total:</span> ${order.total}</p>
            <p><span className="font-semibold text-gray-900">Status:</span> {order.status}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">
          Your order was created successfully. If you refresh this page, you’ll still have the cart flow ready to go for the next purchase.
        </p>
      )}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/"
          className="rounded-xl bg-gray-950 px-6 py-3 font-semibold text-white"
        >
          Back to Home
        </Link>
        <Link
          to="/mens"
          className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
