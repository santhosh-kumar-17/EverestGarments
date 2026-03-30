'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

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
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
}

const statusConfig: Record<string, { color: string; bg: string; icon: string; label: string; step: number }> = {
  pending: { color: '#92400e', bg: '#fef3c7', icon: '⏳', label: 'Order Placed', step: 1 },
  contacted: { color: '#1e40af', bg: '#dbeafe', icon: '📞', label: 'Contacted', step: 2 },
  completed: { color: '#166534', bg: '#dcfce7', icon: '✅', label: 'Completed', step: 3 },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/auth?redirect=/orders');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await fetch('/api/user/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && isAuthenticated && token) {
      fetchOrders();
    }
  }, [mounted, isAuthenticated, token]);

  if (!mounted || !isAuthenticated) {
    return (
      <div style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #e5e7eb', background: 'white', padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
            My Orders
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Track your orders and view order history
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '6rem', borderRadius: '1rem' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
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
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }} className="animate-bounce-in">
              📦
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827', marginBottom: '0.5rem' }}>
              No orders yet
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Start shopping to see your orders here
            </p>
            <Link href="/products" className="btn btn-primary">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order, i) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const isExpanded = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="animate-fade-in-up"
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    animationDelay: `${Math.min(i * 60, 300)}ms`,
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  {/* Order Header — clickable */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '1.25rem 1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '2.75rem',
                            height: '2.75rem',
                            borderRadius: '0.75rem',
                            background: config.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            flexShrink: 0,
                          }}
                        >
                          {config.icon}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            {' · '}
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>
                          ₹{total.toLocaleString('en-IN')}
                        </span>
                        <span
                          className="badge"
                          style={{ background: config.bg, color: config.color, fontSize: '0.75rem' }}
                        >
                          {config.icon} {config.label}
                        </span>
                        <span
                          style={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            transition: 'transform 0.2s',
                            transform: isExpanded ? 'rotate(90deg)' : 'none',
                          }}
                        >
                          ▶
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="animate-fade-in" style={{ borderTop: '1px solid #f3f4f6', padding: '1.5rem' }}>
                      {/* Status Tracker */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ fontWeight: 700, color: '#374151', fontSize: '0.85rem', marginBottom: '1rem' }}>
                          Order Status
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                          {(['pending', 'contacted', 'completed'] as const).map((step, idx) => {
                            const stepConfig = statusConfig[step];
                            const isActive = config.step >= stepConfig.step;
                            const isCurrent = order.status === step;
                            return (
                              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? 1 : 'none' }}>
                                <div
                                  style={{
                                    width: '2.25rem',
                                    height: '2.25rem',
                                    borderRadius: '50%',
                                    background: isActive
                                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                      : '#f3f4f6',
                                    color: isActive ? 'white' : '#9ca3af',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 800,
                                    flexShrink: 0,
                                    boxShadow: isCurrent ? '0 0 0 4px rgba(99,102,241,0.2)' : 'none',
                                    transition: 'all 0.3s',
                                  }}
                                >
                                  {isActive ? '✓' : idx + 1}
                                </div>
                                {idx < 2 && (
                                  <div
                                    style={{
                                      flex: 1,
                                      height: '3px',
                                      background: config.step > stepConfig.step
                                        ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                        : '#e5e7eb',
                                      margin: '0 0.25rem',
                                      borderRadius: '2px',
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500 }}>Placed</span>
                          <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500 }}>Contacted</span>
                          <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500 }}>Completed</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <p style={{ fontWeight: 700, color: '#374151', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                          Items
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.625rem 0.75rem',
                                background: '#f9fafb',
                                borderRadius: '0.5rem',
                              }}
                            >
                              <div>
                                <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.85rem' }}>
                                  {item.name}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                  Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <p className="gradient-text" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '1rem',
                          background: '#f9fafb',
                          borderRadius: '0.75rem',
                          padding: '1rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                            Delivery Address
                          </p>
                          <p style={{ fontSize: '0.85rem', color: '#111827', marginTop: '0.125rem' }}>
                            📍 {order.address}
                          </p>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                            Phone
                          </p>
                          <p style={{ fontSize: '0.85rem', color: '#111827', marginTop: '0.125rem' }}>
                            📞 {order.phone}
                          </p>
                        </div>
                        {order.notes && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                              Notes
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', fontStyle: 'italic', marginTop: '0.125rem' }}>
                              {order.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Total */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #e5e7eb', paddingTop: '1rem' }}>
                        <span style={{ fontWeight: 800, color: '#111827' }}>Total</span>
                        <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                          ₹{total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
