import  { useEffect, useState } from "react";
import Card from "../../../shared/components/card";
import Table from "../../../shared/components/table";
import api from "../../../shared/services/api";
import SalesChart from "../../../shared/components/SalesCharts";

const DetailsLogistic = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [deliveredOrdersPrice, setDeliveredOrdersPrice] = useState(0);
  const [entregueCount, setEntregueCount] = useState(0);
  const [pendenteCount, setPendenteCount] = useState(0);
  const [canceladoCount, setCanceladoCount] = useState(0);


  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await api.get('/users');
        const users = response.data;

        const customers = users.filter((user: { role: string }) => user.role === "customer");
        const drivers = users.filter((user: { role: string }) => user.role === "driver");

        setCustomerCount(customers.length);
        setDriverCount(drivers.length);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

   
    const fetchOrdersData = async () => {
      try {
        const ordersResponse = await api.get('/orders');
        const orders = ordersResponse.data;

        // Calculate the price for delivered orders
        const deliveredOrders = orders.filter((order: { status: string }) => order.status === "Entregue");
        const totalPrice = deliveredOrders.reduce((acc: number, order: { price: number }) => acc + order.price, 0);
        setDeliveredOrdersPrice(totalPrice);

        // Count orders by status
        const entregueCount = orders.filter((order: { status: string }) => order.status === "Entregue").length;
        const pendenteCount = orders.filter((order: { status: string }) => order.status === "Pendente").length;
        const canceladoCount = orders.filter((order: { status: string }) => order.status === "Cancelado").length;

        setEntregueCount(entregueCount);
        setPendenteCount(pendenteCount);
        setCanceladoCount(canceladoCount);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    };

    fetchUserCounts();
    fetchOrdersData();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col py-12">
        <div className="flex md:flex-row gap-4 justify-center items-center">
          <Card count={customerCount} description="Quantidade de clientes cadastrados" text="Clientes" link="/registerclient"/>
          <Card count={driverCount} description="Quantidade de motoristas cadastrados" text="Motoristas" link="/registerdriver"/>
          <Card value={deliveredOrdersPrice} description="Faturamento dos pedidos entregues" text="Pedidos Entregues" link="/orders" />      

        </div>
        <div className="flex flex-col md:flex-row gap-4 py-12 justify-center items-center">
          <SalesChart          
          entregueCount={entregueCount} 
          pendenteCount={pendenteCount} 
          canceladoCount={canceladoCount} 
        />
        </div>

      </div>
      <Table role="customer"/>
    </div>
  );
};

export default DetailsLogistic;

