import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');

    const setMessageWithTimeout = (newMessage) => {
        setMessage(newMessage);
        setTimeout(() => setMessage(''), 5000);  
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            setUser(response.data); 
            setMessageWithTimeout("Login Successful!");
        } catch (error) {
            console.error(error);
            setMessageWithTimeout('Failed to login');
        }
    };

    const logout = async () => {
        try {
            setUser(null); 
            setMessage("Logged out successfully!");
        } catch (error) {
            setMessage('Failed to logout');
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const response = await axios.post('/api/register', { firstName, lastName, email, password });
            setUser(response.data);  
            setMessageWithTimeout("Registration Successful!");
        } catch (error) {
            setMessageWithTimeout('Failed to register');
        }
    };

    return (
        <AuthContext.Provider value={{ user, message, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}
