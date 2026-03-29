'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '80vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div className="spinner" />
        <p style={{ color: '#6b7280', fontWeight: 500 }}>
          Loading order details...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', background: '#f9fafb' }}>
      {/* Success Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
          padding: '3.5rem 1rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div
            className="animate-bounce-in"
            style={{
              marginBottom: '1rem',
              fontSize: '4rem',
            }}
          >
            ✅
          </div>
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              marginBottom: '0.5rem',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
            }}
          >
            Order Placed Successfully!
          </h1>
          <p
            className="animate-fade-in-up delay-200"
            style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}
          >
            Thank you for your order. Our team will contact you shortly.
          </p>
          {order && (
            <p
              className="animate-fade-in-up delay-300"
              style={{
                marginTop: '1rem',
                background: 'rgba(255,255,255,0.15)',
                display: 'inline-block',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Order ID: #{order._id.slice(-8).toUpperCase()}
            </p>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '900px' }}>
        {order ? (
          <>
            <div
              className="animate-fade-in-up"
              style={{
                display: 'grid',
                gap: '1.5rem',
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              {/* Order Info */}
              <div
                className="card-flat"
                style={{
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <h2
                  style={{
                    marginBottom: '1.25rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '-0.02em',
                  }}
                >
                  📋 Order Information
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
                >
                  <InfoRow label="Order ID" value={`#${order._id.slice(-8).toUpperCase()}`} mono />
                  <InfoRow
                    label="Order Date"
                    value={new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Status
                    </span>
                    <div style={{ marginTop: '0.25rem' }}>
                      <span
                        className="badge badge-warning"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <span className="status-dot status-dot-pending" />
                        Pending Review
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '0.5rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #f3f4f6',
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: 700,
                        color: '#374151',
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                      }}
                    >
                      Customer Details
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <InfoRow label="Name" value={order.customerName} />
                      <InfoRow label="Phone" value={order.phone} />
                      <InfoRow label="Address" value={order.address} />
                      {order.notes && <InfoRow label="Notes" value={order.notes} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div
                className="card-flat"
                style={{
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <h2
                  style={{
                    marginBottom: '1.25rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #f3f4f6',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '-0.02em',
                  }}
                >
                  🛍️ Order Items
                </h2>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom:
                          idx < order.items.length - 1 ? '1px solid #f3f4f6' : 'none',
                        paddingBottom: '1rem',
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontWeight: 600,
                            color: '#111827',
                            fontSize: '0.9rem',
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: '#9ca3af',
                            marginTop: '0.125rem',
                          }}
                        >
                          Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p
                        style={{
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '0.95rem',
                        }}
                      >
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}

                  <div
                    style={{
                      borderTop: '2px solid #e5e7eb',
                      paddingTop: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 800,
                    }}
                  >
                    <span style={{ color: '#111827', fontSize: '1rem' }}>Total Amount</span>
                    <span
                      className="gradient-text"
                      style={{ fontSize: '1.15rem' }}
                    >
                      ₹
                      {order.items
                        .reduce((sum, item) => sum + item.price * item.quantity, 0)
                        .toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div
              className="animate-fade-in-up delay-200"
              style={{
                marginTop: '2rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #f0f4ff, #ede9fe)',
                padding: '2rem',
                border: '1px solid #e0e7ff',
              }}
            >
              <h3
                style={{
                  marginBottom: '1.25rem',
                  fontWeight: 800,
                  color: '#312e81',
                  fontSize: '1.05rem',
                }}
              >
                🚀 What happens next?
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {[
                  { emoji: '📧', title: 'Email Sent', desc: 'Our team has been notified of your order' },
                  { emoji: '📞', title: 'Confirmation Call', desc: 'We\'ll call you on the provided number' },
                  { emoji: '💳', title: 'Payment', desc: 'Discuss payment options and finalize' },
                  { emoji: '📦', title: 'Delivery', desc: 'Order packed and shipped to your address' },
                ].map((step) => (
                  <div
                    key={step.title}
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                      {step.emoji}
                    </div>
                    <h4
                      style={{
                        fontWeight: 700,
                        color: '#312e81',
                        fontSize: '0.85rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#6366f1',
                        lineHeight: 1.5,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              borderRadius: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '3rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
            <p style={{ fontWeight: 600, color: '#991b1b' }}>
              Failed to load order details
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="animate-fade-in-up delay-300"
          style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '1rem',
          }}
        >
          <Link
            href="/products"
            className="btn btn-primary btn-lg"
            id="confirm-continue-shopping"
            style={{
              flex: 1,
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            Continue Shopping →
          </Link>
          <Link
            href="/"
            className="btn btn-outline btn-lg"
            id="confirm-back-home"
            style={{
              flex: 1,
              textAlign: 'center',
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <span
        style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <p
        style={{
          fontWeight: 600,
          color: '#111827',
          fontSize: '0.9rem',
          marginTop: '0.125rem',
          fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
        }}
      >
        {value}
      </p>
    </div>
  );
}
