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
        setError('Failed to load products');
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
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', borderBottom: '1px solid #e5e7eb', padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Our Collection</h1>
          
          {/* Search and Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                defaultValue={search}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link
                href="/products"
                className="btn"
                style={{
                  background: !category ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'white',
                  color: !category ? 'white' : '#1a1a1a',
                  border: !category ? 'none' : '2px solid #e5e7eb'
                }}
              >
                All Products
              </Link>
              <Link
                href="/products?category=Women"
                className="btn"
                style={{
                  background: category === 'Women' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'white',
                  color: category === 'Women' ? 'white' : '#1a1a1a',
                  border: category === 'Women' ? 'none' : '2px solid #e5e7eb'
                }}
              >
                👗 Women
              </Link>
              <Link
                href="/products?category=Kids"
                className="btn"
                style={{
                  background: category === 'Kids' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'white',
                  color: category === 'Kids' ? 'white' : '#1a1a1a',
                  border: category === 'Kids' ? 'none' : '2px solid #e5e7eb'
                }}
              >
                👶 Kids
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container" style={{ padding: '4rem 0' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
            <div style={{ height: '3rem', width: '3rem', border: '4px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
            <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading products...</p>
          </div>
        ) : error ? (
          <div style={{ borderRadius: '0.5rem', background: '#fee2e2', borderLeft: '4px solid #dc2626', padding: '1.5rem', color: '#991b1b' }}>
            <p style={{ fontWeight: 'bold' }}>Error</p>
            <p>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <p style={{ color: '#6b7280', fontWeight: 500 }}>No products found</p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '2rem', fontWeight: 500 }}>Showing <span style={{ color: '#6366f1', fontWeight: 'bold' }}>{products.length}</span> products</p>
            <div className="grid grid-cols-4">
              {products.map((product) => (
                <Link key={product._id} href={`/products/${product._id}`}>
                  <div className="card" style={{ cursor: 'pointer' }}>
                    <div style={{ position: 'relative', height: '14rem', background: '#f3f4f6', overflow: 'hidden' }}>
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#e5e7eb', fontSize: '2rem' }}>
                          🖼️
                        </div>
                      )}
                      <div style={{position: 'absolute', top: '0.75rem', right: '0.75rem', borderRadius: '0.375rem', padding: '0.375rem 0.75rem', fontSize: '0.75rem', fontWeight: 'bold', background: product.category === 'Women' ? '#fce7f3' : '#dbeafe', color: product.category === 'Women' ? '#be185d' : '#0369a1' }}>
                        {product.category}
                      </div>
                      {product.stock === 0 && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontWeight: 'bold', color: '#1a1a1a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        {product.name}
                      </h3>
                      <p style={{ marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.875rem', color: '#6b7280' }}>
                        {product.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          Rs. {product.price}
                        </span>
                        <span className="badge" style={{ background: product.stock > 0 ? '#dcfce7' : '#fee2e2', color: product.stock > 0 ? '#16a34a' : '#991b1b' }}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
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
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
