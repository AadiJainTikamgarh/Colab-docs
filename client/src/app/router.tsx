import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";
import VerifyEmail from "../pages/VerifyEmail";
import AuthorizedRoute from "../guard/AuthorizedRoute";
import UnAuthorizedRoute from "../guard/UnAuthorizedRoute";

function Router() {
  return (
    <Routes>
      <Route element={<AuthorizedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
      <Route element={<UnAuthorizedRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="reset-password/:unhashedToken" element={<ResetPassword />} />
      <Route path="verify-email/:unhashedToken" element={<VerifyEmail />} />
    </Routes>
  );
}

export default Router;
