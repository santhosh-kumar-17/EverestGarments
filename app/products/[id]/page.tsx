'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';

interface Product {
  _id: string;
  name: string;
  category: 'Women' | 'Kids';
  price: number;
  description: string;
  stock: number;
  images: string[];
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data.data);
        setError('');
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    if (quantity > product.stock) {
      toast.error('Quantity exceeds available stock');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
      category: product.category,
    });

    toast.success(`${product.name} added to cart!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setQuantity(1);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', background: '#f9fafb' }}>
        <div style={{ borderBottom: '1px solid #e5e7eb', background: 'white', padding: '1rem 1.5rem' }}>
          <div className="container">
            <div className="skeleton" style={{ height: '1rem', width: '8rem' }} />
          </div>
        </div>
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
          <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: '1fr 1fr' }}>
            <div className="skeleton" style={{ height: '28rem', borderRadius: '1rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="skeleton" style={{ height: '1.5rem', width: '40%' }} />
              <div className="skeleton" style={{ height: '2rem', width: '80%' }} />
              <div className="skeleton" style={{ height: '3rem', width: '30%' }} />
              <div className="skeleton" style={{ height: '5rem', width: '100%' }} />
              <div className="skeleton" style={{ height: '3rem', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
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
          <p style={{ fontWeight: 600, color: '#991b1b', marginBottom: '0.5rem' }}>
            {error || 'Product not found'}
          </p>
          <Link href="/products" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', background: '#f9fafb' }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #e5e7eb', background: 'white', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Link
              href="/products"
              style={{
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
            >
              ← Back to Products
            </Link>
            <span style={{ color: '#d1d5db' }}>/</span>
            <span style={{ color: '#9ca3af' }}>{product.category}</span>
            <span style={{ color: '#d1d5db' }}>/</span>
            <span style={{ color: '#6b7280', fontWeight: 500 }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div
          className="animate-fade-in-up"
          style={{ display: 'grid', gap: '3rem', gridTemplateColumns: '1fr 1fr' }}
        >
          {/* Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                position: 'relative',
                height: '28rem',
                width: '100%',
                overflow: 'hidden',
                borderRadius: '1rem',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
              }}
            >
              {product.images[imageIndex] ? (
                <Image
                  src={product.images[imageIndex]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                  }}
                >
                  <span style={{ fontSize: '5rem' }}>🖼️</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    style={{
                      position: 'relative',
                      height: '5rem',
                      width: '5rem',
                      flexShrink: 0,
                      overflow: 'hidden',
                      borderRadius: '0.75rem',
                      border: `3px solid ${imageIndex === idx ? '#6366f1' : '#e5e7eb'}`,
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s',
                      boxShadow: imageIndex === idx ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Category & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                className="badge"
                style={{
                  background:
                    product.category === 'Women'
                      ? 'rgba(236, 72, 153, 0.1)'
                      : 'rgba(59, 130, 246, 0.1)',
                  color:
                    product.category === 'Women' ? '#ec4899' : '#3b82f6',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {product.category}
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: product.stock > 0 ? '#16a34a' : '#dc2626',
                }}
              >
                <span
                  className={`status-dot ${product.stock > 0 ? 'status-dot-completed' : ''}`}
                  style={
                    product.stock === 0
                      ? { background: '#ef4444', boxShadow: '0 0 6px rgba(239,68,68,0.4)' }
                      : {}
                  }
                />
                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0f4ff, #ede9fe)',
                borderRadius: '1rem',
                padding: '1.25rem 1.5rem',
                display: 'inline-block',
              }}
            >
              <span
                className="gradient-text"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                }}
              >
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#6b7280',
                  marginTop: '0.25rem',
                }}
              >
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <div>
              <h3
                style={{
                  marginBottom: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#374151',
                }}
              >
                Description
              </h3>
              <p
                style={{
                  color: '#6b7280',
                  lineHeight: 1.8,
                  fontSize: '0.9rem',
                }}
              >
                {product.description}
              </p>
            </div>

            {/* Quantity + Add to Cart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'block', fontSize: '0.9rem' }}>
                  Quantity
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      display: 'flex',
                      height: '3rem',
                      width: '3rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.75rem 0 0 0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRight: 'none',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      color: '#6b7280',
                      transition: 'all 0.2s',
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1))
                      )
                    }
                    style={{
                      width: '4rem',
                      height: '3rem',
                      textAlign: 'center',
                      padding: '0.5rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      fontSize: '1rem',
                      fontWeight: 700,
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    style={{
                      display: 'flex',
                      height: '3rem',
                      width: '3rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0 0.75rem 0.75rem 0',
                      border: '2px solid #e5e7eb',
                      borderLeft: 'none',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      color: '#6b7280',
                      transition: 'all 0.2s',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary btn-lg"
                id="add-to-cart-btn"
                style={{
                  width: '100%',
                  fontSize: '1rem',
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {product.stock === 0
                  ? '❌ Out of Stock'
                  : addedToCart
                    ? '✓ Added to Cart!'
                    : '🛒 Add to Cart'}
              </button>

              <Link
                href="/cart"
                className="btn btn-secondary"
                id="go-to-cart-btn"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                View Cart →
              </Link>
            </div>

            {/* Info Banner */}
            <div
              style={{
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #f0f4ff, #ede9fe)',
                padding: '1.25rem',
                fontSize: '0.85rem',
                color: '#4338ca',
                border: '1px solid #e0e7ff',
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                📋 How ordering works:
              </p>
              <p style={{ lineHeight: 1.7 }}>
                Browse products, add to cart, and submit your order. Our sales
                team will contact you for payment confirmation and delivery
                arrangement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
