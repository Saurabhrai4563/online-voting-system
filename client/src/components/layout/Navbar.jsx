import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      <div className="text-right">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
      </div>
    </header>
  );
}

export default Navbar;
