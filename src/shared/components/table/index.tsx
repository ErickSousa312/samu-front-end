import { useEffect, useState } from "react";
import api from "../../../shared/services/api";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext/AuthProvider";
import { useToast } from "../../context/ToastContext";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: "customer" | "driver" | "admin";
}

interface TableProps {
  role: "customer" | "driver" | "admin";
}

const Table = ({ role }: TableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const getRoleLabel = (userRole: User["role"]) => {
    switch (userRole) {
      case "driver":
        return "motorista";
      case "admin":
        return "administrador";
      default:
        return "cliente";
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        const users = response.data;

        const filteredUsers = users.filter((user: User) => user.role === role);
        setUsers(filteredUsers);

        setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, [role, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      const roleLabel = getRoleLabel(selectedUser.role);
      try {
        addToast({
          type: "loading",
          message: `Aguarde enquanto o ${roleLabel} é deletado..`,
        });
        await api.delete(`/users/${selectedUser._id}`);
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        addToast({
          type: "success",
          message: `${roleLabel.charAt(0).toUpperCase() + roleLabel.slice(1)} deletado com sucesso!`,
        });
        closeDeleteModal();
      } catch (error) {
        addToast({
          type: "error",
          message: `Ocorreu um problema ao deletar o ${roleLabel}.`,
        });
        console.error("Erro ao excluir usuário:", error);
      }
    }
  };

  const handleEdit = async () => {
    if (selectedUser) {
      const roleLabel = getRoleLabel(selectedUser.role);
      try {
        addToast({
          type: "loading",
          message: `Aguarde enquanto o ${roleLabel} é editado..`,
        });

        const updateUser = {
          ...selectedUser,
          username: (
            document.getElementById("edit-username") as HTMLInputElement
          ).value,
          email: (document.getElementById("edit-email") as HTMLInputElement)
            .value,
        };

        await api.patch(`/users/${updateUser._id}`, updateUser);
        setUsers(
          users.map((user) =>
            user._id === updateUser._id ? updateUser : user,
          ),
        );
        addToast({
          type: "success",
          message: `${roleLabel.charAt(0).toUpperCase() + roleLabel.slice(1)} editado com sucesso!`,
        });
        closeEditModal();
      } catch (err) {
        addToast({
          type: "error",
          message: `Ocorreu um problema ao editar o ${roleLabel}.`,
        });
        console.error("Erro ao atualizar o cliente", err);
      }
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-white uppercase bg-amber-600">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nome do {user?.role === "customer" ? "Cliente" : "Motorista"}
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            {user?.role === "admin" && (
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((users) => (
            <tr
              key={users._id}
              className="border-b border-amber-600 bg-[#121212] hover:bg-slate-50 dark:hover:bg-slate-600"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white"
              >
                {users.username}
              </th>
              <td className="px-6 py-4">{users.email}</td>
              {user?.role === "admin" && (
                <td className="px-6 py-4 flex gap-2">
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => openEditModal(users)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => openDeleteModal(users)}
                  />
                </td>
              )}
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr className="border-b bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-600">
              <td colSpan={3} className="px-6 py-4 text-center text-slate-500">
                Nenhum {role === "customer" ? "cliente" : "motorista"}{" "}
                encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>

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

      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg flex flex-col justify-center items-center">
            <h2 className="text-lg font-bold mb-4">
              Tem certeza que deseja excluir {selectedUser.username}?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white p-2 rounded"
              >
                Sim, excluir
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Editar Usuário</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="edit-username"
                  defaultValue={selectedUser.username}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="edit-email"
                  defaultValue={selectedUser.email}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
