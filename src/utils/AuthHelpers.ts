// src/authHelpers.ts

interface User {
  id: string;
  role: "admin" | "driver" | "user";
  name: string;
  email: string;
}

export const login = (
  userData: User,
  token: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setToken: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  setUser(userData);
  setToken(token);
  localStorage.setItem("token", token);
};

export const logout = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setToken: React.Dispatch<React.SetStateAction<string | null>>,
  navigate: (path: string) => void,
) => {
  setUser(null);
  setToken(null);
  localStorage.removeItem("token");
  navigate("/login");
};

export const hasRole = (roles: string[], user: User | null) => {
  return roles.includes(user?.role ?? "");
};
