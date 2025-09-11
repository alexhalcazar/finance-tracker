// client/src/pages/AuthDemo.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api';

export default function AuthDemo() {
  const { user, register, login, logout } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', full_name: '' });
  const [message, setMessage] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleRegister() {
    try { await register(form.email, form.password, form.full_name); setMessage('Registered + logged in!'); }
    catch (e) { setMessage(e.message); }
  }

  async function handleLogin() {
    try { await login(form.email, form.password); setMessage('Logged in!'); }
    catch (e) { setMessage(e.message); }
  }

  async function callProtected() {
    const res = await apiFetch('/transactions'); // protected example route
    const data = await res.json();
    setMessage(res.ok ? JSON.stringify(data) : (data.error || 'Error'));
  }

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto', display: 'grid', gap: 8 }}>
      <h2>Auth Demo</h2>
      <input name="full_name" placeholder="Full name" value={form.full_name} onChange={onChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={callProtected}>Call Protected /transactions</button>
      <button onClick={logout}>Logout</button>
      <div>User: {user ? user.email : 'none'}</div>
      <pre>{message}</pre>
    </div>
  );
}
