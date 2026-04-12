import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../src/services/communityApi";
import PostCard from "../../components/community/PostCard";
import { formatDistanceToNow } from "date-fns";

export default function UserDashboard() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProfile();
        setProfileData(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
     return <div className="min-h-screen bg-[#04052e] text-white flex items-center justify-center">Loading...</div>;
  }

  if (!profileData || !profileData.user) {
     return <div className="min-h-screen bg-[#04052e] text-white flex items-center justify-center">Error loading profile.</div>;
  }

  const { user, likedPosts } = profileData;
  const username = user.userName || "User";
  const avatar = user.avatar;

  const renderTabContent = () => {
    if (activeTab === "posts") {
       if (!user.posts || user.posts.length === 0) return <p className="text-white/30 text-sm py-8 text-center">No posts created yet.</p>;
       return <div className="space-y-3">{user.posts.map(post => <PostCard key={post._id} post={post} />)}</div>;
    }
    if (activeTab === "liked") {
       if (!likedPosts || likedPosts.length === 0) return <p className="text-white/30 text-sm py-8 text-center">No liked posts.</p>;
       return <div className="space-y-3">{likedPosts.map(post => <PostCard key={post._id} post={post} />)}</div>;
    }
    if (activeTab === "comments") {
       if (!user.comments || user.comments.length === 0) return <p className="text-white/30 text-sm py-8 text-center">No comments yet.</p>;
       return <div className="space-y-3">
         {user.comments.map(comment => (
            <div key={comment._id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
               <p className="text-white/80 text-sm mb-2">{comment.text}</p>
               <div className="flex justify-between items-center text-[10px] text-white/40">
                  <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                  <Link to={`/community/post/${comment.post}`} className="text-white hover:underline">View Post</Link>
               </div>
            </div>
         ))}
       </div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#04052e] text-white pb-10">
      {/* ── Nav bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#04052e]/80 border-b border-white/[0.07]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/community" className="text-white/50 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="font-bold text-sm tracking-wide">My Profile</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 text-center animate-[fadeIn_0.5s_ease]">
          {avatar ? (
             <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto mb-5 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10" />
          ) : (
             <div className="w-24 h-24 rounded-full bg-[#04052e] flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 text-3xl font-bold uppercase">
                {username[0]}
             </div>
          )}
          <h2 className="text-2xl font-bold mb-1">u/{username}</h2>
          <p className="text-white/40 text-sm flex gap-3 justify-center">
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{user.posts?.length || 0} Posts</span>
            <span>•</span>
            <span>{user.comments?.length || 0} Comments</span>
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-white/10 gap-6">
           <button 
             onClick={() => setActiveTab("posts")} 
             className={`py-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === "posts" ? "text-white border-white" : "text-white/40 border-transparent hover:text-white/70"}`}
           >
             My Posts
           </button>
           <button 
             onClick={() => setActiveTab("comments")} 
             className={`py-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === "comments" ? "text-white border-white" : "text-white/40 border-transparent hover:text-white/70"}`}
           >
             Comments
           </button>
           <button 
             onClick={() => setActiveTab("liked")} 
             className={`py-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === "liked" ? "text-white border-white" : "text-white/40 border-transparent hover:text-white/70"}`}
           >
             Liked Posts
           </button>
        </div>

        {/* Tab Content */}
        <div className="animate-[fadeIn_0.3s_ease]">
           {renderTabContent()}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
