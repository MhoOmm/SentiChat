import { useState } from "react";
import { loginAdmin } from "../src/services/AdminApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  // WORKING DRAFT 4 && responsive version
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">

      {/* ══════════ Left Panel ══════════ */}
      <div className="
        hidden sm:flex 
        lg:w-1/2 
        w-full 
        h-[30vh] sm:h-[35vh] lg:h-auto
        flex-col justify-center items-start 
        px-6 sm:px-10 lg:px-20 py-10 
        bg-brand relative overflow-hidden
      ">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-6 lg:mb-16">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
          <span className="text-[0.8rem] sm:text-[0.9rem] font-semibold tracking-[0.14em] uppercase text-white">
            SentiChat
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-[2.8rem] font-bold leading-tight text-white mb-2 lg:mb-4">
          Smart insights,<br />
          <span className="text-white/30">real conversations.</span>
        </h1>

        <p className="text-xs sm:text-sm text-white/50 max-w-sm">
          Monitor sentiment, analyse trends, and manage your admin panel.
        </p>
      </div>

      {/* ══════════ Right Panel ══════════ */}
      <div className="
        w-full lg:w-1/2 
        flex items-center justify-center 
        px-6 py-10 
        bg-white
      ">

        {/* FORM CONTAINER */}
        <div className="w-full max-w-md">

          <motion.div
            key="login"
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold text-brand mb-1">
              Welcome back Admin
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Enter your credentials to access the dashboard
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">

                <input
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm 
                  focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />

                <input
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm 
                  focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />

                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm 
                  focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full py-3 bg-brand text-white text-sm font-semibold rounded-lg
                hover:opacity-85 transition-all"
              >
                Log in
              </button>
            </form>
          </motion.div>

        </div>
      </div>

    </div>
  );

}