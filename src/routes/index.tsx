import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  DriversPage,
  LabelsPage,
  LoginPage,
  LogisticPage,
  Orders,
  RegisterClientPage,
  RegisterDriverPage,
} from "../pages";
import { AuthProvider } from "../shared/context";
import ProtectedRoute from "../shared/components/protectRoute";
import FreeMarket from "../pages/mercadolivre";
import { SideBar } from "@/shared/components/layout/SideBar";
import { MainLayout } from "@/shared/components/layout/MainLayout";

const Routers = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="orders"
            element={
              <ProtectedRoute roles={["admin", "driver", "customer"]}>
                <MainLayout>
                  <Orders />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="logistic"
            element={
              <ProtectedRoute roles={["admin"]}>
                <MainLayout>
                  <LogisticPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="drivers"
            element={
              <ProtectedRoute roles={["admin", "driver"]}>
                <DriversPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="labels"
            element={
              <ProtectedRoute roles={["admin", "driver"]}>
                <LabelsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="registerdriver"
            element={
              <ProtectedRoute roles={["admin"]}>
                <RegisterDriverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="registerclient"
            element={
              <ProtectedRoute roles={["admin"]}>
                <RegisterClientPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="freemarket"
            element={
              <ProtectedRoute roles={["admin", "driver"]}>
                <FreeMarket />
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
