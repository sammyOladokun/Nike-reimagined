import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await apiRequest('/api/auth/session');
        setUser(session.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const handleAuth = async (path, payload) => {
    setAuthError('');
    try {
      const result = await apiRequest(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setUser(result.user);
      return result;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const signIn = (payload) => handleAuth('/api/auth/signin', payload);
  const signUp = (payload) => handleAuth('/api/auth/signup', payload);

  const signOut = async () => {
    await apiRequest('/api/auth/signout', { method: 'POST' });
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      authError,
      signIn,
      signUp,
      signOut,
      setAuthError,
    }),
    [user, isLoading, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
