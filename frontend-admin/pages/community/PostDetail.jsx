import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, getComments } from "../../src/services/communityApi";
import VoteButtons from "../../components/community/VoteButtons";
import CommentTree from "../../components/community/CommentTree";
import { formatDistanceToNow } from "date-fns";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [roots, setRoots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!postId) return;
    (async () => {
      setLoading(true);
      try {
        const [postRes, commRes] = await Promise.all([
          getPost(postId),
          getComments(postId),
        ]);
        setPost(postRes.data.post);
        setRoots(commRes.data.roots ?? []);
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  return (
    <div className="min-h-screen bg-[#04052e] text-white">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#04052e]/80 border-b border-white/[0.07]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            id="back-btn"
            onClick={() => navigate("/community")}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       border border-white/15 hover:bg-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-bold text-sm tracking-wide truncate">
            Post
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-5 w-2/3 bg-white/10 rounded" />
            <div className="h-3 w-full bg-white/[0.06] rounded" />
            <div className="h-3 w-5/6 bg-white/[0.06] rounded" />
            <div className="h-3 w-4/6 bg-white/[0.06] rounded" />
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm text-center py-10">{error}</p>
        ) : post ? (
          <>
            {/* ── Post body ─────────────────────────────────── */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-6">

              {/* Author + age */}
              <div className="flex items-center gap-2 mb-4">
                {post.user?.avatar ? (
                  <img src={post.user.avatar} alt={post.user?.userName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-white/60 uppercase">
                      {(post.user?.userName ?? "?")[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-white/70">u/{post.user.userName}</p>
                  <p className="text-[10px] text-white/30">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{post.text}</p>

              {/* Vote row */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/[0.07]">
                <VoteButtons
                  targetId={post._id}
                  type="post"
                  initialUp={post.upvotes || 0}
                  initialDown={post.downvotes || 0}
                  userVote={(() => {
                    try {
                      const token = localStorage.getItem("token");
                      if (!token) return null;
                      const payload = JSON.parse(atob(token.split('.')[1]));
                      const me = payload.id;
                      const vote = post.votes?.find(v => v.user === me || (v.user && v.user._id === me));
                      return vote ? (vote.value === 1 ? "up" : "down") : null;
                    } catch { return null; }
                  })()}
                />
              </div>
            </div>

            {/* ── Comment tree ──────────────────────────────── */}
            <CommentTree roots={roots} postId={postId} />
          </>
        ) : null}
      </main>
    </div>
  );
}
