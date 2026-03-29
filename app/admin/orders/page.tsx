'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const data = await response.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? data.data : o))
      );
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e', dotClass: 'status-dot-pending', label: 'Pending' };
      case 'contacted':
        return { bg: '#dbeafe', text: '#1e40af', dotClass: 'status-dot-contacted', label: 'Contacted' };
      case 'completed':
        return { bg: '#dcfce7', text: '#166534', dotClass: 'status-dot-completed', label: 'Completed' };
      default:
        return { bg: '#f3f4f6', text: '#374151', dotClass: '', label: status };
    }
  };

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    contacted: orders.filter((o) => o.status === 'contacted').length,
    completed: orders.filter((o) => o.status === 'completed').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        className="animate-fade-in-up"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.03em',
            }}
          >
            Orders
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {orders.length} total orders
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div
        className="animate-fade-in-up delay-100"
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { value: 'all', label: 'All', count: statusCounts.all },
          { value: 'pending', label: '⏳ Pending', count: statusCounts.pending },
          { value: 'contacted', label: '📞 Contacted', count: statusCounts.contacted },
          { value: 'completed', label: '✅ Completed', count: statusCounts.completed },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className="btn btn-sm"
            style={{
              background:
                statusFilter === filter.value
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'white',
              color: statusFilter === filter.value ? 'white' : '#374151',
              border:
                statusFilter === filter.value ? 'none' : '2px solid #e5e7eb',
              borderRadius: '9999px',
              fontWeight: statusFilter === filter.value ? 600 : 500,
              boxShadow:
                statusFilter === filter.value
                  ? '0 4px 12px rgba(99,102,241,0.3)'
                  : 'none',
            }}
          >
            {filter.label}
            <span
              style={{
                background:
                  statusFilter === filter.value
                    ? 'rgba(255,255,255,0.25)'
                    : '#f3f4f6',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 700,
                marginLeft: '0.25rem',
              }}
            >
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: '5rem', borderRadius: '1rem' }}
            />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          className="card-flat animate-fade-in-up"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <p style={{ color: '#6b7280', fontWeight: 600 }}>
            {statusFilter === 'all'
              ? 'No orders yet'
              : `No ${statusFilter} orders`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredOrders.map((order, i) => {
            const config = getStatusConfig(order.status);
            const orderTotal = order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            return (
              <div
                key={order._id}
                className="card-flat animate-fade-in-up"
                style={{
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  animationDelay: `${Math.min(i * 50, 300)}ms`,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order._id ? null : order._id
                    )
                  }
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
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
                        {order.status === 'pending'
                          ? '⏳'
                          : order.status === 'contacted'
                            ? '📞'
                            : '✅'}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontWeight: 700,
                            color: '#111827',
                            fontSize: '0.95rem',
                          }}
                        >
                          {order.customerName}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: '#9ca3af',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                          }}
                        >
                          <span>{order.phone}</span>
                          <span>•</span>
                          <span>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '0.95rem',
                        }}
                      >
                        ₹{orderTotal.toLocaleString('en-IN')}
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: config.bg,
                          color: config.text,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <span className={`status-dot ${config.dotClass}`} />
                        {config.label}
                      </span>
                      <span
                        style={{
                          color: '#9ca3af',
                          transition: 'transform 0.2s',
                          transform:
                            expandedOrder === order._id ? 'rotate(90deg)' : 'none',
                          fontSize: '0.8rem',
                        }}
                      >
                        ▶
                      </span>
                    </div>
                  </div>
                </button>

                {/* Order Details (Expanded) */}
                {expandedOrder === order._id && (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginTop: '1.25rem',
                      borderTop: '1px solid #f3f4f6',
                      paddingTop: '1.25rem',
                    }}
                  >
                    {/* Customer Info Grid */}
                    <div
                      style={{
                        marginBottom: '1.25rem',
                        display: 'grid',
                        gap: '1rem',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        background: '#f9fafb',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: '0.65rem',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                          }}
                        >
                          Phone
                        </p>
                        <p
                          style={{
                            fontWeight: 600,
                            color: '#111827',
                            fontSize: '0.9rem',
                          }}
                        >
                          📞 {order.phone}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '0.65rem',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                          }}
                        >
                          Date
                        </p>
                        <p
                          style={{
                            fontWeight: 600,
                            color: '#111827',
                            fontSize: '0.9rem',
                          }}
                        >
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <p
                          style={{
                            fontSize: '0.65rem',
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                          }}
                        >
                          Address
                        </p>
                        <p style={{ color: '#111827', fontSize: '0.9rem' }}>
                          📍 {order.address}
                        </p>
                      </div>
                      {order.notes && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <p
                            style={{
                              fontSize: '0.65rem',
                              color: '#9ca3af',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              fontWeight: 600,
                            }}
                          >
                            Notes
                          </p>
                          <p
                            style={{
                              color: '#6b7280',
                              fontSize: '0.9rem',
                              fontStyle: 'italic',
                            }}
                          >
                            {order.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <p
                        style={{
                          marginBottom: '0.75rem',
                          fontWeight: 700,
                          color: '#374151',
                          fontSize: '0.9rem',
                        }}
                      >
                        Items ({order.items.length})
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem 1rem',
                              background: '#f9fafb',
                              borderRadius: '0.5rem',
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  fontWeight: 600,
                                  color: '#111827',
                                  fontSize: '0.85rem',
                                }}
                              >
                                {item.name}
                              </p>
                              <p
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#9ca3af',
                                }}
                              >
                                Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <p
                              className="gradient-text"
                              style={{ fontWeight: 700, fontSize: '0.9rem' }}
                            >
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div
                      style={{
                        marginBottom: '1.25rem',
                        borderTop: '2px solid #e5e7eb',
                        paddingTop: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          color: '#111827',
                          fontSize: '1rem',
                        }}
                      >
                        Total:
                      </span>
                      <span
                        className="gradient-text"
                        style={{ fontWeight: 800, fontSize: '1.15rem' }}
                      >
                        ₹{orderTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Status Update */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: '#f9fafb',
                        borderRadius: '0.75rem',
                      }}
                    >
                      <label
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#374151',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Update Status:
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        style={{
                          flex: 1,
                          maxWidth: '200px',
                          padding: '0.625rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="contacted">📞 Contacted</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
