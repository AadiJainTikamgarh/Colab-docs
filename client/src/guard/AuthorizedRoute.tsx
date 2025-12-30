import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/auth.store";

function AuthorizedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthorizedRoute;
