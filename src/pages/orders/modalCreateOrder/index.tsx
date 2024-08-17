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
  userId: z.string().optional(), // Inclua userId no esquema
});

type OrderFormData = z.infer<typeof orderSchema>;

type InputField = 
  | { placeholder: string; type: "text" | "number" | "email"; }
  | { placeholder: string; type: "select"; options: string[]; };

const inputFields: Record<string, InputField> = {
  status: { placeholder: "Status", type: "select", options: [
    "Entregue",
    "Pendente",
    "Cancelado"
  ] },
  email: { placeholder: "Email", type: "email" },
  userName: { placeholder: "Nome", type: "text" },
  address: { placeholder: "Endereço", type: "text" },
  price: { placeholder: "Preço", type: "number" },
  plano: { placeholder: "Plano", type: "text" },
  phone: { placeholder: "Telefone", type: "text" },
};

const CreateOrder = ({ onClose }: CreateOrderProps) => {
    const { addToast } = useToast();
    const [selectedUser, setSelectedUser] = useState<{ email: string; id: string } | null>(null);
    const [users, setUsers] = useState<{ email: string; id: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<OrderFormData>({
      resolver: zodResolver(orderSchema),
    });

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await api.get('/users');
          setUsers(response.data);
        } catch (err) {
          console.error("Erro ao buscar usuários", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, []);

   const handleUserSelect = (user: { email: string; id: string }) => {
    setSelectedUser(user);
    setValue("email", user.email);
    setValue("userId", user.id); 
  };
  const onSubmit = async (data: OrderFormData) => {
    try {
      if (!selectedUser) {
        throw new Error("Usuário deve ser selecionado");
      }
  
      const formData = { ...data, userId: selectedUser.id };
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
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50">
        <div className="relative py-3 sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-[#141414] shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto flex flex-col justify-center items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Criar Pedido</h1>
              </div>
              <div className="mt-4 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center">
                <div className="grid grid-cols-2 gap-8">
                  {Object.entries(inputFields).map(([name, field]) => (
                    <div key={name} className="">
                      {field.type === "select" ? (
                        <div>
                          <select
                            {...register(name as keyof OrderFormData)}
                            className={`mt-1 bg-transparent text-white p-2 border rounded w-[14vw] ${errors[name as keyof OrderFormData] ? 'border-red-500' : ''}`}
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
                      ) : (
                        <div>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            {...register(name as keyof OrderFormData,
                              name === "price" ? { valueAsNumber: true } : {}
                            )}
                            className={`mt-1 w-[14vw] bg-transparent text-white p-2 border rounded ${errors[name as keyof OrderFormData] ? 'border-red-500' : ''}`}
                          />
                          {errors[name as keyof OrderFormData] && (
                            <p className="text-red-500 text-sm mt-1">{errors[name as keyof OrderFormData]?.message}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-8 w-full gap-4 flex justify-between items-center">
                  <button onClick={onClose} className="bg-gray-500 text-black px-4 py-2 rounded hover:bg-gray-600">
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
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
