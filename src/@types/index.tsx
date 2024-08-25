export interface Order {
    _id: string;
    status: string;
    userName: string;
    address: string;
    price: number;
    plano: string;
    phone: string;
    email: string;
    deliveryDate: Date;
    [key: string]: any;
}
  
export interface OrderMl {
  id: string;
  total_amount: number;
  order_items: string[];
  status: string;
  tags: string[];
  paid_amount: number;
}
