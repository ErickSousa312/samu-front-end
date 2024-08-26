import { useEffect, useState } from "react";
import api from "../../../shared/services/api";
import { OrderMl } from "../../../@types";
import { useAuth } from "../../../shared/context/AuthContext/AuthProvider";
import InputSearch from "../../../shared/components/inputs/InputSearch";
import ModalOrderML from "../ModalOrderML";
import { FaQrcode } from "react-icons/fa";
import QRCode from "qrcode.react";

const OrderListFreeMarket = () => {
  const [orders, setOrders] = useState<OrderMl[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderMl | null>(null);
  const [selectedQrCode, setSelectedQrCode] = useState<OrderMl | null>(null);
  const [showModalQrCode, setShowModalQrCode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<OrderMl[]>("/api-ml/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Erro ao carregar os pedidos", err);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const statusMap: { [key: string]: string } = {
    paid: "Pago",
    not_delivered: "Não Entregue",
    test_order: "Teste",
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500 text-white";
      case "not_delivered":
        return "bg-yellow-500 text-black";
      case "test_order":
        return "bg-blue-500 text-white";
      default:
        return "bg-white text-black";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearchTerm = order.buyer?.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus ? order.buyer?.nickname.includes(selectedStatus) : true;
    return matchesSearchTerm && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleOrderClick = (order: OrderMl) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const openModalQrCode = (order: OrderMl) => {
    setSelectedQrCode(order);
    setShowModalQrCode(true);
  };

  const closeModalQrCode = () => {
    setSelectedQrCode(null);
    setShowModalQrCode(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-1 md:p-8 w-full">
      <div className="my-8">
        <InputSearch
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          selectedStatus={selectedStatus}
          onStatusChange={(e) => setSelectedStatus(e.target.value)}
          select={false}
        />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 p-4 w-full">
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleOrderClick(order)}
              className="bg-[#3d3d3d] p-4 rounded flex-col flex md:flex-row items-center justify-between text-white shadow-md w-full cursor-pointer hover:-translate-y-1 hover:opacity-70 duration-200"
            >
              <div className="flex flex-col">
                <h3 className="text-sm md:text-lg font-bold">Pedido #{order.id}</h3>
                <p className="text-sm md:text-lg">
                  <strong>Preço Pago:</strong> {order.paid_amount}
                </p>
                <p className="text-sm md:text-lg">
                  <strong>Preço Produto:</strong> {order.total_amount}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {order.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`${getStatusColorClass(tag)} text-sm md:text-base flex justify-center items-center px-3 py-1 rounded-full`}
                  >
                    {statusMap[tag] || tag}
                  </span>
                ))}
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
          ))
        ) : (
          <p className="text-white">Nenhum pedido encontrado</p>
        )}
      </div>

      <div className="flex justify-between w-full items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Anterior
        </button>
        <span className="text-white">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Próxima
        </button>
      </div>

      {isModalOpen && selectedOrder && (
        <ModalOrderML
          order={selectedOrder}
          onClose={handleCloseModal}
        />
      )}

    {showModalQrCode && selectedQrCode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg flex flex-col justify-center items-center">
            <h2 className="text-lg font-bold mb-4">QR Code do Pedido #{selectedQrCode.id}</h2>
            <QRCode
              size={340}
              className="my-4"
              value={`https://api.helpdesk-maraba.cloud/api-ml/pdf/orders/${selectedQrCode.id}/${user.email}`}
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

export default OrderListFreeMarket;
