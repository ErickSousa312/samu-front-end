import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../shared/services/api";
import { useToast } from "../../../shared/context/ToastContext";

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
    email: z.string().email("Email inválido"),
});

type OrderFormData = z.infer<typeof orderSchema>;

const CreateOrder = ({ onClose }: CreateOrderProps) => {
    const { addToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
    });

    const inputFields = {
        status: { placeholder: "Status", type: "text" },
        userName: { placeholder: "Nome do Usuário", type: "text" },
        address: { placeholder: "Endereço", type: "text" },
        price: { placeholder: "Preço", type: "number" },
        plano: { placeholder: "Plano", type: "text" },
        phone: { placeholder: "Telefone", type: "text" },
        email: { placeholder: "Email", type: "email" },
    };

        const onSubmit = async (data: OrderFormData) => {
          try {
            addToast({ type: 'loading', message: 'Aguarde, estamos processando seu pedido...' });

            await api.post(`/orders`, data);
            addToast({ type: 'success', message: 'Pedido criado com sucesso!' });
            onClose();
          } catch (err) {
            addToast({ type: 'error', message: 'Falha ao criar pedido.' });
            console.error("erro na criação de pedidos", err);
          } 
        };


    return (
         <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r  from-amber-300  to-amber-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                <div className="relative px-4 py-10 bg-[#141414] shadow-lg sm:rounded-3xl sm:p-20  ">
                    <div className="max-w-md mx-auto flex flex-col justify-center items-center ">
                        <div>
                            <h1 className="text-2xl text-white font-semibold">Crie o seu pedido</h1>
                        </div>
                        <div className="py-6 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <form onSubmit={handleSubmit(onSubmit)}  className="flex flex-col justify-center items-center">
                                <div className="grid grid-cols-2 gap-12">
                                    {Object.entries(inputFields).map(([name, { placeholder, type }]) => (
                                        <div key={name} className="">
                                            <input
                                                type={type}
                                                placeholder={placeholder}
                                                {...register(name as keyof OrderFormData,
                                                    name === "price" ? { valueAsNumber: true } : {}
                                                )}
                                                className="mt-1 bg-transparent text-white p-2 border rounded "
                                            />
                                            {errors[name as keyof OrderFormData] && (
                                                <span className="text-red-500">
                                                    {errors[name as keyof OrderFormData]?.message}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                    <div className="flex justify-center items-center gap-4 my-8 w-full">
                                    <button type="submit" className="bg-blue-500 w-full text-white p-2 rounded">
                                        Salvar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className=" bg-gray-500  w-full text-white p-2 rounded"
                                    >
                                        Fechar
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
