import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/use.auth';

const Register = () => {

  const navigate = useNavigate();
  const { loading, handleRegister } = useAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [rePassword, setRePassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await handleRegister({ username, email, password, rePassword, phone })
    if (response.success) {
      navigate("/")
    } else {
      console.log(response.error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#f7f5f0] flex justify-center items-center">
        <div className="flex items-center gap-2.5 text-[#9b9489]">
          <div className="w-4 h-4 rounded-full border-2 border-[#d5cfc5] border-t-[#b48c5f] animate-spin" />
          <span className="text-[13px]">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f5f0] flex justify-center items-center px-6 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#2d2a26] flex items-center justify-center">
            <span className="text-[12px] text-[#f7f5f0] font-bold">AI</span>
          </div>
          <span className="text-[15px] font-semibold text-[#2d2a26]">InterviewAI</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e8e3db] rounded-2xl p-8 shadow-sm">
          <h1 className="text-[22px] font-bold text-[#2d2a26] text-center mb-1">Create your account</h1>
          <p className="text-[13px] text-[#9b9489] text-center mb-8">Start your interview preparation journey</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-[12px] font-medium text-[#6b6560] tracking-wide">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#faf8f4] border border-[#e8e3db] rounded-xl px-4 py-3 text-[14px] text-[#2d2a26] outline-none focus:border-[#b48c5f]/40 focus:ring-2 focus:ring-[#b48c5f]/10 transition-all duration-200 placeholder-[#c5bfb5]"
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[12px] font-medium text-[#6b6560] tracking-wide">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#faf8f4] border border-[#e8e3db] rounded-xl px-4 py-3 text-[14px] text-[#2d2a26] outline-none focus:border-[#b48c5f]/40 focus:ring-2 focus:ring-[#b48c5f]/10 transition-all duration-200 placeholder-[#c5bfb5]"
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-[12px] font-medium text-[#6b6560] tracking-wide">Phone</label>
              <div className="flex items-center w-full bg-[#faf8f4] border border-[#e8e3db] rounded-xl overflow-hidden focus-within:border-[#b48c5f]/40 focus-within:ring-2 focus-within:ring-[#b48c5f]/10 transition-all duration-200">
                <span className="flex items-center px-3.5 py-3 text-[13px] text-[#9b9489] border-r border-[#e8e3db] bg-[#f0ebe3]">
                  +91
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-grow bg-transparent px-4 py-3 text-[14px] text-[#2d2a26] outline-none placeholder-[#c5bfb5]"
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[12px] font-medium text-[#6b6560] tracking-wide">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#faf8f4] border border-[#e8e3db] rounded-xl px-4 py-3 text-[14px] text-[#2d2a26] outline-none focus:border-[#b48c5f]/40 focus:ring-2 focus:ring-[#b48c5f]/10 transition-all duration-200 placeholder-[#c5bfb5]"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="re-password" className="text-[12px] font-medium text-[#6b6560] tracking-wide">Confirm Password</label>
              <input
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                className="w-full bg-[#faf8f4] border border-[#e8e3db] rounded-xl px-4 py-3 text-[14px] text-[#2d2a26] outline-none focus:border-[#b48c5f]/40 focus:ring-2 focus:ring-[#b48c5f]/10 transition-all duration-200 placeholder-[#c5bfb5]"
                type="password"
                id="re-password"
                name="re-password"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-[14px] font-semibold cursor-pointer bg-[#2d2a26] text-[#f7f5f0] hover:bg-[#3d3a35] active:scale-[0.97] transition-all duration-200 mt-2"
            >
              Create Account
            </button>

          </form>
        </div>

        <p className="text-center text-[13px] text-[#9b9489] mt-7">
          Already have an account?{' '}
          <Link to="/login" className="text-[#b48c5f] font-medium no-underline hover:text-[#9a7550] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register