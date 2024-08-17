import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthProvider"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  return (
    <div className='h-16 p-4 w-screen bg-[#121212] text-white flex items-center justify-end gap-4 px-12 border-[#88493877] border-b'>
      <div className="flex items-center gap-4">
        <span>Olá, {user?.username || "Usuário"}</span>
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

export default Header;
