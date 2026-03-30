'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } =
    useCart();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please sign in to place an order');
      router.push('/auth?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div style={{ minHeight: '80vh', background: '#f9fafb' }}>
      {/* Page Header */}
      <div
        style={{
          borderBottom: '1px solid #e5e7eb',
          background: 'white',
          padding: '2rem 0',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.03em',
            }}
          >
            Shopping Cart
          </h1>
          {items.length > 0 && (
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>
      </div>

      {/* Cart Content */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {items.length === 0 ? (
          <div
            className="animate-fade-in-up"
            style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{ fontSize: '4rem', marginBottom: '1rem' }}
              className="animate-bounce-in"
            >
              🛒
            </div>
            <h2
              style={{
                fontWeight: 700,
                fontSize: '1.25rem',
                color: '#111827',
                marginBottom: '0.5rem',
              }}
            >
              Your cart is empty
            </h2>
            <p
              style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
              }}
            >
              Looks like you haven&apos;t added anything yet
            </p>
            <Link href="/products" className="btn btn-primary" id="empty-cart-shop">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: '1fr 380px',
            }}
          >
            {/* Cart Items */}
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {items.map((item, i) => (
                  <div
                    key={item.productId}
                    className="card-flat animate-fade-in-up"
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      animationDelay: `${i * 80}ms`,
                      transition: 'all 0.3s ease',
                    }}
                    id={`cart-item-${item.productId}`}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: 'relative',
                        height: '7rem',
                        width: '7rem',
                        flexShrink: 0,
                        overflow: 'hidden',
                        borderRadius: '0.75rem',
                        background: '#f3f4f6',
                      }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="112px"
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: '2rem' }}>🖼️</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3
                          style={{
                            fontWeight: 700,
                            color: '#111827',
                            fontSize: '0.95rem',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {item.name}
                        </h3>
                        <span
                          className="badge"
                          style={{
                            background:
                              item.category === 'Women'
                                ? 'rgba(236, 72, 153, 0.1)'
                                : 'rgba(59, 130, 246, 0.1)',
                            color:
                              item.category === 'Women' ? '#ec4899' : '#3b82f6',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 700,
                            padding: '0.25rem 0.5rem',
                          }}
                        >
                          {item.category}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '0.75rem',
                        }}
                      >
                        <span
                          className="gradient-text"
                          style={{ fontWeight: 700, fontSize: '1rem' }}
                        >
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {/* Quantity Control */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '2px solid #e5e7eb',
                              borderRadius: '0.5rem',
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              style={{
                                height: '2rem',
                                width: '2rem',
                                textAlign: 'center',
                                color: '#6b7280',
                                background: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'background 0.15s',
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{
                                width: '2.5rem',
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                borderLeft: '1px solid #e5e7eb',
                                borderRight: '1px solid #e5e7eb',
                                padding: '0.25rem 0',
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              style={{
                                height: '2rem',
                                width: '2rem',
                                textAlign: 'center',
                                color: '#6b7280',
                                background: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'background 0.15s',
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => {
                              removeItem(item.productId);
                              toast.success('Item removed from cart');
                            }}
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              color: '#ef4444',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'color 0.2s',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.375rem',
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Subtotal */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        minWidth: '5rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Subtotal
                      </span>
                      <span
                        style={{
                          fontWeight: 800,
                          color: '#111827',
                          fontSize: '1rem',
                        }}
                      >
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared');
                }}
                className="btn btn-outline btn-sm"
                id="clear-cart-btn"
                style={{ marginTop: '1.5rem' }}
              >
                🗑️ Clear Cart
              </button>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div
                className="card-flat animate-fade-in-up delay-200"
                style={{
                  position: 'sticky',
                  top: '5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Order Summary
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    padding: '1rem 0',
                    borderTop: '1px solid #f3f4f6',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: '#6b7280' }}>
                      Items ({totalItems})
                    </span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: '#9ca3af',
                    }}
                  >
                    <span>Shipping</span>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>Free</span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#111827',
                  }}
                >
                  <span>Total</span>
                  <span className="gradient-text">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn btn-primary btn-lg"
                  id="checkout-btn"
                  style={{ width: '100%', fontSize: '0.95rem' }}
                >
                  {mounted && !isAuthenticated
                    ? '🔒 Sign In to Order'
                    : 'Proceed to Checkout →'}
                </button>

                <Link
                  href="/products"
                  className="btn btn-outline"
                  id="continue-shopping-btn"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Continue Shopping
                </Link>

                {/* Security Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                  }}
                >
                  🔒 Secure checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
