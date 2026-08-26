import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/admin/AdminDashboard";
import Elections from "../pages/admin/Elections";
import Candidates from "../pages/admin/Candidates";
import Results from "../pages/admin/Results";

import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "elections",
        element: <Elections />,
      },
      {
        path: "candidates",
        element: <Candidates />,
      },
      {
        path: "results",
        element: <Results />,
      },
    ],
  },
]);

export default router;
