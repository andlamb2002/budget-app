import React, { useEffect, useRef } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';

function Homepage({ setAlertMessage }) {
    const { user, logout, justLoggedIn } = useAuth();
    const navigate = useNavigate();
    const timeoutRef = useRef(null);

    useEffect(() => {
        const setAlertWithTimeout = (message) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setAlertMessage(message);
        };

        if (!user) {
            navigate('/login');
        } else if (justLoggedIn) {
            setAlertWithTimeout({ text: "Login successful! Welcome back.", type: 'success' });
        }
    }, [user, justLoggedIn, navigate, setAlertMessage]);

    const handleLogout = async () => {
        await logout();
        sessionStorage.removeItem("loggedIn"); 
    };

    return (
        <div>
            <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
    );
}

export default Homepage;
