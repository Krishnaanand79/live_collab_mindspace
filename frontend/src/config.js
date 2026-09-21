const browserHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const isSecureWindow = typeof window !== 'undefined' && window.location.protocol === 'https:';
const defaultProtocol = isSecureWindow ? 'https' : 'http';
const apiProtocol = import.meta.env.VITE_API_PROTOCOL || defaultProtocol;
const apiHost = import.meta.env.VITE_API_HOST || browserHost;
const apiPort = import.meta.env.VITE_API_PORT || '3001';

const defaultApiBaseUrl = `${apiProtocol}://${apiHost}:${apiPort}`;
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

// Ensure no trailing slashes on API base URL
export const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');

// If VITE_WS_BASE_URL is explicitly set, use it; otherwise auto-derive from apiBaseUrl
export const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL
  ? import.meta.env.VITE_WS_BASE_URL.replace(/\/+$/, '')
  : apiBaseUrl.replace(/^http(s?):/, 'ws$1:');