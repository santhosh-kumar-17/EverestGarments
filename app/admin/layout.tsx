'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, userType, username, clearAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!token || userType !== 'admin')) {
      router.push('/auth');
    }
  }, [token, userType, router, mounted]);

  // Wait for hydration before rendering
  if (!mounted) {
    return null;
  }

  if (!token || userType !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Desktop Sidebar - Always Visible on md+ screens */}
      <aside
        style={{
          width: '16rem',
          background: '#1f2937',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
        className="hidden md:flex"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          {/* Logo */}
          <div style={{ borderBottom: '1px solid #374151', padding: '1.5rem', color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>
              <span style={{ color: '#6366f1' }}>Everest</span> Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavLink href="/admin" label="Dashboard" icon="📊" />
            <NavLink href="/admin/products" label="Products" icon="📦" />
            <NavLink href="/admin/orders" label="Orders" icon="📋" />
          </nav>

          {/* Logout */}
          <div style={{ borderTop: '1px solid #374151', padding: '1rem' }}>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ width: '100%', margin: 0 }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 30,
            }}
            onClick={() => setIsOpen(false)}
          />
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '16rem',
              background: '#1f2937',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
              {/* Logo */}
              <div style={{ borderBottom: '1px solid #374151', padding: '1.5rem', color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>
                  <span style={{ color: '#6366f1' }}>Everest</span> Admin
                </Link>
              </div>

              {/* Navigation */}
              <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <NavLink href="/admin" label="Dashboard" icon="📊" />
                <NavLink href="/admin/products" label="Products" icon="📦" />
                <NavLink href="/admin/orders" label="Orders" icon="📋" />
              </nav>

              {/* Logout */}
              <div style={{ borderTop: '1px solid #374151', padding: '1rem' }}>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ width: '100%', margin: 0 }}
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: 'white', cursor: 'pointer', fontSize: '1.25rem' }}
          >
            ☰
          </button>
          <span style={{ color: '#6b7280' }}>Welcome, {username}!</span>
        </header>

        {/* Content */}
        <main style={{ padding: '2rem', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        color: '#d1d5db',
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#374151';
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#d1d5db';
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
