import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, status } = useAuth();

  if (status === 'loading') return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirectMap = {
      admin:    '/admin/dashboard',
      merchant: '/merchant/dashboard',
      courier:  '/courier',
      customer: '/',
    };
    return <Navigate to={redirectMap[role] || '/'} replace />;
  }
  return children;
};

export default ProtectedRoute;
