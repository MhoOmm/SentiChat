import { useState } from "react";
import { votePost, voteComment } from "../../src/services/communityApi";

/**
 * Reusable up/down vote buttons.
 * Props:
 *   targetId  – post or comment _id
 *   type      – "post" | "comment"
 *   initialUp – number
 *   initialDown – number
 *   userVote  – "up" | "down" | null  (initial state from server if provided)
 */
export default function VoteButtons({ targetId, type, initialUp = 0, initialDown = 0, userVote = null }) {
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [voted, setVoted] = useState(userVote); // "up" | "down" | null
  const [loading, setLoading] = useState(false);

  const score = up - down;

  const handleVote = async (dir) => {
    if (loading) return;
    setLoading(true);

    // Optimistic UI
    const wasVoted = voted === dir;
    const prevUp = up, prevDown = down, prevVoted = voted;

    if (dir === "up") {
      setUp(wasVoted ? up - 1 : up + 1);
      if (voted === "down") setDown(d => d - 1);
    } else {
      setDown(wasVoted ? down - 1 : down + 1);
      if (voted === "up") setUp(u => u - 1);
    }
    setVoted(wasVoted ? null : dir);

    try {
      const voteValue = dir === "up" ? 1 : -1;
      const fn = type === "post" ? votePost : voteComment;
      const res = await fn(targetId, voteValue);
      if (!res.data.success) throw new Error("Vote failed");
    } catch {
      // rollback
      setUp(prevUp); setDown(prevDown); setVoted(prevVoted);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Up */}
      <button
        id={`vote-up-${targetId}`}
        onClick={() => handleVote("up")}
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150 border
          ${voted === "up"
            ? "bg-white text-[#04052e] border-white"
            : "bg-transparent text-white/50 border-white/20 hover:border-white/60 hover:text-white"
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Score */}
      <span className={`text-xs font-bold min-w-[1.5rem] text-center tabular-nums
        ${score > 0 ? "text-white" : score < 0 ? "text-red-400" : "text-white/40"}`}>
        {score}
      </span>

      {/* Down */}
      <button
        id={`vote-down-${targetId}`}
        onClick={() => handleVote("down")}
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-150 border
          ${voted === "down"
            ? "bg-red-400 text-white border-red-400"
            : "bg-transparent text-white/50 border-white/20 hover:border-red-400/60 hover:text-red-400"
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
