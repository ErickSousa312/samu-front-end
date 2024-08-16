import { Content, Header, SideBar } from '../../shared/components'
import FormDriver from './formDriver'

const RegisterDriverPage = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
    <Header />
    <div className="flex flex-row flex-grow">
      <SideBar />
      <Content title='Cadastrar Motorista' content={<FormDriver />} />
    </div>
  </div>
  )
}

export default RegisterDriverPage
