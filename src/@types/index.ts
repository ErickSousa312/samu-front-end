export interface Order {
  _id: string;
  status: string;
  userName: string;
  address: string;
  price: number;
  plano: string;
  phone: string;
  email: string;
  driver: string;
  deliveryDate: Date;
  [key: string]: any;
}

export interface OrderMl {
  id: string;
  shipping_id?: number;
  total_amount: string;
  tags: string[];
  paid_amount: string;
  buyer?: {
    nickname: string;
  };
  date_created?: string;
  status: string;
  shipping_cost: string;
  order_items?: OrderItem[];
  [key: string]: any;
}

export interface OrderItem {
  item: {
    title: string;
    category_id: string;
    condition: string;
    warranty: string;
  };
  unit_price: string;
  sale_fee: string;
  quantity: string;
  full_unit_price: string;
}

export type ShippingDetails = {
  items_types: string[];
  substatus: string;
  date_created: string;
  origin: {
    shipping_address: {
      country: {
        id: string;
        name: string;
      };
      address_line: string;
      city: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
      street_name: string;
      zip_code: string;
    };
    type: string;
    sender_id: number;
  };
  destination: {
    receiver_name: string;
    shipping_address: {
      address_line: string;
      city: {
        id: string;
        name: string;
      };
      state: {
        id: string;
        name: string;
      };
      street_name: string;
      zip_code: string;
      neighborhood?: {
        name: string;
      };
    };
    receiver_phone: string;
  };
  declared_value: number;
  tracking_number: string;
  status: string;
};
