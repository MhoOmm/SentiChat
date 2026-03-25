import { useState, useEffect } from "react";
import { getPosts, createPost } from "../../src/services/communityApi";
import PostCard from "../../components/community/PostCard";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await getPosts();
      setPosts(data.posts ?? []);
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await createPost({ title, text });
      if (data.success) {
        setPosts(prev => [data.post, ...prev]);
        setTitle(""); setText(""); setShowForm(false);
      }
    } catch {
      alert("Unable to post — are you logged in?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04052e] text-white">

      {/* ── Nav bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#04052e]/80 border-b border-white/[0.07]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Logo dot */}
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span className="font-bold text-sm tracking-wide">SentiChat Community</span>
          </div>
          <button
            id="open-create-post"
            onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20
                       text-xs font-semibold hover:bg-white hover:text-[#04052e]
                       transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* ── Create post form ─────────────────────────────── */}
        {showForm && (
          <div className="bg-white/[0.04] border border-white/[0.10] rounded-2xl p-5 space-y-3
                          animate-[fadeIn_0.15s_ease]">
            <h2 className="text-sm font-semibold text-white/80">Create a post</h2>
            <input
              id="post-title-input"
              type="text"
              value={title}
              maxLength={300}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-white/30
                         rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30
                         outline-none transition-colors"
            />
            <textarea
              id="post-body-input"
              rows={4}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's on your mind? (text only)"
              className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-white/30
                         rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30
                         resize-none outline-none transition-colors"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowForm(false); setTitle(""); setText(""); }}
                className="px-4 py-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >Cancel</button>
              <button
                id="post-submit"
                onClick={handleCreate}
                disabled={submitting || !title.trim() || !text.trim()}
                className="px-6 py-2 bg-white text-[#04052e] text-xs font-bold rounded-xl
                           hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        )}

        {/* ── Sort/filter bar ──────────────────────────────── */}
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="font-semibold text-white/70">Latest</span>
          <span className="w-px h-3 bg-white/10" />
          <span>{posts.length} posts</span>
        </div>

        {/* ── Post list ────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 animate-pulse">
                <div className="h-3 w-32 bg-white/10 rounded mb-4" />
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                <div className="h-3 w-full bg-white/[0.06] rounded mb-1" />
                <div className="h-3 w-2/3 bg-white/[0.06] rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm text-center py-10">{error}</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-white/30 text-sm">No posts yet. Start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
