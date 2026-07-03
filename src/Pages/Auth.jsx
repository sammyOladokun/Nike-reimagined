import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getFirstError = (value) => (Array.isArray(value) ? value[0] : value);

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, authError, isLoading } = useAuth();
  const [mode, setMode] = useState('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const returnTo = searchParams.get('returnTo') ?? '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      if (mode === 'signup') {
        await signUp(formData);
      } else {
        await signIn({
          email: formData.email,
          password: formData.password,
        });
      }

      navigate(returnTo, { replace: true });
    } catch (error) {
      const nextFieldErrors = {};

      if (error.fieldErrors?.name) {
        nextFieldErrors.name = getFirstError(error.fieldErrors.name);
      }

      if (error.fieldErrors?.email) {
        nextFieldErrors.email = getFirstError(error.fieldErrors.email);
      }

      if (error.fieldErrors?.password) {
        nextFieldErrors.password = getFirstError(error.fieldErrors.password);
      }

      setFieldErrors(nextFieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gray-950 text-white p-8 md:p-10 flex flex-col justify-between">
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-[#33CCCC]">Nike Reimagined</p>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
              Sign in to keep your cart, track orders, and move faster at checkout.
            </h1>
            <p className="mt-4 text-gray-300">
              This portfolio build uses real auth flow patterns so the store feels complete, even without a production payment backend.
            </p>
          </div>
          <div className="mt-10 space-y-3 text-sm text-gray-400">
            <p>• Session-backed sign in / sign up</p>
            <p>• Guest checkout fallback</p>
            <p>• Cart ready for future order history</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                mode === 'signin' ? 'bg-[#138695] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                mode === 'signup' ? 'bg-[#138695] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#138695]"
                  placeholder="Your name"
                />
                {fieldErrors.name && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#138695]"
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#138695]"
                placeholder="At least 8 characters"
              />
              {fieldErrors.password && (
                <p className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {authError && !Object.keys(fieldErrors).length && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{authError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#138695] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500">
            {mode === 'signin' ? 'New here?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="font-semibold text-[#138695]"
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
