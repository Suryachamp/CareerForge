import { useAuth } from "../hooks/use.auth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const {loading,user}=useAuth()
    if(loading){
        return (
          <div className="min-h-screen w-full bg-[#0b0f19] flex justify-center items-center">
            <div className="flex items-center gap-2.5 text-gray-400">
              <div className="w-5 h-5 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
              <span className="text-[13px] font-medium tracking-wide">Loading...</span>
            </div>
          </div>
        ) 
    }
    if(!user){
        return <Navigate to={'/Login'}/>
    }

    return children
}

export default Protected