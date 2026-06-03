import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">🐾 Pet Hotel</Link>
        {user && user.role === "customer" && (
          <>
            <Link to="/">Trang chủ</Link>
            <Link to="/pets">Thú cưng</Link>
            <Link to="/my-bookings">Đặt phòng của tôi</Link>
          </>
        )}
        {user && (user.role === "admin" || user.role === "staff") && (
          <>
            <Link to="/admin/bookings">Quản lý đặt phòng</Link>
            {user.role === "admin" && (
              <>
                <Link to="/admin/rooms">Phòng</Link>
                <Link to="/admin/branches">Chi nhánh</Link>
              </>
            )}
          </>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">{user.name} ({user.role})</span>
            <button className="btn-danger" onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}