import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Everest Garments - Premium Textiles',
  description: 'Premium textile catalog for wholesale ordering',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="page-container">
        {/* Header */}
        <header>
          <div className="container">
            <nav>
              <Link href="/" className="logo">
                Everest Garments
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/products" className="text-sm md:text-base">
                  Shop
                </Link>
                <Link href="/cart" className="text-sm md:text-base">
                  Cart
                </Link>
                <Link href="/auth" className="btn btn-primary btn-sm">
                  Admin
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <h4>About</h4>
                <p className="text-sm">Premium textile catalog for wholesale ordering and bulk purchases.</p>
              </div>
              <div>
                <h4>Quick Links</h4>
                <div className="flex flex-col gap-2 text-sm">
                  <Link href="/products">Shop</Link>
                  <Link href="/cart">Cart</Link>
                  <Link href="/auth">Admin</Link>
                </div>
              </div>
              <div>
                <h4>Contact</h4>
                <div className="text-sm">
                  <p>Email: info@everest.com</p>
                  <p>Phone: +91 9710666603</p>
                </div>
              </div>
              <div>
                <h4>Follow</h4>
                <p className="text-sm">Stay updated with our latest collections and offers.</p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
              <p>&copy; 2026 Everest Garments. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
