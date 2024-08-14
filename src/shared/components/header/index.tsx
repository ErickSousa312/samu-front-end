
interface HeaderProps {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className='h-16 p-4 w-screen bg-[#121212] text-white items-end flex justify-around px-12 border-[#88493877] border-b'>
      <div className="pl-6">
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <div className="">
      <img src="" alt="" />
      ola Calvin
      </div>

    </div>
  )
}

export default Header
