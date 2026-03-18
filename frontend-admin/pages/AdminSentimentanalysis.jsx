import { useEffect, useState } from "react";
import { getSentiment } from "../src/services/AdminApi";

export default function SentimentAnalysis() {
  const [stats, setStats] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    getSentiment(token).then((res) => {
      setStats(res.data.stats);
    });
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Sentiment Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-green-100 p-6 rounded text-center">
          <h3 className="font-bold text-lg">Positive</h3>
          <p className="text-2xl">{stats.positive}%</p>
        </div>

        <div className="bg-red-100 p-6 rounded text-center">
          <h3 className="font-bold text-lg">Negative</h3>
          <p className="text-2xl">{stats.negative}%</p>
        </div>

        <div className="bg-gray-200 p-6 rounded text-center">
          <h3 className="font-bold text-lg">Neutral</h3>
          <p className="text-2xl">{stats.neutral}%</p>
        </div>

      </div>

    </div>
  );
}