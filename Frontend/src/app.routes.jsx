import {createBrowserRouter} from "react-router"
import Login from "../src/features/auth/pages/Login"
import Register from "../src/features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"

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
        element:<Protected><h1>Home page</h1></Protected>
    }
])