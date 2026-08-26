import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
