import { useState, useEffect } from "react";
import api from "../api/axios";

const statusLabel = {
  pending: "Chờ xác nhận", confirmed: "Đã xác nhận", checked_in: "Đang ở",
  completed: "Hoàn thành", cancelled: "Đã hủy",
};
const statusColor = {
  pending: "#f59e0b", confirmed: "#3b82f6", checked_in: "#8b5cf6",
  completed: "#16a34a", cancelled: "#ef4444",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  const load = () => api.get("/bookings").then((res) => setBookings(res.data));

  useEffect(() => {
    load();
    api.get("/rooms").then((res) => setRooms(res.data));
  }, []);

  const roomNumber = (id) => {
    const r = rooms.find((x) => x.id === id);
    return r ? r.room_number : id?.slice(-6);
  };

  const handleCancel = async (id) => {
    if (!confirm("Hủy đặt phòng này?")) return;
    await api.put(`/bookings/${id}/cancel`);
    load();
  };

  return (
    <div>
      <h2>Đặt phòng của tôi 📋</h2>
      {bookings.length === 0 ? (
        <p>Bạn chưa có đặt phòng nào.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Phòng</th><th>Ngày nhận</th><th>Ngày trả</th>
              <th>Tổng tiền</th><th>Trạng thái</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{roomNumber(b.room_id)}</td>
                <td>{b.check_in}</td>
                <td>{b.check_out}</td>
                <td>{Number(b.total_price).toLocaleString()} đ</td>
                <td>
                  <span className="badge" style={{ background: statusColor[b.status] }}>
                    {statusLabel[b.status] || b.status}
                  </span>
                </td>
                <td>
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <button className="btn-danger" onClick={() => handleCancel(b.id)}>Hủy</button>
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