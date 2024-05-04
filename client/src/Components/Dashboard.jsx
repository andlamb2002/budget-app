import React, { useEffect } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';

function Dashboard({ setAlertMessage }) {
    const { user, justLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, justLoggedIn, navigate, setAlertMessage]);

    return (
        <div>
            <h1>Dashboard for {user?.firstName} {user?.lastName}.</h1>
        </div>
    );
}

export default Dashboard;
