import { useEffect, useState } from "react";
import { getSentiment } from "../src/services/AdminApi";
import { useNavigate } from "react-router-dom";
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

const sentimentConfig = [
  {
    key: "positive",
    label: "Positive",
    icon: "😊",
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    bar: "#10b981",
  },
  {
    key: "negative",
    label: "Negative",
    icon: "😟",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    bar: "#ef4444",
  },
  {
    key: "neutral",
    label: "Neutral",
    icon: "😐",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    bar: "#94a3b8",
  },
];

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

  if (!stats)
    return (
      <div style={pageStyle}>
        <AdminNavbar admin={null} onLogout={handleLogout} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
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
            Loading sentiment data…
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );

  const total =
    (stats.positive || 0) + (stats.negative || 0) + (stats.neutral || 0);

  return (
    <div style={pageStyle}>
      <AdminNavbar admin={null} onLogout={handleLogout} />

      <main
        style={{
          maxWidth: 960,
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
            Sentiment Analysis
          </h2>
          <p
            style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: 14,
              color: "#94a3b8",
              marginTop: 4,
            }}
          >
            Overview of user sentiment from chat interactions.
          </p>
        </div>

        {/* STAT CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {sentimentConfig.map((s) => (
            <div
              key={s.key}
              style={{
                ...cardBase,
                padding: "26px 24px",
                borderLeft: `4px solid ${s.color}`,
                transition: "transform 0.18s, box-shadow 0.18s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(30,64,175,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 24px rgba(30,64,175,0.07)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Arial', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {s.label}
                </span>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  {s.icon}
                </div>
              </div>

              <div
                style={{
                  fontFamily: "'Arial', sans-serif",
                  fontSize: 38,
                  fontWeight: 800,
                  color: s.color,
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                {stats[s.key]}%
              </div>

              {/* PROGRESS BAR */}
              <div
                style={{
                  height: 6,
                  borderRadius: 4,
                  background: "#f0f4ff",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${stats[s.key]}%`,
                    background: s.bar,
                    borderRadius: 4,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* DISTRIBUTION CHART CARD */}
        <div style={{ ...cardBase, padding: "28px 32px" }}>
          <h3
            style={{
              fontFamily: "'Arial', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#1e3a8a",
              margin: "0 0 22px",
            }}
          >
            Sentiment Distribution
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sentimentConfig.map((s) => (
              <div
                key={s.key}
                style={{ display: "flex", alignItems: "center", gap: 14 }}
              >
                <div
                  style={{
                    width: 90,
                    fontFamily: "'Arial', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#475569",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{s.icon}</span>
                  {s.label}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 10,
                    borderRadius: 6,
                    background: "#f0f4ff",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${stats[s.key]}%`,
                      background: `linear-gradient(90deg, ${s.color}99, ${s.color})`,
                      borderRadius: 6,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 44,
                    textAlign: "right",
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: s.color,
                    flexShrink: 0,
                  }}
                >
                  {stats[s.key]}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}