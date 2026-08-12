import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ role, children }) {
  const { user, isAuthenticated, isInitialized } = useSelector(
    (state) => state.auth,
  );

  // Wait until auth restoration completes
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // No login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but user not loaded
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading user...
      </div>
    );
  }

  const userRole = user?.role?.name;

  // Role protection
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
