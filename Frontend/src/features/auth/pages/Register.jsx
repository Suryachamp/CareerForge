import React from 'react'
import { useNavigate,Link } from 'react-router';

const Register = () => {

  const navigate=useNavigate();

  const handleSubmit=(e)=>{
    e.preventDefault();
  }
  const handleoutput=()=>{
    console.log("button clicked")
  }
  return (
    <main className='min-h-screen w-full flex justify-center items-center'>
      <div className="form-container flex flex-col gap-5 w-full max-w-sm mx-auto p-5 rounded-xl border">

        <h1 className='text-center text-2xl font-bold'>Register</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

          <div className="input-group flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <input className='input primary bg-white text-black p-2 rounded-lg outline-none' type='text' id='username' name='username' placeholder='Enter username'/>
          </div>

          <div className="input-group flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input className='input primary bg-white text-black p-2 rounded-lg outline-none' type='email' id='email' name='email' placeholder='Enter email address'/>
          </div>

          <div className="input-group flex flex-col gap-1">
            <label htmlFor="phone">Phone</label>
            <div className="flex items-center w-full bg-white rounded-lg p-2">
              <span className="flex items-center px-1 py-1 mr-2 text-gray-500 border border-gray-300 rounded-lg bg-gray-50 text-sm whitespace-nowrap">
                +91
              </span>
              <input className='input primary flex-grow bg-transparent text-black outline-none min-w-0' type='tel' id='phone' name='phone' placeholder='Enter phone number'/>
            </div>
          </div>


          <div className='input-group flex flex-col gap-1'>
            <label htmlFor='password'>Password</label>
            <input className='input primary bg-white text-black p-2 rounded-lg outline-none' type='password' id='password' name='password' placeholder='Enter password'/>
          </div>

          <div className='input-group flex flex-col gap-1 pb-3'>
            <label htmlFor='re-password'>Confirm Password</label>
            <input className='input primary bg-white text-black p-2 rounded-lg outline-none' type='password' id='re-password' name='re-password' placeholder='Enter password'/>
          </div>

          <button onClick={handleoutput} className="button primary-button bg-red-500 text-black p-2 rounded-lg border-none outline-none cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white">
            Register
          </button>

        </form>

        <p>Already have an account?<Link to='/login' className='no-underline text-red-500'> Login</Link></p>
        
      </div>
    </main>
  )
}

export default Register