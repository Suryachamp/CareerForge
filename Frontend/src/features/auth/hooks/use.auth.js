import { useContext, useEffect } from "react";
import { AuthContext } from "../services/auth.context";
import { login, logout, register, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            if (data && data.user) {
                setUser(data.user);
                return { success: true, user: data.user };
            }
            return { success: false, error: data?.message || "Failed to login" };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            if (data && data.user) {
                setUser(data.user);
                return { success: true, user: data.user };
            }
            return { success: false, error: data?.message || "Failed to register" };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{
        const getAndsetUser = async()=>{
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                }
            } catch (err) {
                console.error("getMe error:", err);
            } finally {
                setLoading(false)
            }
        }
        getAndsetUser() 
    },[])

    return { user, loading, handleLogin, handleRegister, handleLogout };
};