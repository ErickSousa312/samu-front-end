import { ReactNode } from "react";
import { SideBar } from "./SideBar";
import SvgDiv from "@/assets/divSVGVertical.svg";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const currentPath = window.location.pathname;
  const formattedPath = currentPath
    .split("/")
    .filter(Boolean) // Remove strings vazias causadas por "/"
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

  return (
    <main className="flex h-screen bg-gray-800 w-screen overflow-x-hidden">
      <div className="flex-col h-[100%] w-[20%] ">
        <SideBar />
      </div>
      <img style={{ marginTop: 25 }} src={SvgDiv} alt="Logo" />
      <div className="flex flex-col h-full w-full">
        <Header title={formattedPath} />
        <div className="flex  h-[87%] pl-1 overflow-x-hidden ">{children}</div>
      </div>
    </main>
  );
};
