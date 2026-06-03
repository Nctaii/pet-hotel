import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "" });

  const load = () => api.get("/branches").then((res) => setBranches(res.data));
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post("/branches", form);
    setForm({ name: "", address: "", city: "", phone: "" });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa chi nhánh này?")) return;
    await api.delete(`/branches/${id}`);
    load();
  };

  return (
    <div>
      <h2>Quản lý chi nhánh 🏢</h2>
      <form onSubmit={handleAdd} className="form-box" style={{ maxWidth: 360 }}>
        <h3 style={{ margin: 0 }}>Thêm chi nhánh</h3>
        <input name="name" placeholder="Tên chi nhánh" value={form.name} onChange={handleChange} required />
        <input name="address" placeholder="Địa chỉ" value={form.address} onChange={handleChange} required />
        <input name="city" placeholder="Thành phố" value={form.city} onChange={handleChange} required />
        <input name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleChange} />
        <button type="submit" className="btn-success">Thêm</button>
      </form>

      <h3 style={{ marginTop: 28 }}>Danh sách</h3>
      <table>
        <thead>
          <tr><th>Tên</th><th>Địa chỉ</th><th>Thành phố</th><th>SĐT</th><th>Thao tác</th></tr>
        </thead>
        <tbody>
          {branches.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td><td>{b.address}</td><td>{b.city}</td><td>{b.phone}</td>
              <td><button className="btn-danger" onClick={() => handleDelete(b.id)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}