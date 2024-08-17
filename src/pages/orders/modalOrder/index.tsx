import { useEffect, useState } from "react";
import { Order } from "../../../@types";

interface ModalOrderProps {
  order: Order | null;
  isClient?: boolean; // Agora opcional
  readOnly?: boolean; // Nova propriedade para tornar os campos somente leitura
  onClose: () => void;
  onEdit?: (updatedOrder: Order) => Promise<void>; // Agora opcional
  onDelete?: () => Promise<void>; // Agora opcional
}

const ModalOrder = ({ order, isClient = false, readOnly = false, onClose, onEdit, onDelete }: ModalOrderProps) => {
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (order) {
      setEditedOrder(order);
    }
  }, [order]);

  const handleSave = () => {
    if (editedOrder && onEdit) {
      onEdit(editedOrder);
    }
  };

  if (!order) return null;

  // Se readOnly for verdadeiro, todos os campos serão somente leitura
  const isFieldReadOnly = readOnly || isClient;

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
              readOnly={isFieldReadOnly}
              className={isFieldReadOnly ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Status:</strong></label>
            <select
              value={editedOrder?.status || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value } as Order)}
              disabled={isFieldReadOnly}
              className={isFieldReadOnly ? `input-field-client` : `input-field`}
            >
              <option value="Entregue">Entregue</option>
              <option value="Pendente">Pendente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label><strong>Endereço:</strong></label>
            <input
              type="text"
              value={editedOrder?.address || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, address: e.target.value } as Order)}
              readOnly={isFieldReadOnly}
              className={isFieldReadOnly ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Preço:</strong></label>
            <input
              type="text"
              value={editedOrder?.price || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, price: parseFloat(e.target.value) } as Order)}
              readOnly={isFieldReadOnly}
              className={isFieldReadOnly ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Plano:</strong></label>
            <input
              type="text"
              value={editedOrder?.plano || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, plano: e.target.value } as Order)}
              readOnly={isFieldReadOnly}
              className={isFieldReadOnly ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Telefone:</strong></label>
            <input
              type="text"
              value={editedOrder?.phone || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, phone: e.target.value } as Order)}
              readOnly={isFieldReadOnly}
              className={isFieldReadOnly ? `input-field-client` : `input-field`}
            />
          </div>
          <div>
            <label><strong>Email:</strong></label>
            <input
              type="text"
              value={editedOrder?.email || ""}
              onChange={(e) => setEditedOrder({ ...editedOrder, email: e.target.value } as Order)}
              readOnly={isFieldReadOnly}
              className={isFieldReadOnly ? `input-field-client` : `input-field`}
            />
          </div>

          <div className="flex justify-end mt-4 gap-2">
            {!isFieldReadOnly && (
              <>
                {onEdit && (
                  <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button onClick={onDelete} className="bg-red-500 text-white p-2 rounded">
                    Deletar
                  </button>
                )}
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
