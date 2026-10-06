import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext/AuthProvider";
const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <span className="header-label">Painel de gestão</span>
      <div className="header-user">
        <span className="avatar" aria-hidden="true">
          {user?.userName?.slice(0, 2).toUpperCase() || "SU"}
        </span>
        <span className="user-name">{user?.userName || "Usuário"}</span>
        <button className="button button-ghost" onClick={logout}>
          <LogOut size={17} aria-hidden="true" />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};
export default Header;
