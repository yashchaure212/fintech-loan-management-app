import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute() {
  const { isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return null;
  }

  return <Outlet />;
}

export default PublicRoute;
