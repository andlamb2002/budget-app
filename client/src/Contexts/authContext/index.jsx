import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [justLoggedIn, setJustLoggedIn] = useState(false);
    const [sessionWarningActive, setSessionWarningActive] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const timeoutRef = useRef(null);
    const expirationRef = useRef(Date.now() + 60000);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
        clearTimeout(timeoutRef.current);
        setSessionWarningActive(false);
        sessionStorage.setItem("loggedOut", "true");
        setJustLoggedIn(false);
    }, []);

    const setSessionTimeout = useCallback(() => {
        clearTimeout(timeoutRef.current);
        expirationRef.current = Date.now() + 60000;
        const warningTimeout = setTimeout(() => {
            setSessionWarningActive(true);
            const logoutTimeout = setTimeout(() => {
                if (Date.now() >= expirationRef.current) {
                    logout();
                }
            }, 20000);
            timeoutRef.current = logoutTimeout;
        }, 40000);
        timeoutRef.current = warningTimeout;
    }, [logout]);

    const refreshSession = () => {
        console.log("ref");
        setJustLoggedIn(false);
        clearTimeout(timeoutRef.current);
        setSessionWarningActive(false);
        setSessionTimeout();
    };

    const setMessageWithTimeout = useCallback((text, type = 'info') => {
        setMessage({ text, type });
        clearTimeout(timeoutRef.current);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            if (response.status === 200) {
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                setJustLoggedIn(true);
                setSessionTimeout();
                return { success: true };
            }
        } catch (error) {
            setMessageWithTimeout(error.response.data.error, 'danger');
            return { success: false, error: error.response.data.error };
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const response = await axios.post('/api/register', { firstName, lastName, email, password });
            if (response.status === 201) {
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                setJustLoggedIn(true);
                setSessionTimeout();
                return { success: true };
            }
        } catch (error) {
            setMessageWithTimeout(error.response.data.error, 'danger');
            return { success: false, error: error.response.data.error };
        }
    };

    useEffect(() => {
        if (user) {
            setSessionTimeout();
        }

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [user, setSessionTimeout]);

    return (
        <AuthContext.Provider value={{
            user, 
            login, 
            logout, 
            register, 
            refreshSession,
            sessionWarningActive, 
            message,
            justLoggedIn
        }}>
            {children}
        </AuthContext.Provider>
    );
};
