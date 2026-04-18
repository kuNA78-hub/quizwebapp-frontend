import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/ui/navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res.success) navigate('/dashboard');
  };
  const inputClass = "border-4 border-black rounded-xl p-4 w-full font-bold bg-white focus:bg-indigo-50 outline-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]";
  const labelClass = "block font-black uppercase text-[10px] tracking-[0.2em] ml-2 mb-1 text-gray-500";

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans text-black pb-20">
        <div className="container mx-auto px-4 py-12 max-w-md">
          <div className="relative mb-10 text-center">
            <div className="inline-block bg-purple-500 border-4 border-black px-10 py-3 rounded-2xl -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Join the Club!</h2>
            </div>
            <Sparkle className="absolute -top-6 -left-4 text-yellow-400 w-10 h-10 animate-pulse" />
          </div>
          <NeoCard className="rounded-[45px] border-4 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Username</label>
                <input 
                  placeholder="CoolQuizzer123"
                  value={form.username} 
                  onChange={e => setForm({...form, username: e.target.value})} 
                  className={inputClass} 
                  required 
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="hello@example.com"
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className={inputClass} 
                  required 
                />
              </div>
              <div>
                <label className={labelClass}>Secret Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  className={inputClass} 
                  required 
                />
              </div>
              <div>
                <label className={labelClass}>Pick Your Role</label>
                <div className="grid grid-cols-2 gap-3 p-2 bg-indigo-50 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <button
                    type="button"
                    onClick={() => setForm({...form, role: 'user'})}
                    className={`py-2 rounded-xl font-black uppercase text-xs transition-all border-2 border-transparent ${form.role === 'user' ? 'bg-yellow-400 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-white'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({...form, role: 'admin'})}
                    className={`py-2 rounded-xl font-black uppercase text-xs transition-all border-2 border-transparent ${form.role === 'admin' ? 'bg-[#5c94ff] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:bg-white'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <NeoButton 
                  type="submit" 
                  className="w-full py-5 rounded-2xl bg-[#5c94ff] text-white text-xl font-black uppercase italic tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Account '}
                </NeoButton>
              </div>
            </form>
            <div className="mt-8 text-center">
              <p className="font-bold text-gray-500 text-sm">
                Already part of the crew? <br />
                <Link to="/login" className="text-purple-600 font-black uppercase tracking-widest hover:underline decoration-4">
                  Log In Here
                </Link>
              </p>
            </div>
          </NeoCard>
        </div>
      </div>
    </>
  );
}