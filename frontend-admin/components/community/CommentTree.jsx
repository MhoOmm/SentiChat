import { useState } from "react";
import { createComment } from "../../src/services/communityApi";
import CommentItem from "./CommentItem";

export default function CommentTree({ roots: initialRoots, postId }) {
  const [roots, setRoots] = useState(initialRoots ?? []);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await createComment({ postId, text });
      if (data.success) {
        setRoots(prev => [{ ...data.comment, children: [] }, ...prev]);
        setText("");
      }
    } catch {
      alert("Unable to post comment — are you logged in?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-white/60 text-sm font-semibold mb-4 uppercase tracking-widest">
        {roots.length} Comment{roots.length !== 1 ? "s" : ""}
      </h3>

      {/* Top-level comment box */}
      <div className="mb-6 space-y-2">
        <textarea
          id="comment-input"
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="What do you think?"
          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-white/25
                     rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30
                     resize-none outline-none transition-colors"
        />
        <button
          id="comment-submit"
          onClick={submit}
          disabled={submitting || !text.trim()}
          className="px-6 py-2 bg-white text-[#04052e] text-sm font-bold rounded-xl
                     hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Posting…" : "Comment"}
        </button>
      </div>

      {/* Comment tree */}
      {roots.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-10">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-1">
          {roots.map(comment => (
            <CommentItem key={comment._id} comment={comment} postId={postId} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}
