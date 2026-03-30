'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, username, email } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    notes: '',
  });

  const totalPrice = getTotalPrice();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      toast.error('Please sign in to place an order');
      router.push('/auth?redirect=/checkout');
    }
  }, [mounted, isAuthenticated, router]);

  // Pre-fill name from auth
  useEffect(() => {
    if (mounted && isAuthenticated && username) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || username,
      }));
    }
  }, [mounted, isAuthenticated, username]);

  // Don't render until mounted and authenticated
  if (!mounted || !isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '60vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Client-side phone validation
    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
      toast.error('Please enter a valid phone number (at least 7 digits)');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customerName: formData.customerName.trim(),
        phone: phoneDigits,
        address: formData.address.trim(),
        notes: formData.notes.trim() || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit order');
      }

      const result = await response.json();
      toast.success('Order submitted successfully!');
      clearCart();
      router.push(`/order-confirmation/${result.data._id}`);
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit order'
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '80vh', background: '#f9fafb' }}>
        <div className="container" style={{ padding: '5rem 1.5rem' }}>
          <div
            className="animate-fade-in-up"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              maxWidth: '28rem',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.25rem' }}>
              Your cart is empty
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Add some products before checking out
            </p>
            <Link
              href="/products"
              className="btn btn-primary"
              id="empty-checkout-shop"
            >
              Browse Products →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', background: '#f9fafb' }}>
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid #e5e7eb',
          background: 'white',
          padding: '2rem 0',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Link
              href="/cart"
              style={{
                color: '#6366f1',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
              ← Back to Cart
            </Link>
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.03em',
            }}
          >
            Checkout
          </h1>

          {/* Progress Steps */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: '#16a34a',
              }}
            >
              <span
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  background: '#16a34a',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                }}
              >
                ✓
              </span>
              Cart
            </span>
            <span style={{ width: '2rem', height: '2px', background: '#16a34a' }} />
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: '#6366f1',
              }}
            >
              <span
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  background: '#6366f1',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                }}
              >
                2
              </span>
              Details
            </span>
            <span style={{ width: '2rem', height: '2px', background: '#e5e7eb' }} />
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: '#9ca3af',
              }}
            >
              <span
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  background: '#e5e7eb',
                  color: '#9ca3af',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                }}
              >
                3
              </span>
              Confirm
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: '1fr 380px',
          }}
        >
          {/* Order Form */}
          <div className="animate-fade-in-up">
            <form
              onSubmit={handleSubmit}
              className="card-flat"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                padding: '2rem',
              }}
              id="checkout-form"
            >
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                📦 Delivery Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label htmlFor="customerName">
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber">
                    Phone Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number (e.g., 9876543210)"
                    autoComplete="tel"
                  />
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.375rem' }}>
                    We&apos;ll contact you on this number to confirm your order
                  </p>
                </div>

                <div>
                  <label htmlFor="address">
                    Delivery Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Enter your full delivery address with pincode"
                    autoComplete="street-address"
                  />
                </div>

                <div>
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Any special instructions or notes (optional)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                id="submit-order-btn"
                style={{
                  width: '100%',
                  fontSize: '1rem',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="spinner spinner-sm" />
                    Submitting Order...
                  </span>
                ) : (
                  '🛍️ Place Order'
                )}
              </button>
            </form>

            {/* Info Banner */}
            <div
              style={{
                marginTop: '1.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #f0f4ff, #ede9fe)',
                padding: '1.25rem',
                fontSize: '0.85rem',
                color: '#4338ca',
                border: '1px solid #e0e7ff',
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                ℹ️ How it works:
              </p>
              <p style={{ lineHeight: 1.7 }}>
                After submitting your order, our sales team will contact you
                using the provided phone number to confirm the order, discuss
                payment options, and arrange delivery.
              </p>
            </div>
          </div>

          {/* Order Summary */}
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
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                📋 Order Summary
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  maxHeight: '16rem',
                  overflowY: 'auto',
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      padding: '0.5rem 0',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <span style={{ color: '#374151', fontWeight: 500 }}>
                        {item.name}
                      </span>
                      <span style={{ color: '#9ca3af' }}> × {item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#111827', marginLeft: '1rem' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: '1px solid #f3f4f6',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: '#6b7280' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: '#9ca3af',
                  }}
                >
                  <span>Shipping</span>
                  <span>To be confirmed</span>
                </div>
              </div>

              <div
                style={{
                  borderTop: '2px solid #e5e7eb',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                }}
              >
                <span style={{ color: '#111827' }}>Total</span>
                <span className="gradient-text">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <p
                style={{
                  fontSize: '0.7rem',
                  color: '#9ca3af',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                Final amount including shipping will be confirmed during payment
                discussion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
