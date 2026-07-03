import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

const getFirstError = (value) => (Array.isArray(value) ? value[0] : value);

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { all_product, cartItems, clearCart, getTotalCartAmount, getTotalCartItems } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useMemo(
    () => all_product.filter((product) => cartItems[product.id] > 0),
    [all_product, cartItems],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setFieldErrors({});

    try {
      const payload = {
        customerName: formData.fullName,
        customerEmail: user ? user.email : formData.email,
        shippingAddress: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        items: items.map((product) => ({
          productId: product.id,
          productName: product.name,
          unitPrice: product.new_price,
          quantity: cartItems[product.id],
        })),
      };

      const result = await apiRequest('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      clearCart();
      navigate('/order-success', {
        state: {
          order: result.order,
        },
      });
    } catch (error) {
      const nextFieldErrors = {
        fullName: getFirstError(error.fieldErrors?.customerName),
        email: getFirstError(error.fieldErrors?.customerEmail),
        address: getFirstError(error.fieldErrors?.shippingAddress),
        city: getFirstError(error.fieldErrors?.city),
        postalCode: getFirstError(error.fieldErrors?.postalCode),
      };

      setFieldErrors(nextFieldErrors);

      const hasFieldErrors = Object.values(nextFieldErrors).some(Boolean);
      setErrorMessage(hasFieldErrors ? '' : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  if (getTotalCartItems() === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-gray-600">Add a few products before heading to checkout.</p>
        <Link
          to="/mens"
          className="mt-6 inline-flex rounded-xl bg-[#138695] px-6 py-3 font-semibold text-white"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <form onSubmit={handlePlaceOrder} className="flex-1 space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#138695]">Checkout</p>
            <h1 className="mt-2 text-3xl font-bold">Complete your order</h1>
            <p className="mt-2 text-gray-600">
              {user
                ? `Signed in as ${user.email}.`
                : 'Guests can complete checkout with an email address, or sign in to save order history.'}
            </p>
          </div>

          {!user && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-semibold">Guest checkout</p>
              <p className="mt-1 text-sm text-gray-600">
                Enter your email below to receive order updates and a receipt.
              </p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#138695]"
                  placeholder="guest@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
              <Link
                to="/auth?returnTo=/checkout"
                className="mt-4 inline-flex text-sm font-semibold text-[#138695]"
              >
                Sign in instead
              </Link>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#138695]"
              />
              {fieldErrors.fullName && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#138695]"
              />
              {fieldErrors.postalCode && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.postalCode}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#138695]"
            />
            {fieldErrors.address && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#138695]"
            />
            {fieldErrors.city && (
              <p className="mt-2 text-sm text-red-600">{fieldErrors.city}</p>
            )}
          </div>

          {errorMessage && !Object.values(fieldErrors).some(Boolean) && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gray-950 py-4 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <aside className="w-full lg:w-[420px]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sticky top-6">
            <h2 className="text-2xl font-bold">Order summary</h2>
            <div className="mt-6 space-y-4">
              {items.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-500">Qty {cartItems[product.id]}</p>
                  </div>
                  <p className="font-semibold">${product.new_price * cartItems[product.id]}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getTotalCartAmount()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getTotalCartAmount()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
