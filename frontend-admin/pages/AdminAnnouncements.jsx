import { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
} from "../src/services/AdminApi";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const token = localStorage.getItem("adminToken");

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

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">
        Announcements
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">

        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Message"
          className="w-full border p-2 rounded"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Announcement
        </button>

      </form>

      {/* LIST */}
      {announcements.map((a) => (
        <div
          key={a._id}
          className="bg-white p-4 rounded shadow mb-3"
        >
          <h3 className="font-semibold">{a.title}</h3>
          <p className="text-gray-600">{a.message}</p>
        </div>
      ))}

    </div>
  );
}