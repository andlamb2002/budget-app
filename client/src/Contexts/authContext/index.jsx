import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState({ text: '', type: 'info' }); 

    const setMessageWithTimeout = (text, type = 'danger') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: 'info' }), 5000); 
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/login', { email, password });
            if (response.status === 200) {
                setUser(response.data);
                setMessageWithTimeout("Login Successful!", 'success');
                return true;
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error("Error in login:", error);
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Failed to login';
            setMessageWithTimeout(errorMessage, 'danger');
            return false;
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            setMessageWithTimeout("Logged out successfully!", 'success');
            return true;
        } catch (error) {
            console.error("Error in logout:", error.message);
            setMessageWithTimeout('Failed to logout', 'danger');
            return false;
        }
    };

    const register = async (firstName, lastName, email, password) => {
        try {
            const response = await axios.post('/api/register', { firstName, lastName, email, password });
            if (response.status === 201) {
                setUser(response.data);
                setMessageWithTimeout("Registration Successful!", 'success');
                return true;
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error("Error in registration:", error);
            const errorMessage = error.response && error.response.data && error.response.data.error
                ? error.response.data.error
                : 'Failed to register';
            setMessageWithTimeout(errorMessage, 'danger');
            return false;
        }
    };
    
    return (
        <AuthContext.Provider value={{ user, message, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}
