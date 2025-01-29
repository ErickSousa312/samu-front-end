import { ReactNode } from "react";
import { SideBar } from "./SideBar";
import SvgDiv from "@/assets/divSVGVertical.svg";
import Header from "./FooterSidebar";
import FooterSidebar from "./FooterSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <main className="flex h-screen bg-gray-800 w-screen overflow-x-hidden">
      <div className="flex-col h-[100%] w-[20%] ">
        <SideBar />
        <FooterSidebar />
      </div>
      <img style={{ marginTop: 25 }} src={SvgDiv} alt="Logo" />
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 pl-1 ">{children}</div>
      </div>
    </main>
  );
};
