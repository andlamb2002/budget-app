import React from 'react';
import { useAuth } from '../Contexts/authContext';

function Alert() {
    const { message } = useAuth();

    return (
        <div className="container mt-3" style={{ minHeight: '50px' }}>
            {message && <div className="alert alert-info">{message}</div>}
        </div>
    );
}

export default Alert;
