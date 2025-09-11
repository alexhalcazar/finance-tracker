// client/src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

let accessToken = null;
let refreshToken = null;

export function setTokens({ access, refresh }) {
  accessToken = access || null;
  refreshToken = refresh || null;
  // Optional: persist access token (short lived) in memory only is safest.
  // If you must persist, prefer sessionStorage over localStorage.
  sessionStorage.setItem('accessToken', accessToken || '');
  sessionStorage.setItem('refreshToken', refreshToken || '');
}

export function loadTokensFromStorage() {
  accessToken = sessionStorage.getItem('accessToken') || null;
  refreshToken = sessionStorage.getItem('refreshToken') || null;
}

async function refreshTokensOnce() {
  if (!refreshToken) return false;
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  setTokens({ access: data.tokens.accessToken, refresh: data.tokens.refreshToken });
  return true;
}

export async function apiFetch(path, options = {}, _retried = false) {
  const headers = new Headers(options.headers || {});
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // If access token expired, try refresh once
  if (res.status === 401 && !_retried && refreshToken) {
    const ok = await refreshTokensOnce();
    if (ok) return apiFetch(path, options, true);
  }
  return res;
}
