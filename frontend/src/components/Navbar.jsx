import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Task Manager</h1>
      <div className="flex items-center gap-4">

        <button
          onClick={() => navigate("/history")}
          className="bg-yellow-500 px-4 py-1 rounded hover:bg-yellow-600"
        >
          History
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
