import React, { useEffect, useRef } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';

function Homepage({ setAlertMessage }) {
    const { user, justLoggedIn, refreshSession } = useAuth();
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
        } else {
            if (justLoggedIn) {
                setAlertWithTimeout({ text: "Login successful!", type: 'success' });
            }
            refreshSession(); 
        }
    }, [user, justLoggedIn, navigate, setAlertMessage]);

    return (
        <div>
            <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
        </div>
    );
}

export default Homepage;
