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
                <nav className="d-flex justify-content-between align-items-center">
                    <h1>{getPageTitle(pathname)}</h1>
                    {user && (
                        <div>
                            <Link to="/" className="btn btn-primary m-2" aria-label="Home">Home</Link>
                            <Link to="/dashboard" className="btn btn-primary m-2" aria-label="Dashboard">Dashboard</Link>
                            <button onClick={handleLogout} className="btn btn-danger m-2" aria-label="Logout">Logout</button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
