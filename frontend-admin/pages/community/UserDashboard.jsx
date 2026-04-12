import { Link } from "react-router-dom";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-[#04052e] text-white">
      {/* ── Nav bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#04052e]/80 border-b border-white/[0.07]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/community" className="text-white/50 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="font-bold text-sm tracking-wide">My Community Dashboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 text-center animate-[fadeIn_0.5s_ease]">
          <div className="w-24 h-24 rounded-full bg-[#04052e] flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
          <p className="text-white/40 text-sm">View your posts and interactions.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 transition-colors hover:bg-white/[0.03]">
              <h3 className="text-sm font-bold text-white/80 mb-2">My Posts</h3>
              <p className="text-xs font-semibold text-indigo-400">Coming Soon</p>
           </div>
           <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 transition-colors hover:bg-white/[0.03]">
              <h3 className="text-sm font-bold text-white/80 mb-2">My Comments</h3>
              <p className="text-xs font-semibold text-indigo-400">Coming Soon</p>
           </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
