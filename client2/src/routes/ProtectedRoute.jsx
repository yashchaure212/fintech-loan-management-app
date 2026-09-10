import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/shared/FullPageLoader";

function getUserRole(user) {
  if (!user?.role) {
    return null;
  }

  if (typeof user.role === "string") {
    return user.role;
  }

  return user.role?.name ?? null;
}

function getDashboardPath(userRole) {
  switch (userRole) {
    case "ADMIN":
      return "/admin/dashboard";

    case "CUSTOMER":
      return "/customer/dashboard";

    default:
      return "/customer/dashboard";
  }
}

function ProtectedRoute({ role, children }) {
  const location = useLocation();

  const { user, isAuthenticated, isInitialized } = useSelector(
    (state) => state.auth,
  );

  if (!isInitialized) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    const redirect = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (!user) {
    return <FullPageLoader message="Loading your account..." />;
  }

  const userRole = getUserRole(user);

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={getDashboardPath(userRole)} replace />;
    }
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
