import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { Navbar } from '../components/ui/navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';

export default function QuizTakePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiService.quizzes.getById(id).then(res => {
      const q = res.data.data;
      setQuiz(q);
      setAnswers(new Array(q.questions.length).fill(null));
      setTimeLeft(q.timeLimit * 60);
    }).catch(() => navigate('/quizzes'));
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft <= 0 || !quiz) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quiz]);

  const autoSubmit = async () => {
    setSubmitting(true);
    try {
      await apiService.results.submit({ 
        quizId: id, 
        answers, 
        timeTaken: quiz.timeLimit * 60 
      });
      navigate('/results');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswer = (optIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => { if (currentIndex < quiz.questions.length - 1) setCurrentIndex(currentIndex + 1); };
  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0 && !window.confirm(`Wait! ${unanswered} questions are still empty. Submit anyway?`)) return;
    
    setSubmitting(true);
    try {
      await apiService.results.submit({ 
        quizId: id, 
        answers, 
        timeTaken: (quiz.timeLimit * 60) - timeLeft 
      });
      navigate('/results');
    } catch (err) { 
      alert('Submission failed'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  if (!quiz) return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="font-black text-2xl uppercase italic animate-pulse">Loading Mission... 🚀</div>
      </div>
    </>
  );

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        
        {/* Main Quiz Container */}
        <NeoCard className="rounded-[45px] p-0 overflow-hidden border-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
          
          {/* Header Section */}
          <div className="relative py-14 px-6 bg-indigo-50 border-b-4 border-black">
            {/* Quiz Title Sticker */}
            <div className="absolute -left-2 top-6 bg-purple-500 border-4 border-black px-6 py-2 rounded-xl -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-white font-black uppercase italic tracking-tighter text-lg">{quiz.title}</h2>
            </div>
            
            {/* Timer Badge */}
            <div className={`absolute right-6 top-6 border-4 border-black px-4 py-2 rounded-2xl font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-2 ${timeLeft < 60 ? 'bg-red-400 animate-pulse' : 'bg-yellow-400'}`}>
              {mins}:{secs.toString().padStart(2, '0')}
            </div>
          </div>

          <div className="p-8">
            {/* Chunky Progress Bar */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-black text-xs uppercase text-gray-400">Progress</span>
              <div className="flex-grow h-6 bg-gray-100 border-4 border-black rounded-full overflow-hidden">
                <div 
                  className="bg-[#5c94ff] h-full transition-all duration-500 border-r-4 border-black" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <span className="font-black text-xs">{currentIndex + 1} / {quiz.questions.length}</span>
            </div>

            {/* Question Bubble */}
            <div className="bg-purple-100 border-4 border-black p-6 rounded-[30px] mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black leading-tight italic">
                {quiz.questions[currentIndex].questionText}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-4 mb-10">
              {quiz.questions[currentIndex].options.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleAnswer(idx)} 
                  className={`relative w-full text-left p-5 border-4 border-black rounded-2xl font-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                    answers[currentIndex] === idx 
                    ? 'bg-[#5c94ff] text-white -translate-y-1' 
                    : 'bg-white hover:bg-indigo-50'
                  }`}
                >
                  <span className={`inline-block w-8 h-8 text-center leading-7 border-2 border-black rounded-lg mr-3 ${answers[currentIndex] === idx ? 'bg-white text-black' : 'bg-yellow-400'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-4 border-t-4 border-black border-dashed">
              <NeoButton 
                className={`rounded-2xl px-8 py-3 bg-white ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePrev} 
                disabled={currentIndex === 0}
              >
                ← Back
              </NeoButton>
              
              {currentIndex === quiz.questions.length - 1 ? (
                <NeoButton 
                  className="rounded-2xl px-10 py-3 bg-green-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                  onClick={handleSubmit} 
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Finish Quiz!'}
                </NeoButton>
              ) : (
                <NeoButton 
                  className="rounded-2xl px-10 py-3 bg-[#5c94ff] text-white" 
                  onClick={handleNext}
                >
                  Next Question →
                </NeoButton>
              )}
            </div>
          </div>
        </NeoCard>
      </div>
    </>
  );
}