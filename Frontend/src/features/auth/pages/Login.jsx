import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/use.auth';

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleLogin({ email, password });
    if (result && result.success) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0b0f19] flex justify-center items-center">
        <div className="flex items-center gap-2.5 text-gray-400">
          <div className="w-5 h-5 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
          <span className="text-[13px] font-medium tracking-wide">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] flex flex-col justify-between overflow-x-hidden text-gray-300 font-sans">
      <div className="h-6"></div>

      <div className="w-full max-w-[400px] mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <span className="text-[12px] text-rose-400 font-bold">★</span>
          </div>
          <span className="text-[16px] font-bold text-white tracking-wide">InterviewAI</span>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-[22px] font-extrabold text-white text-center mb-1">Welcome back</h1>
          <p className="text-[13px] text-gray-400 text-center mb-8">Sign in to continue preparing</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[12px] font-bold text-gray-400 tracking-wider uppercase">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-800/80 rounded-xl px-4 py-3 text-[14px] text-gray-200 outline-none focus:border-rose-500/30 transition-colors duration-200 placeholder-gray-600/70"
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[12px] font-bold text-gray-400 tracking-wider uppercase">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0f19] border border-gray-800/80 rounded-xl px-4 py-3 text-[14px] text-gray-200 outline-none focus:border-rose-500/30 transition-colors duration-200 placeholder-gray-600/70"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-[14px] font-bold cursor-pointer bg-rose-600 hover:bg-rose-500 text-white transition-colors duration-200 shadow-lg shadow-rose-600/10 active:scale-[0.98] mt-2"
            >
              Sign In
            </button>

          </form>
        </div>

        <p className="text-center text-[13px] text-gray-500 mt-7">
          Don't have an account?{' '}
          <Link to="/register" className="text-rose-400 font-semibold no-underline hover:text-rose-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>

      {/* Footer Links */}
      <footer className="py-6 border-t border-gray-800/40 text-center">
        <div className="flex justify-center gap-6 text-[12px] text-gray-500">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;