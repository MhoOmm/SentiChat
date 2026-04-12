import { useEffect, useState } from "react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/poll/announcements/all")
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnnouncements(data.announcements);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#04052e] text-white">

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#04052e]/80 border-b border-white/[0.07]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <h1 className="font-bold text-sm tracking-wide">Announcements</h1>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {announcements.length === 0 ? (
          <p className="text-white/40 text-sm">No announcements yet</p>
        ) : (
          announcements.map((item) => (
            <div
              key={item._id}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.05] transition"
            >
              <div className="flex justify-between mb-2 text-xs text-white/40">
                <span>Admin</span>
                <span>
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              <h2 className="text-sm font-semibold mb-2">
                {item.title}
              </h2>

              <p className="text-sm text-white/80 leading-relaxed">
                {item.message}
              </p>
            </div>
          ))
        )}

      </main>
    </div>
  );
}