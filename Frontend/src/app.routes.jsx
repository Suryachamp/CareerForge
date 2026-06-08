import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import Home from "./features/Interview/Pages/Home"

export const router = createBrowserRouter([
    {
        path:"/Login",
        element:<Login/>
    },
    {
        path:"/Register",
        element:<Register/>
    },{
        path:"/",
        element:<Protected><Home/></Protected>
    }
])