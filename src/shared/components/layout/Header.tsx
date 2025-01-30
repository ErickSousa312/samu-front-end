import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthProvider";
import SvgDiv from "@/assets/divSVGHorizontal.svg";

const Header = ({ title }: { title: string }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex-col flex justify-between items-center pt-4 pl-4 pr-4 h-[10%] ">
      <div className="flex flex-row justify-between w-full pl-8 pr-8  items-center debug-border">
        <div className="flex items-center text-3xl gap-4 text-white">
          <span>{title}</span>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex items-center gap-4 text-white">
            <span>Olá, {user?.userName || "Usuário"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <img style={{ marginTop: 13 }} src={SvgDiv} alt="Logo" />
      </div>
    </div>
  );
};

export default Header;
