import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
