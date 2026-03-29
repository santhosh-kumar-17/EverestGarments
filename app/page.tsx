import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ padding: '6rem 0 5rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up">
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              ✨ New Spring Collection 2026
            </span>
          </div>
          <h1 className="animate-fade-in-up delay-100">
            Premium Textile
            <br />
            <span style={{ opacity: 0.9 }}>Collection</span>
          </h1>
          <p className="animate-fade-in-up delay-200">
            Discover exquisite fabrics and garments for women and kids.
            Where exceptional quality meets unbeatable value.
          </p>
          <div
            className="animate-fade-in-up delay-300"
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/products"
              className="btn btn-lg"
              id="hero-shop-now"
              style={{
                background: 'white',
                color: '#6366f1',
                fontWeight: 700,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              }}
            >
              Shop Now →
            </Link>
            <Link
              href="/products?category=Women"
              className="btn btn-lg"
              id="hero-women"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Women&apos;s Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '0',
          marginTop: '-2rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1px',
              background: '#e5e7eb',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            }}
          >
            {[
              { value: '500+', label: 'Products', icon: '📦' },
              { value: '10K+', label: 'Happy Customers', icon: '😊' },
              { value: '100%', label: 'Quality Assured', icon: '✓' },
              { value: '24/7', label: 'Support', icon: '💬' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-fade-in-up delay-${(i + 1) * 100}`}
                style={{
                  background: 'white',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  className="gradient-text"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    marginBottom: '0.25rem',
                  }}
                >
                  {stat.value}
                </div>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ paddingTop: '5rem' }}>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            Browse our carefully curated collections designed for every taste
          </p>
          <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            <Link href="/products?category=Women" id="cat-women">
              <div
                className="card"
                style={{
                  cursor: 'pointer',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '1rem',
                }}
              >
                <div
                  style={{
                    height: '280px',
                    background:
                      'linear-gradient(135deg, #fce7f3 0%, #fbb6ce 50%, #f9a8d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    }}
                  />
                  <span className="animate-float" style={{ position: 'relative' }}>
                    👗
                  </span>
                </div>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Women&apos;s Collection
                  </h3>
                  <p
                    style={{
                      color: '#6b7280',
                      marginBottom: '1.25rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    Elegant dresses, sarees & more for every occasion
                  </p>
                  <span
                    className="gradient-text"
                    style={{ fontWeight: 600, fontSize: '0.95rem' }}
                  >
                    Browse Collection →
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/products?category=Kids" id="cat-kids">
              <div
                className="card"
                style={{
                  cursor: 'pointer',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '1rem',
                }}
              >
                <div
                  style={{
                    height: '280px',
                    background:
                      'linear-gradient(135deg, #dbeafe 0%, #93c5fd 50%, #60a5fa 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '5rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    }}
                  />
                  <span className="animate-float delay-200" style={{ position: 'relative' }}>
                    👶
                  </span>
                </div>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Kids&apos; Collection
                  </h3>
                  <p
                    style={{
                      color: '#6b7280',
                      marginBottom: '1.25rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    Comfortable & stylish outfits for little ones
                  </p>
                  <span
                    className="gradient-text"
                    style={{ fontWeight: 600, fontSize: '0.95rem' }}
                  >
                    Browse Collection →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section
        className="section"
        style={{
          background:
            'linear-gradient(180deg, #f9fafb 0%, #eef2ff 100%)',
        }}
      >
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            Trusted by thousands of customers for quality and service
          </p>
          <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
            {[
              {
                icon: '🚚',
                title: 'Fast Shipping',
                desc: 'Quick and reliable delivery across India. Same-day dispatch for orders before 2 PM.',
                gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              },
              {
                icon: '✨',
                title: 'Premium Quality',
                desc: 'Handpicked fabrics and strict quality control. Every piece is checked before shipping.',
                gradient: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
              },
              {
                icon: '🛡️',
                title: 'Secure Orders',
                desc: 'Place your order safely. Pay on delivery or through our secure payment options.',
                gradient: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="card animate-fade-in-up"
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                  animationDelay: `${i * 150}ms`,
                }}
              >
                <div
                  style={{
                    width: '4.5rem',
                    height: '4.5rem',
                    borderRadius: '1rem',
                    background: feature.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    fontSize: '1.15rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Simple 4-step process to get your order delivered
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            {[
              {
                step: '01',
                title: 'Browse',
                desc: 'Explore our premium collection of textiles',
              },
              {
                step: '02',
                title: 'Add to Cart',
                desc: 'Select products and quantities you need',
              },
              {
                step: '03',
                title: 'Place Order',
                desc: 'Fill in your details and submit your order',
              },
              {
                step: '04',
                title: 'Get Delivered',
                desc: 'We confirm, pack and deliver to your doorstep',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="animate-fade-in-up"
                style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <div
                  className="gradient-text"
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    marginBottom: '1rem',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="hero"
        style={{
          padding: '4rem 0',
          background:
            'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: '1rem',
              letterSpacing: '-0.03em',
            }}
          >
            Ready to Explore?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Start shopping our premium collection today
          </p>
          <Link
            href="/products"
            className="btn btn-lg"
            id="cta-browse"
            style={{
              background: 'white',
              color: '#4338ca',
              fontWeight: 700,
              width: 'fit-content',
              margin: '0 auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            Browse Products →
          </Link>
        </div>
      </section>
    </>
  );
}
