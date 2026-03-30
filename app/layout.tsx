import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'Everest Garments — Premium Textile Collection',
  description:
    'Discover premium textiles, elegant dresses, and comfortable kids wear. Browse our exclusive wholesale catalog and order with confidence.',
  keywords: 'textiles, garments, wholesale, women wear, kids wear, dresses, fabrics',
  openGraph: {
    title: 'Everest Garments — Premium Textile Collection',
    description:
      'Discover premium textiles, elegant dresses, and comfortable kids wear.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="page-container">
        {/* Auth-aware Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <h4>
                  <span className="gradient-text">Everest Garments</span>
                </h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    lineHeight: 1.7,
                  }}
                >
                  Premium textile catalog for wholesale ordering and bulk
                  purchases. Quality fabrics for women and kids.
                </p>
              </div>
              <div>
                <h4>Quick Links</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/products">Shop All</Link>
                  <Link href="/products?category=Women">Women</Link>
                  <Link href="/products?category=Kids">Kids</Link>
                  <Link href="/cart">Cart</Link>
                </div>
              </div>
              <div>
                <h4>Contact</h4>
                <div
                  style={{
                    fontSize: '0.875rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    color: '#9ca3af',
                  }}
                >
                  <p>📧 devateverest@gmail.com</p>
                  <p>📞 +91 9710666603</p>
                </div>
              </div>
              <div>
                <h4>Follow Us</h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    lineHeight: 1.7,
                  }}
                >
                  Stay updated with our latest collections, new arrivals, and
                  exclusive offers.
                </p>
              </div>
            </div>
            <div
              style={{
                borderTop: '1px solid #374151',
                paddingTop: '1.5rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: '#6b7280',
              }}
            >
              <p>© 2026 Everest Garments. All rights reserved. Crafted with ❤️</p>
            </div>
          </div>
        </footer>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '12px',
              fontSize: '0.9rem',
              padding: '12px 20px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f9fafb',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f9fafb',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
