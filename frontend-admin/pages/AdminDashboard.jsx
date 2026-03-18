import { useEffect, useState } from "react";
import { getAdmin } from "../src/services/AdminApi";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {

  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfileMenu, setShowProfileMenu] = useState(false); 

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
      } 
      
      catch (err) {
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
    setShowProfileMenu(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl bg-blue-400">
        Loading...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-blue-400">
      {/* RESPONSIVE HEADER */}
      <header className="bg-white shadow-lg px-4 md:px-6 lg:px-10 py-4 border-b-4 border-blue-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo - Responsive */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-1 md:p-2">
              <img 
                src="../public/sentichat_logo.png" 
                alt="SentiChat Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Arial, sans-serif' }}>
              SentiChat Admin
            </h1>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navigation - Responsive */}
          <nav className="flex flex-col lg:flex-row lg:space-x-1 bg-gray-100 lg:bg-transparent p-2 lg:p-0 rounded-xl lg:rounded-none w-full lg:w-auto order-2 lg:order-1">
            <Link
              to="/admin/dashboard"
              className={`px-4 py-3 md:px-6 lg:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("dashboard")}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/announcements"
              className={`px-4 py-3 md:px-6 lg:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                activeTab === "announcements"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("announcements")}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Announcements & Polls
            </Link>
            <Link
              to="/admin/sentiments"
              className={`px-4 py-3 md:px-6 lg:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                activeTab === "sentiments"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("sentiments")}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Sentiments
            </Link>
          </nav>

          {/* Profile Circle */}
          <div className="flex items-center space-x-3 flex-shrink-0 order-3 lg:order-3">
            {admin && (
              <div className="relative">
                <div 
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                  title="Profile"
                >
                  {admin.username?.charAt(0)?.toUpperCase()}
                </div>
                
                {/* DROPDOWN MENU - Only shows on click */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100" style={{ fontFamily: 'Arial, sans-serif' }}>
                      {admin.username}
                    </div>
                    <div className="px-4 py-2 text-xs text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>
                      {admin.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold text-sm transition-all duration-200"
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* EMPTY CONTENT AREA FOR TEAM */}
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50 min-h-[400px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
            Dashboard Content
          </h2>
          {/* <p className="text-gray-600 mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            <strong>ML Team:</strong> Add sentiment analysis cards here
          </p>
          <p className="text-gray-600" style={{ fontFamily: 'Arial, sans-serif' }}>
            <strong>Tableau Team:</strong> Embed your Tableau dashboard/iframe below
          </p> */}
          {/* TEAM WILL REPLACE THIS */}
          <div className="mt-8 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
            <h3 className="text-xl font-semibold mb-2">Team Collaboration Area</h3>
            <p>KANISHK</p>
          </div>
        </div>
      </main>
    </div>
  );
}
