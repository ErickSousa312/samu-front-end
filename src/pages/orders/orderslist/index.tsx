import { useEffect, useState } from "react";
import ModalOrder from "../modalOrder";
import { FaPlusSquare } from "react-icons/fa";
import CreateOrder from "../modalCreateOrder";
import api from "../../../shared/services/api";
import { useToast } from "../../../shared/context/ToastContext";
import { Order } from "../../../@types";
import { useAuth } from "../../../shared/context/AuthContext/AuthProvider";
import InputSearch from "../../../shared/components/inputs/InputSearch";

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<Order[]>("/orders");
        if (user && user.role === "customer") {
          const userOrders = response.data.filter(order => order.email === user.email);
          setOrders(userOrders);
        } else {
          setOrders(response.data);
        }
      } catch (err) {
        console.log(err);
      } 
    };
  
    fetchOrders();
  }, [user]);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Entregue":
        return "bg-green-500 text-white";
      case "Pendente":
        return "bg-yellow-500 text-black";
      case "Cancelado":
        return "bg-red-500 text-white";
      default:
        return "bg-white text-black";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearchTerm = order.userName.toLowerCase().includes(searchTerm.toLowerCase()) || order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true;
    return matchesSearchTerm && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfFirstOrder + ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const openModalCreateOrder = () => {
    setShowCreateOrder(true);
  };

  const closeModalCreateOrder = () => {
    setShowCreateOrder(false);
  };

  const handleEdit = async (updatedOrder: Order) => {
    try {
      addToast({ type: "loading", message: "Aguarde enquanto o pedido é editado.." });
      await api.patch(`/orders/${updatedOrder._id}`, updatedOrder);
      setOrders(orders.map(order => order._id === updatedOrder._id ? updatedOrder : order));
      addToast({ type: "success", message: "Pedido editado com sucesso!" });
      closeModal();
    } catch (err) {
      addToast({ type: "error", message: "Ocorreu um problema ao editar seu pedido." });
      console.error("Erro ao atualizar o pedido", err);
    }
  };

  const handleDelete = async () => {
    if (selectedOrder) {
      try {
        addToast({ type: "loading", message: "Aguarde enquanto o pedido é deletado.." });
        await api.delete(`/orders/${selectedOrder._id}`);
        setOrders(orders.filter(order => order._id !== selectedOrder._id));
        addToast({ type: "success", message: "Pedido deletado com sucesso!" });
        closeModal();
      } catch (err) {
        addToast({ type: "error", message: "Ocorreu um problema ao deletar seu pedido." });
        console.error("Erro ao deletar o pedido", err);
      }
    }
  };

  if (!user) {
    return null;
  }

  const isClient = user.role === "customer";

  return (
    <div className="p-1 md:p-8 w-full">
      {!user || user.role !== "customer" ? (
        <button
          className="flex justify-center items-center font-semibold text-center text-white border-amber-600 hover:text-black border-2 mt-4 md:mt-0 self-start hover:bg-amber-600 hover:-translate-y-1 p-2 mx-4 rounded-xl w-40 duration-300"
          onClick={openModalCreateOrder}
        >
          Criar Pedido <FaPlusSquare className="ml-2" />
        </button>
      ) : null}

    <div className="my-8">
        <InputSearch
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          selectedStatus={selectedStatus}
          onStatusChange={(e) => setSelectedStatus(e.target.value)}
        />
      </div>


      <div className="flex flex-wrap justify-center items-center gap-4 p-4 w-full">
      {currentOrders.map((order) => (
          <div
            key={order._id}
            className="bg-[#3d3d3d] p-4 rounded flex-col flex md:flex-row items-center justify-between text-white shadow-md w-full cursor-pointer hover:-translate-y-1 hover:opacity-70 duration-200"
            onClick={() => openModal(order)}
          >
            <div className="flex flex-col">
              <h3 className="text-sm md:text-lg font-bold">Pedido #{order._id}</h3>
              <p className="text-sm md:text-lg"><strong>Endereço:</strong> {order.address}</p>
            </div>
            <p className={`${getStatusColorClass(order.status)} text-sm md:text-base  flex justify-center w-full md:w-24 items-center m-2 rounded-full h-10 md:h-12`}>
              {order.status}
            </p>
          </div>
        ))}

      </div>

      <div className="flex justify-between w-full items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Anterior
        </button>
        <span className="text-white">Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Próxima
        </button>
      </div>

      {showCreateOrder && (
        <CreateOrder onClose={closeModalCreateOrder} />
      )}

      {showModal && selectedOrder && (
        <ModalOrder
          order={selectedOrder}
          onClose={closeModal}
          isClient={isClient}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default OrdersList;
