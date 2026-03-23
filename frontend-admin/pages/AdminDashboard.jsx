import { useEffect, useState } from "react";
import { getAdmin } from "../src/services/AdminApi";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar/AdminNavbar";

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #e8f0fe 100%)",
  fontFamily: "'Arial', sans-serif",
};

const cardBase = {
  background: "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 70%), white",
  borderRadius: 16,
  border: "1.5px solid #e0e7ff",
  boxShadow: "0 2px 24px rgba(30,64,175,0.07)",
};

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    console.log("TOKEN FROM STORAGE:", token);

    if (!token) {
      navigate("/admin/login-admin");
      return;
    }

    const fetchAdmin = async () => {
      try {
        const res = await getAdmin(token);
        if (res.data.success) {
          setAdmin(res.data.admin);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (err) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login-admin");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login-admin");
  };

  if (loading) {
    return (
      <div
        style={{
          ...pageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "4px solid #e0e7ff",
            borderTop: "4px solid #3b82f6",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <span
          style={{
            color: "#64748b",
            fontFamily: "'Arial', sans-serif",
            fontSize: 15,
          }}
        >
          Loading dashboard…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <AdminNavbar admin={admin} onLogout={handleLogout} />

      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* PAGE HEADER */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontFamily: "'Arial', sans-serif",
              fontWeight: 800,
              fontSize: 28,
              color: "#1e3a8a",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Dashboard
          </h2>
          <p
            style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: 14,
              color: "#94a3b8",
              marginTop: 4,
            }}
          >
            Welcome back, {admin?.username} — here's your overview.
          </p>
        </div>


        {/* MAIN DASHBOARD CONTENT CARD */}
        <div style={{ ...cardBase, padding: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h3
              style={{
                fontFamily: "'Arial', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#1e3a8a",
                margin: 0,
              }}
            >
              Analytics Overview
            </h3>
            <span
              style={{
                background: "#e0e7ff",
                color: "#3b82f6",
                fontFamily: "'Arial', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 6,
              }}
            >
              LIVE DATA
            </span>
          </div>

          {/* TEAM COLLABORATION AREA */}
          <div
            style={{
              border: "2px dashed #c7d7fe",
              borderRadius: 14,
              padding: "56px 32px",
              textAlign: "center",
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 70%), linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#e0e7ff",
                color: "#3b82f6",
                fontFamily: "'Arial', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 20,
                letterSpacing: "0.5px",
              }}
            >
              KANISHK
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}