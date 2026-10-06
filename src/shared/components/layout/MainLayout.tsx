import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SideBar } from "./SideBar";
import Header from "./Header";
import { navigation } from "./navigation";
export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const page = navigation.find((item) => item.path === pathname);
  useEffect(() => {
    document.title = `${page?.title || "SAMU"} · SAMU`;
    document.getElementById("main-content")?.focus();
    window.scrollTo(0, 0);
  }, [pathname, page?.title]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <SideBar />
      <div className="app-body">
        <Header />
        <main id="main-content" className="page-content" tabIndex={-1}>
          <div className="page-heading">
            <p className="eyebrow">SAMU · Gestão e indicadores</p>
            <h1>{page?.title || "SAMU"}</h1>
            <p className="muted">{page?.description}</p>
          </div>
          {children}
        </main>
        <footer className="app-footer">
          SAMU <span>Gestão de atendimentos e operação</span>
        </footer>
      </div>
    </div>
  );
};
