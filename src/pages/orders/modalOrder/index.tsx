import React from "react";

interface ModalOrderProps {
  order: {
    _id: string;
    status: string;
    userName: string;
    address: string;
    price: number;
    plano: string;
    phone: string;
    email: string;
  } | null;
  onClose: () => void;
  onEdit: () => void;
  onEmitLabel: () => void;
}

const ModalOrder: React.FC<ModalOrderProps> = ({ order, onClose, onEdit, onEmitLabel }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-[700px]">
        <h3 className="text-lg font-bold mb-4">Detalhes do Pedido ID: {order._id}</h3>
        <p><strong>Cliente:</strong> {order.userName}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Endereço:</strong> {order.address}</p>
        <p><strong>Preço:</strong> {order.price}</p>
        <p><strong>Plano:</strong> {order.plano}</p>
        <p><strong>Telefone:</strong> {order.phone}</p>
        <p><strong>Email:</strong> {order.email}</p>
        
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onEdit} className="bg-blue-500 text-white p-2 rounded">
            Editar
          </button>
          <button onClick={onEmitLabel} className="bg-green-500 text-white p-2 rounded">
            Emitir Etiqueta
          </button>
          <button onClick={onClose} className="bg-red-500 text-white p-2 rounded">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOrder;
