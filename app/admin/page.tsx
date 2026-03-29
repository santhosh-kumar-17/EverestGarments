'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  contactedOrders: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    contactedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token) return;

        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/admin/orders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const orders = ordersData.data || [];
        const pendingCount = orders.filter(
          (o: any) => o.status === 'pending'
        ).length;
        const contactedCount = orders.filter(
          (o: any) => o.status === 'contacted'
        ).length;
        const completedCount = orders.filter(
          (o: any) => o.status === 'completed'
        ).length;

        const totalRevenue = orders
          .filter((o: any) => o.status === 'completed')
          .reduce((sum: number, o: any) => {
            return (
              sum +
              (o.items || []).reduce(
                (s: number, item: any) =>
                  s + (item.price || 0) * (item.quantity || 0),
                0
              )
            );
          }, 0);

        setStats({
          totalProducts: productsData.data?.length || 0,
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          contactedOrders: contactedCount,
          completedOrders: completedCount,
          totalRevenue,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Section */}
      <div
        className="animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
          borderRadius: '1rem',
          padding: '2rem 2.5rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '0.25rem',
            }}
          >
            Welcome Back! 👋
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            Manage your products, track orders, and grow your business
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: '8rem', borderRadius: '1rem' }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="📦"
            gradient="linear-gradient(135deg, #dbeafe, #bfdbfe)"
            textColor="#1e40af"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="📋"
            gradient="linear-gradient(135deg, #dcfce7, #bbf7d0)"
            textColor="#166534"
          />
          <StatCard
            title="Pending"
            value={stats.pendingOrders}
            icon="⏳"
            gradient="linear-gradient(135deg, #fef3c7, #fde68a)"
            textColor="#92400e"
          />
          <StatCard
            title="Completed"
            value={stats.completedOrders}
            icon="✅"
            gradient="linear-gradient(135deg, #ede9fe, #ddd6fe)"
            textColor="#5b21b6"
          />
        </div>
      )}

      {/* Revenue Card */}
      {!loading && (
        <div
          className="card-flat animate-fade-in-up delay-300"
          style={{
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                marginBottom: '0.25rem',
              }}
            >
              Completed Order Revenue
            </p>
            <p
              className="gradient-text"
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
              }}
            >
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
          <div style={{ fontSize: '2.5rem' }}>💰</div>
        </div>
      )}

      {/* Quick Actions */}
      <div
        className="card-flat animate-fade-in-up delay-400"
        style={{
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
        }}
      >
        <h2
          style={{
            marginBottom: '1.25rem',
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.02em',
          }}
        >
          ⚡ Quick Actions
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <Link
            href="/admin/products/new"
            className="btn btn-primary"
            id="admin-add-product"
            style={{
              display: 'flex',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="btn btn-secondary"
            id="admin-view-orders"
            style={{
              display: 'flex',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            📋 View All Orders
          </Link>
          <Link
            href="/admin/products"
            className="btn btn-outline"
            id="admin-manage-products"
            style={{
              display: 'flex',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            📦 Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
  textColor,
}: {
  title: string;
  value: number;
  icon: string;
  gradient: string;
  textColor: string;
}) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        background: gradient,
        borderRadius: '1rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <p
        style={{
          fontSize: '0.8rem',
          color: textColor,
          fontWeight: 600,
          opacity: 0.8,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <p
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: textColor,
            letterSpacing: '-0.03em',
          }}
        >
          {value}
        </p>
        <p style={{ fontSize: '2rem' }}>{icon}</p>
      </div>
    </div>
  );
}
