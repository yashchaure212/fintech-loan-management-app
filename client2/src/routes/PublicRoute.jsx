import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import FullPageLoader from "@/components/shared/FullPageLoader";

function PublicRoute() {
  const isInitialized = useSelector((state) => state.auth.isInitialized);

  if (!isInitialized) {
    return <FullPageLoader />;
  }

  return <Outlet />;
}

export default PublicRoute;
