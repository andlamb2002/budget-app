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
        <header className="container-fluid bg-success py-4"> 
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <h1>{getPageTitle()}</h1>
                    {user && (
                        <div>
                            <Link to="/" className="btn btn-primary m-2">Home</Link>
                            <Link to="/dashboard" className="btn btn-primary m-2">Dashboard</Link>
                            <button onClick={handleLogout} className="btn btn-danger m-2">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
