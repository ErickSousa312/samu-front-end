import { useEffect, useState } from "react";
import api from "../../../shared/services/api";
import { Order } from "../../../@types";
import { useAuth } from "../../../shared/context/AuthContext/AuthProvider";
import QRCode from "qrcode.react";
import { FaQrcode } from "react-icons/fa";
import InputSearch from "../../../shared/components/inputs/InputSearch";
import ModalOrder from "../../orders/modalOrder";

const OrderLabels = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedQrCode, setSelectedQrCode] = useState<Order | null>(null);
  const [showModalQrCode, setShowModalQrCode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<Order[]>('/orders');
        const deliveredOrders = response.data.filter(order => order.status === "Entregue");
        if (user && user.role === "customer") {
          const userOrders = deliveredOrders.filter(order => order.email === user.email);
          setOrders(userOrders);
        } else {
          setOrders(deliveredOrders);
        }
      } catch (err) {
        setError("Erro ao carregar os pedidos");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="text-white flex gap-2">Carregando...<div className="mr-2 animate-spin border-4 border-t-transparent border-white rounded-full w-5 h-5"></div></div>;
  if (error) return <p>{error}</p>;

  const filteredOrders = orders.filter(order => {
    const matchesSearchTerm = order.userName.toLowerCase().includes(searchTerm.toLowerCase()) || order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true;
    return matchesSearchTerm && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfFirstOrder + ordersPerPage);


  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const openModalQrCode = (order: Order) => {
    setSelectedQrCode(order);
    setShowModalQrCode(true);
  };

  const closeModalQrCode = () => {
    setSelectedQrCode(null);
    setShowModalQrCode(false);
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-0 md:p-8 w-full">

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
            <div className="flex items-center w-full md:w-44">
              <p className="bg-green-500 text-sm md:text-base  flex justify-center w-full md:w-24 items-center m-2 rounded-full h-10 md:h-12">
                {order.status}
              </p>
              <FaQrcode
                className="text-white cursor-pointer"
                size={24}
                onClick={(e) => {
                  e.stopPropagation();
                  openModalQrCode(order);
                }}
              />
            </div>
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
      </div>

      {showModal && selectedOrder && (
        <ModalOrder
          order={selectedOrder}
          onClose={closeModal}
          readOnly
        />
      )}

      {showModalQrCode && selectedQrCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg flex flex-col justify-center items-center">
            <h2 className="text-lg font-bold mb-4">QR Code do Pedido #{selectedQrCode._id}</h2>
            <QRCode
              size={340}
              className="my-4"
              value={`https://libras.helpdesk-maraba.cloud/pdf/${selectedQrCode._id}`}
            />
            <button
              onClick={closeModalQrCode}
              className="mt-4 bg-red-500 text-white p-2 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderLabels;
