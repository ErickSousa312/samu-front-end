import { ReactNode } from "react";

interface ContainerProps {
    content: ReactNode;
  }

const Content = ({ content }: ContainerProps) => {
  return (
    <div className="flex flex-col bg-[#161617] justify-center items-center w-screen h-screen m-auto">
      {content}
    </div>
  )
}

export default Content
