import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateQuantity, removeProduct, selectCartItems, selectCartTotal, selectCart } from '../store/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { getProductImageUrl } from '../utils/productImages';
import AiProductInsights from '../components/AiProductInsights';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartId, loading } = useSelector(selectCart);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  if (loading && items.length === 0) return <div className="loading-spinner"><div className="spinner"></div></div>;

  if (items.length === 0) return (
    <div className="container">
      <div className="empty-state" style={{ paddingTop: 80 }}>
        <div className="empty-state-icon">🛒</div>
        <div className="empty-state-title">Your cart is empty</div>
        <div className="empty-state-text">Add some products to get started!</div>
        <Link to="/products" className="btn btn-primary btn-lg">
          <ShoppingBag size={18} /> Browse Products
        </Link>
      </div>
    </div>
  );

  const shipping = total >= 500 ? 0 : 49;
  const finalTotal = total + shipping;

  return (
    <div className="container" style={{ padding: '32px 24px 60px' }}>
      <h1 className="page-title" style={{ marginBottom: 32 }}>Shopping Cart ({items.length} items)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {items.map(item => {
            const imgUrl = getProductImageUrl(item);
            return (
              <div key={item.productId} style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="cart-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: '100%' }}>
                  <img
                    className="cart-item-image"
                    src={imgUrl}
                    alt={item.productName}
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.productId}/200/200`; }}
                  />

                  <div className="cart-item-details" style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.productName}</div>
                    {item.categoryName && <div className="text-xs text-muted" style={{ marginBottom: 8 }}>{item.categoryName}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        ₹{item.specialPrice?.toFixed(2)}
                      </span>
                      {item.discount > 0 && (
                        <span className="price-discount">{Math.round(item.discount)}% off</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                    <div className="cart-quantity-controls">
                      <button
                        className="cart-quantity-btn"
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, operation: 'delete' }))}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="cart-quantity-num">{item.quantity}</span>
                      <button
                        className="cart-quantity-btn"
                        onClick={() => dispatch(updateQuantity({ productId: item.productId, operation: 'add' }))}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>
                      ₹{((item.specialPrice || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>

                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-error)' }}
                      onClick={() => dispatch(removeProduct({ cartId, productId: item.productId }))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* AI Reality Check Badge / Compact Card */}
                <AiProductInsights productId={item.productId} compact={true} />
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(item => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span className="text-muted" style={{ flex: 1, paddingRight: 8 }}>{item.productName} × {item.quantity}</span>
                <span>₹{((item.specialPrice || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 4 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span className="text-muted">Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span className="text-muted">Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--color-success)' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            {shipping === 0 && (
              <div className="badge badge-success" style={{ fontSize: 11 }}>🎉 You qualify for free shipping!</div>
            )}

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 20 }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <Link to="/products" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 10, justifyContent: 'center' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
