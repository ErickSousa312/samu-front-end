import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const storedRole = localStorage.getItem("role");

  if (!storedRole || !roles.includes(storedRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
