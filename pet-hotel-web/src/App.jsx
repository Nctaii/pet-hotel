import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import StaffBookings from "./pages/admin/StaffBookings";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminBranches from "./pages/admin/AdminBranches";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: 24 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Khách hàng */}
            <Route path="/" element={<Home />} />
            <Route path="/booking/:roomId" element={
              <ProtectedRoute roles={["customer"]}><Booking /></ProtectedRoute>
            } />
            <Route path="/pets" element={
              <ProtectedRoute roles={["customer"]}><Pets /></ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute roles={["customer"]}><MyBookings /></ProtectedRoute>
            } />

            {/* Staff & Admin */}
            <Route path="/admin/bookings" element={
              <ProtectedRoute roles={["staff", "admin"]}><StaffBookings /></ProtectedRoute>
            } />

            {/* Chỉ Admin */}
            <Route path="/admin/rooms" element={
              <ProtectedRoute roles={["admin"]}><AdminRooms /></ProtectedRoute>
            } />
            <Route path="/admin/branches" element={
              <ProtectedRoute roles={["admin"]}><AdminBranches /></ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}