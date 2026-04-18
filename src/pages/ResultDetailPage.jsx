import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/ui/navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';
const ResultBubble = ({ label, value, color }) => (
  <div className={`${color} border-4 border-black rounded-[30px] p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center flex-1`}>
    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">{label}</span>
    <span className="text-2xl font-black italic tracking-tighter leading-none">{value}</span>
  </div>
);
export default function ResultDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await apiService.results.getById(id);
        setResult(res.data.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          setError('Access Denied!');
        } else if (err.response?.status === 404) {
          setError('Report Missing!');
        } else {
          setError('System Error!');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);
  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="font-black text-2xl uppercase italic animate-bounce">Downloading Report...</div>
      </div>
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-400 border-4 border-black p-8 rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-4xl font-black italic mb-4 uppercase">{error}</h2>
          <NeoButton onClick={() => navigate('/dashboard')} className="bg-white">Go Back</NeoButton>
        </div>
      </div>
    </>
  );
  if (!result) return null;
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="relative mb-14 text-center">
          <div className="inline-block bg-[#5c94ff] border-4 border-black px-12 py-4 rounded-3xl -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
              Quiz Report
            </h1>
          </div>
          <Sparkle className="absolute -top-6 left-1/4 text-yellow-400 w-10 h-10" />
        </div>
        <NeoCard className="rounded-[45px] border-4 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white mb-10">
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div className="bg-purple-500 border-4 border-black p-6 rounded-[35px] text-white flex-grow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Challenger</span>
                  <h2 className="text-3xl font-black italic tracking-tighter">{result.userId?.username}</h2>
                  <p className="font-bold text-sm mt-2 opacity-90 italic">Quiz: {result.quizId?.title}</p>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] text-6xl opacity-20 rotate-12 italic font-black">?</div>
            </div>
            <div className="flex flex-wrap gap-4 w-full md:w-1/2">
               <ResultBubble label="Score" value={`${result.percentage}%`} color="bg-yellow-400" />
               <ResultBubble label="Points" value={`${result.score}/${result.totalPossibleScore}`} color="bg-cyan-200" />
               <ResultBubble label="Time" value={`${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`} color="bg-green-300" />
            </div>
          </div>
          <div className="border-t-4 border-black pt-10">
            <div className="bg-black text-white px-6 py-2 rounded-t-2xl font-black uppercase italic text-sm tracking-widest inline-block">
               Answer Review Log
            </div>
            <div className="bg-indigo-50 border-4 border-black rounded-b-3xl rounded-tr-3xl p-6 space-y-6">
              {result.answers?.map((ans, idx) => (
                <div 
                  key={idx} 
                  className={`border-4 border-black p-5 rounded-[30px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-[1.01] ${
                    ans.isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-xs uppercase italic tracking-widest text-black/50">
                       Question #{idx+1}
                    </span>
                    <span className={`px-4 py-1 rounded-full border-2 border-black font-black text-[10px] uppercase ${
                      ans.isCorrect ? 'bg-green-400' : 'bg-red-400 text-white'
                    }`}>
                      {ans.isCorrect ? 'Correct ✓' : 'Oops! ✗'}
                    </span>
                  </div>

                  <p className="font-black text-lg mb-4">
                    {ans.questionText || "Question Content"}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white border-2 border-black px-4 py-1 rounded-xl font-bold text-xs">
                      <span className="opacity-40 uppercase mr-2">Chosen:</span> 
                      {ans.selectedAnswer !== undefined ? `Option ${String.fromCharCode(65+ans.selectedAnswer)}` : 'N/A'}
                    </div>
                    <div className="bg-black text-white px-4 py-1 rounded-xl font-black text-xs">
                       +{ans.pointsEarned} PTS
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <NeoButton 
              onClick={() => navigate('/dashboard')} 
              className="bg-purple-500 text-white px-10 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Back to Dashboard
            </NeoButton>
            <NeoButton 
              onClick={() => navigate('/quizzes')} 
              className="bg-yellow-400 text-black px-10 py-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Open Quiz Library
            </NeoButton>
          </div>
        </NeoCard>
        <div className="text-center">
            <div className="inline-block bg-white border-4 border-black px-6 py-2 rounded-full rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-black text-[10px] uppercase tracking-widest">
                   Completed on: {new Date(result.completedAt).toLocaleDateString()}
                </span>
            </div>
        </div>
      </div>
    </>
  );
}