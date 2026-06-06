import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router';
import {useAuth} from '../hooks/use.auth';

const Register = () => {

  const navigate=useNavigate();
  const {loading,handleRegister}=useAuth()
  const[username,setUsername]=useState("")
  const[email,setEmail]=useState("")
  const[phone,setPhone]=useState("")
  const[password,setPassword]=useState("")
  const[rePassword,setRePassword]=useState("")

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const response =await handleRegister({username,email,password,rePassword,phone})
    if(response.success){
      navigate("/")
    }else{
      console.log(response.error)
    }
  }

  if(loading){
    return(
      <main className='min-h-screen w-full flex justify-center items-center'>
        <h1>Loading...</h1>
      </main>
    )
  }

  return (
    <main className='min-h-screen w-full flex justify-center items-center'>
      <div className="form-container flex flex-col gap-5 w-full max-w-sm mx-auto p-5 rounded-xl border">

        <h1 className='text-center text-2xl font-bold'>Register</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

          <div className="input-group flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input value={username} onChange={(e)=>setUsername(e.target.value)} className='input primary bg-white text-black p-2 rounded-lg outline-none' type='text' id='username' name='username' placeholder='Enter username'/>
          </div>

          <div className="input-group flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className='input primary bg-white text-black p-2 rounded-lg outline-none' type='email' id='email' name='email' placeholder='Enter email address'/>
          </div>

          <div className="input-group flex flex-col gap-1">
            <label htmlFor="phone">Phone</label>
            <div className="flex items-center w-full bg-white rounded-lg p-2">
              <span className="flex items-center px-1 py-1 mr-2 text-gray-500 border border-gray-300 rounded-lg bg-gray-50 text-sm whitespace-nowrap">
                +91
              </span>
              <input value={phone} onChange={(e)=>setPhone(e.target.value)} className='input primary flex-grow bg-transparent text-black outline-none min-w-0' type='tel' id='phone' name='phone' placeholder='Enter phone number'/>
            </div>
          </div>


          <div className='input-group flex flex-col gap-1'>
            <label htmlFor='password'>Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} className='input primary bg-white text-black p-2 rounded-lg outline-none' type='password' id='password' name='password' placeholder='Enter password'/>
          </div>

          <div className='input-group flex flex-col gap-1 pb-3'>
            <label htmlFor='re-password'>Confirm Password</label>
            <input value={rePassword} onChange={(e)=>setRePassword(e.target.value)} className='input primary bg-white text-black p-2 rounded-lg outline-none' type='password' id='re-password' name='re-password' placeholder='Enter password'/>
          </div>

          <button type="submit" className="button primary-button bg-red-500 text-black p-2 rounded-lg border-none outline-none cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white">
            Register
          </button>

        </form>

        <p>Already have an account?<Link to='/login' className='no-underline text-red-500'> Login</Link></p>
        
      </div>
    </main>
  )
}

export default Register