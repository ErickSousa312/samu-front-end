import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../shared/context/AuthContext/AuthProvider';
import api from '../../shared/services/api';
import { useNavigate } from 'react-router-dom';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login } = useAuth();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await api.post(`/signin`, data);
      login(response.data.token);
      if (response.status === 200) {
        navigate('/orders');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col justify-center items-center h-screen gap-4'>
      <input {...register('email')} placeholder="Email" />
      <input {...register('password')} placeholder="Password" type="password" />
      <button type="submit">Login</button>
      </div>

     
    </form>
  );
};

export default LoginPage;
