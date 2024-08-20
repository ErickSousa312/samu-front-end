import { ChangeEventHandler } from "react";

interface InputSearchProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  selectedStatus: string;
  onStatusChange: ChangeEventHandler<HTMLSelectElement>; // Handler para o select
}

const InputSearch = ({ value, onChange, selectedStatus, onStatusChange }: InputSearchProps) => {
  return (
    <div className=" flex flex-col md:flex-row md:flex items-center p-2 px-4 md:px-0 mx-4 space-x-6 bg-white hover:shadow-lg hover:shadow-orange-500 rounded-xl duration-300">
      <div className="flex bg-gray-100 p-4 w-[90%] space-x-4 rounded-lg cursor-text">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="bg-gray-100 outline-none w-full"
          type="text"
          placeholder="Pesquise por email ou nome.."
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="flex py-3 px-1 md:px-4 w-[20vw] md:w-[14vw] rounded-lg text-gray-500 font-semibold cursor-pointer">
        <select
          value={selectedStatus}
          onChange={onStatusChange}
          className="bg-white text-blac font-semibold border focus:outline-none border-amber-300 rounded-md p-1 md:p-2"
        >
          <option value="" className="">Todos</option>
          <option value="Entregue">Entregue</option>
          <option value="Pendente">Pendente</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
    </div>
  );
};

export default InputSearch;
