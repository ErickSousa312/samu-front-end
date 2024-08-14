import { Content, Header, SideBar } from '../../shared/components'
import FormDriver from './formDriver'

const RegisterDriverPage = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Header title='Cadastrar Motorista'/>
    <div className="flex flex-row flex-grow">
      <SideBar />
      <Content content={<FormDriver />} />
    </div>
  </div>
  )
}

export default RegisterDriverPage
