import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedRoute;