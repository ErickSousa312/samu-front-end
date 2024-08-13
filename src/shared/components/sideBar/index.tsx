import { LuPackageSearch } from "react-icons/lu";
import { FaTruck } from "react-icons/fa";
import { MdLabel } from "react-icons/md";
import SubMenu from "../submenu";

const SideBar = () => {
  return (
    <div className="h-screen w-96 border-[#88493877]  border-r bg-[#121212] text-white">
      <div className="p-4 px-12 text-xl font-bold ">Dashboard</div>
      <ul className="mt-4 ">
        <li className="flex items-center p-4 hover:bg-gray-700 hover:text-[#CF4E29] duration-200 cursor-pointer">
          <LuPackageSearch className="mr-3" />
          <a href="/orders">Pedidos</a>
        </li>
        <li className="flex items-center p-4 hover:bg-gray-700 hover:text-[#CF4E29] duration-200 cursor-pointer">
          <FaTruck className="mr-3" />
          <span>Motoristas</span>
        </li>
        <li className="flex items-center p-4 hover:bg-gray-700 hover:text-[#CF4E29]   cursor-pointer">
          <div className="mr-3">
            <SubMenu />
          </div>
        </li>
        <li className="flex items-center p-4 hover:bg-gray-700 hover:text-[#CF4E29] duration-200 cursor-pointer">
          <MdLabel className="mr-3" />
          <span>Etiquetas</span>
        </li>
      </ul>
    
    </div>
  );
};

export default SideBar;
