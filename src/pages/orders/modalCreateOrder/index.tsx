import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import api from "../../../shared/services/api";

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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
    });

    const inputFields = {
        status: { label: "Status", type: "text" },
        userName: { label: "Nome do Usuário", type: "text" },
        address: { label: "Endereço", type: "text" },
        price: { label: "Preço", type: "number" },
        plano: { label: "Plano", type: "text" },
        phone: { label: "Telefone", type: "text" },
        email: { label: "Email", type: "email" },
    };


        const onSubmit = async (data: OrderFormData) => {
          try {
            await api.post(`/api/admin/orders`, data);
            console.log("Pedido criado com sucesso");
            onClose();
          } catch (err) {
            console.error("erro na criação de pedidos", err);
          } 
        };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="bg-white p-6 rounded w-[700px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {Object.entries(inputFields).map(([name, { label, type }]) => (
                        <div key={name} className="mb-4">
                            <label className="block text-gray-700">{label}</label>
                            <input
                                type={type}
                                {...register(name as keyof OrderFormData,
                                    name === "price" ? { valueAsNumber: true } : {}
                                )}
                                className="mt-1 p-2 border rounded w-full"
                            />
                            {errors[name as keyof OrderFormData] && (
                                <span className="text-red-500">
                                    {errors[name as keyof OrderFormData]?.message}
                                </span>
                            )}
                        </div>
                    ))}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Salvar
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-4 bg-gray-500 text-white p-2 rounded"
                    >
                        Fechar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateOrder;
