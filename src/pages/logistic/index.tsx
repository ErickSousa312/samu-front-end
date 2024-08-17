
import { Content, Header, SideBar } from '../../shared/components'
import DetailsLogistic from './details'


const LogisticPage = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Header />
    <div className="flex flex-row flex-grow">
      <SideBar />
      <Content title='Logistica' content={<DetailsLogistic />} />
    </div>
  </div>
  )
}

export default LogisticPage