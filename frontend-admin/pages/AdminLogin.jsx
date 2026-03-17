import { useState } from "react";
import { loginAdmin } from "../src/services/AdminApi";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Admin Login Form Submitted");
    console.log("Form Data:", form);

    try {
      const res = await loginAdmin(form);
      // console.log(res.data);

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>

      </form>

    </div>
  );
}