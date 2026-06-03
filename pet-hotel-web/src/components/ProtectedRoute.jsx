import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: 20 }}>Đang tải...</p>;

  // Chưa đăng nhập
  if (!user) return <Navigate to="/login" replace />;

  // Có yêu cầu vai trò nhưng user không thuộc vai trò đó
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}