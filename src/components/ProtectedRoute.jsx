import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
const isAuth = sessionStorage.getItem("authenticated") === "true";
  return isAuth
    ? <Outlet />              
    : <Navigate to="/" />;   
};

export default ProtectedRoute;
