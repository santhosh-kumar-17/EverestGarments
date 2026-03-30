'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { Suspense } from 'react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const redirectTo = searchParams.get('redirect') || '/';

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        setAuth(
          result.data.token,
          result.data.displayName || result.data.email.split('@')[0],
          result.data.email,
          'user'
        );
        toast.success('Welcome back!');
        router.push(redirectTo);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Login failed'
      );
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

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
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
        setAuth(
          result.data.token,
          result.data.displayName || result.data.email.split('@')[0],
          result.data.email,
          'user'
        );
        toast.success('Account created successfully!');
        router.push(redirectTo);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isLogin) {
      handleUserLogin(e);
    } else {
      handleUserRegister(e);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '80vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #f9fafb 0%, #eef2ff 100%)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '26rem' }}>
        <div
          className="animate-fade-in-up"
          style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid #e5e7eb',
            padding: '2.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.5rem',
                color: 'white',
                fontWeight: 900,
              }}
            >
              E
            </div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.03em',
                marginBottom: '0.25rem',
              }}
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              {isLogin
                ? 'Sign in to place orders and track them'
                : 'Join Everest Garments to start ordering'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: '#f3f4f6',
              borderRadius: '0.75rem',
              padding: '0.25rem',
              marginBottom: '1.75rem',
            }}
          >
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '0.625rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                background: isLogin ? 'white' : 'transparent',
                color: isLogin ? '#111827' : '#6b7280',
                fontWeight: isLogin ? 700 : 500,
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                boxShadow: isLogin
                  ? '0 1px 3px rgba(0,0,0,0.08)'
                  : 'none',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '0.625rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                background: !isLogin ? 'white' : 'transparent',
                color: !isLogin ? '#111827' : '#6b7280',
                fontWeight: !isLogin ? 700 : 500,
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                boxShadow: !isLogin
                  ? '0 1px 3px rgba(0,0,0,0.08)'
                  : 'none',
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            id="auth-form"
          >
            {/* Display Name (register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="displayName">Full Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder={isLogin ? 'Enter your password' : 'Min 6 characters'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {/* Confirm Password (register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              id="auth-submit-btn"
              style={{
                width: '100%',
                fontSize: '0.95rem',
                marginTop: '0.5rem',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center',
                  }}
                >
                  <span className="spinner spinner-sm" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer text */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#9ca3af',
              marginTop: '1.5rem',
              lineHeight: 1.6,
            }}
          >
            {isLogin
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                fontSize: '0.8rem',
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Redirect info */}
          {redirectTo !== '/' && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#fef3c7',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                color: '#92400e',
                textAlign: 'center',
              }}
            >
              🔒 Please sign in to continue with your order
            </div>
          )}

          {/* Back to Home */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <Link
              href="/"
              style={{
                fontSize: '0.85rem',
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            minHeight: '80vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="spinner" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
