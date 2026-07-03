const getDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? getDefaultApiBaseUrl();

const buildUrl = (path) => `${API_BASE_URL}${path}`;

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

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
