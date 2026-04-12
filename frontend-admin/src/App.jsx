import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import AdminLogin from "../pages/AdminLogin"
import AdminDashboard from "../pages/AdminDashboard";
import CommunityPage from "../pages/community/index";
import PostDetail from "../pages/community/PostDetail";
import UserDashboard from "../pages/community/UserDashboard";
import AnnouncementsPage from "../pages/community/Anouncements"
import PollsPage from "../pages/community/PollsPage"
import AdminGrievances from "../pages/AdminGrievancePage"

import WriteGreivance from "../pages/community/Greivance"
import Announcements from "../pages/AdminAnnouncements";
import SentimentAnalysis from "../pages/AdminSentimentanalysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/greivance" element={<WriteGreivance />} />
        <Route path="/admin/login-admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/post/:postId" element={<PostDetail />} />
        <Route path="/community/dashboard" element={<UserDashboard />} />
        <Route path="/community/announcement" element={<AnnouncementsPage />} />
        <Route path="/community/polls" element={<PollsPage />} />

        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/sentiments" element={<SentimentAnalysis />} />
        <Route path="/admin/greivances" element={<AdminGrievances/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
