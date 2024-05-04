import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');

    const setMessageWithTimeout = (message, type = 'error') => {
        if (typeof message === 'object' && message !== null) {
            const details = message.details || 'An error occurred';
            setMessage(`${message.error}: ${details}`);
        } else {
            setMessage(message);
        }
        setTimeout(() => setMessage(''), 5000);
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            if (response.status === 200) {
                setUser(response.data);
                setMessageWithTimeout("Login Successful!", 'success');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error("Error in login:", error);
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Failed to login';
            setMessageWithTimeout(errorMessage, 'error');
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            setMessageWithTimeout("Logged out successfully!", 'success');
        } catch (error) {
            console.error("Error in logout:", error.message);
            setMessageWithTimeout('Failed to logout', 'error');
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const response = await axios.post('/api/register', { firstName, lastName, email, password });
            if (response.status === 201) {
                setUser(response.data);
                setMessageWithTimeout("Registration Successful!", 'success');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error("Error in registration:", error);
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Failed to register';
            setMessageWithTimeout(errorMessage, 'error');
        }
    };
    
    return (
        <AuthContext.Provider value={{ user, message, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}
