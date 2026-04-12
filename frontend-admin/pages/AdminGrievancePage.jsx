import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar/AdminNavbar";

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #e8f0fe 100%)",
  fontFamily: "'Arial', sans-serif",
};

const cardBase = {
  background:
    "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 70%), white",
  borderRadius: 16,
  border: "1.5px solid #e0e7ff",
  boxShadow: "0 2px 24px rgba(30,64,175,0.07)",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
}

export default function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login-admin");
      return;
    }
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/grievance", 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // haha mza
      console.log("API:", res.data);
      setGrievances(res.data.grievances || []);
    } 
    catch (err) {
      console.error(err);
      setGrievances([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login-admin");
  };

  return (
    <div style={pageStyle}>
      <AdminNavbar admin={null} onLogout={handleLogout} />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontWeight: 800, fontSize: 28, color: "#1e3a8a" }}>
            Student Grievances
          </h2>
          <p style={{ color: "#94a3b8", marginTop: 4 }}>
            Monitor and review student submissions
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#94a3b8" }}>
            Loading grievances...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            
            {/* EMPTY STATE */}
            {grievances.length === 0 ? (
              <div
                style={{
                  ...cardBase,
                  padding: 32,
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                No grievances submitted yet.
              </div>
            ) : (
              grievances.map((g) => (
                <div
                  key={g._id}
                  style={{
                    ...cardBase,
                    padding: "20px 24px",
                  }}
                >
                  {/* TOP */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#3b82f6",
                        background: "#e0e7ff",
                        padding: "2px 8px",
                        borderRadius: 20,
                        textTransform: "capitalize",
                      }}
                    >
                      {g.category || "general"}
                    </span>

                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {formatDate(g.createdAt)}
                    </span>
                  </div>

                  {/* TEXT */}
                  <p
                    style={{
                      fontSize: 14,
                      color: "#475569",
                      lineHeight: 1.6,
                      marginBottom: 10,
                    }}
                  >
                    {g.text || "No content"}
                  </p>

                  {/* SENTIMENT */}
                  {g.sentiment && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background:
                          g.sentiment === "negative"
                            ? "#fee2e2"
                            : g.sentiment === "positive"
                            ? "#dcfce7"
                            : "#e0e7ff",
                        color:
                          g.sentiment === "negative"
                            ? "#dc2626"
                            : g.sentiment === "positive"
                            ? "#16a34a"
                            : "#3b82f6",
                        fontWeight: 700,
                      }}
                    >
                      {g.sentiment}
                    </span>
                  )}
                </div>
              ))
            )}

          </div>
        )}
      </main>
    </div>
  );
}