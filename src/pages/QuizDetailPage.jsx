import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/ui/navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';

const InfoBubble = ({ label, value, color }) => (
  <div className={`${color} border-4 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center`}>
    <span className="text-[10px] font-black uppercase tracking-widest text-black/50 mb-1">{label}</span>
    <span className="text-lg font-black italic text-center leading-tight">{value}</span>
  </div>
);

export default function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    apiService.quizzes.getById(id)
      .then(res => setQuiz(res.data.data))
      .catch(() => navigate('/quizzes'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStart = () => { 
    if (!isAuthenticated) navigate('/login'); 
    else navigate(`/quiz/${id}/take`); 
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="font-black text-2xl uppercase italic animate-bounce">Scanning Mission Details... 🛰️</div>
      </div>
    </>
  );
  if (!quiz) return null;
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="relative mb-14 text-center">
          <div className="inline-block bg-[#5c94ff] border-4 border-black px-10 py-4 rounded-3xl -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
              {quiz.title}
            </h1>
          </div>
          <Sparkle className="absolute -top-6 -left-4 text-yellow-400 w-12 h-12" />
        </div>
        <NeoCard className="rounded-[45px] border-4 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white mb-10">
          <p className="text-xl font-bold text-gray-700 mb-10 text-center leading-relaxed italic">
            "{quiz.description || "Get ready to test your brain cells with this awesome challenge!"}"
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <InfoBubble label="Category" value={quiz.category} color="bg-purple-200" />
            <InfoBubble label="Difficulty" value={quiz.difficulty} color="bg-cyan-200" />
            <InfoBubble label="Questions" value={quiz.questions?.length} color="bg-yellow-300" />
            <InfoBubble label="Time Limit" value={`${quiz.timeLimit}m`} color="bg-green-300" />
          </div>
          {isAdmin ? (
            <div className="border-t-4 border-black pt-10">
              <div className="inline-block bg-black text-white px-6 py-2 rounded-t-2xl font-black uppercase italic text-sm tracking-widest">
                Admin Intel: Questions Preview
              </div>
              <div className="bg-indigo-50 border-4 border-black rounded-b-3xl rounded-tr-3xl p-6 space-y-6">
                {quiz.questions.map((q, idx) => (
                  <div key={idx} className="bg-white border-4 border-black p-5 rounded-[25px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between mb-2">
                        <span className="font-black text-xs uppercase text-purple-500 italic">Question #{idx+1}</span>
                        <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest">{q.points} PTS</span>
                    </div>
                    <p className="font-black text-lg mb-4">{q.questionText}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((opt, oidx) => (
                        <div key={oidx} className={`p-2 border-2 border-black rounded-xl text-sm font-bold flex items-center gap-2 ${oidx === q.correctAnswer ? 'bg-green-300' : 'bg-gray-50'}`}>
                          <span className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-lg text-[10px]">{String.fromCharCode(65+oidx)}</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                 <Link to="/quizzes">
                    <NeoButton className="bg-black text-white rounded-2xl px-10">Return to Library</NeoButton>
                 </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
                <div className="bg-yellow-100 border-2 border-black border-dashed p-4 rounded-2xl text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">Ready to begin?</p>
                </div>
                <NeoButton 
                    onClick={handleStart} 
                    className="w-full md:w-80 py-6 text-2xl bg-[#5c94ff] text-white rounded-[30px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase italic font-black"
                >
                    Start Mission!
                </NeoButton>
                <Link to="/quizzes" className="font-black uppercase text-xs text-gray-400 hover:text-black transition-colors underline decoration-2 underline-offset-4">
                    Wait, let me go back
                </Link>
            </div>
          )}
        </NeoCard>
        <div className="flex justify-center">
            <div className="bg-white border-4 border-black px-6 py-2 rounded-full rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-black text-[10px] uppercase tracking-[0.2em]">Good Luck, {user?.username || 'Challenger'}!</span>
            </div>
        </div>
      </div>
    </>
  );
}