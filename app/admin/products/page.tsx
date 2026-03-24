'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  _id: string;
  name: string;
  category: 'Women' | 'Kids';
  price: number;
  stock: number;
  images: string[];
}

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Delete product "${productName}"?`)) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Add New Product
        </Link>
      </div>

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', color: '#6b7280' }}>No products yet</p>
          <Link href="/admin/products" className="btn btn-primary" style={{ display: 'inline-block' }}>
            + Add First Product
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <div className="card" style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                    Image
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                    Name
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                    Category
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                    Price
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                    Stock
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem' }}>
                      {product.images[0] ? (
                        <div style={{ position: 'relative', height: '3rem', width: '3rem', overflow: 'hidden', borderRadius: '0.25rem' }}>
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', height: '3rem', width: '3rem', alignItems: 'center', justifyContent: 'center', background: '#e5e7eb', borderRadius: '0.25rem' }}>
                          🖼️
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1a1a1a' }}>
                      {product.name}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-block', borderRadius: '0.25rem', background: '#dbeafe', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#1e40af' }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#6366f1' }}>
                      Rs. {product.price}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: product.stock > 0 ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          href={`/admin/products/${product._id}`}
                          style={{
                            color: '#6366f1',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#1a1a1a'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#6366f1'}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          style={{
                            color: '#dc2626',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#b91c1c'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#dc2626'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
