import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { userInfo } = useAuthStore();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
