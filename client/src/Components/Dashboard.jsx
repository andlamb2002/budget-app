import React, { useEffect } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';

function Dashboard({ setAlertMessage }) {
    const { user, refreshSession } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            refreshSession(); 
        }
    }, [user, navigate, setAlertMessage]);

    return (
        <div>
            <h1>Dashboard of: {user?.firstName} {user?.lastName}</h1>
        </div>
    );
}

export default Dashboard;
