import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import Home from "./features/Interview/Pages/Home"
import Interview from "./features/Interview/Pages/Interview"
import ReportsHistory from "./features/Interview/Pages/ReportsHistory"
import Dashboard from "./features/Interview/Pages/Dashboard"
import ResumeBuilder from "./features/Resume/Pages/ResumeBuilder"
import ResumeView from "./features/Resume/Pages/ResumeView"

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Protected><Home/></Protected>
    },
    {
        path:"/dashboard",
        element:<Protected><Dashboard/></Protected>
    },
    {
        path:"/history",
        element:<Protected><ReportsHistory/></Protected>
    },
    {
        path:"/interview/:id",
        element:<Protected><Interview/></Protected>
    },
    {
        path:"/interview/interview:id",
        element:<Protected><Interview/></Protected>
    },
    {
        path:"/resume/new",
        element:<Protected><ResumeBuilder/></Protected>
    },
    {
        path:"/resume/:id",
        element:<Protected><ResumeView/></Protected>
    }
])