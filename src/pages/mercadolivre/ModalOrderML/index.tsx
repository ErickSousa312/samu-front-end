import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { OrderMl } from "../../../@types";
import api from "../../../shared/services/api";
import ModalOrderItems from "../ModalOrderItems";
import ModalShippingDetails from "../ModalShippingDetails";

interface ModalOrderProps {
  order: OrderMl | null;
  onClose: () => void;
  onEdit?: (updatedOrder: OrderMl) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const ModalOrderML = ({ order, onClose, onEdit, onDelete }: ModalOrderProps) => {
  const [editedOrder, setEditedOrder] = useState<OrderMl | null>(null);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState<boolean>(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState<boolean>(false);
  const [shippingDetails, setShippingDetails] = useState<any>(null);

  const tagMap: { [key: string]: string } = {
    paid: "Pago",
    not_delivered: "Não Entregue",
    test_order: "Teste",
  };

  const fields = [
    { key: 'total_amount', label: 'Valor Total', type: 'text' },
    { key: 'tags', label: 'Tags', type: 'select', options: tagOptions },
    { key: 'paid_amount', label: 'Valor Pago', type: 'text' },
    { key: 'buyerNickname', label: 'Nome do Comprador', type: 'text' },
    { key: 'date_created', label: 'Data de Criação', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'shipping_cost', label: 'Custo de Envio', type: 'text' },
  ];

  useEffect(() => {
    if (order) {
      setEditedOrder(order);
    }
  }, [order]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get<OrderMl[]>("/api-ml/orders");
        const tagsSet = new Set<string>();
        response.data.forEach(order => {
          order.tags?.forEach(tag => {
            const translatedTag = tagMap[tag] || tag;
            tagsSet.add(translatedTag);
          });
        });
        setTagOptions(Array.from(tagsSet));
      } catch (err) {
        console.error("Erro ao carregar as tags", err);
      }
    };
    fetchTags();
  }, []);

  const handleSave = async () => {
    if (editedOrder && onEdit) {
      await onEdit(editedOrder);
    }
  };

  const handleShowItemsModal = () => {
    setIsItemsModalOpen(true);
  };

  const handleCloseItemsModal = () => {
    setIsItemsModalOpen(false);
  };

  const handleShowShippingModal = async () => {
  
    if (order && order.shipping.id) {
      try {
        const response = await api.get(`https://api.helpdesk-maraba.cloud/api-ml/shipments/${order.shipping.id}`);
        setShippingDetails(response.data);
        setIsShippingModalOpen(true);
      } catch (err) {
        console.error("Erro ao carregar detalhes do envio", err);
      }
    } 
  };

  const handleCloseShippingModal = () => {
    setIsShippingModalOpen(false);
  };

  if (!order) return null;

  const isFieldReadOnly = true;

  const handleChange = <K extends keyof OrderMl>(key: K, value: OrderMl[K]) => {
    if (editedOrder) {
      setEditedOrder({ ...editedOrder, [key]: value } as OrderMl);
    }
  };

  const getValue = <K extends keyof OrderMl>(key: K) => {
    if (key === 'buyerNickname') {
      return editedOrder?.buyer?.nickname || '';
    }
    if (key === 'date_created') {
      return editedOrder?.date_created ? format(new Date(editedOrder.date_created), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) : '';
    }
    if (key === 'tags') {
      return (editedOrder?.tags || []).join(', ');
    }
    return editedOrder ? editedOrder[key] || '' : '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative m-16 bg-white max-w-lg w-full">
        <span className="absolute py-1 px-3 -left-8 -top-2 -rotate-[10deg] border border-black black_border bg-amber-600 text-white font-bold">
          Seu Pedido!
        </span>
        <div className="purple_border p-8 border border-black">
          <h3 className="text-lg font-bold mb-4">Detalhes do Pedido ID: {order.id}</h3>
          <div className="grid grid-cols-2 gap-4">
            {fields.map(({ key, label, type, options }) => (
              <div key={key} className="mb-4">
                <label><strong>{label}:</strong></label>
                {type === 'select' ? (
                  <select
                    value={getValue(key as keyof OrderMl)}
                    onChange={(e) => handleChange(key as keyof OrderMl, e.target.value as OrderMl[typeof key])}
                    disabled={isFieldReadOnly}
                    className="input-field-client"
                  >
                    {options?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={type === 'text' ? getValue(key as keyof OrderMl) : ''}
                    onChange={(e) => handleChange(key as keyof OrderMl, type === 'text' ? e.target.value as OrderMl[typeof key] : e.target.value || '')}
                    readOnly={isFieldReadOnly}
                    className="input-field-client"
                  />
                )}
              </div>
            ))}

            <div className="col-span-2 mt-4 flex justify-center gap-2">
              <button onClick={handleShowItemsModal} className="bg-green-500 text-white p-2 rounded">
                Detalhes do Pedido
              </button>
              <button onClick={handleShowShippingModal} className="bg-blue-500 text-white p-2 rounded">
                Detalhes do Envio
              </button>
            </div>
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
      {isItemsModalOpen && (
        <ModalOrderItems items={order.order_items || []} onClose={handleCloseItemsModal} />
      )}
      {isShippingModalOpen && (
        <ModalShippingDetails shippingDetails={shippingDetails} onClose={handleCloseShippingModal} />
      )}
    </div>
  );
};

export default ModalOrderML;
