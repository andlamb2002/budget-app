import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/authContext';
import logo from '../Assets/logo.png'; 
import { Navbar } from 'react-bootstrap'; // Import the Navbar component from react-bootstrap

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
        <Navbar bg="success" variant="dark" className="text-white"> {/* Use Navbar component with Bootstrap styling */}
            <Navbar.Brand as={Link} to="/"> {/* Use Navbar.Brand to render a Link */}
                <img src={logo} alt="Logo" height="100" style={{ marginRight: '32px' }} /> {/* Increase margin from mr-2 to mr-4 */}
                {getPageTitle()}
            </Navbar.Brand>
            {user && (
                <div className="ml-auto">
                    <Link to="/dashboard" className="btn btn-primary mx-2">Dashboard</Link>
                    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </div>
            )}
        </Navbar>
    );
}

export default Header;
