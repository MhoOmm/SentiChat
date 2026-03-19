import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getAnnouncements,
  createAnnouncement,
} from "../src/services/AdminApi";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate(); 
  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const token = localStorage.getItem("adminToken");
  console.log("Fetch token on announcement page:", token);


  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await getAnnouncements(token);
    setAnnouncements(res.data.announcements);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createAnnouncement(form, token);
    console.log("Announcement created, Token:", token);

    setForm({ title: "", message: "" });
    fetchAnnouncements();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login-admin");
  };


  return (
    <div className="min-h-screen bg-brand text-white font-sans">

      {/* ══════════ HEADER ══════════ */}
      <header className="sticky top-0 z-40 bg-brand/95 border-b border-white/10 shadow-lg px-4 md:px-6 lg:px-10 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* LEFT */}
          <h1 className="text-xl md:text-2xl font-bold text-white">
            SentiChat
          </h1>

          {/* CENTER NAV */}
          <nav className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
            <Link
              to="/admin/dashboard"
              className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/announcements"
              className="px-4 py-2.5 rounded-lg bg-blue-300 text-brand font-medium"
            >
              Announcements & Polls
            </Link>

            <Link
              to="/admin/sentiments"
              className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              Sentiments
            </Link>
          </nav>

          {/* RIGHT */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-blue-300 text-brand font-semibold hover:opacity-90 hover:cursor-pointer transition"
          >
            Logout
          </button>

        </div>
      </header>

      {/* ══════════ CONTENT ══════════ */}
      <main className="p-6 md:p-8 max-w-4xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          Announcements
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur">

          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Message"
            className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 outline-none"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <button className="bg-blue-300 text-brand px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 hover:cursor-pointer transition">
            Create Announcement
          </button>

        </form>

        {/* LIST */}
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="bg-white/10 p-5 rounded-xl border border-white/10 backdrop-blur"
            >
              <h3 className="font-semibold text-white text-lg">
                {a.title}
              </h3>
              <p className="text-white/70 mt-1">
                {a.message}
              </p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );

}
