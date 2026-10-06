import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HeartPulse,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext/AuthProvider";
import { navigation } from "./navigation";

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  user: "Usuário interno",
};

export const SideBar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true",
  );
  const visibleItems = navigation.filter((item) =>
    item.roles.includes(user?.role || ""),
  );

  const groupedItems = visibleItems.reduce<Record<string, typeof visibleItems>>(
    (acc, item) => {
      const section = item.section || "Geral";
      acc[section] = [...(acc[section] || []), item];
      return acc;
    },
    {},
  );

  const toggleSidebar = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        type="button"
        className="sidebar-collapse-button"
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
        aria-expanded={!collapsed}
        title={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? (
          <PanelLeftOpen size={18} aria-hidden="true" />
        ) : (
          <PanelLeftClose size={18} aria-hidden="true" />
        )}
      </button>
      <div className="brand">
        <span className="brand-icon">
          <HeartPulse aria-hidden="true" />
        </span>
        <div className="brand-copy">
          <strong>SAMU</strong>
          <small>Central de gestão</small>
        </div>
      </div>

      <div className="sidebar-user-card">
        <div className="sidebar-user-avatar" aria-hidden="true">
          {user?.userName?.slice(0, 2).toUpperCase() || "SU"}
        </div>
        <div className="sidebar-user-meta">
          <span className="sidebar-user-name">{user?.userName || "Usuário"}</span>
          <span className="sidebar-user-role">
            <ShieldCheck size={12} aria-hidden="true" />
            {roleLabels[user?.role || "user"] || "Usuário"}
          </span>
        </div>
      </div>

      <p className="nav-caption">ESPAÇO DE TRABALHO</p>
      <nav aria-label="Navegação principal" className="sidebar-nav">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="nav-group">
            <p className="nav-section-label">{section}</p>
            <ul className="nav-list">
              {items.map(({ path, title, icon: Icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end
                    title={collapsed ? title : undefined}
                    aria-label={collapsed ? title : undefined}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={19} aria-hidden="true" />
                    <span>{title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <button type="button" className="sidebar-logout" onClick={logout}>
        <LogOut size={16} aria-hidden="true" />
        <span>Sair do sistema</span>
      </button>
    </aside>
  );
};
