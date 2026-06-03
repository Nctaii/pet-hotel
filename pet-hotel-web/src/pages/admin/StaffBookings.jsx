import { useState, useEffect } from "react";
import api from "../../api/axios";

const statusLabel = {
  pending: "Chờ xác nhận", confirmed: "Đã xác nhận", checked_in: "Đang ở",
  completed: "Hoàn thành", cancelled: "Đã hủy",
};
const statusColor = {
  pending: "#f59e0b", confirmed: "#3b82f6", checked_in: "#8b5cf6",
  completed: "#16a34a", cancelled: "#ef4444",
};

export default function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);

  const loadBookings = () => api.get("/bookings").then((res) => setBookings(res.data));

  useEffect(() => {
    loadBookings();
    api.get("/rooms").then((res) => setRooms(res.data));
    api.get("/branches").then((res) => setBranches(res.data));
  }, []);

  const roomNumber = (id) => {
    const r = rooms.find((x) => x.id === id);
    return r ? r.room_number : id?.slice(-6);
  };
  const branchName = (id) => {
    const b = branches.find((x) => x.id === id);
    return b ? b.name : "—";
  };

  const doAction = async (id, action) => {
    await api.put(`/bookings/${id}/${action}`);
    loadBookings();
    api.get("/rooms").then((res) => setRooms(res.data));
  };

  return (
    <div>
      <h2>Quản lý đặt phòng 🗂️</h2>
      {bookings.length === 0 ? (
        <p>Chưa có đặt phòng nào.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Phòng</th><th>Chi nhánh</th><th>Nhận</th><th>Trả</th>
              <th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{roomNumber(b.room_id)}</td>
                <td>{branchName(b.branch_id)}</td>
                <td>{b.check_in}</td>
                <td>{b.check_out}</td>
                <td>{Number(b.total_price).toLocaleString()} đ</td>
                <td>
                  <span className="badge" style={{ background: statusColor[b.status] }}>
                    {statusLabel[b.status] || b.status}
                  </span>
                </td>
                <td>
                  {b.status === "pending" && (
                    <button onClick={() => doAction(b.id, "confirm")}>Xác nhận</button>
                  )}
                  {b.status === "confirmed" && (
                    <button className="btn-pink" onClick={() => doAction(b.id, "checkin")}>Check-in</button>
                  )}
                  {b.status === "checked_in" && (
                    <button className="btn-success" onClick={() => doAction(b.id, "checkout")}>Check-out</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}