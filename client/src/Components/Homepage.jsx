import React from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login'); 
    };

    return (
        <div>
            <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
    );
}

export default Homepage;
