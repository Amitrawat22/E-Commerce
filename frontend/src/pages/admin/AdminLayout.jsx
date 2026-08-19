import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingBag } from 'lucide-react';

const links = [
  { to: '/admin', icon: <LayoutDashboard size={16} />, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: <Package size={16} />, label: 'Products' },
  { to: '/admin/categories', icon: <Tags size={16} />, label: 'Categories' },
  { to: '/admin/orders', icon: <ShoppingBag size={16} />, label: 'Orders' },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 24px 20px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Admin Panel
        </div>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
          >
            {l.icon} {l.label}
          </NavLink>
        ))}
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
