import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const GuestRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    const destination = user.role === "owner" ? "/dashboard/landlord" : "/dashboard/tenant";
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default GuestRoute;
