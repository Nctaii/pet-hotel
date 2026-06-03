import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ branch_id: "", room_number: "", type: "small", price_per_day: "" });

  const load = () => api.get("/rooms").then((res) => setRooms(res.data));

  useEffect(() => {
    load();
    api.get("/branches").then((res) => {
      setBranches(res.data);
      if (res.data.length > 0) setForm((f) => ({ ...f, branch_id: res.data[0].id }));
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post("/rooms", form);
    setForm({ ...form, room_number: "", price_per_day: "" });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa phòng này?")) return;
    await api.delete(`/rooms/${id}`);
    load();
  };

  const branchName = (id) => {
    const b = branches.find((x) => x.id === id);
    return b ? b.name : id?.slice(-6);
  };

  return (
    <div>
      <h2>Quản lý phòng 🛏️</h2>
      <form onSubmit={handleAdd} className="form-box" style={{ maxWidth: 360 }}>
        <h3 style={{ margin: 0 }}>Thêm phòng</h3>
        <select name="branch_id" value={form.branch_id} onChange={handleChange} required>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <input name="room_number" placeholder="Số phòng" value={form.room_number} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="small">Nhỏ</option>
          <option value="medium">Vừa</option>
          <option value="large">Lớn</option>
        </select>
        <input name="price_per_day" type="number" placeholder="Giá/ngày" value={form.price_per_day} onChange={handleChange} required />
        <button type="submit" className="btn-success">Thêm</button>
      </form>

      <h3 style={{ marginTop: 28 }}>Danh sách</h3>
      <table>
        <thead>
          <tr><th>Số phòng</th><th>Chi nhánh</th><th>Loại</th><th>Giá/ngày</th><th>Trạng thái</th><th>Thao tác</th></tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id}>
              <td>{r.room_number}</td>
              <td>{branchName(r.branch_id)}</td>
              <td>{r.type}</td>
              <td>{Number(r.price_per_day).toLocaleString()} đ</td>
              <td>{r.status}</td>
              <td><button className="btn-danger" onClick={() => handleDelete(r.id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}