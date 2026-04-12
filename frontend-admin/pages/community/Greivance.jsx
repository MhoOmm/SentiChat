import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function WriteGreivance() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("academic");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  const categories = [
    "academic",
    "hostel",
    "mess",
    "infrastructure",
    "admin",
    "other",
  ];

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/chat/create-greivance",
        { text, category },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setText("");
      alert("Grievance submitted!");

    } catch (err) {
      alert(err.response?.data?.message || "Error submitting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04052e] text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#04052e]/80 border-b border-white/[0.07]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <h1 className="font-bold text-sm tracking-wide">
            Write Grievance
          </h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 py-6">

        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-4"
        >

          {/* TEXT */}
          <div>
            <label className="text-xs text-white/40 mb-1 block">
              Your grievance
            </label>
            <textarea
              className="w-full bg-transparent border border-white/[0.08] rounded-xl p-3 text-sm focus:outline-none focus:border-white/20"
              rows="4"
              placeholder="Describe your issue..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-xs text-white/40 mt-1">
              {text.length}/300
            </p>
          </div>

          {/* CATEGORY (CUSTOM DROPDOWN) */}
          <div ref={dropdownRef} className="relative">
            <label className="text-xs text-white/40 mb-1 block">
              Category
            </label>

            {/* Button */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="w-full bg-transparent border border-white/[0.08] rounded-xl p-3 text-sm text-left flex justify-between items-center"
            >
              <span className="capitalize">{category}</span>
              <span className="text-white/40">▾</span>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute w-full mt-2 bg-[#0a0b3d] border border-white/[0.08] rounded-xl shadow-lg z-10 overflow-hidden">

                {categories.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setCategory(item);
                      setOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer capitalize transition
                      ${
                        category === item
                          ? "bg-white/10"
                          : "hover:bg-white/10"
                      }`}
                  >
                    {item}
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* INFO */}
          <p className="text-xs text-white/40">
            Please avoid offensive language. Your submission is monitored.
          </p>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className={`w-full py-2 rounded-xl text-sm font-medium transition 
              ${
                loading
                  ? "bg-white/10 text-white/40"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </form>

      </main>
    </div>
  );
}