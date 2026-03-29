'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

interface Product {
  _id: string;
  name: string;
  category: 'Women' | 'Kids';
  price: number;
  description: string;
  images: string[];
  stock: number;
}

function ProductSkeleton() {
  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="skeleton" style={{ height: '14rem', borderRadius: '0.75rem 0.75rem 0 0' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton" style={{ height: '1.25rem', width: '75%' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '100%' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '60%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem' }}>
          <div className="skeleton" style={{ height: '1.25rem', width: '30%' }} />
          <div className="skeleton" style={{ height: '1.25rem', width: '25%', borderRadius: '9999px' }} />
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/api/products';
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.data || []);
        setError('');
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    const params = new URLSearchParams();
    if (searchValue) params.append('search', searchValue);
    if (category) params.append('category', category);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <>
      {/* Page Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(168, 85, 247, 0.06) 100%)',
          borderBottom: '1px solid #e5e7eb',
          padding: '2.5rem 0',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Our Collection
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
            {category
              ? `Browsing ${category}'s collection`
              : 'Explore our complete range of premium textiles'}
          </p>

          {/* Search */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form
              onSubmit={handleSearch}
              style={{ display: 'flex', gap: '0.5rem', maxWidth: '32rem' }}
              id="product-search-form"
            >
              <div style={{ flex: 1, position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '1rem',
                    pointerEvents: 'none',
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={search}
                  id="search-input"
                  style={{
                    paddingLeft: '2.75rem',
                    borderRadius: '0.75rem',
                    border: '2px solid #e5e7eb',
                    height: '3rem',
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                id="search-button"
                style={{ height: '3rem', borderRadius: '0.75rem' }}
              >
                Search
              </button>
            </form>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { href: '/products', label: 'All Products', value: '' },
                { href: '/products?category=Women', label: '👗 Women', value: 'Women' },
                { href: '/products?category=Kids', label: '👶 Kids', value: 'Kids' },
              ].map((filter) => {
                const isActive = category === filter.value;
                return (
                  <Link
                    key={filter.value}
                    href={filter.href}
                    className="btn btn-sm"
                    id={`filter-${filter.value || 'all'}`}
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                        : 'white',
                      color: isActive ? 'white' : '#374151',
                      border: isActive ? 'none' : '2px solid #e5e7eb',
                      borderRadius: '9999px',
                      fontWeight: isActive ? 600 : 500,
                      boxShadow: isActive
                        ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                        : 'none',
                    }}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {loading ? (
          <div>
            <div className="skeleton" style={{ height: '1rem', width: '10rem', marginBottom: '2rem' }} />
            <div className="grid grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div
            style={{
              borderRadius: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <p style={{ fontWeight: 600, color: '#991b1b', marginBottom: '0.5rem' }}>
              Something went wrong
            </p>
            <p style={{ color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 2rem',
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
              }}
              className="animate-bounce-in"
            >
              📦
            </div>
            <p
              style={{
                color: '#6b7280',
                fontWeight: 600,
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
              }}
            >
              No products found
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Try adjusting your search or filters
            </p>
            <Link href="/products" className="btn btn-primary btn-sm">
              View All Products
            </Link>
          </div>
        ) : (
          <div>
            <p
              style={{
                color: '#6b7280',
                marginBottom: '2rem',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              Showing{' '}
              <span className="gradient-text" style={{ fontWeight: 700 }}>
                {products.length}
              </span>{' '}
              products
            </p>
            <div className="grid grid-cols-4">
              {products.map((product, i) => (
                <Link key={product._id} href={`/products/${product._id}`}>
                  <div
                    className="card animate-fade-in-up"
                    style={{
                      cursor: 'pointer',
                      padding: 0,
                      animationDelay: `${Math.min(i * 50, 400)}ms`,
                    }}
                    id={`product-card-${product._id}`}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        position: 'relative',
                        height: '14rem',
                        background: '#f3f4f6',
                        overflow: 'hidden',
                      }}
                    >
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          style={{
                            objectFit: 'cover',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                            fontSize: '2.5rem',
                          }}
                        >
                          🖼️
                        </div>
                      )}

                      {/* Category Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          left: '0.75rem',
                          borderRadius: '9999px',
                          padding: '0.375rem 0.875rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                          background:
                            product.category === 'Women'
                              ? 'rgba(236, 72, 153, 0.9)'
                              : 'rgba(59, 130, 246, 0.9)',
                          color: 'white',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {product.category}
                      </div>

                      {/* Out of Stock Overlay */}
                      {product.stock === 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(2px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span
                            style={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem',
                              background: 'rgba(0,0,0,0.5)',
                              padding: '0.5rem 1.25rem',
                              borderRadius: '9999px',
                            }}
                          >
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div style={{ padding: '1.25rem' }}>
                      <h3
                        style={{
                          fontWeight: 700,
                          color: '#111827',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          marginBottom: '0.5rem',
                          fontSize: '0.95rem',
                          lineHeight: 1.4,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        style={{
                          marginBottom: '1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          fontSize: '0.8rem',
                          color: '#9ca3af',
                          lineHeight: 1.5,
                        }}
                      >
                        {product.description}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid #f3f4f6',
                        }}
                      >
                        <span
                          className="gradient-text"
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span
                          className="badge"
                          style={{
                            background:
                              product.stock > 0 ? '#dcfce7' : '#fee2e2',
                            color:
                              product.stock > 0 ? '#16a34a' : '#991b1b',
                            fontSize: '0.7rem',
                          }}
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
