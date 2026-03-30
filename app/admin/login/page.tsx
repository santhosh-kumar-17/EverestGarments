'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
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
          result.data.username || 'Admin',
          '',
          'admin'
        );
        toast.success('Admin login successful');
        router.push('/admin');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '24rem' }}>
        <div
          className="animate-fade-in-up"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.25rem',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '2.5rem',
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
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.03em',
                marginBottom: '0.25rem',
              }}
            >
              Admin Panel
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
              Authorized personnel only
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            id="admin-login-form"
          >
            <div>
              <label
                htmlFor="admin-username"
                style={{ color: '#d1d5db', fontSize: '0.85rem' }}
              >
                Username
              </label>
              <input
                type="text"
                id="admin-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Enter admin username"
                autoComplete="username"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                style={{ color: '#d1d5db', fontSize: '0.85rem' }}
              >
                Password
              </label>
              <input
                type="password"
                id="admin-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter admin password"
                autoComplete="current-password"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              id="admin-login-btn"
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
                  Authenticating...
                </span>
              ) : (
                '🔐 Sign In'
              )}
            </button>
          </form>

          {/* Back to store */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link
              href="/"
              style={{
                fontSize: '0.8rem',
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
