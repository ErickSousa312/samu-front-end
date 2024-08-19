import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

type userStorage = { role: string, email: string, username: string, id: string } | null;

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const userLocalStorage = localStorage.getItem('user');
  const userFromStorage:userStorage = JSON.parse(userLocalStorage || 'null');
  
  if (!userLocalStorage || !roles.includes(userFromStorage!.role)) {
     return <Navigate to="/" />;
   }

  return children;
};

export default ProtectedRoute;
