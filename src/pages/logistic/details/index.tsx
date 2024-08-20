import  { useEffect, useState } from "react";
import Card from "../../../shared/components/card";
import Table from "../../../shared/components/table";
import api from "../../../shared/services/api";

const DetailsLogistic = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);

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

    fetchUserCounts();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col md:flex-row gap-8 py-12">
        <Card count={customerCount} description="Quantidade de clientes cadastrados" text="Clientes" link="/registerclient"/>
        <Card count={driverCount} description="Quantidade de motoristas cadastrados" text="Motoristas" link="/registerdriver"/>
      </div>
      <Table role="customer"/>
    </div>
  );
};

export default DetailsLogistic;

