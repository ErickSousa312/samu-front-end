import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { LoginPage, UsersPage } from "../pages";
import { AuthProvider } from "../shared/context";
import ProtectedRoute from "../shared/components/protectRoute";
import { MainLayout } from "@/shared/components/layout/MainLayout";
import Dashboard from "@/pages/dashboard";
import ConsultasPage from "@/pages/consultas";
import OcorrenciasRecentesPage from "@/pages/ocorrenciasRecentes";
import ExportacoesPage from "@/pages/exportacoes";
import { navigation } from "@/shared/components/layout/navigation";

const pages = {
  "/dashboard": Dashboard,
  "/consultas": ConsultasPage,
  "/recentes": OcorrenciasRecentesPage,
  "/exportacoes": ExportacoesPage,
  "/users": UsersPage,
};

const Routers = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {navigation.map(({ path, roles }) => {
          const Page = pages[path];
          return (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute roles={[...roles]}>
                  <MainLayout>
                    <Page />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          );
        })}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default Routers;
