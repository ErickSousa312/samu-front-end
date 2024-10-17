import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../../../shared/services/api";
import { useToast } from "../../../shared/context/ToastContext";

const orderSchema = z.object({
  username: z.string().min(1, "Nome do usuário é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(3, "Senha deve ter no minimo 5 caracteres"),
});

type OrderFormData = z.infer<typeof orderSchema>;

const FormDriver = () => {
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const inputFields = {
    username: { placeholder: "Nome", type: "text" },
    email: { placeholder: "Email", type: "email" },
    password: { placeholder: "Senha", type: "password" },
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      addToast({
        type: "loading",
        message: "Aguarde, estamos criando um motorista...",
      });
      const dataWithRole = { ...data, role: "driver" };

      await api.post(`/signUp`, dataWithRole);
      addToast({ type: "success", message: "Motorista criado com sucesso!" });
    } catch (err) {
      addToast({ type: "error", message: "Falha ao criar motorista." });
      console.error("erro na criação de pedidos", err);
    }
  };

  return (
    <div className="w-full h-full flex justify-start m-12  ">
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex flex-col md:flex-row gap-12">
            {Object.entries(inputFields).map(
              ([name, { placeholder, type }]) => (
                <div key={name} className="flex flex-col gap-3">
                  <input
                    type={type}
                    placeholder={placeholder}
                    {...register(
                      name as keyof OrderFormData,
                      name === "price" ? { valueAsNumber: true } : {},
                    )}
                    className="mt-1 bg-transparent text-white p-2 border rounded "
                  />
                  {errors[name as keyof OrderFormData] && (
                    <span className="text-red-500">
                      {errors[name as keyof OrderFormData]?.message}
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
          <div className="flex justify-center items-center gap-4 my-8 w-full">
            <button
              type="submit"
              className="bg-blue-500 w-full text-white p-2 rounded"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormDriver;
