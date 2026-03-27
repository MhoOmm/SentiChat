import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

const slideVariants = {
  enter: { x: 28, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -28, opacity: 0 },
};

const categories = ["academic", "hostel", "mess", "infrastructure", "admin", "other"];

const Field = ({ id, label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block mb-1.5 text-[0.72rem] font-medium tracking-widest uppercase text-gray-400">
      {label}
    </label>
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full px-4 py-2.5 rounded-lg text-sm text-brand
        border border-gray-200 bg-white outline-none
        placeholder:text-gray-300
        focus:border-brand focus:ring-2 focus:ring-brand/[0.08]
        transition-all duration-150
      "
    />
  </div>
);

export default function GrievancePage() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!text.trim() || !category) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post("/chat/create-greivance", { text, category });
      if (data.success) {
        setSuccessMsg(data.message || "Grievance posted successfully.");
        setText("");
        setCategory("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to post grievance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 justify-center items-center p-6">
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <h2 className="text-2xl font-bold text-brand mb-1">Post Your Grievance</h2>
        <p className="text-sm text-gray-400 mb-6">
          Fill out the form below to submit your grievance. Max 5 grievances per day.
        </p>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Field
            id="greivance-text"
            label="Grievance Text"
            placeholder="Describe your grievance..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mb-6">
            <label className="block mb-1.5 text-[0.72rem] font-medium tracking-widest uppercase text-gray-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                w-full px-4 py-2.5 rounded-lg text-sm text-brand
                border border-gray-200 bg-white outline-none
                focus:border-brand focus:ring-2 focus:ring-brand/[0.08]
                transition-all duration-150
              "
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand text-white text-sm font-semibold rounded-lg tracking-wide
              hover:opacity-85 active:opacity-100 hover:-translate-y-px active:translate-y-0
              transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Posting…" : "Post Grievance"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}