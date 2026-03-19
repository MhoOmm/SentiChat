import { useEffect, useState } from "react";
import { getSentiment } from "../src/services/AdminApi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SentimentAnalysis() {
  const [stats, setStats] = useState(null);

  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    getSentiment(token).then((res) => {
      setStats(res.data.stats);
    });
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login-admin");
  };


  if (!stats) return <p className="p-6">Loading...</p>;


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
            className="px-4 py-2.5 font-medium text-sm rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/announcements"
            className="px-4 py-2.5 font-medium text-sm rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            Announcements & Polls
          </Link>

          <Link
            to="/admin/sentiments"
            className="px-4 py-2.5 font-medium text-sm rounded-lg bg-blue-300 text-brand font-medium"
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
    {!stats ? (
      <p className="p-6 text-white/70">Loading...</p>
    ) : (
      <main className="p-6 md:p-8 max-w-5xl mx-auto">

        <h2 className="text-2xl font-bold mb-8">
          Sentiment Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* POSITIVE */}
          <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/10 text-center hover:scale-[1.02] transition">
            <h3 className="font-semibold text-lg text-white/80 mb-2">
              Positive
            </h3>
            <p className="text-3xl font-bold text-green-400">
              {stats.positive}%
            </p>
          </div>

          {/* NEGATIVE */}
          <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/10 text-center hover:scale-[1.02] transition">
            <h3 className="font-semibold text-lg text-white/80 mb-2">
              Negative
            </h3>
            <p className="text-3xl font-bold text-red-400">
              {stats.negative}%
            </p>
          </div>

          {/* NEUTRAL */}
          <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/10 text-center hover:scale-[1.02] transition">
            <h3 className="font-semibold text-lg text-white/80 mb-2">
              Neutral
            </h3>
            <p className="text-3xl font-bold text-gray-300">
              {stats.neutral}%
            </p>
          </div>

        </div>

      </main>
    )}
  </div>
);




  // DRAFT 1 - WORKING BASE
  // return (
  //   <div className="p-6">

  //     <h2 className="text-2xl font-bold mb-6">
  //       Sentiment Analysis
  //     </h2>

  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  //       <div className="bg-green-100 p-6 rounded text-center">
  //         <h3 className="font-bold text-lg">Positive</h3>
  //         <p className="text-2xl">{stats.positive}%</p>
  //       </div>

  //       <div className="bg-red-100 p-6 rounded text-center">
  //         <h3 className="font-bold text-lg">Negative</h3>
  //         <p className="text-2xl">{stats.negative}%</p>
  //       </div>

  //       <div className="bg-gray-200 p-6 rounded text-center">
  //         <h3 className="font-bold text-lg">Neutral</h3>
  //         <p className="text-2xl">{stats.neutral}%</p>
  //       </div>

  //     </div>

  //   </div>
  // );


}