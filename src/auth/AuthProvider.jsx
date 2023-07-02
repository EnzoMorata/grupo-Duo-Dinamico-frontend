import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({children}){
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [username, setUsername] = useState(localStorage.getItem("username") || null);
    const [userId, setUserId] = useState(localStorage.getItem("id") || null);

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    useEffect(() => {
        localStorage.setItem("username", username);
    }, [username]);

    useEffect(() => {
        localStorage.setItem("id", userId);
    }, [userId]);

    function logout() {
        setToken(null);
        setUsername(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{token, setToken, logout, username, setUsername, userId, setUserId}}>
            {children}
        </AuthContext.Provider>
    )
}