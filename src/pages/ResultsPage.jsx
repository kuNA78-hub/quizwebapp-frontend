import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import apiService from '../services/api';
import { Navbar } from '../components/ui/navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';

export default function ResultsPage() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const latestResult = location.state?.result;
  useEffect(() => {
    apiService.results.getUserResults()
      .then(res => setResults(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="font-black text-2xl uppercase italic animate-bounce">
          Fetching your trophies... 
        </div>
      </div>
    </>
  );
  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans text-black pb-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="relative mb-16 text-center">
            <div className="inline-block bg-purple-500 border-4 border-black px-12 py-4 rounded-3xl -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                My Results
              </h1>
            </div>
            <Sparkle className="absolute -top-6 -right-4 text-yellow-400 w-12 h-12" />
          </div>
          {latestResult && (
            <div className="relative mb-12">
              <div className="absolute -inset-2 bg-black rounded-[45px] rotate-1"></div>
              <NeoCard className="relative z-10 bg-green-300 rounded-[40px] border-4 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <span className="bg-black text-white px-4 py-1 rounded-full font-black text-[10px] uppercase italic tracking-widest mb-2 inline-block">
                    Latest Mission Update
                  </span>
                  <h2 className="text-3xl font-black italic tracking-tighter">You just crushed it!</h2>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center min-w-[100px]">
                    <div className="text-2xl font-black">{latestResult.percentage}%</div>
                    <div className="text-[9px] font-black uppercase text-gray-400">Score</div>
                  </div>
                  <div className="bg-yellow-300 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center min-w-[100px]">
                    <div className="text-2xl font-black text-green-700">PASS</div>
                    <div className="text-[9px] font-black uppercase text-black/40">Status</div>
                  </div>
                </div>
              </NeoCard>
            </div>
          )}
          <div className="space-y-6">
            {results.length === 0 ? (
              <NeoCard className="rounded-[30px] p-20 text-center border-4 border-dashed border-black bg-indigo-50/50">
                <div className="text-6xl mb-4">🕸️</div>
                <p className="font-black uppercase italic tracking-widest text-gray-400">No history found...</p>
                <Link to="/quizzes">
                   <NeoButton className="mt-6 bg-[#5c94ff] text-white px-8">Go Take a Quiz!</NeoButton>
                </Link>
              </NeoCard>
            ) : (
              results.map(r => (
                <NeoCard 
                  key={r._id} 
                  className="rounded-[35px] border-4 p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    <div className="flex-grow text-center md:text-left">
                      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-cyan-200 border-2 border-black px-2 py-0.5 rounded-lg">
                          {r.quizId?.category || 'General'}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-100 border-2 border-black px-2 py-0.5 rounded-lg text-gray-500">
                          {new Date(r.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black italic tracking-tighter group-hover:text-[#5c94ff] transition-colors">
                        {r.quizId?.title || 'Untitled Quiz'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-black italic leading-none">{r.percentage}%</div>
                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                          {r.score}/{r.totalPossibleScore} PTS
                        </div>
                      </div>
                      <Link to={`/results/${r._id}`}>
                        <NeoButton className="bg-yellow-400 border-2 px-5 py-2 text-xs rounded-xl hover:bg-black hover:text-white transition-all">
                          Details ↗
                        </NeoButton>
                      </Link>
                    </div>
                  </div>
                </NeoCard>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}