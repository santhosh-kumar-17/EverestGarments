import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Premium Textile Collection</h1>
          <p>Discover exquisite fabrics and garments for women and kids. Quality meets affordability.</p>
          <Link href="/products" className="btn btn-primary" style={{ width: 'fit-content', margin: '0 auto' }}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" style={{ backgroundColor: '#f3f4f6', padding: '2rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-3">
            <div className="text-center">
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                500+
              </div>
              <p style={{ color: '#6b7280' }}>Products</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                10K+
              </div>
              <p style={{ color: '#6b7280' }}>Customers</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                100%
              </div>
              <p style={{ color: '#6b7280' }}>Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our carefully curated collections</p>
          <div className="grid grid-cols-2">
            <Link href="/products?category=Women">
              <div className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}>
                <div style={{ height: '250px', background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                  👗
                </div>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Women's Collection</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Elegant dresses for every occasion</p>
                  <span style={{ color: '#6366f1', fontWeight: '500' }}>Browse →</span>
                </div>
              </div>
            </Link>
            
            <Link href="/products?category=Kids">
              <div className="card" style={{ cursor: 'pointer', overflow: 'hidden' }}>
                <div style={{ height: '250px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                  👶
                </div>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Kids' Collection</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Comfortable outfits for little ones</p>
                  <span style={{ color: '#6366f1', fontWeight: '500' }}>Browse →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="grid grid-cols-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚚</div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Fast Shipping</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Quick delivery to your doorstep</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Premium Quality</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>High-quality textiles and fabrics</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Secure Payment</h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Safe and encrypted transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Explore?</h2>
          <p>Start shopping our premium collection today</p>
          <Link href="/products" className="btn btn-primary" style={{ width: 'fit-content', margin: '0 auto' }}>
            Browse Products
          </Link>
        </div>
      </section>
    </>
  );
}
