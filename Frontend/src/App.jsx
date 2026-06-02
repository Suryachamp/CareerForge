import React from 'react'
import "./index.css";
import {RouterProvider} from "react-router"
import { router } from './app.routes.jsx';
import { AuthProvider } from './features/auth/services/auth.context.js';

const App = () => {
  return (
    <>
      <AuthProvider>

      <RouterProvider router={router}/>
      </AuthProvider>
    </>
  )
}

export default App;