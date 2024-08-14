import { ReactNode } from "react";

interface ContainerProps {
    content: ReactNode;
  }

const Content = ({ content }: ContainerProps) => {
  return (
    <div className="flex flex-col p-8 bg-[#161617] justify-center items-center w-screen min-h-full m-auto">
      {content}
    </div>
  )
}

export default Content
