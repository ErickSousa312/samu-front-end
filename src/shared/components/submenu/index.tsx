/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { MdAssignmentAdd } from "react-icons/md";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

const SubMenu = () => {
  const [submenuOpenState, setSubmenuOpenState] = useState<{
    [key: number]: boolean;
  }>({});

  const handleButtonClick = (buttonIndex: number): void => {
    setSubmenuOpenState((prevState) => ({
      ...prevState,
      [buttonIndex]: !prevState[buttonIndex],
    }));
  };

  return (
    <div className="space-y-2 w-full ">
      <div
        className={`flex justify-around items-center cursor-pointer  duration-200  ${submenuOpenState[1] ? " " : ""}`}
        onClick={() => handleButtonClick(1)}
      >
        <div className="flex items-center ">
          <MdAssignmentAdd size={32} className="mr-3" />
          <span className="text-xl ">Cadastrar</span>
        </div>
        <button
          className={`text-sm font-bold ml-20  ${submenuOpenState[1] ? "rotate-180" : ""}`}
        >
          {submenuOpenState ? (
            <IoIosArrowDown size={20} />
          ) : (
            <IoIosArrowUp size={20} />
          )}
        </button>
      </div>
      <div
        className={`overflow-hidden  transition-all duration-300 ${submenuOpenState[1] ? "h-auto " : "h-0"}`}
      >
        <Link
          to="/registerdriver"
          className="flex items-center gap-2 px-6 py-2 cursor-pointer"
        >
          <span className="border-l-2 px-2 hover:scale-105">Motorista</span>
        </Link>
        <Link
          to="/registerclient"
          className="flex items-center gap-2 px-6 py-2 cursor-pointer"
        >
          <span className="border-l-2 px-2 hover:scale-105">Cliente</span>
        </Link>
      </div>
    </div>
  );
};

export default SubMenu;
