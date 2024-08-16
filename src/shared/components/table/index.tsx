import { useEffect, useState } from "react";
import api from "../../../shared/services/api";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
}

interface TableProps {
    role: string;
}

const Table = ({ role }: TableProps) => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/users');
        const users = response.data;

        const customersList = users.filter((user: { role: string }) => user.role === role);
        setCustomers(customersList);

        // Calcula o total de páginas
        setTotalPages(Math.ceil(customersList.length / itemsPerPage));
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchCustomers();
  }, [role, itemsPerPage]);

  // Calcula os dados da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

  // Funções de navegação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative overflow-x-auto w-[50vw] shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-300">
        <thead className="text-xs text-white uppercase bg-amber-600">
          <tr>
            <th scope="col" className="px-6 py-3">Nome do Cliente</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((customer) => (
            <tr key={customer._id} className="border-b border-amber-600 bg-[#121212] hover:bg-slate-50 dark:hover:bg-slate-600">
              <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                {customer.username}
              </th>
              <td className="px-6 py-4">{customer.email}</td>
              <td className="px-6 py-4 text-right">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</a>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr className="border-b bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-600">
              <td colSpan={3} className="px-6 py-4 text-center text-slate-500">Nenhum cliente encontrado</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Controles de Paginação */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Anterior
        </button>
        <span className="text-white">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default Table;
