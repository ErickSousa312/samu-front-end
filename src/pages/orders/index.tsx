
import { Content, Header, SideBar } from '../../shared/components'

import OrdersList from './orderslist'

const Orders = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Header/>
    <div className="flex flex-row flex-grow">
      <SideBar />
      <Content title='Pedidos' content={<OrdersList />} />
    </div>
  </div>
  )
}

export default Orders
