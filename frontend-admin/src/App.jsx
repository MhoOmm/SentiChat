import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin"
import AdminDashboard from "../pages/AdminDashboard";
import Announcements from "../pages/AdminAnnouncements";
import SentimentAnalysis from "../pages/AdminSentimentanalysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login-admin" />} />
        <Route path="/admin/login-admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/sentiments" element={<SentimentAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
