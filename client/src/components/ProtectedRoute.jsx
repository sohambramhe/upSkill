import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function ProtectedRoute({ children, roles }) {
  const { user } = useSelector((s) => s.auth);
  const loc = useLocation();
  if (!user)
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return children;
}
