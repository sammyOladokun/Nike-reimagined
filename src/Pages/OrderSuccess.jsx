import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-[#138695]">Order placed</p>
      <h1 className="mt-4 text-4xl font-bold">Thanks for your order.</h1>
      <p className="mt-4 text-gray-600">
        This is a showcase success page for the portfolio flow, ready to be connected to real order persistence next.
      </p>
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
