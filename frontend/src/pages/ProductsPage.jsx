import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  fetchProducts, fetchProductsByCategory, fetchProductsByKeyword, fetchCategories,
  selectProducts, selectCategories, selectPagination, selectProductsLoading,
  setSelectedCategory, setSearchKeyword, selectSelectedCategory, selectSearchKeyword,
} from '../store/productSlice';
import { addProductToCart } from '../store/cartSlice';
import { selectUser } from '../store/authSlice';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { Search, SlidersHorizontal, X, LayoutGrid, List, ShoppingCart } from 'lucide-react';
import { getProductImageUrl } from '../utils/productImages';

const SORT_OPTIONS = [
  { label: 'Newest First', sortBy: 'productId', sortOrder: 'desc' },
  { label: 'Oldest First', sortBy: 'productId', sortOrder: 'asc' },
  { label: 'Price: Low to High', sortBy: 'specialPrice', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'specialPrice', sortOrder: 'desc' },
  { label: 'Name A-Z', sortBy: 'productName', sortOrder: 'asc' },
];

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectProductsLoading);
  const selectedCategory = useSelector(selectSelectedCategory);
  const searchKeyword = useSelector(selectSearchKeyword);
  const user = useSelector(selectUser);

  const [page, setPage] = useState(0);
  const [sortIdx, setSortIdx] = useState(0);
  const [localSearch, setLocalSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    dispatch(fetchCategories({ pageSize: 50 }));
    const cat = searchParams.get('category');
    if (cat) dispatch(setSelectedCategory(Number(cat)));
  }, []);

  const loadProducts = useCallback(() => {
    const sort = SORT_OPTIONS[sortIdx];
    const params = { pageNumber: page, pageSize: 12, sortBy: sort.sortBy, sortOrder: sort.sortOrder };

    if (searchKeyword) {
      dispatch(fetchProductsByKeyword({ keyword: searchKeyword, params }));
    } else if (selectedCategory) {
      dispatch(fetchProductsByCategory({ categoryId: selectedCategory, params }));
    } else {
      dispatch(fetchProducts(params));
    }
  }, [dispatch, page, sortIdx, searchKeyword, selectedCategory]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchKeyword(localSearch.trim()));
    dispatch(setSelectedCategory(null));
    setPage(0);
  };

  const clearSearch = () => {
    setLocalSearch('');
    dispatch(setSearchKeyword(''));
    setPage(0);
  };

  const handleCategoryClick = (catId) => {
    dispatch(setSelectedCategory(catId === selectedCategory ? null : catId));
    dispatch(setSearchKeyword(''));
    setLocalSearch('');
    setPage(0);
    setSearchParams(catId && catId !== selectedCategory ? { category: catId } : {});
  };

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    dispatch(addProductToCart({ productId, quantity: 1 }));
  };

  return (
    <div>
      <div className="page-header" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '24px 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>Explore Products</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {pagination.totalElements > 0 ? `Showing ${pagination.totalElements} products` : 'Browse all available products'}
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* Search, Sort, & View Toggle Bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 280 }}>
            <div className="search-bar">
              <Search size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products by name or description..."
              />
              {(localSearch || searchKeyword) && (
                <button type="button" onClick={clearSearch} style={{ background: 'none', color: 'var(--color-text-muted)' }}>
                  <X size={16} />
                </button>
              )}
            </div>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={16} style={{ color: 'var(--color-text-muted)' }} />
              <select
                className="form-select"
                style={{ width: 'auto', padding: '8px 14px', fontSize: 14 }}
                value={sortIdx}
                onChange={(e) => { setSortIdx(Number(e.target.value)); setPage(0); }}
              >
                {SORT_OPTIONS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
              </select>
            </div>

            {/* View Mode Toggle: Grid vs List */}
            <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                className={`btn btn-ghost btn-sm ${viewMode === 'grid' ? 'active' : ''}`}
                style={{ background: viewMode === 'grid' ? 'var(--color-primary-light)' : 'transparent', color: viewMode === 'grid' ? 'var(--color-primary)' : 'inherit', borderRadius: 0 }}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`btn btn-ghost btn-sm ${viewMode === 'list' ? 'active' : ''}`}
                style={{ background: viewMode === 'list' ? 'var(--color-primary-light)' : 'transparent', color: viewMode === 'list' ? 'var(--color-primary)' : 'inherit', borderRadius: 0 }}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="filter-bar">
          <button
            className={`filter-chip ${!selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryClick(null)}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.categoryId}
              className={`filter-chip ${selectedCategory === cat.categoryId ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.categoryId)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Active Filter Indicators */}
        {(searchKeyword || selectedCategory) && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
            <span className="text-sm text-muted">Active Filter:</span>
            {searchKeyword && (
              <span className="badge badge-primary">
                Search: "{searchKeyword}"
                <button onClick={clearSearch} style={{ background: 'none', marginLeft: 6, color: 'inherit' }}>
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="badge badge-primary">
                Category: {categories.find(c => c.categoryId === selectedCategory)?.categoryName}
                <button onClick={() => handleCategoryClick(null)} style={{ background: 'none', marginLeft: 6, color: 'inherit' }}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Products List & Grid Rendering */}
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 48 }}>
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No products match your search</div>
            <div className="empty-state-text">Try adjusting your category filter or keyword.</div>
            <button className="btn btn-outline" onClick={() => { clearSearch(); handleCategoryClick(null); }}>
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.productId} product={p} />)}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="product-list">
            {products.map(product => {
              const discountPct = product.discount ? Math.round(product.discount) : 0;
              const imgUrl = getProductImageUrl(product);
              return (
                <div
                  key={product.productId}
                  className="product-list-item"
                  onClick={() => navigate(`/products/${product.productId}`)}
                >
                  <img
                    className="product-list-image"
                    src={imgUrl}
                    alt={product.productName}
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.productId}/200/200`; }}
                  />

                  <div className="product-list-content">
                    {product.categoryName && (
                      <div className="product-card-category">{product.categoryName}</div>
                    )}
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{product.productName}</h3>
                    <p className="text-sm text-muted" style={{ marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text-primary)' }}>
                        ₹{product.specialPrice?.toFixed(2)}
                      </span>
                      {discountPct > 0 && (
                        <>
                          <span style={{ fontSize: 14, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                            ₹{product.price?.toFixed(2)}
                          </span>
                          <span className="badge badge-success">{discountPct}% OFF</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => handleAddToCart(e, product.productId)}
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
}
