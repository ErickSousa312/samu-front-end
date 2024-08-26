import { useState, useEffect, useRef, MouseEvent } from 'react';
import { IoIosArrowDown } from "react-icons/io";

interface DropdownProps {
  name: string;
  options: { email: string; id: string }[];
  onSelect: (user: { email: string; id: string }) => void;
  initialSelectedItem?: { email: string; id: string };
  loading: boolean;
  disabled?: boolean;
}

const Dropdown = ({
  name,
  options,
  onSelect,
  initialSelectedItem,
  loading,
  disabled,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<{ email: string; id: string } | null>(initialSelectedItem || null);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent<Document | Window>) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside as unknown as EventListener);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener);
    };
  }, []);

  const handleItemSelect = (item: { email: string; id: string }) => {
    setSelectedItem(item);
    setIsOpen(false);
    onSelect(item);
  };

  useEffect(() => {
    if (initialSelectedItem) {
      setSelectedItem(initialSelectedItem);
    }
  }, [initialSelectedItem]);

  return (
    <div className='relative inline-block justify-center items-center ' ref={selectRef}>
      <button
        onClick={toggleDropdown}
        disabled={loading || disabled}
        className='mt-1 bg-transparent flex items-center justify-center text-white p-2 border rounded w-[16vw] h-[44px]'
      >
        {loading ? 'Loading...' : (selectedItem ? selectedItem.email : name)}
        <IoIosArrowDown  size={16}/>
      </button>
      {isOpen && (
        <div className='absolute z-10 w-full mt-2  bg-white border  border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
          <ul className='py-1'>
            {options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleItemSelect(option)}
                  className='px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer'
                >
                  {option.email}
                </li>
              ))
            ) : (
              <li className='px-4 py-2 text-gray-700'>No options available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};


export default Dropdown;
