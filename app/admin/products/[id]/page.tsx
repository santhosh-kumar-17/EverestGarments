'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface ProductFormData {
  name: string;
  category: 'Women' | 'Kids';
  price: number;
  description: string;
  stock: number;
  images: string[];
}

export default function AdminProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const productId = (params.id as string) || null;
  const isEdit = productId && productId !== 'new';

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'Women',
    price: 0,
    description: '',
    stock: 0,
    images: [],
  });

  useEffect(() => {
    if (isEdit && token) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`);
          if (!response.ok) throw new Error('Failed to fetch product');
          const data = await response.json();
          setFormData(data.data);
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product');
          router.push('/admin/products');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isEdit, productId, token, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setUploadingImages(true);
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileData = new FormData();
        fileData.append('file', file);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fileData,
        });

        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        newImages.push(data.data.url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setSubmitting(true);

      const url = isEdit
        ? `/api/admin/products/${productId}`
        : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save product');
      }

      toast.success(
        isEdit ? 'Product updated successfully' : 'Product created successfully'
      );
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save product'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading product...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          {/* Product Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter product name"
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

          {/* Category */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                background: 'white',
              }}
            >
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
              Price (Rs.) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
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

          {/* Stock */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
              placeholder="0"
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
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Enter product description"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Images */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a1a' }}>
            Product Images *
          </label>
          <div style={{ marginBottom: '1rem', borderRadius: '0.25rem', border: '2px dashed #d1d5db', padding: '1.5rem', textAlign: 'center' }}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages}
              style={{ display: 'none' }}
              id="image-input"
            />
            <label htmlFor="image-input" style={{ cursor: 'pointer' }}>
              <p style={{ marginBottom: '0.5rem', fontSize: '2.25rem' }}>📷</p>
              <p style={{ fontWeight: '600', color: '#1a1a1a' }}>Click to upload images</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {uploadingImages ? 'Uploading...' : 'or drag and drop'}
              </p>
            </label>
          </div>

          {/* Image Gallery */}
          {formData.images.length > 0 && (
            <div>
              <p style={{ marginBottom: '0.75rem', fontWeight: '600', color: '#1a1a1a' }}>
                Uploaded Images ({formData.images.length})
              </p>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                {formData.images.map((image, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{ position: 'relative', height: '8rem', width: '100%', overflow: 'hidden', borderRadius: '0.25rem', background: '#e5e7eb' }}>
                      <Image
                        src={image}
                        alt={`Product ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: 'absolute',
                        right: '-0.5rem',
                        top: '-0.5rem',
                        display: 'flex',
                        height: '1.5rem',
                        width: '1.5rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={submitting || uploadingImages}
            className="btn btn-primary"
            style={{
              flex: 1,
              opacity: submitting || uploadingImages ? 0.5 : 1,
            }}
          >
            {submitting
              ? 'Saving...'
              : isEdit
                ? 'Update Product'
                : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
