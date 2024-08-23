import { Content, Header, SideBar } from '../../shared/components'
import FormMarket from './formAccess'
import OrderListFreeMarket from './orderListMercadoLivre'

const access = true

const FreeMarket = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Header />
    <div className="flex flex-row flex-grow">
      <SideBar />
      <Content title='Login mercado livre' content={access ? <FormMarket /> : <OrderListFreeMarket />} />
    </div>
  </div>
  )
}

export default FreeMarket