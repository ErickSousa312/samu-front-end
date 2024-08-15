import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage, DriversPage, LabelsPage, LoginPage, LogisticPage, Orders, RegisterClientPage, RegisterDriverPage } from '../pages';
import { AuthProvider } from '../shared/context';
import { useAuth } from '../shared/context/AuthContext/AuthProvider';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/" />;
};

const Routers = () => {
  return (
    <Router>
    <AuthProvider>

    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="logistic"
        element={
          <ProtectedRoute>
            <LogisticPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="drivers"
        element={
          <ProtectedRoute>
            <DriversPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="labels"
        element={
          <ProtectedRoute>
            <LabelsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="registerdriver"
        element={
          <ProtectedRoute>
            <RegisterDriverPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="registerclient"
        element={
          <ProtectedRoute>
            <RegisterClientPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>

    </AuthProvider>
    </Router>
  );
};

export default Routers;
