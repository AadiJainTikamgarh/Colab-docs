import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/auth.store";

function UnAuthorizedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
}

export default UnAuthorizedRoute;
