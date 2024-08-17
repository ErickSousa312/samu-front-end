
interface SubHeaderProps {
    title: string
}

const SubHeader = ({ title }: SubHeaderProps) => {
  return (
    <div className="pt-2 bg-[#161617] justify-center items-center w-screen  ">
        <h1>{title}</h1>
      
    </div>
  )
}

export default SubHeader
