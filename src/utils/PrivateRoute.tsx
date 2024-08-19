import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext/AuthProvider';

interface PrivateRouteProps {
  roles: string[];
  element: React.ReactElement;
  path: string;
}

const PrivateRoute = ({ element, path }: PrivateRouteProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("user DATA verify", user)
  console.log("entrou aqui")
  if (!user) {
    navigate('/');
  }

  // if (!user.role(roles)) {
  //   // Redireciona para a página de não autorizado ou dashboard principal
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Route path={path} element={element} />;
};

export default PrivateRoute;
