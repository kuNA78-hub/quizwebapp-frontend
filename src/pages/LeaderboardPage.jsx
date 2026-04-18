import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { Navbar } from '../components/ui/navbar';
import { NeoCard } from '../components/ui/NeoCard';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.results.getLeaderboard().then(res => setLeaderboard(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><div className="text-center py-12">Loading...</div></>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NeoCard className="overflow-hidden p-0">
          <div className="bg-black text-white p-4 font-black text-xl">Student Leaderboard</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b-2 border-black bg-gray-100"><th className="p-3">Rank</th><th className="p-3">Student</th><th className="p-3">Total Score</th><th className="p-3">Quizzes</th><th className="p-3">Avg %</th></tr></thead>
              <tbody>
                {leaderboard.map((entry, idx) => (
                  <tr key={entry._id} className="border-b-2 border-black last:border-0"><td className="p-3 font-bold">{idx+1}</td><td className="p-3">{entry.username}</td><td className="p-3">{Math.round(entry.totalScore)}</td><td className="p-3">{entry.totalQuizzes}</td><td className="p-3">{Math.round(entry.averagePercentage)}%</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </NeoCard>
      </div>
    </>
  );
}
