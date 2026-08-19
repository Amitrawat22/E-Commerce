import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts, selectPagination, selectProductsLoading } from '../../store/productSlice';
import { fetchAllOrders, selectAllOrders } from '../../store/orderSlice';
import { Package, Tags, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const pagination = useSelector(selectPagination);
  const orders = useSelector(selectAllOrders);

  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: 0, pageSize: 10 }));
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const stats = [
    { label: 'Total Products', value: pagination.totalElements || products.length, icon: <Package size={22} />, color: 'var(--color-primary)' },
    { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={22} />, color: 'var(--color-accent)' },
    { label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: <DollarSign size={22} />, color: 'var(--color-success)' },
    { label: 'Avg Order Value', value: orders.length > 0 ? `₹${(totalRevenue / orders.length).toFixed(0)}` : '₹0', icon: <TrendingUp size={22} />, color: 'var(--color-warning)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700 }}>Dashboard</h1>
        <p className="text-muted" style={{ marginTop: 4 }}>Welcome to the admin panel</p>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ color: s.color, background: `${s.color}18`, padding: 8, borderRadius: 'var(--radius-sm)' }}>
                {s.icon}
              </div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { to: '/admin/products', label: 'Manage Products', icon: <Package size={20} />, desc: 'Add, edit, delete products' },
          { to: '/admin/categories', label: 'Manage Categories', icon: <Tags size={20} />, desc: 'Organize product categories' },
          { to: '/admin/orders', label: 'Manage Orders', icon: <ShoppingBag size={20} />, desc: 'Update order statuses' },
        ].map(item => (
          <Link key={item.to} to={item.to} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, textDecoration: 'none' }}>
            <div style={{ color: 'var(--color-primary)' }}>{item.icon}</div>
            <div style={{ fontWeight: 600 }}>{item.label}</div>
            <div className="text-sm text-muted">{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Orders</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId}</td>
                    <td>{order.email}</td>
                    <td style={{ fontWeight: 600 }}>₹{order.totalAmount?.toFixed(2)}</td>
                    <td>{order.orderDate}</td>
                    <td><span className="badge badge-primary">{order.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
