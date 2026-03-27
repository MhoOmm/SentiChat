import { useState } from "react";
import { createComment } from "../../src/services/communityApi";
import VoteButtons from "./VoteButtons";
import { formatDistanceToNow } from "date-fns";

/** Depth-limited indent colours */
const depthBorder = ["border-white/20", "border-blue-400/30", "border-purple-400/30", "border-pink-400/30"];

export default function CommentItem({ comment, postId, depth = 0 }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [children, setChildren] = useState(comment.children ?? []);
  const [collapsed, setCollapsed] = useState(false);

  const author = comment.user?.userName ?? "deleted";
  const age = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  const borderColor = depthBorder[Math.min(depth, depthBorder.length - 1)];

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await createComment({
        postId,
        text: replyText,
        parentCommentId: comment._id,
      });
      if (data.success) {
        setChildren(prev => [...prev, { ...data.comment, children: [] }]);
        setReplyText("");
        setShowReply(false);
      }
    } catch {
      alert("Unable to post reply — are you logged in?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`ml-${depth > 0 ? 4 : 0} mt-3`}>
      <div className={`border-l-2 pl-4 ${borderColor}`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          {comment.user?.avatar ? (
            <img src={comment.user.avatar} alt={author} className="w-5 h-5 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-white/60 uppercase">{author[0]}</span>
            </div>
          )}
          <span className="text-xs text-white/60 font-medium">u/{author}</span>
          <span className="text-white/20 text-xs">{age}</span>

          {/* collapse toggle */}
          {children.length > 0 && (
            <button
              onClick={() => setCollapsed(c => !c)}
              className="ml-auto text-white/30 hover:text-white/60 text-[10px] transition-colors"
            >
              {collapsed ? `[+${children.length}]` : "[–]"}
            </button>
          )}
        </div>

        {/* Body */}
        <p className="text-white/75 text-sm leading-relaxed mb-2">{comment.text}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <VoteButtons
            targetId={comment._id}
            type="comment"
            initialUp={comment.upvotes?.length ?? 0}
            initialDown={comment.downvotes?.length ?? 0}
          />
          <button
            id={`reply-btn-${comment._id}`}
            onClick={() => setShowReply(r => !r)}
            className="text-[11px] text-white/30 hover:text-white/70 transition-colors font-medium"
          >
            Reply
          </button>
        </div>

        {/* Reply box */}
        {showReply && (
          <div className="mt-3 space-y-2">
            <textarea
              id={`reply-input-${comment._id}`}
              rows={2}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write a reply…"
              className="w-full bg-white/5 border border-white/10 focus:border-white/30
                         rounded-xl px-3 py-2 text-sm text-white placeholder-white/30
                         resize-none outline-none transition-colors"
            />
            <div className="flex gap-2">
              <button
                id={`reply-submit-${comment._id}`}
                onClick={submitReply}
                disabled={submitting}
                className="text-xs px-4 py-1.5 bg-white text-[#04052e] rounded-lg
                           font-semibold hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {submitting ? "Posting…" : "Post Reply"}
              </button>
              <button
                onClick={() => { setShowReply(false); setReplyText(""); }}
                className="text-xs px-3 py-1.5 text-white/40 hover:text-white/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Nested children */}
        {!collapsed && children.map(child => (
          <CommentItem key={child._id} comment={child} postId={postId} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
}
