import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SvgDiv from "@/assets/divSVG.svg";
import { TiHome } from "react-icons/ti";
import { FaChartBar } from "react-icons/fa";

interface ISideBarProps {
  children: React.ReactNode;
}

export const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentPath = window.location.pathname;
  console.log("currentPath", currentPath);
  const isActiveRoute = (path: string) => currentPath === path;

  const getItemClass = (path: string) =>
    `flex items-center px-4 py-2 rounded ${
      isActiveRoute(path)
        ? "bg-gray-700 text-white"
        : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <aside className="w-full  h-[90%] pl-2 pr-2">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white text-center">DEAF</h1>
        <img style={{ marginTop: 13 }} src={SvgDiv} alt="Logo" />
      </div>
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <a href="#" className={getItemClass("/dashboard")}>
              <div className="w-6 h-6 justify-items-center align-middle bg-red-500 rounded-lg">
                <TiHome
                  color="white"
                  size={19}
                  style={{
                    backgroundColor: "transparent",
                    marginTop: 1,
                  }}
                />
              </div>
              <i className="fas fa-tachometer-alt mr-3"></i> Dashboard
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className={getItemClass("/ocorrencias")}>
              <div className="w-6 h-6 justify-items-center align-middle bg-red-500 rounded-lg">
                <FaChartBar
                  color="white"
                  size={17}
                  style={{ backgroundColor: "transparent", marginTop: 3 }}
                />
              </div>
              <i className="fas fa-chart-bar mr-3"></i> Ocorrências
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className={getItemClass("/consultas")}>
              <div className="w-6 h-6 justify-items-center align-middle bg-red-500 rounded-lg">
                <TiHome
                  color="white"
                  size={19}
                  style={{ backgroundColor: "transparent", marginTop: 1 }}
                />
              </div>
              <i className="fas fa-search mr-3"></i> Consultas
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className={getItemClass("/configuracao")}>
              <div className="w-6 h-6 justify-items-center align-middle bg-red-500 rounded-lg">
                <TiHome
                  color="white"
                  size={19}
                  style={{ backgroundColor: "transparent", marginTop: 1 }}
                />
              </div>
              <i className="fas fa-cog mr-3"></i> Configuração
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className={getItemClass("/perfil")}>
              <div className="w-6 h-6 justify-items-center align-middle bg-red-500 rounded-lg">
                <TiHome
                  color="white"
                  size={19}
                  style={{ backgroundColor: "transparent", marginTop: 1 }}
                />
              </div>
              <i className="fas fa-user mr-3"></i> Perfil
            </a>
          </li>
        </ul>
      </nav>
      {/* <div className="p-6">
        <div className="bg-gray-700 p-4 rounded">
          <p className="text-sm text-gray-300">Precisa de ajuda?</p>
          <p className="text-sm text-gray-300">Cheque a documentação</p>
          <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
            Documentação
          </button>
        </div>
      </div> */}
    </aside>
  );
};
