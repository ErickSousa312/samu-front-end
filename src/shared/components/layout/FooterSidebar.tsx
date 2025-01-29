import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthProvider";

const FooterSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex-row flex justify-between items-center pl-4 pr-4 h-[10%] ">
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
  );
};

export default FooterSidebar;
