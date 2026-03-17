import { useEffect, useState } from "react";
import { getAdmin } from "../src/services/AdminApi";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

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
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {admin && (
        <div className="mb-6">
          <p><strong>Username:</strong> {admin.username}</p>
          <p><strong>Email:</strong> {admin.email}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}