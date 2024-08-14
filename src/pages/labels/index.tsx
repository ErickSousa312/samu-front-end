import { Content, Header, SideBar } from '../../shared/components'
import QrCode from './qrcode'

const LabelsPage = () => {
  return (
        <div className="flex flex-col h-screen w-screen">
        <Header title='Etiquetas'/>
        <div className="flex flex-row flex-grow">
          <SideBar />
          <Content content={<QrCode />} />
        </div>
      </div>
  )
}

export default LabelsPage
