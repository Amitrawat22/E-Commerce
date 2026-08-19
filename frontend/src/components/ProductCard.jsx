import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../store/cartSlice';
import { selectUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getProductImageUrl } from '../utils/productImages';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    dispatch(addProductToCart({ productId: product.productId, quantity: 1 }));
  };

  const discountPct = product.discount ? Math.round(product.discount) : 0;
  const imageUrl = getProductImageUrl(product);

  return (
    <div className="product-card animate-fade-in" onClick={() => navigate(`/products/${product.productId}`)}>
      <div className="product-card-image-wrapper">
        <img
          className="product-card-image"
          src={imageUrl}
          alt={product.productName}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.productId}/400/280`; }}
        />
        {discountPct > 0 && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className="badge badge-accent">{discountPct}% OFF</span>
          </div>
        )}
        <div className="product-card-overlay">
          <button
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-card-body">
        {product.categoryName && (
          <div className="product-card-category">{product.categoryName}</div>
        )}
        <div className="product-card-name">{product.productName}</div>
        <p className="text-sm text-muted" style={{ marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>

        <div className="product-card-price-row">
          <div>
            <div className="price-special">₹{product.specialPrice?.toFixed(2)}</div>
            {discountPct > 0 && (
              <div className="price-original">₹{product.price?.toFixed(2)}</div>
            )}
          </div>
          {discountPct > 0 && (
            <span className="price-discount">Save {discountPct}%</span>
          )}
        </div>

        {product.quantity !== undefined && product.quantity <= 5 && product.quantity > 0 && (
          <div className="text-xs" style={{ color: 'var(--color-warning)', marginTop: 8 }}>
            Only {product.quantity} left!
          </div>
        )}
      </div>
    </div>
  );
}
