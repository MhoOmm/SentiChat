import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Dashboard",             path: "/admin/dashboard"     },
  { label: "Announcements & Polls", path: "/admin/announcements" },
  // { label: "Sentiments",            path: "/admin/sentiments"    },
  { label: "Grievances",            path: "/admin/grievances"}
];

export default function Navbar({ onLogout }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#e5edff] transition-all duration-300 font-[Arial,sans-serif]
        ${scrolled
          ? "bg-white/97 backdrop-blur-md shadow-[0_4px_32px_rgba(30,64,175,0.13)]"
          : "bg-white shadow-[0_1px_0_rgba(30,64,175,0.07)]"
        }`}
    >
      {/* ── MAIN BAR ── */}
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* LOGO */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center shadow-[0_2px_10px_rgba(30,64,175,0.25)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white"/>
            </svg>
          </div>
          <span className="font-extrabold text-xl text-[#1e3a8a] tracking-tight">
            SentiChat
          </span>
          <span className="bg-[#e0e7ff] text-[#3b82f6] text-[11px] font-bold px-[7px] py-[2px] rounded-[5px] tracking-wide ml-0.5">
            ADMIN
          </span>
        </div>

        {/* DESKTOP NAV — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 whitespace-nowrap
                ${isActive(link.path)
                  ? "bg-[#e0e7ff] text-[#1e40af] font-bold border-b-2 border-[#3b82f6]"
                  : "text-[#64748b] font-medium border-b-2 border-transparent hover:bg-[#f1f5f9] hover:text-[#1e40af]"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP LOGOUT — hidden on mobile */}
        <button
          onClick={onLogout}
          className="hidden md:flex items-center gap-1.5 px-[18px] py-2 rounded-[10px] border-[1.5px] border-[#fecaca] bg-[#fef2f2] text-[#ef4444] font-bold text-[13px] cursor-pointer shrink-0 transition-all duration-200 hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Logout
        </button>

        {/* HAMBURGER — visible on mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden flex items-center justify-center p-2 rounded-lg border-[1.5px] border-[#e0e7ff] transition-colors duration-200
            ${menuOpen ? "bg-[#e0e7ff]" : "bg-white"}`}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>

      </div>

      {/* MOBILE DROPDOWN — visible on mobile only */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e5edff] bg-white px-5 pt-3 pb-4">

          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-lg text-sm mb-1 transition-all duration-200
                ${isActive(link.path)
                  ? "bg-[#e0e7ff] text-[#1e40af] font-bold border-l-[3px] border-[#3b82f6]"
                  : "text-[#475569] font-medium border-l-[3px] border-transparent hover:bg-[#f1f5f9] hover:text-[#1e40af]"
                }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-3 pt-3 border-t border-[#f0f4ff]">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[9px] border-[1.5px] border-[#fecaca] bg-[#fef2f2] text-[#ef4444] font-bold text-[13px] cursor-pointer transition-all duration-200 hover:bg-[#ef4444] hover:text-white hover:border-[#ef4444]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Logout
            </button>
          </div>

        </div>
      )}
    </header>
  );
}