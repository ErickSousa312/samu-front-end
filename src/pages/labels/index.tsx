import { Content, Header, SideBar } from '../../shared/components'
import OrderLabels from './orderlist'

const LabelsPage = () => {
  return (
        <div className="flex flex-col h-screen w-screen">
        <Header />
        <div className="flex flex-row flex-grow">
          <SideBar />
          <Content title='Etiquetas' content={<OrderLabels />} />
        </div>
      </div>
  )
}

export default LabelsPage
