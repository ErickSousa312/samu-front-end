import { OrderItem } from "../../../@types";

interface ModalOrderItemsProps {
  items: OrderItem[];
  onClose: () => void;
}

const ModalOrderItems = ({ items, onClose }: ModalOrderItemsProps) => {
  const orderItemFields = [
    { key: 'title', label: 'Título', accessor: 'item.title' },
    { key: 'unit_price', label: 'Preço Unitário', accessor: 'unit_price' },
    { key: 'sale_fee', label: 'Taxa de venda', accessor: 'sale_fee' },
    { key: 'quantity', label: 'Quantidade', accessor: 'quantity' },
    { key: 'full_unit_price', label: 'Valor Total', accessor: 'full_unit_price' },
    { key: 'category_id', label: 'Categoria', accessor: 'item.category_id' },
    { key: 'condition', label: 'Condição', accessor: 'item.condition' },
    { key: 'warranty', label: 'Garantia', accessor: 'item.warranty' }
  ];

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90">
      <div className="relative m-4 md:m-16 bg-white max-w-lg w-full">
        <span className="absolute py-1 px-3 -left-4 md:-left-8 -top-4 md:-top-2 -rotate-[10deg] border border-black black_border bg-amber-600 text-white font-bold">
          Detalhes do pedido
        </span>
        <div className="purple_border p-8 border border-black">
          <h3 className="text-lg font-bold mb-4">Itens do Pedido</h3>
          {items.map((item: OrderItem, index: number) => (
            <div key={index} className="mb-4  p-4 rounded">
              <h5 className="font-semibold">Item {index + 1}</h5>
              <div className="grid grid-cols-2 gap-4">
                {orderItemFields.map(({ key, label, accessor }) => {
                  const value = getNestedValue(item, accessor) || '';
                  return (
                    <div key={key} className="mb-2">
                      <label><strong>{label}:</strong></label>
                      <input
                        type="text"
                        value={value}
                        readOnly={true}
                        className="input-field-client"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex justify-center items-center mt-4">
            <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalOrderItems;
