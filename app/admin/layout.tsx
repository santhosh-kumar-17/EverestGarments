'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/orders', label: 'Orders', icon: '📋' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, userType, username, clearAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!token || userType !== 'admin')) {
      router.push('/admin/login');
    }
  }, [token, userType, router, mounted]);

  if (!mounted) return null;
  if (!token || userType !== 'admin') return null;

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  const isActiveLink = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '1.5rem',
        }}
      >
        <Link
          href="/admin"
          style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 900,
              color: 'white',
            }}
          >
            E
          </span>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#8b5cf6' }}>Everest</span>{' '}
              <span style={{ color: '#d1d5db' }}>Admin</span>
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Management Panel
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: '1.25rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        {navItems.map((item) => {
          const active = isActiveLink(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: active ? 'white' : '#9ca3af',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: active
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))'
                  : 'transparent',
                fontWeight: active ? 600 : 500,
                fontSize: '0.9rem',
                borderLeft: active
                  ? '3px solid #8b5cf6'
                  : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '0.5rem',
          }}
        >
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: 'white',
              fontWeight: 800,
            }}
          >
            {(username || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div
              style={{
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {username || 'Admin'}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.7rem' }}>
              Administrator
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-sm"
          id="admin-logout"
          style={{
            width: '100%',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: '16rem',
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
        className="hidden md:flex"
      >
        <div style={{ width: '100%' }}>
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
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
              zIndex: 40,
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minWidth: 0,
        }}
      >
        {/* Top Bar */}
        <header
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid #e5e7eb',
            padding: '0.875rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              background: 'white',
              cursor: 'pointer',
              fontSize: '1.25rem',
            }}
          >
            ☰
          </button>
          <div
            style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              fontWeight: 500,
            }}
          >
            Welcome back,{' '}
            <span style={{ color: '#111827', fontWeight: 700 }}>
              {username}
            </span>
          </div>
          <Link
            href="/"
            style={{
              fontSize: '0.8rem',
              color: '#6366f1',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← View Store
          </Link>
        </header>

        {/* Content */}
        <main style={{ padding: '2rem', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
