import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { TypeUser } from "../../../@types/useData";
import api from "../../services/api";

interface AuthContextType {
  user: TypeUser | null;
  login: (token: string, email: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TypeUser | null>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    Cookies.remove("user");
    delete axios.defaults.headers.common.Authorization;
    setUser(null);
  };

  const validateUser = (data: TypeUser): TypeUser => {
    if (
      !data ||
      typeof data._id !== "number" ||
      typeof data.userName !== "string" ||
      typeof data.role !== "string"
    ) {
      throw new Error("Dados de usuário inválidos.");
    }
    return data;
  };

  useEffect(() => {
    const controller = new AbortController();
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = Cookies.get("user");
        if (!token || !storedUser) {
          clearSession();
          return;
        }
        const parsedUser = validateUser(JSON.parse(storedUser));
        const response = await api.get<TypeUser>(
          `users/name/${encodeURIComponent(parsedUser.userName)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
            timeout: 15000,
          },
        );
        if (controller.signal.aborted) return;
        const userData = validateUser(response.data);
        setUser(userData);
        localStorage.setItem("role", userData.role);
        Cookies.set("user", JSON.stringify(userData), { expires: 7 });
      } catch {
        if (!controller.signal.aborted) clearSession();
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    restoreSession();
    return () => controller.abort();
  }, []);

  const login = async (token: string, email: string) => {
    try {
      if (!token) throw new Error("Token ausente.");
      const response = await api.get<TypeUser>(
        `users/name/${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 },
      );
      const userData = validateUser(response.data);
      localStorage.setItem("token", token);
      localStorage.setItem("role", userData.role);
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });
      setUser(userData);
      return true;
    } catch (error) {
      clearSession();
      throw error;
    }
  };

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user && !!localStorage.getItem("token"),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
