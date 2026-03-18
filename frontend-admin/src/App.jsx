import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import AdminLogin from "../pages/AdminLogin"
import AdminDashboard from "../pages/AdminDashboard";

import GrievancePage from "../pages/GrievancePage"
import Announcements from "../pages/AdminAnnouncements";
import SentimentAnalysis from "../pages/AdminSentimentanalysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/greivance" element={<GrievancePage />} />
        <Route path="/admin/login-admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/sentiments" element={<SentimentAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
