import { useEffect, useState } from "react";
import { Order } from "../../../@types";

interface ModalOrderProps {
  order: Order | null;
  isClient: boolean; // Nova propriedade para indicar se o usuário é um cliente
  onClose: () => void;
  onEdit: (updatedOrder: Order) => Promise<void>;
  onDelete: () => Promise<void>;
}

const ModalOrder = ({ order, isClient, onClose, onEdit, onDelete }: ModalOrderProps) => {
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (order) {
      setEditedOrder(order);
    }
  }, [order]);

  const handleSave = () => {
    if (editedOrder) {
      onEdit(editedOrder);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative m-16 bg-white">
        <span className="absolute py-1 px-3 -left-8 -top-2 -rotate-[10deg] border border-black black_border bg-amber-600 text-white font-bold">
          Seu Pedido!
        </span>
        <div className="purple_border p-8 border border-black">
          <h3 className="text-lg font-bold mb-4">Detalhes do Pedido ID: {order._id}</h3>
          <div>
            <label><strong>Cliente:</strong></label>
            <input
              type="text"
              value={editedOrder?.userName || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, userName: e.target.value } as Order)}
              readOnly={isClient}
              className={isClient ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Status:</strong></label>
            <input
              type="text"
              value={editedOrder?.status || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value } as Order)}
              readOnly={isClient}
              className={isClient ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Endereço:</strong></label>
            <input
              type="text"
              value={editedOrder?.address || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, address: e.target.value } as Order)}
              readOnly={isClient}
              className={isClient ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Preço:</strong></label>
            <input
              type="text"
              value={editedOrder?.price || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, price: parseFloat(e.target.value) } as Order)}
              readOnly={isClient}
              className={isClient ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Plano:</strong></label>
            <input
              type="text"
              value={editedOrder?.plano || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, plano: e.target.value } as Order)}
              readOnly={isClient}
              className={isClient ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Telefone:</strong></label>
            <input
              type="text"
              value={editedOrder?.phone || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, phone: e.target.value } as Order)}
              readOnly={isClient}
              className={isClient ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Email:</strong></label>
            <input
              type="text"
              value={editedOrder?.email || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, email: e.target.value } as Order)}
              readOnly={isClient}
              className={isClient ? `input-field-client` : `input-field`}
            />
          </div>

          <div className="flex justify-end mt-4 gap-2">
            {!isClient && (
              <>
                <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
                  Editar
                </button>
                <button onClick={onDelete} className="bg-red-500 text-white p-2 rounded">
                  Deletar
                </button>
              </>
            )}
            <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalOrder;
