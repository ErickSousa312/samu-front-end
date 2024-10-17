import { Content, Header, SideBar } from "../../shared/components";
import FormMarket from "./formAccess";

const FreeMarket = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="flex flex-row flex-grow">
        <SideBar />
        <Content title="Login mercado livre" content={<FormMarket />} />
      </div>
    </div>
  );
};

export default FreeMarket;
