'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Admin login failed');
      }

      const result = await response.json();
      if (result.data && result.data.token) {
        setAuth(result.data.token, result.data.username || 'Admin', formData.email, 'admin');
        toast.success('Admin login successful!');
        router.push('/admin');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();
      if (result.data && result.data.token) {
        setAuth(result.data.token, result.data.email.split('@')[0], result.data.email, 'user');
        toast.success('Login successful!');
        router.push('/');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result = await response.json();
      if (result.data && result.data.token) {
        setAuth(result.data.token, result.data.email.split('@')[0], result.data.email, 'user');
        toast.success('Registration successful!');
        router.push('/');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isAdmin) {
      handleAdminLogin(e);
    } else if (isLogin) {
      handleUserLogin(e);
    } else {
      handleUserRegister(e);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div className="card" style={{ padding: '2rem', gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>Everest</span> Garments
            </h1>
            <p style={{ color: '#6b7280' }}>
              {isAdmin ? 'Admin Login' : isLogin ? 'Customer Login' : 'Create Account'}
            </p>
          </div>

          {/* Mode Selector */}
          {!isAdmin && (
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: isLogin ? '2px solid #6366f1' : 'none',
                  color: isLogin ? '#6366f1' : '#6b7280',
                  fontWeight: isLogin ? '600' : '400',
                  fontSize: '0.875rem',
                }}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: !isLogin ? '2px solid #6366f1' : 'none',
                  color: !isLogin ? '#6366f1' : '#6b7280',
                  fontWeight: !isLogin ? '600' : '400',
                  fontSize: '0.875rem',
                }}
              >
                Register
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a', fontSize: '0.875rem' }}>
                {isAdmin ? 'Username' : 'Email'}
              </label>
              <input
                type={isAdmin ? 'text' : 'email'}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder={isAdmin ? 'Enter username' : 'Enter your email'}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Display Name (for registration) */}
            {!isAdmin && !isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a', fontSize: '0.875rem' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a', fontSize: '0.875rem' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Confirm Password (for registration) */}
            {!isAdmin && !isLogin && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a', fontSize: '0.875rem' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Processing...' : isAdmin ? 'Admin Login' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          {/* Admin Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            {!isAdmin && (
              <button
                onClick={() => setIsAdmin(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6366f1',
                  fontSize: '0.875rem',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  padding: 0,
                }}
              >
                Admin Login
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setIsAdmin(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6366f1',
                  fontSize: '0.875rem',
                  textDecoration: 'underline',
                  textAlign: 'center',
                  padding: 0,
                }}
              >
                Back to Customer Login
              </button>
            )}
          </div>

          {/* Demo Credentials */}
          {isAdmin && (
            <div style={{
              borderRadius: '0.5rem',
              background: '#dbeafe',
              padding: '1rem',
              fontSize: '0.875rem',
              color: '#1e40af',
            }}>
              <p>
                <strong>Demo Credentials:</strong>
                <br />
                Username: admin
                <br />
                Password: admin123
              </p>
            </div>
          )}

          {/* Back to Home */}
          <div style={{ textAlign: 'center' }}>
            <Link href="/" style={{
              fontSize: '0.875rem',
              color: '#6366f1',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1a1a1a'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6366f1'}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
