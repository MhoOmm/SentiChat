import { useEffect, useState } from "react";

export default function PollsPage() {
  const [polls, setPolls] = useState([]);

  // 🔥 TEMP USER (replace later with auth)
  const userId = "user123";

  const fetchPolls = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/poll/polls/all?userId=${userId}`
      );

      const data = await res.json();

      if (data.success) {
        setPolls(data.polls);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/poll/polls/vote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ pollId, optionIndex, userId })
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchPolls(); // refresh UI
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#04052e] text-white">

      {/* Header */}
      <header className="sticky top-0 backdrop-blur-md bg-[#04052e]/80 border-b border-white/[0.07]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <h1 className="font-bold text-sm">Polls</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {polls.map((poll) => {
          const totalVotes = poll.options.reduce(
            (sum, opt) => sum + opt.votes,
            0
          );

          const votedOption =
            poll.userVote !== null &&
            poll.userVote !== undefined
              ? poll.options[poll.userVote]
              : null;

          return (
            <div
              key={poll._id}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6"
            >
              <h2 className="text-sm font-semibold mb-3">
                {poll.question}
              </h2>

              {/* ✅ SAFE USER VOTE DISPLAY */}
              {votedOption && (
                <p className="text-xs text-green-400 mb-3">
                  You voted: {votedOption.text}
                </p>
              )}

              <div className="space-y-3">
                {poll.options.map((opt, index) => {
                  const percentage = totalVotes
                    ? Math.round((opt.votes / totalVotes) * 100)
                    : 0;

                  return (
                    <div
                      key={index}
                      onClick={() => handleVote(poll._id, index)}
                      className={`cursor-pointer border rounded-xl p-4 transition
                      ${
                        poll.userVote === index
                          ? "border-green-400 bg-green-500/10"
                          : "border-white/[0.07] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex justify-between text-sm mb-2">
                        <span>{opt.text}</span>
                        <span className="text-white/50">
                          {percentage}%
                        </span>
                      </div>

                      <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-white/40 mt-3 text-center">
                Total votes: {totalVotes}
              </p>
            </div>
          );
        })}
      </main>
    </div>
  );
}