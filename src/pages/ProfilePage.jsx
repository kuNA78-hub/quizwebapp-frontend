import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Navbar } from '../components/ui/navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';

const StatBubble = ({ label, value, color }) => (
  <div className={`${color} border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center`}>
    <span className="text-2xl font-black italic">{value}</span>
    <span className="text-[10px] font-black uppercase text-center leading-tight">{label}</span>
  </div>
);

export default function ProfilePage() {
  const { user } = useAuth();
  const [studentStats, setStudentStats] = useState({ totalQuizzes: 0, averageScore: 0, passed: 0 });
  const [adminStats, setAdminStats] = useState({ totalQuizzesCreated: 0, totalStudents: 0, totalAttempts: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email });
      fetchStats();
    }
  }, [user]);
  const fetchStats = async () => {
    try {
      const myRes = await apiService.results.getUserResults();
      const myResults = myRes.data.data || [];
      const total = myResults.length;
      const avg = total ? myResults.reduce((s, r) => s + r.percentage, 0) / total : 0;
      const passed = myResults.filter(r => r.percentage >= 60).length;
      setStudentStats({ totalQuizzes: total, averageScore: Math.round(avg), passed });
      if (isAdmin) {
        const allRes = await apiService.results.getAllResults();
        const attempts = allRes.data.data || [];
        const uniqueStudents = new Set(attempts.map(a => a.userId?._id).filter(Boolean));
        const quizzesRes = await apiService.quizzes.getAll();
        const allQuizzes = quizzesRes.data.data || [];
        const myCreated = allQuizzes.filter(q => q.createdBy?._id === user?.id);
        setAdminStats({
          totalQuizzesCreated: myCreated.length,
          totalStudents: uniqueStudents.size,
          totalAttempts: attempts.length,
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await apiService.users.updateProfile(formData);
      alert('Profile updated!');
      setIsEditing(false);
    } catch (err) { alert('Update failed'); }
  };
  if (!user) return null;
  if (loading) return <><Navbar /><div className="text-center py-12 font-black uppercase italic">Loading profile...</div></>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="relative mb-10 text-center">
          <div className="inline-block bg-yellow-300 border-4 border-black px-8 py-2 rounded-full -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">My Profile</h1>
          </div>
          <span className="absolute -top-4 right-1/4 text-4xl animate-bounce">👤</span>
        </div>

        <NeoCard className="rounded-[40px] p-8 border-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-400 border-4 border-black p-2 rounded-xl font-black uppercase text-xs">Username</div>
                  <span className="text-xl font-black">{user.username}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-400 border-4 border-black p-2 rounded-xl font-black uppercase text-xs">Email</div>
                  <span className="text-lg font-bold text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-400 border-4 border-black p-2 rounded-xl font-black uppercase text-xs">Role</div>
                  <span className="text-sm font-black uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-lg">{user.role}</span>
                </div>
              </div>

              <div className="border-t-4 border-black pt-6">
                <h3 className="font-black uppercase text-sm mb-4 italic underline decoration-blue-400 decoration-4">
                  {isAdmin ? "Admin Power Stats" : "My Quiz Journey"}
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {!isAdmin ? (
                    <>
                      <StatBubble label="Taken" value={studentStats.totalQuizzes} color="bg-orange-300" />
                      <StatBubble label="Avg %" value={`${studentStats.averageScore}%`} color="bg-cyan-300" />
                      <StatBubble label="Passed" value={studentStats.passed} color="bg-green-300" />
                    </>
                  ) : (
                    <>
                      <StatBubble label="Created" value={adminStats.totalQuizzesCreated} color="bg-pink-300" />
                      <StatBubble label="Students" value={adminStats.totalStudents} color="bg-indigo-300" />
                      <StatBubble label="Attempts" value={adminStats.totalAttempts} color="bg-yellow-300" />
                    </>
                  )}
                </div>
              </div>

              <NeoButton 
                onClick={() => setIsEditing(true)} 
                className="w-full py-4 text-lg bg-[#5c94ff] text-white rounded-2xl"
              >
                Edit My Settings 
              </NeoButton>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-2">
                <label className="block font-black uppercase text-xs ml-2">Display Name</label>
                <input 
                  className="w-full border-4 border-black p-4 rounded-2xl font-bold bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-200 outline-none transition-all"
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="block font-black uppercase text-xs ml-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full border-4 border-black p-4 rounded-2xl font-bold bg-gray-50 focus:bg-white focus:ring-4 focus:ring-purple-200 outline-none transition-all"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="flex flex-col gap-3 pt-4">
                <NeoButton type="submit" className="bg-green-400 rounded-2xl py-4">Save Changes </NeoButton>
                <NeoButton 
                  variant="secondary" 
                  onClick={() => setIsEditing(false)}
                  className="bg-white rounded-2xl py-4"
                >
                  Nevermind 
                </NeoButton>
              </div>
            </form>
          )}
        </NeoCard>
      </div>
    </>
  );
}