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
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'contacted':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'completed':
        return { bg: '#dcfce7', text: '#166534' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>Orders</h1>
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>No orders yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => {
            const colors = getStatusColor(order.status);
            return (
              <div key={order._id} className="card">
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{order.customerName}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{order.phone}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{
                        borderRadius: '0.25rem',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        background: colors.bg,
                        color: colors.text,
                      }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span style={{ color: '#6b7280' }}>
                        {expandedOrder === order._id ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Order Details */}
                {expandedOrder === order._id && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                    {/* Customer Info */}
                    <div style={{ marginBottom: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Phone</p>
                        <p style={{ fontWeight: '600', color: '#1a1a1a' }}>{order.phone}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Date</p>
                        <p style={{ fontWeight: '600', color: '#1a1a1a' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Address</p>
                        <p style={{ color: '#1a1a1a' }}>{order.address}</p>
                      </div>
                      {order.notes && (
                        <div style={{ gridColumn: 'span 2' }}>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Notes</p>
                          <p style={{ color: '#1a1a1a' }}>{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>Items:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRadius: '0.25rem', background: '#f9fafb', padding: '0.75rem' }}>
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <p style={{ fontWeight: '600', color: '#1a1a1a' }}>
                                {item.name}
                              </p>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p style={{ fontWeight: '600', color: '#6366f1' }}>
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div style={{ marginBottom: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>Total:</span>
                        <span style={{ fontWeight: 'bold', color: '#6366f1' }}>
                          Rs.{' '}
                          {order.items
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                        Update Status:
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        style={{
                          width: '100%',
                          maxWidth: '200px',
                          padding: '0.5rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          fontSize: '1rem',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
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
