import { Content, Header, SideBar } from '../../shared/components'
import FormClient from './formClient'

const RegisterClientPage = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Header title='Cadastrar Cliente'/>
    <div className="flex flex-row flex-grow">
      <SideBar />
      <Content content={<FormClient />} />
    </div>
  </div>
  )
}

export default RegisterClientPage
