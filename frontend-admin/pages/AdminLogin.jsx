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
      // console.log(res);

      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        console.log("STORED TOKEN:", res.data.token);
        navigate("/admin/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen bg-blue-400 flex flex-col p-8">
      {/* Top Left Logo + Name */}
      <div className="flex items-center space-x-3 mb-auto">
        <div className="w-12 h-12 flex items-center justify-center p-2">
          <img 
            src="../public/sentichat_logo.png" 
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          SentiChat
        </h1>
      </div>

      {/* Centered Login Form */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-2xl shadow-2xl w-92 border border-gray-200 max-w-md"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Welcome back
          </h2>

          <div className="space-y-5">
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-400"
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-400"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-400"
            />
          </div>

          <button className="w-full mt-8 bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0">
            Log In
          </button>
        </form>
      </div>
    </div>
  );

}