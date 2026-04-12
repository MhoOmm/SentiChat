import { Link } from "react-router-dom";
import VoteButtons from "./VoteButtons";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post }) {
  const age = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const author = post.user?.userName ?? "deleted";

  return (
    <article
      id={`post-${post._id}`}
      className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5
                 hover:bg-white/[0.06] hover:border-white/[0.14]
                 transition-all duration-200 cursor-pointer"
    >
      {/* Top meta */}
      <div className="flex items-center gap-2 mb-3">
        {/* Avatar */}
        {post.user?.avatar ? (
          <img src={post.user.avatar} alt={author} className="w-7 h-7 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-white/70 uppercase">
              {author[0]}
            </span>
          </div>
        )}
        <span className="text-xs text-white/40 font-medium">
          <span className="text-white/60">u/{author}</span>
          <span className="mx-1">·</span>
          {age}
        </span>
      </div>

      <Link to={`/community/post/${post._id}`} className="block">
        {/* Body preview */}
        <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
          {post.text}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.07]">
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

        <Link
          to={`/community/post/${post._id}`}
          id={`post-comments-${post._id}`}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comments
        </Link>
      </div>
    </article>
  );
}
