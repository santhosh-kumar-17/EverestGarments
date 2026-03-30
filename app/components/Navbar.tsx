'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, username, userType, clearAuth } = useAuth();
  const { getTotalItems } = useCart();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setDropdownOpen(false);
    router.push('/');
  };

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <header>
      <div className="container">
        <nav>
          <Link href="/" className="logo" aria-label="Everest Garments Home">
            Everest Garments
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/products" id="nav-shop">
              Shop
            </Link>

            {/* Cart with badge */}
            <Link
              href="/cart"
              id="nav-cart"
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              🛒 Cart
              {mounted && totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-12px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    width: '1.1rem',
                    height: '1.1rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth section */}
            {mounted && isAuthenticated ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="nav-user-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '2px solid #e5e7eb',
                    borderRadius: '9999px',
                    padding: '0.375rem 0.875rem 0.375rem 0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#374151',
                    transition: 'all 0.2s',
                  }}
                >
                  <span
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                    }}
                  >
                    {(username || 'U')[0].toUpperCase()}
                  </span>
                  {username}
                  <span
                    style={{
                      fontSize: '0.6rem',
                      transition: 'transform 0.2s',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    ▼
                  </span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="animate-fade-in"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'white',
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      padding: '0.5rem',
                      minWidth: '11rem',
                      zIndex: 50,
                    }}
                  >
                    <div
                      style={{
                        padding: '0.75rem',
                        borderBottom: '1px solid #f3f4f6',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '0.85rem',
                        }}
                      >
                        {username}
                      </p>
                      <p
                        style={{
                          fontSize: '0.7rem',
                          color: '#9ca3af',
                          textTransform: 'capitalize',
                        }}
                      >
                        {userType === 'admin' ? '🔑 Admin' : '👤 Customer'}
                      </p>
                    </div>

                    {userType === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'block',
                          padding: '0.625rem 0.75rem',
                          borderRadius: '0.5rem',
                          color: '#374151',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          transition: 'background 0.15s',
                        }}
                      >
                        📊 Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        borderRadius: '0.5rem',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <Link
                href="/auth"
                className="btn btn-primary btn-sm"
                id="nav-login"
              >
                Sign In
              </Link>
            ) : (
              <div
                style={{
                  width: '5rem',
                  height: '2rem',
                  borderRadius: '0.5rem',
                  background: '#f3f4f6',
                }}
              />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
