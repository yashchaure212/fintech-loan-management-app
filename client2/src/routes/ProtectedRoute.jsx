import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import FullPageLoader from "@/components/common/FullPageLoader";

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

  /*
   * -------------------------------------------------------------
   * AUTH RESTORATION
   * -------------------------------------------------------------
   *
   * The application may still be checking whether a previous
   * session can be restored.
   *
   * Never redirect to login during this period.
   */
  if (!isInitialized) {
    return <FullPageLoader />;
  }

  /*
   * -------------------------------------------------------------
   * AUTHENTICATION CHECK
   * -------------------------------------------------------------
   *
   * Preserve:
   * - pathname
   * - query string
   * - hash
   *
   * Example:
   *
   * /customer/loans/apply?step=2#documents
   *
   * becomes:
   *
   * /login?redirect=%2Fcustomer%2Floans%2Fapply%3Fstep%3D2%23documents
   */
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

  /*
   * -------------------------------------------------------------
   * USER RESTORATION
   * -------------------------------------------------------------
   *
   * We have an access token but user details have not arrived yet.
   */
  if (!user) {
    return <FullPageLoader message="Loading your account..." />;
  }

  const userRole = getUserRole(user);

  /*
   * -------------------------------------------------------------
   * ROLE AUTHORIZATION
   * -------------------------------------------------------------
   *
   * Supports:
   *
   * role="ADMIN"
   *
   * and:
   *
   * role={["ADMIN", "CUSTOMER"]}
   */
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={getDashboardPath(userRole)} replace />;
    }
  }

  /*
   * -------------------------------------------------------------
   * RENDER
   * -------------------------------------------------------------
   *
   * Supports both:
   *
   * <ProtectedRoute>
   *   <Page />
   * </ProtectedRoute>
   *
   * and:
   *
   * <ProtectedRoute>
   *   <Outlet />
   * </ProtectedRoute>
   */
  return children ?? <Outlet />;
}

export default ProtectedRoute;
