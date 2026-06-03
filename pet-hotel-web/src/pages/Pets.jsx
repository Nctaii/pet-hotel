import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: "", species: "dog", breed: "", age: "", weight: "", note: "" });

  const loadPets = () => api.get("/pets").then((res) => setPets(res.data));

  useEffect(() => { loadPets(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post("/pets", form);
    setForm({ name: "", species: "dog", breed: "", age: "", weight: "", note: "" });
    loadPets();
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa thú cưng này?")) return;
    await api.delete(`/pets/${id}`);
    loadPets();
  };

  return (
    <div>
      <h2>Thú cưng của tôi 🐶🐱</h2>

      <form onSubmit={handleAdd} className="form-box" style={{ maxWidth: 360 }}>
        <h3 style={{ margin: 0 }}>Thêm thú cưng</h3>
        <input name="name" placeholder="Tên" value={form.name} onChange={handleChange} required />
        <select name="species" value={form.species} onChange={handleChange}>
          <option value="dog">Chó</option>
          <option value="cat">Mèo</option>
          <option value="other">Khác</option>
        </select>
        <input name="breed" placeholder="Giống" value={form.breed} onChange={handleChange} />
        <input name="age" type="number" placeholder="Tuổi" value={form.age} onChange={handleChange} />
        <input name="weight" type="number" placeholder="Cân nặng (kg)" value={form.weight} onChange={handleChange} />
        <input name="note" placeholder="Ghi chú" value={form.note} onChange={handleChange} />
        <button type="submit" className="btn-success">Thêm</button>
      </form>

      <h3 style={{ marginTop: 28 }}>Danh sách</h3>
      <div className="card-list">
        {pets.map((p) => (
          <div key={p.id} className="card" style={{ width: 240 }}>
            <h4 style={{ margin: "0 0 8px" }}>{p.name}</h4>
            <p>Loài: {p.species}</p>
            <p>Giống: {p.breed || "—"}</p>
            <p>Tuổi: {p.age || "—"} | {p.weight || "—"} kg</p>
            <p>Ghi chú: {p.note || "—"}</p>
            <button className="btn-danger" onClick={() => handleDelete(p.id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}