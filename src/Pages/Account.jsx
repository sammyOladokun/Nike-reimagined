import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pageError, setPageError] = useState('');
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (isLoading) {
        return;
      }

      if (!user) {
        setIsFetchingOrders(false);
        return;
      }

      try {
        const result = await apiRequest('/api/orders/mine');
        setOrders(result.orders ?? []);
      } catch (error) {
        setPageError(error.message);
      } finally {
        setIsFetchingOrders(false);
      }
    };

    loadOrders();
  }, [isLoading, user]);

  if (isLoading || isFetchingOrders) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[#138695]">Account</p>
        <h1 className="mt-4 text-4xl font-bold">Sign in to view your orders.</h1>
        <p className="mt-4 text-gray-600">
          This page shows the production-style account experience with order history and profile details.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth?returnTo=/account"
            className="rounded-xl bg-gray-950 px-6 py-3 font-semibold text-white"
          >
            Sign In
          </Link>
          <Link
            to="/mens"
            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-[#138695]">Profile</p>
          <h1 className="mt-3 text-3xl font-bold">{user.name}</h1>
          <p className="mt-2 text-gray-600">{user.email}</p>
          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">Member since:</span>{' '}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Role:</span> {user.role}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="rounded-xl bg-[#138695] px-5 py-3 font-semibold text-white"
            >
              Go to Checkout
            </button>
            <Link
              to="/mens"
              className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-center text-gray-900"
            >
              Continue Shopping
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-[#138695]">Orders</p>
          <h2 className="mt-3 text-3xl font-bold">Your order history</h2>

          {pageError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{pageError}</p>
          )}

          {!pageError && orders.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
              No orders yet. Your first purchase will appear here.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div key={order.orderNumber} className="rounded-2xl border border-gray-200 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><span className="font-semibold text-gray-900">Status:</span> {order.status}</p>
                      <p><span className="font-semibold text-gray-900">Total:</span> ${order.total}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-900">Items:</span> {order.items.length}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold text-gray-900">Ship to:</span> {order.shippingAddress}, {order.city}
                    </p>
                  </div>
                  {order.items?.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                      <p className="font-semibold text-gray-900">Purchased items</p>
                      <div className="mt-3 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p>Size {item.size} · Qty {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-900">${item.unitPrice * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Account;
