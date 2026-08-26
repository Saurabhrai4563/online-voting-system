import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  // Wait until localStorage is checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check user role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
