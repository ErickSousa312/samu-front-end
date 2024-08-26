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
      } catch (error) {
        console.error('Error fetching data:', error); 
      }
    };
    
    handleLogin()
  
  }, [])

  return (
        <div>
            
          {redirectLogin &&
            <button onClick={() => redirect()} formTarget='_blank' className='bg-white px-3 py-2 rounded-md'>
              Logar na sua conta do Mercado Livre
            </button>
          } 
          {!redirectLogin &&
          <div className='w-[70vw]'>
            <OrderListFreeMarket />
          </div>

          } 
        </div>
   
  );
};

export default FormMarket;
