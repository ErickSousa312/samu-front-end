// src/authContext.ts
import { createContext } from "react";

interface User {
  id: string;
  role: "admin" | "driver" | "user";
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
