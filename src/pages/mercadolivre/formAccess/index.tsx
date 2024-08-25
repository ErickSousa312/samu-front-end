import { useEffect, useState } from 'react';
import api from '../../../shared/services/api';
import OrderListFreeMarket from '../orderListMercadoLivre';

const FormMarket = () => {
  const [redirectLogin, setRedirectLogin] = useState(false)

  const redirect = () => {
    window.location.href = 'https://api.helpdesk-maraba.cloud/api-ml/login'
  }

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const response = await api.get("api-ml/verifyToken/");
        if (response.status !== 200) {
          return setRedirectLogin(!redirectLogin)
        
        }
        console.log('Data:', response.data);
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    };
    
    handleLogin()
  
  }, [])

  return (
        <div className="py-3 sm:w-96 h-[50vh]  mx-auto flex items-center justify-center">
          <div className="h-2 bg-amber-400 rounded-t-md"></div>
          <div className="mt-4 bg-[#161617] shadow-md rounded-lg justify-center items-center">
            
          {redirectLogin &&
            <button onClick={() => redirect()} formTarget='_blank' className='bg-white px-3 py-2 rounded-md'>
              Logar na sua conta do Mercado Livre
            </button>
          } 
          {!redirectLogin &&
            <OrderListFreeMarket />
          } 
          </div>
        </div>
   
  );
};

export default FormMarket;
