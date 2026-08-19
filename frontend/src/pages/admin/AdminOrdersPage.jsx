import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, changeOrderStatus, selectAllOrders, selectOrdersLoading } from '../../store/orderSlice';
import { ShoppingBag, Calendar, User, CreditCard } from 'lucide-react';

const ORDER_STATUSES = [
  'Order Accepted!',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(changeOrderStatus({ orderId, status: newStatus }));
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>Order Management</h1>
        <p className="text-muted text-sm">{orders.length} total customer orders</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 32 }} className="text-muted">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.map(o => (
                  <tr key={o.orderId}>
                    <td style={{ fontWeight: 600 }}>#{o.orderId}</td>
                    <td>
                      <div className="text-sm font-semibold">{o.email}</div>
                    </td>
                    <td>{o.orderItems?.length || 0} item(s)</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{o.totalAmount?.toFixed(2)}</td>
                    <td className="text-sm text-muted">{o.orderDate}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '6px 12px', fontSize: 13 }}
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o.orderId, e.target.value)}
                      >
                        {ORDER_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
