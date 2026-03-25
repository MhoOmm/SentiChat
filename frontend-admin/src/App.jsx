import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import AdminLogin from "../pages/AdminLogin"
import AdminDashboard from "../pages/AdminDashboard";
import CommunityPage from "../pages/community/index";
import PostDetail from "../pages/community/PostDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/community" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login-admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/post/:postId" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
