import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext/AuthProvider";
import { LuPackageSearch } from "react-icons/lu";
import { FaTruck } from "react-icons/fa";
import { MdLabel } from "react-icons/md";
import { BiSolidObjectsVerticalCenter } from "react-icons/bi";
import SubMenu from "../submenu";

const SideBar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:w-96 hidden lg:block md:fixed top-0 left-0 h-full bg-[#121212] text-white z-50 border-[#88493877] border-r transition-transform duration-300">
        <div className="p-4 px-12 text-xl font-bold">Dashboard</div>
        <ul className="mt-4 px-2">
          {(user?.role === 'admin') && (
            <Link
              to="/logistic"
              className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer"
            >
              <BiSolidObjectsVerticalCenter size={32} className="mr-3" />
              <span className="text-xl">Logística</span>
            </Link>
          )}
          {(user?.role === 'admin' || user?.role === 'driver' || user?.role === 'customer') && (
            <Link
              to="/orders"
              className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer"
            >
              <LuPackageSearch size={32} className="mr-3" />
              <span className="text-xl">Pedidos</span>
            </Link>
          )}
          {(user?.role === 'admin' || user?.role === 'driver') && (
            <Link
              to="/drivers"
              className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer"
            >
              <FaTruck size={32} className="mr-3" />
              <span className="text-xl">Motoristas</span>
            </Link>
          )}
          {(user?.role === 'admin' ) && (
            <li className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 cursor-pointer">
              <div className="mr-3">
                <SubMenu />
              </div>
            </li>
          )}
          {(user?.role === 'admin' || user?.role === 'driver') && (
            <Link
              to="/labels"
              className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer"
            >
              <MdLabel size={32} className="mr-3" />
              <span className="text-xl">Etiquetas</span>
            </Link>
          )}
        </ul>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 text-white"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

          {isOpen && (
            <div className={`fixed top-0 pt-8 left-0 w-full bg-[#121212] text-white z-50 transition-transform duration-300 ${isOpen ? 'translate-y-0' : '-translate-y-full'} lg:hidden`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden absolute self-end top-4 right-4 z-50 text-white"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
            <ul className="p-4">
              {(user?.role === 'admin') && (
                <Link
                  to="/logistic"
                  className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer"
                >
                  <BiSolidObjectsVerticalCenter size={32} className="mr-3" />
                  <span className="text-xl">Logística</span>
                </Link>
              )}
              {(user?.role === 'admin' || user?.role === 'driver' || user?.role === 'customer') && (
                <Link
                  to="/orders"
                  className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer"
                >
                  <LuPackageSearch size={32} className="mr-3" />
                  <span className="text-xl">Pedidos</span>
                </Link>
              )}
              {(user?.role === 'admin' || user?.role === 'driver') && (
                <Link
                  to="/drivers"
                  className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer"
                >
                  <FaTruck size={32} className="mr-3" />
                  <span className="text-xl">Motoristas</span>
                </Link>
              )}
              {(user?.role === 'admin' ) && (
                <li className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 cursor-pointer">
                  <div className="mr-3">
                    <SubMenu />
                  </div>
                </li>
              )}
              {(user?.role === 'admin' || user?.role === 'driver') && (
                <Link
                  to="/labels"
                  className="flex items-center p-4 hover:bg-amber-600 hover:text-black rounded-xl my-2 hover:font-bold duration-200 cursor-pointer"
                >
                  <MdLabel size={32} className="mr-3" />
                  <span className="text-xl">Etiquetas</span>
                </Link>
              )}
            </ul>
          </div>
          )}

    </>
  );
};

export default SideBar;
