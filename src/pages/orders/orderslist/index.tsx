import { useEffect, useState } from "react";
import axios from "axios";
import ModalOrder from "../modalOrder";
import { FaPlusSquare } from "react-icons/fa";
import CreateOrder from "../modalCreateOrder";
import api from "../../../shared/services/api";

interface Order {
  _id: string;
  status: string;
  userName: string;
  address: string;
  price: number;
  plano: string;
  phone: string;
  email: string;
}

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<Order[]>(`/admin/orders/all`);
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

  if (loading) return <p>Carregando...</p>;
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

  const handleEdit = () => {
    // Implementar lógica para editar o pedido
    console.log("Editar pedido", selectedOrder);
    closeModal();
  };

  const handleEmitLabel = () => {
    // Implementar lógica para emitir etiqueta
    console.log("Emitir etiqueta para pedido", selectedOrder);
    closeModal();
  };

  return (
    <>
      <button className="flex justify-center items-center font-semibold text-center text-white border-amber-600 hover:text-black border-2 self-start mx-12 hover:bg-amber-600 hover:-translate-y-1 p-2 rounded-xl w-40 duration-300" onClick={openModalCreateOrder}>Criar Pedido <FaPlusSquare className="ml-2 " /></button>
      <div className="flex flex-wrap justify-center items-center gap-4 p-4 w-full">
        {currentOrders.map((order) => (
          <div
            key={order._id}
            className="bg-[#3d3d3d] p-4 rounded flex items-center justify-between text-white shadow-md w-full cursor-pointer"
            onClick={() => openModal(order)}
          >
            <div className="flex flex-col">
            <h3 className="text-lg font-bold">Pedido #{order._id}</h3>
            <p><strong>Endereço:</strong> {order.address}</p>
            </div>
    
            <p className="bg-green-500 flex justify-center items-center p-4 rounded-full h-12 ">{order.status}</p>
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
          <CreateOrder 
            onClose={closeModalCreateOrder}
          />
        )}

        {showModal && selectedOrder && (
          <ModalOrder
            order={selectedOrder}
            onClose={closeModal}
            onEdit={handleEdit}
            onEmitLabel={handleEmitLabel}
          />
        )}
      </div>
    </>
    
  );
};

export default OrdersList;
