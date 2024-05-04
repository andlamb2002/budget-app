import React from 'react';
import { useAuth } from '../Contexts/authContext'; 

function Alert({ propMessage }) {
    const { message: contextMessage } = useAuth();

    const message = propMessage && propMessage.text ? propMessage : contextMessage;

    return (
        <div className="container mt-3" style={{ minHeight: '50px' }}>
            {message && message.text ? (
                <div className={`alert alert-${message.type}`}>{message.text}</div>
            ) : (
                <div style={{ height: '50px' }}></div> 
            )}
        </div>
    );
}

export default Alert;
