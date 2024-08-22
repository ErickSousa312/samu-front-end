import { useForm} from 'react-hook-form';
import axios from 'axios';


interface LoginFormInputs {
  email: string;
  password: string;
}

const FormMarket = () => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.helpdesk-maraba.cloud/api-ml/login/');
      console.log('Data:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error); 
    }
  };

  return (
        <div className="relative py-3 sm:w-96 mx-auto text-center">
          <span className="text-2xl font-light text-gray-100">Logue na sua conta!</span>
          <div className="mt-4 bg-[#161617] shadow-md rounded-lg text-left">
            <div className="h-2 bg-amber-400 rounded-t-md"></div>
            <form onSubmit={handleSubmit(fetchData)} className="px-8 py-6 ">
              <div className='flex flex-col justify-center items-center gap-4'>
                <input type="email" {...register('email')} placeholder="Email" className="w-full h-5 px-3 py-5 my-8  bg-transparent border-b hover:outline-none focus:outline-none" />
   
                <input type="password" {...register('password')} placeholder="Senha" className="w-full h-5 mt6 px-3 py-5 bg-transparent border-b hover:outline-none focus:outline-none" />

                <button type="submit" className="mt-4 bg-amber-500 text-white py-2 px-6 rounded-md hover:bg-amber-600 ">Login</button>  
              </div>          
            </form>          
          </div>
        </div>
   
  );
};

export default FormMarket;
