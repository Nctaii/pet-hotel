import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";

export default function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/rooms/${roomId}`).then((res) => setRoom(res.data));
    api.get("/pets").then((res) => {
      setPets(res.data);
      if (res.data.length > 0) setPetId(res.data[0].id);
    });
    api.get(`/rooms/${roomId}/booked-dates`).then((res) => setBookedRanges(res.data));
  }, [roomId]);

  const getDisabledDates = () => {
    const dates = [];
    bookedRanges.forEach((r) => {
      let cur = new Date(r.check_in);
      const end = new Date(r.check_out);
      while (cur < end) {
        dates.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
    });
    return dates;
  };

  const disabledDates = getDisabledDates();
  const isDateBooked = (date) =>
    disabledDates.some((d) => d.toDateString() === date.toDateString());

  const calcTotal = () => {
    if (!room || !checkIn || !checkOut) return 0;
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (days < 1) return 0;
    return days * Number(room.price_per_day);
  };

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn ngày nhận và ngày trả");
      return;
    }
    try {
      await api.post("/bookings", {
        pet_id: petId,
        room_id: roomId,
        check_in: formatDate(checkIn),
        check_out: formatDate(checkOut),
      });
      setMessage("Đặt phòng thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Đặt phòng thất bại");
    }
  };

  if (!room) return <p>Đang tải...</p>;

  return (
    <div style={{ maxWidth: 440 }}>
      <h2>Đặt phòng 🏨</h2>
      <div className="card" style={{ marginBottom: 18 }}>
        <p><b>Phòng:</b> {room.room_number}</p>
        <p><b>Loại:</b> {room.type}</p>
        <p><b>Giá:</b> {Number(room.price_per_day).toLocaleString()} đ/ngày</p>
      </div>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {message && <p style={{ color: "var(--success)" }}>{message}</p>}

      <form onSubmit={handleSubmit} className="form-box">
        <label>Chọn thú cưng</label>
        <select value={petId} onChange={(e) => setPetId(e.target.value)} required>
          <option value="">-- Chọn --</option>
          {pets.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
          ))}
        </select>
        {pets.length === 0 && (
          <small style={{ color: "#b45309" }}>
            Bạn chưa có thú cưng. Hãy thêm ở mục "Thú cưng" trước.
          </small>
        )}

        <label>Ngày nhận</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          minDate={new Date()}
          excludeDates={disabledDates}
          filterDate={(date) => !isDateBooked(date)}
          placeholderText="Chọn ngày nhận"
          dateFormat="dd/MM/yyyy"
          className="date-input"
        />

        <label>Ngày trả</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          minDate={checkIn || new Date()}
          excludeDates={disabledDates}
          filterDate={(date) => !isDateBooked(date)}
          placeholderText="Chọn ngày trả"
          dateFormat="dd/MM/yyyy"
          className="date-input"
        />

        <p style={{ fontSize: 16 }}>Tạm tính: <b>{calcTotal().toLocaleString()} đ</b></p>
        <button type="submit">Xác nhận đặt phòng</button>
      </form>
    </div>
  );
}