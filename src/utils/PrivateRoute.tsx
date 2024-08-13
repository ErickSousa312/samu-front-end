import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext/AuthProvider';

interface PrivateRouteProps {
  roles: string[];
  element: React.ReactElement;
  path: string;
}

const PrivateRoute = ({ roles, element, path }: PrivateRouteProps) => {
  const { user, hasRole } = useAuth();

  if (!user) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(roles)) {
    // Redireciona para a página de não autorizado ou dashboard principal
    return <Navigate to="/unauthorized" replace />;
  }

  return <Route path={path} element={element} />;
};

export default PrivateRoute;
