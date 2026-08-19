import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, selectCart } from '../store/cartSlice';
import { selectUser } from '../store/authSlice';
import { getProducts } from '../api/productAPI';
import { ShoppingCart, ArrowLeft, Package, Tag, Check } from 'lucide-react';
import { getProductImageUrl } from '../utils/productImages';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { loading: cartLoading } = useSelector(selectCart);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProducts({ pageNumber: 0, pageSize: 200 })
      .then(res => {
        const found = res.data.content?.find(p => String(p.productId) === String(id));
        setProduct(found || null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    await dispatch(addProductToCart({ productId: product.productId, quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!product) return (
    <div className="empty-state">
      <div className="empty-state-icon">😕</div>
      <div className="empty-state-title">Product not found</div>
      <button className="btn btn-primary" onClick={() => navigate('/products')}>Back to Products</button>
    </div>
  );

  const discountPct = product.discount ? Math.round(product.discount) : 0;
  const imgUrl = getProductImageUrl(product);

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginTop: 24, marginBottom: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="product-detail">
        {/* Image */}
        <div className="product-detail-image">
          <img
            src={imgUrl}
            alt={product.productName}
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.productId}/600/600`; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div className="product-detail-info">
          {product.categoryName && (
            <div>
              <span className="badge badge-primary">
                <Tag size={12} style={{ marginRight: 4 }} />
                {product.categoryName}
              </span>
            </div>
          )}

          <h1 className="product-detail-name">{product.productName}</h1>

          <div className="product-detail-price">
            <span className="product-detail-price-main">₹{product.specialPrice?.toFixed(2)}</span>
            {discountPct > 0 && (
              <>
                <span style={{ fontSize: 18, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.price?.toFixed(2)}
                </span>
                <span className="badge badge-success">{discountPct}% OFF</span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: 15 }}>
            {product.description}
          </p>

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={16} style={{ color: product.quantity > 0 ? 'var(--color-success)' : 'var(--color-error)' }} />
            <span style={{ fontSize: 14, color: product.quantity > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity selector */}
          {product.quantity > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Quantity:</span>
              <div className="cart-quantity-controls">
                <button className="cart-quantity-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span className="cart-quantity-num">{quantity}</span>
                <button className="cart-quantity-btn" onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}>+</button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={product.quantity === 0 || cartLoading}
              style={{ flex: 1 }}
            >
              {added ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>
            {user && (
              <button
                className="btn btn-outline btn-lg"
                onClick={async () => {
                  await dispatch(addProductToCart({ productId: product.productId, quantity }));
                  navigate('/cart');
                }}
                disabled={product.quantity === 0}
                style={{ flex: 1 }}
              >
                Buy Now
              </button>
            )}
          </div>

          {/* Meta */}
          <div style={{
            padding: 16,
            background: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            fontSize: 13,
            color: 'var(--color-text-secondary)',
          }}>
            <div>🚚 Free shipping on orders above ₹500</div>
            <div style={{ marginTop: 4 }}>🔒 Secure payment guaranteed</div>
            <div style={{ marginTop: 4 }}>↩️ 30-day easy returns</div>
          </div>
        </div>
      </div>
    </div>
  );
}
