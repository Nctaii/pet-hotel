import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/branches").then((res) => setBranches(res.data));
  }, []);

  const viewRooms = (branch) => {
    setSelectedBranch(branch);
    api
      .get("/rooms", { params: { branch_id: branch.id, status: "available" } })
      .then((res) => setRooms(res.data));
  };

  const handleBook = (roomId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/booking/${roomId}`);
  };

  return (
    <div>
      <h2>Hệ thống Khách sạn Thú cưng 🐾</h2>

      <h3>Chọn chi nhánh</h3>
      <div className="card-list">
        {branches.map((b) => (
          <div key={b.id} className="card" style={{ width: 240 }}>
            <h4 style={{ margin: "0 0 8px" }}>{b.name}</h4>
            <p>{b.address}, {b.city}</p>
            <p>📞 {b.phone}</p>
            <button className="btn-pink" onClick={() => viewRooms(b)}>
              Xem phòng trống
            </button>
          </div>
        ))}
      </div>

      {selectedBranch && (
        <div style={{ marginTop: 28 }}>
          <h3>Phòng trống tại {selectedBranch.name}</h3>
          {rooms.length === 0 ? (
            <p>Không còn phòng trống.</p>
          ) : (
            <div className="card-list">
              {rooms.map((r) => (
                <div key={r.id} className="card" style={{ width: 240 }}>
                  <h4 style={{ margin: "0 0 8px" }}>Phòng {r.room_number}</h4>
                  <p>Loại: {r.type}</p>
                  <p>Giá: {Number(r.price_per_day).toLocaleString()} đ/ngày</p>
                  <button onClick={() => handleBook(r.id)}>Đặt phòng</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}