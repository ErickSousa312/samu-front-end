import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthProvider';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  console.log( isAuthenticated, user )

   if (!user) {
     return null
   }

   if (!isAuthenticated || !roles.includes(user.role)) {
     return <Navigate to="/" />;
   }

  return children;
};

export default ProtectedRoute;
