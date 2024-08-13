/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { MdAssignmentAdd } from 'react-icons/md';

const SubMenu = () => {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [submenuOpenState, setSubmenuOpenState] = useState<{ [key: number]: boolean }>({});

  const handleButtonClick = (buttonIndex: number): void => {
    setActiveButton(buttonIndex);
    setSubmenuOpenState((prevState) => ({
      ...prevState,
      [buttonIndex]: !prevState[buttonIndex],
    }));
  };

  return (
    <div className="space-y-2">
      <div className={`flex justify-between items-center cursor-pointer hover:text-[#CF4E29] duration-200  ${submenuOpenState[1] ? ' ' : ''}`} onClick={() => handleButtonClick(1)}>
        <div className='flex items-center '>
        <MdAssignmentAdd className="mr-3" />
        <span>Cadastrar</span>
        </div>
        <button className={`text-sm font-bold  ${submenuOpenState[1] ? 'rotate-180' : ''}`}>
          {submenuOpenState ? '▲' : '▼'}
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${submenuOpenState[1] ? 'h-auto' : 'h-0'}`}>
          <div className="flex items-center gap-2 px-6 py-2 cursor-pointer">
            <button>Motorista</button>        
          </div>
          <div className="flex items-center gap-2 px-6 py-2 cursor-pointer">
            <button>Cliente</button>          
          </div>
      </div>
    </div>
  );
};

export default SubMenu;
