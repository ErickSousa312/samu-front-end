import { Content, Header, SideBar } from "../../shared/components";
import DetailsDrivers from "./detailsdrivers";

const DriversPage = () => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="flex flex-row flex-grow">
        <SideBar />
        <Content title="Motoristas" content={<DetailsDrivers />} />
      </div>
    </div>
  );
};

export default DriversPage;
