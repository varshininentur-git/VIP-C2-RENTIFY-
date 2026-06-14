import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const fallback = user.role === "owner" ? "/dashboard/landlord" : "/dashboard/tenant";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
