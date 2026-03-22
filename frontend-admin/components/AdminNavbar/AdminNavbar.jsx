// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export default function Navbar({ onLogout }) {
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);



//   const navLinks = [
//     { label: "Dashboard", path: "/admin/dashboard" },
//     { label: "Announcements & Polls", path: "/admin/announcements" },
//     { label: "Sentiments", path: "/admin/sentiments" },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <header
//       style={{
//         fontFamily: "'Arial', sans-serif",
//         transition: "all 0.3s ease",
//         boxShadow: scrolled
//           ? "0 4px 32px rgba(30,64,175,0.13)"
//           : "0 1px 0 rgba(30,64,175,0.07)",
//         background: scrolled
//           ? "rgba(255,255,255,0.97)"
//           : "rgba(255,255,255,1)",
//         backdropFilter: scrolled ? "blur(16px)" : "none",
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//         borderBottom: "1.5px solid #e5edff",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: 1280,
//           margin: "0 auto",
//           padding: "0 24px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: 64,
//         }}
//       >
//         {/* LOGO */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div
//             style={{
//               width: 34,
//               height: 34,
//               borderRadius: 9,
//               background: "linear-gradient(135deg, #1e40af 60%, #3b82f6 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 2px 10px rgba(30,64,175,0.25)",
//             }}
//           >
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//               <path
//                 d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
//                 fill="white"
//               />
//             </svg>
//           </div>
//           <span
//             style={{
//               fontFamily: "'Arial', sans-serif",
//               fontWeight: 800,
//               fontSize: 20,
//               color: "#1e3a8a",
//               letterSpacing: "-0.5px",
//             }}
//           >
//             SentiChat
//           </span>
//           <span
//             style={{
//               background: "#e0e7ff",
//               color: "#3b82f6",
//               fontSize: 11,
//               fontWeight: 700,
//               padding: "2px 7px",
//               borderRadius: 5,
//               letterSpacing: "0.5px",
//               marginLeft: 2,
//             }}
//           >
//             ADMIN
//           </span>
//         </div>

//         {/* DESKTOP NAV */}
//         <nav
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 4,
//             "@media(maxWidth:768px)": { display: "none" },
//           }}
//           className="hidden md:flex"
//         >
//           {navLinks.map((link) => (
//             <Link
//               key={link.path}
//               to={link.path}
//               style={{
//                 padding: "7px 16px",
//                 borderRadius: 8,
//                 fontFamily: "'Arial', sans-serif",
//                 fontWeight: isActive(link.path) ? 700 : 500,
//                 fontSize: 14,
//                 color: isActive(link.path) ? "#1e40af" : "#64748b",
//                 background: isActive(link.path) ? "#e0e7ff" : "transparent",
//                 textDecoration: "none",
//                 transition: "all 0.18s",
//                 borderBottom: isActive(link.path)
//                   ? "2px solid #3b82f6"
//                   : "2px solid transparent",
//               }}
//               onMouseEnter={(e) => {
//                 if (!isActive(link.path)) {
//                   e.currentTarget.style.background = "#f1f5f9";
//                   e.currentTarget.style.color = "#1e40af";
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isActive(link.path)) {
//                   e.currentTarget.style.background = "transparent";
//                   e.currentTarget.style.color = "#64748b";
//                 }
//               }}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         {/* LOGOUT + HAMBURGER */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           {/* LOGOUT BUTTON (desktop) */}
//           <button
//             onClick={onLogout}
//             className="hidden md:flex"
//             style={{
//               alignItems: "center",
//               gap: 7,
//               padding: "8px 18px",
//               borderRadius: 10,
//               border: "1.5px solid #fecaca",
//               background: "#fef2f2",
//               color: "#ef4444",
//               fontFamily: "'Arial', sans-serif",
//               fontWeight: 700,
//               fontSize: 13,
//               cursor: "pointer",
//               transition: "all 0.18s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#ef4444";
//               e.currentTarget.style.color = "white";
//               e.currentTarget.style.borderColor = "#ef4444";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#fef2f2";
//               e.currentTarget.style.color = "#ef4444";
//               e.currentTarget.style.borderColor = "#fecaca";
//             }}
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
//             </svg>
//             Logout
//           </button>

//           {/* HAMBURGER (mobile) */}
//           <button
//             className="md:hidden"
//             onClick={() => setMenuOpen(!menuOpen)}
//             style={{
//               padding: 8,
//               borderRadius: 8,
//               border: "1.5px solid #e0e7ff",
//               background: menuOpen ? "#e0e7ff" : "white",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {menuOpen ? (
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#1e40af"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//               >
//                 <path d="M18 6L6 18M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#1e40af"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//               >
//                 <path d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE MENU */}
//       {menuOpen && (
//         <div
//           style={{
//             borderTop: "1.5px solid #e5edff",
//             background: "white",
//             padding: "12px 20px 16px",
//           }}
//           className="md:hidden"
//         >
//           {navLinks.map((link) => (
//             <Link
//               key={link.path}
//               to={link.path}
//               onClick={() => setMenuOpen(false)}
//               style={{
//                 display: "block",
//                 padding: "10px 14px",
//                 borderRadius: 8,
//                 fontFamily: "'Arial', sans-serif",
//                 fontWeight: isActive(link.path) ? 700 : 500,
//                 fontSize: 14,
//                 color: isActive(link.path) ? "#1e40af" : "#475569",
//                 background: isActive(link.path) ? "#e0e7ff" : "transparent",
//                 textDecoration: "none",
//                 marginBottom: 4,
//                 borderLeft: isActive(link.path)
//                   ? "3px solid #3b82f6"
//                   : "3px solid transparent",
//               }}
//             >
//               {link.label}
//             </Link>
//           ))}
//           <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f4ff" }}>
//             <button
//               onClick={onLogout}
//               style={{
//                 width: "100%",
//                 padding: "10px 14px",
//                 borderRadius: 9,
//                 border: "1.5px solid #fecaca",
//                 background: "#fef2f2",
//                 color: "#ef4444",
//                 fontFamily: "'Arial', sans-serif",
//                 fontWeight: 700,
//                 fontSize: 13,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 7,
//               }}
//             >
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
//               </svg>
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }







// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------









// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export default function Navbar({ onLogout }) {
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);



//   const navLinks = [
//     { label: "Dashboard", path: "/admin/dashboard" },
//     { label: "Announcements & Polls", path: "/admin/announcements" },
//     { label: "Sentiments", path: "/admin/sentiments" },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <header
//       style={{
//         fontFamily: "'Arial', sans-serif",
//         transition: "all 0.3s ease",
//         boxShadow: scrolled
//           ? "0 4px 32px rgba(30,64,175,0.13)"
//           : "0 1px 0 rgba(30,64,175,0.07)",
//         background: scrolled
//           ? "rgba(255,255,255,0.97)"
//           : "rgba(255,255,255,1)",
//         backdropFilter: scrolled ? "blur(16px)" : "none",
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//         borderBottom: "1.5px solid #e5edff",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: 1280,
//           margin: "0 auto",
//           padding: "0 24px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           height: 64,
//         }}
//       >
//         {/* LOGO */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div
//             style={{
//               width: 34,
//               height: 34,
//               borderRadius: 9,
//               background: "linear-gradient(135deg, #1e40af 60%, #3b82f6 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 2px 10px rgba(30,64,175,0.25)",
//             }}
//           >
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//               <path
//                 d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
//                 fill="white"
//               />
//             </svg>
//           </div>
//           <span
//             style={{
//               fontFamily: "'Arial', sans-serif",
//               fontWeight: 800,
//               fontSize: 20,
//               color: "#1e3a8a",
//               letterSpacing: "-0.5px",
//             }}
//           >
//             SentiChat
//           </span>
//           <span
//             style={{
//               background: "#e0e7ff",
//               color: "#3b82f6",
//               fontSize: 11,
//               fontWeight: 700,
//               padding: "2px 7px",
//               borderRadius: 5,
//               letterSpacing: "0.5px",
//               marginLeft: 2,
//             }}
//           >
//             ADMIN
//           </span>
//         </div>

