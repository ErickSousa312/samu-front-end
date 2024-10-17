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

interface AuthContextType {
  user: TypeUser | null;
  login: (token: string, email: string) => Promise<boolean | undefined>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TypeUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUser = Cookies.get("user");

    if (token && storedUser) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const parsedUser = JSON.parse(storedUser);
      setUser({ ...parsedUser, role: storedRole || parsedUser.role });
    }
  }, []);

  const login = async (token: string, email: string) => {
    try {
      const dataInsertLocalStorage = await new Promise(async (resolve) => {
        localStorage.setItem("token", token);
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/name/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const userData: TypeUser = response.data;
        console.log(userData);
        setUser(userData);
        Cookies.set("user", JSON.stringify(userData), { expires: 7 });
        localStorage.setItem("role", userData.role);
        resolve(true);
      });
      return dataInsertLocalStorage ? true : false;
    } catch (error: any) {
      console.error("Erro ao buscar dados do usuário:", error);
      if (error.response && error.response.status === 500) {
        alert("Erro no servidor. Por favor, tente novamente mais tarde.");
      } else {
        alert("Erro ao buscar os dados do usuário.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    Cookies.remove("user");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
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
