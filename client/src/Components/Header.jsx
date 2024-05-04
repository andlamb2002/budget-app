import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/authContext';

function Header() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const getPageTitle = () => {
        switch (pathname) {
            case '/':
                return 'Home';
            case '/login':
                return 'Login';
            case '/dashboard':
                return 'Dashboard';
            default:
                return 'My Budget App';
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="container">
            <div className="d-flex justify-content-between align-items-center">
                <h1>{getPageTitle()}</h1>
                {user && (
                    <div>
                        <Link to="/dashboard" className="btn btn-primary mx-2">Dashboard</Link>
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