//         {/* DESKTOP NAV */}
//         <nav
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 4,
//             "@media(max-width:768px)": { display: "none" },
//           }}
//           className="hidden md:flex"
//         >
//           {navLinks.map((link) => (
//             <Link
//               key={link.path}
//               to={link.path}
//               style={{
//                 padding: "7px 16px",
//                 borderRadius: 8,
//                 fontFamily: "'Arial', sans-serif",
//                 fontWeight: isActive(link.path) ? 700 : 500,
//                 fontSize: 14,
//                 color: isActive(link.path) ? "#1e40af" : "#64748b",
//                 background: isActive(link.path) ? "#e0e7ff" : "transparent",
//                 textDecoration: "none",
//                 transition: "all 0.18s",
//                 borderBottom: isActive(link.path)
//                   ? "2px solid #3b82f6"
//                   : "2px solid transparent",
//               }}
//               onMouseEnter={(e) => {
//                 if (!isActive(link.path)) {
//                   e.currentTarget.style.background = "#f1f5f9";
//                   e.currentTarget.style.color = "#1e40af";
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isActive(link.path)) {
//                   e.currentTarget.style.background = "transparent";
//                   e.currentTarget.style.color = "#64748b";
//                 }
//               }}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         {/* LOGOUT + HAMBURGER */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           {/* LOGOUT BUTTON (desktop) */}
//           <button
//             onClick={onLogout}
//             className="hidden md:flex"
//             style={{
//               alignItems: "center",
//               gap: 7,
//               padding: "8px 18px",
//               borderRadius: 10,
//               border: "1.5px solid #fecaca",
//               background: "#fef2f2",
//               color: "#ef4444",
//               fontFamily: "'Arial', sans-serif",
//               fontWeight: 700,
//               fontSize: 13,
//               cursor: "pointer",
//               transition: "all 0.18s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#ef4444";
//               e.currentTarget.style.color = "white";
//               e.currentTarget.style.borderColor = "#ef4444";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#fef2f2";
//               e.currentTarget.style.color = "#ef4444";
//               e.currentTarget.style.borderColor = "#fecaca";
//             }}
//           >
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
//             </svg>
//             Logout
//           </button>

//           {/* HAMBURGER (mobile) */}
//           <button
//             className="md:hidden"
//             onClick={() => setMenuOpen(!menuOpen)}
//             style={{
//               padding: 8,
//               borderRadius: 8,
//               border: "1.5px solid #e0e7ff",
//               background: menuOpen ? "#e0e7ff" : "white",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {menuOpen ? (
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#1e40af"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//               >
//                 <path d="M18 6L6 18M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#1e40af"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//               >
//                 <path d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE MENU */}
//       {menuOpen && (
//         <div
//           style={{
//             borderTop: "1.5px solid #e5edff",
//             background: "white",
//             padding: "12px 20px 16px",
//           }}
//           className="md:hidden"
//         >
//           {navLinks.map((link) => (
//             <Link
//               key={link.path}
//               to={link.path}
//               onClick={() => setMenuOpen(false)}
//               style={{
//                 display: "block",
//                 padding: "10px 14px",
//                 borderRadius: 8,
//                 fontFamily: "'Arial', sans-serif",
//                 fontWeight: isActive(link.path) ? 700 : 500,
//                 fontSize: 14,
//                 color: isActive(link.path) ? "#1e40af" : "#475569",
//                 background: isActive(link.path) ? "#e0e7ff" : "transparent",
//                 textDecoration: "none",
//                 marginBottom: 4,
//                 borderLeft: isActive(link.path)
//                   ? "3px solid #3b82f6"
//                   : "3px solid transparent",
//               }}
//             >
//               {link.label}
//             </Link>
//           ))}
//           <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f4ff" }}>
//             <button
//               onClick={onLogout}
//               style={{
//                 width: "100%",
//                 padding: "10px 14px",
//                 borderRadius: 9,
//                 border: "1.5px solid #fecaca",
//                 background: "#fef2f2",
//                 color: "#ef4444",
//                 fontFamily: "'Arial', sans-serif",
//                 fontWeight: 700,
//                 fontSize: 13,
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 7,
//               }}
//             >
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
//               </svg>
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }


















// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------


















import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Dashboard",             path: "/admin/dashboard"     },
  { label: "Announcements & Polls", path: "/admin/announcements" },
  { label: "Sentiments",            path: "/admin/sentiments"    },
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