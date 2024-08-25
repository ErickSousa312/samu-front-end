import { useEffect, useState } from "react";
import { Order } from "../../../@types";

interface ModalOrderProps {
  order: Order | null;
  isClient?: boolean;
  readOnly?: boolean;
  onClose: () => void;
  onEdit?: (updatedOrder: Order) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const fields = [
  { key: 'userName', label: 'Cliente', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Entregue', 'Pendente', 'Cancelado'] },
  { key: 'address', label: 'Endereço', type: 'text' },
  { key: 'price', label: 'Preço', type: 'text' },
  { key: 'plano', label: 'Plano', type: 'select', options: [
    "Mercado Livre Flex",
    "Mercado Livre Flex Turbo",
    "Serviços Particular"
  ] },
  { key: 'phone', label: 'Telefone', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'deliveryDate', label: 'Data do Pedido', type: 'date' },
];

const ModalOrder = ({ order, isClient = false, readOnly = false, onClose, onEdit, onDelete }: ModalOrderProps) => {
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (order) {
      setEditedOrder(order);
    }
  }, [order]);

  const handleSave = async () => {
    if (editedOrder && onEdit) {
      await onEdit(editedOrder);
    }
  };

  if (!order) return null;

  const isFieldReadOnly = readOnly || isClient;

  const handleChange = (key: keyof Order, value: any) => {
    if (editedOrder) {
      if (key === 'deliveryDate') {
        // Para campos de data, manter o valor como string no formato 'YYYY-MM-DD'
        setEditedOrder({ ...editedOrder, [key]: value } as Order);
      } else {
        setEditedOrder({ ...editedOrder, [key]: value } as Order);
      }
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (dateString) {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "" : date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
    return "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative m-16 bg-white max-w-lg w-full">
        <span className="absolute py-1 px-3 -left-8 -top-2 -rotate-[10deg] border border-black black_border bg-amber-600 text-white font-bold">
          Seu Pedido!
        </span>
        <div className="purple_border p-8 border border-black">
          <h3 className="text-lg font-bold mb-4">Detalhes do Pedido ID: {order._id}</h3>
          <div className="grid grid-cols-2 gap-4">
            {fields.map(({ key, label, type, options }) => (
              <div key={key} className="mb-4">
                <label><strong>{label}:</strong></label>
                {type === 'select' ? (
                  <select
                    value={editedOrder?.[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    disabled={isFieldReadOnly}
                    className={isFieldReadOnly ? `input-field-client` : `input-field`}
                  >
                    {options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={type === 'date' ? formatDate(editedOrder?.[key] as string) : editedOrder?.[key] || ""}
                    onChange={(e) => handleChange(key, type === 'text' ? e.target.value : type === 'date' ? e.target.value : parseFloat(e.target.value))}
                    readOnly={isFieldReadOnly}
                    className={isFieldReadOnly ? `input-field-client` : `input-field`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-4 gap-2">
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
