'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    notes: '',
  });

  const totalPrice = getTotalPrice();

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

    try {
      setLoading(true);

      const orderData = {
        customerName: formData.customerName,
        phone: formData.phoneNumber,
        address: formData.address,
        notes: formData.notes,
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
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
          <div style={{ borderRadius: '0.5rem', background: '#dbeafe', padding: '2rem', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>Your cart is empty</p>
            <Link href="/products" className="btn btn-primary" style={{ display: 'inline-block' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #e5e7eb', background: 'white', padding: '1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>Checkout</h1>
        </div>
      </div>

      {/* Checkout Form */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {/* Order Form */}
          <div style={{ gridColumn: 'span 2' }}>
            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                Delivery Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Enter your delivery address"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions or notes"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? 'Submitting Order...' : 'Submit Order'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', borderRadius: '0.25rem', background: '#dbeafe', padding: '1rem', fontSize: '0.875rem', color: '#1e40af' }}>
              <p>
                <strong>How it works:</strong> After submitting your order, our sales
                team will contact you using the provided phone number to confirm the
                order, discuss payment options, and arrange delivery.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '16rem', overflowY: 'auto' }}>
                {items.map((item) => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6b7280' }}>
                      {item.name} x {item.quantity}
                    </span>
                    <span style={{ fontWeight: '600', color: '#1a1a1a' }}>
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.875rem' }}>
                  <span>Shipping</span>
                  <span>To be confirmed</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold' }}>
                <span style={{ color: '#1a1a1a' }}>Total</span>
                <span style={{ color: '#6366f1' }}>Rs. {totalPrice.toFixed(2)}</span>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
                Final amount will be confirmed during payment discussion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
