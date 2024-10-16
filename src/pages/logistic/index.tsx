
import { Content, Header, SideBar } from '../../shared/components'
import DetailsLogistic from './details'


const LogisticPage = () => {
  return (
    <div className="flex flex-col h-screen w-full ">
    <Header />
    <div className="flex flex-row flex-grow mt-[65px] overflow-y-auto [&::-webkit-scrollbar]:w-3">
      <SideBar />
      <Content title='Logistica' content={<DetailsLogistic />} />
    </div>
  </div>
  )
}

export default LogisticPage