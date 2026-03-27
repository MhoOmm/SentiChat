import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { 
  createAnnouncement,
  getAnnouncements, 
  createPoll, 
  getPolls
} from "../src/services/AdminApi";
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

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid #e0e7ff",
  fontFamily: "'Arial', sans-serif",
  fontSize: 14,
  color: "#1e293b",
  background: "#f8faff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.18s",
};

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("announcements");
  const [form, setForm] = useState({ title: "", message: "" });
  const [polls, setPolls] = useState([]);
  const [pollForm, setPollForm] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
  });

  const token = localStorage.getItem("adminToken");
  // console.log("Fetch token on announcement page:", token);

  useEffect(() => {
    fetchAnnouncements();
    fetchPolls();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await getAnnouncements(token);
    setAnnouncements(res.data.announcements);
  };

  const fetchPolls = async () => {
    const res = await getPolls(token);
    setPolls(res.data.polls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAnnouncement(form, token);
    console.log("Announcement created, Token:", token);
    setForm({ title: "", message: "" });
    fetchAnnouncements();
  };

  const handlePollSubmit = async () => {
    const options = [pollForm.option1, pollForm.option2, pollForm.option3].filter(Boolean);
    if (!pollForm.question || options.length < 2) 
      return;
    await createPoll({ question: pollForm.question, options }, token);
    
    setPollForm({ question: "", option1: "", option2: "", option3: "" });
    fetchPolls();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login-admin");
  };

  return (
    <div style={pageStyle}>
      {/* Use Navbar with no admin prop — this page doesn't fetch admin */}
      <AdminNavbar admin={null} onLogout={handleLogout} />

      <main
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        {/* PAGE HEADER */}
        <div style={{ marginBottom: 28 }}>
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
            Announcements & Polls
          </h2>
          <p
            style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: 14,
              color: "#94a3b8",
              marginTop: 4,
            }}
          >
            Publish announcements and run polls for your users.
          </p>
        </div>

        {/* TAB TOGGLE */}
        <div
          style={{
            display: "inline-flex",
            background: "#f0f4ff",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            border: "1.5px solid #e0e7ff",
          }}
        >
          {["announcements", "polls"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 22px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "'Arial', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.2px",
                transition: "all 0.18s",
                background:
                  activeTab === tab
                    ? "white"
                    : "transparent",
                color: activeTab === tab ? "#1e40af" : "#64748b",
                boxShadow:
                  activeTab === tab
                    ? "0 1px 8px rgba(30,64,175,0.10)"
                    : "none",
              }}
            >
              {tab === "announcements" ? "📣 Announcements" : "🗳️ Polls"}
            </button>
          ))}
        </div>

        {/* ── ANNOUNCEMENTS TAB ── */}
        {activeTab === "announcements" && (
          <div>
            {/* FORM CARD */}
            <div style={{ ...cardBase, padding: "28px", marginBottom: 24 }}>
              <h3
                style={{
                  fontFamily: "'Arial', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#1e3a8a",
                  margin: "0 0 20px",
                }}
              >
                Create Announcement
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      fontFamily: "'Arial', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Announcement title…"
                    style={inputStyle}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#3b82f6")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#e0e7ff")
                    }
                    required
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      fontFamily: "'Arial', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    placeholder="Write your announcement…"
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#3b82f6")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#e0e7ff")
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                    color: "white",
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 3px 12px rgba(30,64,175,0.22)",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.opacity = "0.88")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Publish Announcement
                </button>
              </form>
            </div>

            {/* ANNOUNCEMENT LIST */}
            <h3
              style={{
                fontFamily: "'Arial', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#1e3a8a",
                marginBottom: 14,
              }}
            >
              Published ({announcements.length})
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {announcements.length === 0 && (
                <div
                  style={{
                    ...cardBase,
                    padding: "32px",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontFamily: "'Arial', sans-serif",
                    fontSize: 14,
                  }}
                >
                  No announcements yet. Create one above.
                </div>
              )}
              {announcements.map((a) => (
                <div
                  key={a._id}
                  style={{
                    ...cardBase,
                    padding: "20px 24px",
                    transition: "box-shadow 0.18s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 32px rgba(30,64,175,0.13)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 2px 24px rgba(30,64,175,0.07)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                          flexWrap: "wrap",
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "'Arial', sans-serif",
                            fontWeight: 700,
                            fontSize: 15,
                            color: "#1e3a8a",
                            margin: 0,
                          }}
                        >
                          {a.title}
                        </h4>
                        {a.createdBy && (
                          <span
                            style={{
                              background: "#e0e7ff",
                              color: "#3b82f6",
                              fontFamily: "'Arial', sans-serif",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 20,
                            }}
                          >
                            {a.createdBy}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Arial', sans-serif",
                          fontSize: 14,
                          color: "#475569",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {a.message}
                      </p>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Arial', sans-serif",
                        fontSize: 11,
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {formatDate(a.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── POLLS TAB ── */}
        {activeTab === "polls" && (
          <div>
            {/* POLL FORM CARD */}
            <div style={{ ...cardBase, padding: "28px", marginBottom: 24 }}>
              <h3  
                style={{
                  fontFamily: "'Arial', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#1e3a8a",
                  margin: "0 0 20px",
                }}
              >   
                Create Poll
              </h3>

              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontFamily: "'Arial', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Question
                </label>
                <input
                  type="text"
                  placeholder="What would you like to ask?"
                  style={inputStyle}
                  value={pollForm.question}
                  onChange={(e) =>
                    setPollForm({ ...pollForm, question: e.target.value })
                  }
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#3b82f6")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#e0e7ff")
                  }
                />
              </div>

              {["option1", "option2", "option3"].map((key, i) => (
                <div key={key} style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      fontFamily: "'Arial', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Option {i + 1}
                  </label>
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}…`}
                    style={inputStyle}
                    value={pollForm[key]}
                    onChange={(e) =>
                      setPollForm({ ...pollForm, [key]: e.target.value })
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#3b82f6")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#e0e7ff")
                    }
                  />
                </div>
              ))}

              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={handlePollSubmit}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                    color: "white",
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 3px 12px rgba(30,64,175,0.22)",
                    transition: "all 0.18s",
                    opacity: pollForm.question ? 1 : 0.5,
                  }}
                >
                  Publish Poll
                </button>
                
              </div>
            </div>

            {/* POLLS PLACEHOLDER */}
          
            <h3 style={{ fontFamily: "'Arial', sans-serif", fontWeight: 700, fontSize: 15, color: "#1e3a8a", marginBottom: 14 }}>
              Published ({polls.length})
            </h3>
          
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {polls.length === 0 && (
                <div style={{ ...cardBase, padding: "32px", textAlign: "center", color: "#94a3b8", fontFamily: "'Arial', sans-serif", fontSize: 14 }}>
                  No polls yet. Create one above.
                </div>
              )}
              {polls.map((p) => (
                <div key={p._id} style={{ ...cardBase, padding: "20px 24px" }}>
                  <h4 style={{ fontFamily: "'Arial', sans-serif", fontWeight: 700, fontSize: 15, color: "#1e3a8a", margin: "0 0 12px" }}>
                    {p.question}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {p.options.map((opt, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "#f8faff", border: "1.5px solid #e0e7ff", fontFamily: "'Arial', sans-serif", fontSize: 14, color: "#475569" }}>
                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#e0e7ff", color: "#1e40af", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {i + 1}
                        </span>
                        {opt.text}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontFamily: "'Arial', sans-serif", fontSize: 11, color: "#94a3b8", marginTop: 10 }}>
                    {formatDate(p.createdAt)}
                  </div>
                </div>
              ))}
            </div>


          </div>

        )}
      </main>

    </div>
  );
}
