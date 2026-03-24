'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();

  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #e5e7eb', background: 'white', padding: '1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>Shopping Cart</h1>
        </div>
      </div>

      {/* Cart Content */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
        {items.length === 0 ? (
          <div style={{ borderRadius: '0.5rem', background: '#dbeafe', padding: '2rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>Your cart is empty</p>
            <Link href="/products" className="btn btn-primary" style={{ display: 'inline-block' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {/* Cart Items */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item) => (
                  <div key={item.productId} className="card" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', height: '6rem', width: '6rem', flexShrink: 0, overflow: 'hidden', borderRadius: '0.25rem', background: '#e5e7eb' }}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{item.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.category}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: '#6366f1' }}>
                          Rs. {item.price}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              style={{
                                height: '2rem',
                                width: '2rem',
                                textAlign: 'center',
                                color: '#6b7280',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                              −
                            </button>
                            <span style={{ width: '2rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
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
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: '#dc2626',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textDecoration: 'none',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#b91c1c'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#dc2626'}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'right' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Subtotal</span>
                      <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => clearCart()}
                className="btn btn-secondary"
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="card" style={{ position: 'sticky', top: '5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a' }}>Order Summary</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Items ({items.length})</span>
                    <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                      Rs. {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                  <span>Total</span>
                  <span style={{ color: '#6366f1' }}>Rs. {totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="btn btn-secondary"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
