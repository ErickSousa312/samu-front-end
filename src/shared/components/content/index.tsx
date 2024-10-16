import { ReactNode } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface ContainerProps {
    content: ReactNode;
    title: string;
  }

const Content = ({ content, title }: ContainerProps) => {
  return (
    <div className="p-8 pt-24 mt-[-65px] bg-[#161617]  ml-0 lg:ml-96 w-screen h-[100%] ">
      <h1 className="text-3xl flex items-center text-white font-bold">
        {title} <IoIosArrowForward size={32} className="pl-2 text-center pt-2" />
      </h1>
      <div className=" flex flex-col items-center ">
      {content}
      </div>
    </div>
  )
}

export default Content
