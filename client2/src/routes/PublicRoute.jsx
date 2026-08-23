import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import FullPageLoader from "@/components/common/FullPageLoader";

function PublicRoute() {
  const isInitialized = useSelector((state) => state.auth.isInitialized);

  /*
   * -------------------------------------------------------------
   * AUTH RESTORATION
   * -------------------------------------------------------------
   *
   * Do not render public pages until the application has finished
   * restoring the authentication state.
   *
   * This prevents:
   *
   * - Login page flashing before session restoration
   * - Navbar showing the wrong state
   * - Protected/public route race conditions
   */
  if (!isInitialized) {
    return <FullPageLoader />;
  }

  return <Outlet />;
}

export default PublicRoute;
