import { LuPackageSearch } from "react-icons/lu";
import { FaTruck } from "react-icons/fa";
import { MdLabel } from "react-icons/md";
import { BiSolidObjectsVerticalCenter } from "react-icons/bi";
import SubMenu from "../submenu";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className=" w-96 border-[#88493877] border-r bg-[#121212] text-white">
      <div className="p-4 px-12 text-xl font-bold ">Dashboard</div>
      <ul className="mt-4 px-2 ">
        <Link to="/logistic" className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer">
          <BiSolidObjectsVerticalCenter size={32} className="mr-3" />
          <span className="text-xl">Logistica</span>
        </Link>
        <Link to="/orders" className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl  my-2 hover:font-bold duration-200 cursor-pointer">
          <LuPackageSearch size={32} className="mr-3" />
          <span  className="text-xl">Pedidos</span>
        </Link>
        <Link to="/drivers" className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl  my-2 hover:font-bold duration-200 cursor-pointer">
          <FaTruck size={32} className="mr-3" />
          <span  className="text-xl">Motoristas</span>
        </Link>
        <li className="flex items-center p-4 hover:-pr-8 hover:bg-amber-600 hover:text-black rounded-xl hover:font-bold  my-2 cursor-pointer">
          <div className="mr-3">
            <SubMenu />
          </div>
        </li>
        <Link to="/labels" className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl  my-2 hover:font-bold duration-200 cursor-pointer">
          <MdLabel size={32} className="mr-3" />
          <span className="text-xl">Etiquetas</span>
        </Link>
      </ul>
    
    </div>
  );
};

export default SideBar;
