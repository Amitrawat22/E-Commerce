import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';

export function ProtectedRoute({ children }) {
  const user = useSelector(selectUser);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const user = useSelector(selectUser);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.roles?.includes('ROLE_ADMIN') && !user.roles?.includes('ROLE_SELLER')) {
    return <Navigate to="/" replace />;
  }
  return children;
}
