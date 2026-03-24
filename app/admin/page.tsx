'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
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
        const completedCount = orders.filter(
          (o: any) => o.status === 'completed'
        ).length;

        setStats({
          totalProducts: productsData.data?.length || 0,
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          completedOrders: completedCount,
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
      <div className="card">
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>
          Welcome to Admin Dashboard
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
          Manage products, orders, and track business metrics
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.5rem' }}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="📦"
            bgColor="#dbeafe"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="📋"
            bgColor="#dcfce7"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="⏳"
            bgColor="#fef3c7"
          />
          <StatCard
            title="Completed Orders"
            value={stats.completedOrders}
            icon="✅"
            bgColor="#e9d5ff"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
          <Link
            href="/admin/products/new"
            className="btn btn-primary"
            style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="btn btn-secondary"
            style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
          >
            View All Orders
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a' }}>Recent Activity</h2>
        <p style={{ color: '#6b7280' }}>
          Go to Products or Orders pages to view detailed information
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  bgColor,
}: {
  title: string;
  value: number;
  icon: string;
  bgColor: string;
}) {
  return (
    <div className="card" style={{ background: bgColor, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a' }}>{value}</p>
        <p style={{ fontSize: '2.25rem' }}>{icon}</p>
      </div>
    </div>
  );
}
