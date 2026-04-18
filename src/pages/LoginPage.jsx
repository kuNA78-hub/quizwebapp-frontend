import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/ui/navbar';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { Sparkle } from '../components/ui/Sparkle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.success) navigate('/dashboard');
  };

  // Chunky Input Styles
  const inputClass = "border-4 border-black rounded-xl p-4 w-full font-bold bg-white focus:bg-indigo-50 outline-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]";
  const labelClass = "block font-black uppercase text-[10px] tracking-[0.2em] ml-2 mb-1 text-gray-500";

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-sans text-black pb-20">
        <div className="container mx-auto px-4 py-16 max-w-md">
          
          {/* Section 1: Sticker Ribbon Header */}
          <div className="relative mb-10 text-center">
            <div className="inline-block bg-[#5c94ff] border-4 border-black px-10 py-3 rounded-2xl rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Sign In</h2>
            </div>
            <Sparkle className="absolute -top-6 -right-4 text-yellow-400 w-10 h-10 animate-pulse" />
          </div>

          {/* Section 2: Login Card */}
          <NeoCard className="rounded-[45px] border-4 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className={labelClass}>Your Email</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {/* Section 3: Submit Button (High Contrast Yellow) */}
              <div className="pt-2">
                <NeoButton 
                  type="submit" 
                  className="w-full py-5 rounded-2xl bg-yellow-400 text-black text-xl font-black uppercase italic tracking-tighter shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                  disabled={loading}
                >
                  {loading ? 'Entering...' : 'Let\'s Go! '}
                </NeoButton>
              </div>
            </form>

            {/* Section 4: Footer Link Badge */}
            <div className="mt-8 text-center border-t-4 border-black border-dashed pt-6">
              <p className="font-bold text-gray-500 text-sm mb-2">
                New around here?
              </p>
              <Link to="/register">
                <div className="inline-block bg-purple-200 border-2 border-black px-6 py-2 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-purple-300 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  Register Account
                </div>
              </Link>
            </div>
          </NeoCard>
        </div>
      </div>
    </>
  );
}