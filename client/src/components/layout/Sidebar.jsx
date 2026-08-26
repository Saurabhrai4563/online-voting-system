import { NavLink } from "react-router-dom";
import { LayoutDashboard, Vote, Users, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Elections",
      path: "/admin/elections",
      icon: <Vote size={20} />,
    },
    {
      name: "Candidates",
      path: "/admin/candidates",
      icon: <Users size={20} />,
    },
    {
      name: "Results",
      path: "/admin/results",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">🗳️ VoteSys</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
