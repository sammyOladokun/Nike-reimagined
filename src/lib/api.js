const ACCESS_TOKEN_KEY = 'nike-access-token';

const getDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? getDefaultApiBaseUrl();

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export const getStoredAccessToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setStoredAccessToken = (token) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearStoredAccessToken = () => setStoredAccessToken(null);

export const apiRequest = async (path, options = {}) => {
  const storedToken = getStoredAccessToken();
  const requestUrl = buildUrl(path);

  let response;

  try {
    response = await fetch(requestUrl, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch (error) {
    const networkError = new Error(`Could not reach the API at ${requestUrl}`);
    networkError.cause = error;
    networkError.status = 0;
    networkError.details = { message: 'Network request failed', requestUrl };
    throw networkError;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message ?? 'Request failed');
    error.status = response.status;
    error.issues = data.issues ?? [];
    error.fieldErrors = data.fieldErrors ?? {};
    error.details = data;
    throw error;
  }

  return data;
};
