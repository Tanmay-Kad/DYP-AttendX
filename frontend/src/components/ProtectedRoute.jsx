import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../services/auth";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || isTokenExpired()) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;