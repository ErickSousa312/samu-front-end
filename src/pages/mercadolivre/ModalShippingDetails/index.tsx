import { useState } from "react";
import { ShippingDetails } from "../../../@types";

const orderShippingFields = [
  { key: 'tracking_number', label: 'Número de Rastreamento' },
  { key: 'date_created', label: 'Data de Criação' },
  { key: 'origin.shipping_address.address_line', label: 'Endereço de Origem' },
  { key: 'destination.shipping_address.address_line', label: 'Endereço de Destino' },
  { key: 'declared_value', label: 'Valor Declarado' },
  { key: 'status', label: 'Status' },
  { key: 'destination.receiver_name', label: 'Nome do recebedor' },
  { key: 'destination.receiver_phone', label: 'Número do recebedor' },
  { key: 'destination.shipping_address.street_name', label: 'Rua' },
  { key: 'destination.shipping_address.city.name', label: 'Cidade' },
  { key: 'destination.shipping_address.neighborhood.name', label: 'Bairro' },
  { key: 'destination.shipping_address.state.name', label: 'Estado' },
];

interface ModalShippingDetailsProps {
  onClose: () => void;
  shippingDetails: ShippingDetails;
}

type NestedObject = {
  [key: string]: any;
};

const setNestedValue = (obj: NestedObject, path: string[], value: any): void => {
  const lastKey = path.pop();
  const lastObj = path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : {}), obj);
  if (lastObj && lastKey) lastObj[lastKey] = value;
};

const getNestedValue = (obj: NestedObject, path: string[]): any => {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return new Date(dateString).toLocaleString('pt-BR', options).replace(',', '');
};

const ModalShippingDetails = ({ onClose, shippingDetails }: ModalShippingDetailsProps) => {
  const [editedOrder, setEditedOrder] = useState<ShippingDetails>(shippingDetails);

  const handleChange = (key: string, value: string | number) => {
    const keys = key.split('.'); 
    setNestedValue(editedOrder, keys, value);
    setEditedOrder({ ...editedOrder });
  };

  const getValue = (key: string): string | number | undefined => {
    const keys = key.split('.'); 
    const value = getNestedValue(editedOrder, keys);
    if (typeof value === 'string' && key.includes('date')) {
      return formatDate(value);
    }
    return typeof value === 'string' || typeof value === 'number' ? value : '';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Detalhes do Envio</h2>
        <form className="space-y-4 grid grid-cols-3">
          {orderShippingFields.map(({ key, label }) => (
            <div key={key} className="mb-4">
              <label><strong>{label}:</strong></label>
              <input
                type="text"
                value={getValue(key)}
                onChange={(e) => handleChange(key, e.target.value)}
                readOnly={true}
                className="input-field-client"
              />
            </div>
          ))}

        </form>
        <div className="flex justify-center items-center w-full my-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ModalShippingDetails;
