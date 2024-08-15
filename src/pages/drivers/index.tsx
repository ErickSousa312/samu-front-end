import { Content, Header, SideBar } from "../../shared/components"
import Test from "./teste"

const DriversPage = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Header />
    <div className="flex flex-row flex-grow">
      <SideBar />
      <Content title="Motoristas" content={<Test />} />
    </div>
  </div>
  )
}

export default DriversPage
