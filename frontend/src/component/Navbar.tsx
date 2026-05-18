import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Navbar=()=>{

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {

    await logout();
    navigate("/");
  };

  return (

    <nav className="bg-white border-b shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <h1 className="text-2xl font-bold text-blue-600">
          Smart Leads Dashboard
        </h1>

        <div className="flex items-center gap-4">

          <div className="text-right">
            <p className="font-semibold text-gray-800">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}



export default Navbar;