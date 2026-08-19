import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, selectProducts, selectCategories, selectPagination, selectProductsLoading } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { ArrowRight, Zap, Shield, Truck, Headphones, ShoppingBag } from 'lucide-react';

const features = [
  { icon: <Zap size={24} />, title: 'Lightning Fast', desc: 'Instant order processing & dispatch' },
  { icon: <Shield size={24} />, title: 'Secure Checkout', desc: '100% encrypted & verified transactions' },
  { icon: <Truck size={24} />, title: 'Free Express Shipping', desc: 'On orders above ₹500 across India' },
  { icon: <Headphones size={24} />, title: '24/7 Customer Support', desc: 'Round the clock helpline & assistance' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectProductsLoading);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories({ pageSize: 50 }));
    dispatch(fetchProducts({ pageNumber: page, pageSize: 8, sortBy: 'productId', sortOrder: 'desc' }));
  }, [dispatch, page]);

  return (
    <div>
      {/* Banner / Hero */}
      <section className="hero">
        <div className="container">
          <div className="badge badge-primary" style={{ marginBottom: 16 }}>
            🔥 Official Full-Stack E-Commerce Store
          </div>
          <h1 className="hero-title">
            Discover Quality Products,<br />
            <span>Delivered Straight to You</span>
          </h1>
          <p className="hero-subtitle">
            Welcome to Ecommerce App. Browse top categories including Electronics, Fashion, Home Decor, Books, and more.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              <ShoppingBag size={20} /> Browse Catalog
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Bar */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '28px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {features.map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                  {f.icon}
                </div>
                <div>
                  <div className="font-semibold" style={{ fontSize: 15, color: 'var(--color-text-primary)' }}>{f.title}</div>
                  <div className="text-sm text-muted">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      {categories.length > 0 && (
        <section style={{ padding: '48px 0 24px' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Browse by Category</h2>
              <Link to="/products" className="btn btn-ghost btn-sm">All Categories <ArrowRight size={14} /></Link>
            </div>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              {categories.map(cat => (
                <Link
                  key={cat.categoryId}
                  to={`/products?category=${cat.categoryId}`}
                  className="filter-chip"
                >
                  {cat.categoryName}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section style={{ padding: '36px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>Featured Products</h2>
              <p className="text-sm text-muted">Handpicked selection of top selling items</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="empty-state" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 48 }}>
              <div className="empty-state-icon">📦</div>
              <div className="empty-state-title">No products found</div>
              <div className="empty-state-text">Products will appear here once added in the database.</div>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map(p => <ProductCard key={p.productId} product={p} />)}
              </div>
              <Pagination pagination={pagination} onPageChange={setPage} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
