import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectIsAdmin, logoutUser } from '../store/authSlice';
import { selectCartCount } from '../store/cartSlice';
import { ShoppingCart, User, LogOut, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const cartCount = useSelector(selectCartCount);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <ShoppingBag size={24} style={{ color: 'var(--color-primary)' }} />
        Ecommerce <span>App</span>
      </Link>

      <div className="navbar-links">
        <NavLink to="/products" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
          Products
        </NavLink>
        {user && (
          <NavLink to="/orders" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            My Orders
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin/products" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Admin Panel
          </NavLink>
        )}
      </div>

      <div className="navbar-actions">
        {user && (
          <NavLink to="/cart" className="btn btn-ghost btn-sm cart-badge" title="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
          </NavLink>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NavLink to="/profile" className="btn btn-outline btn-sm" title={user.username}>
              <User size={16} />
              <span>{user.username}</span>
            </NavLink>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
