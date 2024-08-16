import { useEffect, useState } from "react";
import ModalOrder from "../modalOrder";
import { FaPlusSquare } from "react-icons/fa";
import CreateOrder from "../modalCreateOrder";
import api from "../../../shared/services/api";
import { useToast } from "../../../shared/context/ToastContext";
import { Order } from "../../../@types";
import { useAuth } from "../../../shared/context/AuthContext/AuthProvider";


const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const  { addToast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<Order[]>('/orders');
        setOrders(response.data);
      } catch (err) {
        setError("Erro ao carregar os pedidos");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-white flex gap-2">Carregando...<div className="mr-2 animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5"></div></p>;
  if (error) return <p>{error}</p>;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

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

  if(!user) {
    return null
  }

  const isClient = user.role === "customer";

  const handleEdit = async (updatedOrder: Order) => {
    try {
      addToast({ type: "loading", message: "Aguarde enquanto o pedido é editado.." })
      await api.patch(`/orders/${updatedOrder._id}`, updatedOrder);
      setOrders(orders.map(order => order._id === updatedOrder._id ? updatedOrder : order));
      addToast({ type: "success", message: "Pedido editado com sucesso!" })
      closeModal();
    } catch (err) {
      addToast({ type: "error", message: "Ocorreu um problema ao editar seu pedido." })
      console.error("Erro ao atualizar o pedido", err);
    }
  };

  const handleDelete = async () => {
    if (selectedOrder) {
      try {
        addToast({ type: "loading", message: "Aguarde enquanto o pedido é deletado.." })
        await api.delete(`/orders/${selectedOrder._id}`);
        setOrders(orders.filter(order => order._id !== selectedOrder._id));
        addToast({ type: "success", message: "Pedido deletado com sucesso!" })
        closeModal();
      } catch (err) {
        addToast({ type: "error", message: "Ocorreu um problema ao deletar seu pedido." })
        console.error("Erro ao deletar o pedido", err);
      }
    }
  };

  return (
    <div className="p-12">
      <button
        className="flex justify-center items-center font-semibold text-center text-white border-amber-600 hover:text-black border-2 self-start hover:bg-amber-600 hover:-translate-y-1 p-2 mx-4 rounded-xl w-40 duration-300"
        onClick={openModalCreateOrder}
      >
        Criar Pedido <FaPlusSquare className="ml-2" />
      </button>
      <div className="flex flex-wrap justify-center items-center gap-4 p-4 w-full">
        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="bg-[#3d3d3d] p-4 rounded flex items-center justify-between text-white shadow-md w-full cursor-pointer hover:-translate-y-1 hover:opacity-70 duration-200"
            onClick={() => openModal(order)}
          >
            <div className="flex flex-col">
              <h3 className="text-lg font-bold">Pedido #{order._id}</h3>
              <p><strong>Endereço:</strong> {order.address}</p>
            </div>
            <p className="bg-green-500 flex justify-center items-center p-4 rounded-full h-12">
              {order.status}
            </p>
          </div>
        ))}

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
    </div>
  );
};

export default OrdersList;
