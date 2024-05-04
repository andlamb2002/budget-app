import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionWarningActive, setSessionWarningActive] = useState(false);
    const [message, setMessage] = useState({ text: '', type: 'info' });
    const timeoutRef = useRef(null);
    const expirationRef = useRef(Date.now() + 60000); 

    const logout = useCallback(() => {
        setUser(null);
        clearTimeout(timeoutRef.current);
        setSessionWarningActive(false);
        setMessageWithTimeout("Logged out successfully!", 'success');
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
        clearTimeout(timeoutRef.current); 
        setSessionWarningActive(false);
        setSessionTimeout(); 
    };

    const setMessageWithTimeout = (text, type = 'info', duration = 5000) => {
        clearTimeout(timeoutRef.current);  // Clear any existing timeout to avoid overlaps
        setMessage({ text, type });
        timeoutRef.current = setTimeout(() => {
            setMessage({ text: '', type: 'info' });
        }, duration);
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            if (response.status === 200) {
                setUser(response.data);
                setSessionTimeout(); 
                setMessageWithTimeout("Login Successful!", 'success');
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
                setSessionTimeout(); 
                setMessageWithTimeout("Registration Successful!", 'success');
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
            message
        }}>
            {children}
        </AuthContext.Provider>
    );
};
