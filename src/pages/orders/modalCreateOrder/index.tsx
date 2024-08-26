import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../shared/services/api";
import { useToast } from "../../../shared/context/ToastContext";
import { useState, useEffect } from "react"; 
import Dropdown from "../../../shared/components/select";

interface CreateOrderProps {
  onClose: () => void;
}

const orderSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),
  userName: z.string().min(1, "Nome do usuário é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  price: z.number().min(1, "Preço deve ser maior que zero"),
  plano: z.string().min(1, "Plano é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido").optional(),
  driver: z.string().email("Email inválido").optional(),
  userId: z.string().optional(),
  deliveryDate: z.string().optional(),  // Transformação aqui
});

type OrderFormData = z.infer<typeof orderSchema>;

type InputField = 
  | { placeholder: string; type: "text" | "number" | "email"; }
  | { placeholder: string; type: "select"; options: string[]; }
  | { placeholder: string; type: "date"; };

const inputFields: Record<string, InputField> = {
  status: { placeholder: "Status", type: "select", options: ["Entregue", "Pendente", "Cancelado"] },
  email: { placeholder: "Email", type: "email" },
  driver: { placeholder: "Driver", type: "email" },
  userName: { placeholder: "Nome", type: "text" },
  address: { placeholder: "Endereço", type: "text" },
  price: { placeholder: "Preço", type: "number" },
  plano: { placeholder: "Plano", type: "select", options: ["Mercado Livre Flex", "Mercado Livre Flex Turbo", "Serviços Particular"] },
  phone: { placeholder: "Telefone", type: "text" },
  deliveryDate: { placeholder: "Data", type: "date" }, // Campo de data
};

const CreateOrder = ({ onClose }: CreateOrderProps) => {
  const { addToast } = useToast();
  const [selectedUser, setSelectedUser] = useState<{ email: string; id: string } | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<{ email: string; id: string } | null>(null); // Novo estado
  const [users, setUsers] = useState<{ email: string; id: string }[]>([]);
  const [drivers, setDrivers] = useState<{ email: string; id: string }[]>([]); // Novo estado
  const [loading, setLoading] = useState(true);

    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<OrderFormData>({
      resolver: zodResolver(orderSchema),
      defaultValues: {
        deliveryDate: new Date().toISOString(), // Ensure a default value is set
      },
    });

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await api.get('/users');
          const customers = response.data.filter((user: { role: string }) => user.role === 'customer');
          setUsers(customers);

          const driverResponse = response.data.filter((user: { role: string }) => user.role === 'driver');;
          setDrivers(driverResponse);
        } catch (err) {
          console.error("Erro ao buscar usuários ou motoristas", err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchUsers();
    }, []);

    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      setValue("deliveryDate", date); // Set ISO string directly
    };

    const handleUserSelect = (user: { email: string; id: string }) => {
      setSelectedUser(user);
      setValue("email", user.email);
      setValue("userId", user.id); 
    };

    const handleDriverSelect = (driver: { email: string; id: string }) => {
      setSelectedDriver(driver);
      setValue("driver", driver.email);
      setValue("userId", driver.id); 
    };

    const onSubmit = async (data: OrderFormData) => {
      try {
        if (!selectedUser) {
          throw new Error("Usuário deve ser selecionado");
        }
  
        const formData = { ...data, userId: selectedUser.id, driverId: selectedDriver?.id };
        console.log("Dados enviados:", formData);
  
        addToast({ type: 'loading', message: 'Aguarde, estamos processando seu pedido...' });
  
        await api.post(`/orders`, formData);
        addToast({ type: 'success', message: 'Pedido criado com sucesso!' });
        onClose();
      } catch (err) {
        addToast({ type: 'error', message: 'Falha ao criar pedido.' });
        console.error("Erro na criação de pedidos", err);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70">
        <div className="relative py-3 sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-[#141414] w-[50vw] shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto flex flex-col justify-center items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Criar Pedido</h1>
              </div>
              <div className="mt-4 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center w-[50vw]">
                  <div className="grid grid-cols-2 gap-4 items-center m-auto justify-center text-base ">
                    {Object.entries(inputFields).map(([name, field]) => (
                      <div key={name} className="">
                        {field.type === "select" ? (
                          <div>
                            <select
                              {...register(name as keyof OrderFormData)}
                              className={`mt-1 bg-transparent text-white p-2 border rounded  w-[16vw] ${errors[name as keyof OrderFormData] ? 'border-red-500' : ''}`}
                            >
                              <option value="" disabled>
                                {field.placeholder}
                              </option>
                              {field.options?.map((option) => (
                                <option className="text-black" key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {errors[name as keyof OrderFormData] && (
                              <p className="text-red-500 text-sm mt-1">{errors[name as keyof OrderFormData]?.message}</p>
                            )}
                          </div>
                        ) : name === "email" ? (
                          <div>
                            <Dropdown
                              name={selectedUser ? selectedUser.email : "Selecione um usuário"}
                              options={users}
                              onSelect={handleUserSelect}
                              initialSelectedItem={selectedUser ?? undefined}
                              loading={loading} 
                            />
                            {errors[name as keyof OrderFormData] && (
                              <p className="text-red-500 text-sm mt-1">{errors[name as keyof OrderFormData]?.message}</p>
                            )}
                          </div>
                        ) : name === "driver" ? (
                          <div>
                            <Dropdown
                              name={selectedDriver ? selectedDriver.email : "Selecione um motorista"}
                              options={drivers}
                              onSelect={handleDriverSelect}
                              initialSelectedItem={selectedDriver ?? undefined}
                              loading={loading}
                            />
                            {errors[name as keyof OrderFormData] && (
                              <p className="text-red-500 text-sm mt-1">{errors[name as keyof OrderFormData]?.message}</p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              {...register(name as keyof OrderFormData,
                                name === "price" ? { valueAsNumber: true } : {}
                              )}
                              onChange={name === "deliveryDate" ? handleChangeDate : undefined}
                              className={`mt-1 w-[10vw] md:w-[16vw] bg-transparent text-white p-2 border rounded ${errors[name as keyof OrderFormData] ? 'border-red-500' : ''}`}
                            />
                            {errors[name as keyof OrderFormData] && (
                              <p className="text-red-500 text-sm mt-1">{errors[name as keyof OrderFormData]?.message}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 w-full gap-4 flex justify-center items-center px-32">
                    <button onClick={onClose} className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600 w-full">
                      Fechar
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-500 text-black px-4 py-2 rounded w-full hover:bg-yellow-600"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default CreateOrder;
