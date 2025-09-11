// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, setTokens, loadTokensFromStorage } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => { loadTokensFromStorage(); }, []);

  async function register(email, password, full_name) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    setTokens({ access: data.tokens.accessToken, refresh: data.tokens.refreshToken });
    setUser(data.user);
  }

  async function login(email, password) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setTokens({ access: data.tokens.accessToken, refresh: data.tokens.refreshToken });
    // Optionally fetch profile (if you implement /auth/me)
    setUser({ email }); // minimal; or call /auth/me to get full profile
  }

  async function logout() {
    // Tell server to revoke refresh token
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken) {
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    }
    setTokens({ access: null, refresh: null });
    setUser(null);
  }

  const value = { user, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
