import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, selectMyOrders, selectOrdersLoading } from '../store/orderSlice';
import { Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  'Order Accepted!': 'badge-primary',
  'Shipped': 'badge-warning',
  'Delivered': 'badge-success',
  'Cancelled': 'badge-error',
};

export default function OrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">{orders.length} order(s) total</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 60px' }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-title">No orders yet</div>
            <div className="empty-state-text">When you place an order, it'll appear here.</div>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map(order => (
              <div key={order.orderId} className="order-card animate-fade-in">
                <div className="order-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Package size={18} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>Order #{order.orderId}</div>
                      <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} />
                        {order.orderDate}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--color-primary)' }}>
                        ₹{order.totalAmount?.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted">{order.orderItems?.length || 0} item(s)</div>
                    </div>
                    <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-primary'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {order.orderItems?.map(item => (
                      <div key={item.orderItemId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={item.product?.image && item.product.image !== 'default.png'
                            ? `/images/${item.product.image}`
                            : `https://picsum.photos/seed/${item.product?.productId}/80/80`}
                          alt={item.product?.productName}
                          style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--color-surface-2)' }}
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.product?.productId}/80/80`; }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{item.product?.productName}</div>
                          <div className="text-xs text-muted">Qty: {item.quantity} × ₹{item.orderedProductPrice?.toFixed(2)}</div>
                        </div>
                        <div style={{ fontWeight: 600 }}>₹{(item.quantity * item.orderedProductPrice).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Meta */}
                  {(order.payment || order.addressId) && (
                    <div style={{ marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {order.payment && (
                        <div className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)' }}>
                          <CreditCard size={14} />
                          {order.payment.paymentMethod}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
