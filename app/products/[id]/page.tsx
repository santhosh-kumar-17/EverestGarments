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
    setQuantity(1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ borderRadius: '0.25rem', background: '#fee2e2', padding: '1rem', color: '#991b1b' }}>{error || 'Product not found'}</div>
        <Link href="/products" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #e5e7eb', background: 'white', padding: '1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <Link href="/products" style={{ color: '#6366f1', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1a1a1a'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6366f1'}
          >
            ← Back to Products
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
          {/* Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', height: '24rem', width: '100%', overflow: 'hidden', borderRadius: '0.25rem', background: '#e5e7eb' }}>
              {product.images[imageIndex] ? (
                <Image
                  src={product.images[imageIndex]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#d1d5db' }}>
                  <span style={{ fontSize: '3.75rem' }}>🖼️</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                      borderRadius: '0.25rem',
                      border: `2px solid ${imageIndex === idx ? '#6366f1' : '#e5e7eb'}`,
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ borderRadius: '0.25rem', background: '#dbeafe', padding: '0.25rem 0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
                  {product.category}
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: product.stock > 0 ? '#16a34a' : '#dc2626',
                }}>
                  {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>{product.name}</h1>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '1rem' }}>
              <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#6366f1' }}>Rs. {product.price}</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.75rem', fontWeight: '600', color: '#1a1a1a' }}>Description</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.625' }}>{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
                  Quantity
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      display: 'flex',
                      height: '2.5rem',
                      width: '2.5rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.25rem',
                      border: '1px solid #d1d5db',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(product.stock, parseInt(e.target.value) || 1))
                    }
                    style={{
                      width: '4rem',
                      textAlign: 'center',
                      padding: '0.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.25rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{
                      display: 'flex',
                      height: '2.5rem',
                      width: '2.5rem',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.25rem',
                      border: '1px solid #d1d5db',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={product.stock === 0 ? 'btn btn-secondary' : 'btn btn-primary'}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.25rem',
                  fontWeight: '600',
                  color: 'white',
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <Link
                href="/cart"
                className="btn btn-secondary"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
              >
                Go to Cart
              </Link>
            </div>

            {/* Additional Info */}
            <div style={{ borderRadius: '0.25rem', background: '#dbeafe', padding: '1rem', fontSize: '0.875rem', color: '#1e40af' }}>
              <p>
                <strong>Wholesale Catalog:</strong> Browse all products, add to cart,
                and submit your order. Our sales team will contact you for payment and
                confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
