import React from 'react'
import { useNavigate,Link } from 'react-router';


const Login = () => {

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

        <h1 className='text-center text-2xl font-bold'>Login</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>

          <div className="input-group flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input className='input primary bg-white text-black p-2 rounded-lg outline-none' type='email' id='email' name='email' placeholder='Enter email address'/>
          </div>

          <div className='input-group flex flex-col gap-2 pb-3'>
            <label htmlFor='password'>Password</label>
            <input className='input primary bg-white text-black p-2 rounded-lg outline-none' type='password' id='password' name='password' placeholder='Enter password'/>
          </div>

          <button onClick={handleoutput} className="button primary-button bg-red-500 text-black p-2 rounded-lg border-none outline-none cursor-pointer transition-colors duration-300 ease-in-out hover:bg-red-600 hover:text-white">
            Login
          </button>

        </form>


        <p>Don't have an account?<Link to='/register'className='no-underline text-red-500'> Register</Link></p>

      </div>
    </main>
  )
}

export default Login