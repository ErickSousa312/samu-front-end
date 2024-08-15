import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthProvider';

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles: string[];
  path: string;
}

const ProtectedRoute = ({ element, allowedRoles, path }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Route path={path} element={element} />;
};

export default ProtectedRoute;
