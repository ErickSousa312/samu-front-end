import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../shared/context/AuthContext/AuthProvider';
import api from '../../shared/services/api';
import { useNavigate } from 'react-router-dom';
import { ToastProvider, useToast } from '../../shared/context/ToastContext';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    addToast({ type: 'loading', message: 'Aguarde, estamos processando seu login...' });

    try {
      const response = await api.post(`/signIn`, data);
      login(response.data.token, data.email);
      if (response.status === 200) {
        addToast({ type: 'success', message: 'Login realizado com sucesso!' });
        navigate('/orders');
      }
      
    } catch (error) {
      addToast({ type: 'error', message: 'Falha no login. Verifique suas credenciais.' });

      console.error('Login failed:', error);
    }
  };

  return (

    <ToastProvider>
    <div className='w-screen h-screen m-auto'>
 <div className="relative flex h-screen  text-gray-100 antialiased flex-col justify-center overflow-hidden bg-[#121212] py-6 sm:py-12">
        <div className="relative py-3 sm:w-96 mx-auto text-center">
          <span className="text-2xl font-light text-gray-100">Logue na sua conta!</span>
          <div className="mt-4 bg-[#161617] shadow-md rounded-lg text-left">
            <div className="h-2 bg-amber-400 rounded-t-md"></div>
            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 ">
              <div className='flex flex-col justify-center items-center gap-4'>
                <input type="email" {...register('email')} placeholder="Email" className="w-full h-5 px-3 py-5 my-8  bg-transparent border-b hover:outline-none focus:outline-none" />
   
                <input type="password" {...register('password')} placeholder="Senha" className="w-full h-5 mt6 px-3 py-5 bg-transparent border-b hover:outline-none focus:outline-none" />

                <button type="submit" className="mt-4 bg-amber-500 text-white py-2 px-6 rounded-md hover:bg-amber-600 ">Login</button>  
              </div>          
            </form>          
          </div>
        </div>
      </div>
    </div>
    </ToastProvider>

   
  );
};

export default LoginPage;
