import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
    role: "Standard User",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/v1/register", form);
      setMessage("Registration successful. redirect to login .....");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-3">
      <h1 className="text-2xl font-bold mb-4">Welcome Please Register</h1>

      <div className="space-y-2">
        <label className="block">Name</label>
        <input
          placeholder="Name"
          className="border p-2 w-full rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block">Profile Picture</label>
        <input
          type="text"
          placeholder="Profile Picture"
          className="border p-2 w-full rounded"
          value={form.profilePicture}
          onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="block">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 w-full rounded"
          required
        >
          <option value="Standard User">Standard User</option>
          <option value="Organizer">Organizer</option>
          <option value="System Admin">System Admin</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition-colors"
      >
        Register
      </button>

      {message && <p className="text-green-600 text-center">{message}</p>}
    </form>
  );
}