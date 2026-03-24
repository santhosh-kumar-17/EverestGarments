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
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading order details...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Success Message */}
      <div style={{ borderBottom: '1px solid #bbf7d0', background: '#dcfce7', padding: '1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', fontSize: '3.75rem' }}>✅</div>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '1.875rem', fontWeight: 'bold', color: '#166534' }}>
            Order Submitted Successfully!
          </h1>
          <p style={{ color: '#15803d' }}>
            Thank you for your order. Our sales team will contact you soon.
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
        {order ? (
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
            <div className="card">
              <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                Order Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Order ID</span>
                  <p style={{ fontFamily: 'monospace', fontWeight: '600', color: '#1a1a1a' }}>{order._id}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Order Date</span>
                  <p style={{ fontWeight: '600', color: '#1a1a1a' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status</span>
                  <p style={{ display: 'inline-block', borderRadius: '0.25rem', background: '#fef3c7', padding: '0.25rem 0.75rem', fontWeight: '600', color: '#92400e' }}>
                    Pending
                  </p>
                </div>

                <h3 style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                  Customer Details
                </h3>

                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Name</span>
                  <p style={{ fontWeight: '600', color: '#1a1a1a' }}>{order.customerName}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Phone</span>
                  <p style={{ fontWeight: '600', color: '#1a1a1a' }}>{order.phone}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Address</span>
                  <p style={{ color: '#1a1a1a' }}>{order.address}</p>
                </div>

                {order.notes && (
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Notes</span>
                    <p style={{ color: '#1a1a1a' }}>{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="card">
              <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                Order Items
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: idx < order.items.length - 1 ? '1px solid #e5e7eb' : 'none',
                      paddingBottom: '1rem',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: '600', color: '#1a1a1a' }}>{item.name}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Rs. {item.price.toFixed(2)}
                      </p>
                      <p style={{ fontWeight: '600', color: '#1a1a1a' }}>
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1a1a1a' }}>
                    <span>Total Amount</span>
                    <span style={{ color: '#6366f1' }}>
                      Rs.{' '}
                      {order.items
                        .reduce((sum, item) => sum + item.price * item.quantity, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ borderRadius: '0.25rem', background: '#fee2e2', padding: '1rem', color: '#991b1b' }}>
            Failed to load order details
          </div>
        )}

        {/* Next Steps */}
        <div style={{ marginTop: '2rem', borderRadius: '0.25rem', background: '#dbeafe', padding: '1.5rem', color: '#1e40af' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>What happens next?</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>✓ Your order has been submitted successfully</li>
            <li>✓ Our sales team will review your order</li>
            <li>✓ You will receive a call on the provided phone number</li>
            <li>✓ We will discuss payment options and delivery details</li>
            <li>✓ Your order will be confirmed and processed</li>
          </ul>
        </div>

        {/* Actions */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <Link href="/products" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'block', padding: '0.75rem 1.5rem' }}>
            Continue Shopping
          </Link>
          <Link href="/" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'block', padding: '0.75rem 1.5rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
