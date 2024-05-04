import React from 'react';
import { useAuth } from '../Contexts/authContext'; 

function Alert({ propMessage }) {
    const { message: contextMessage } = useAuth();

    const message = propMessage && propMessage.text ? propMessage : contextMessage;

    if (!message || !message.text) return null;

    return (
        <div className="container mt-3" style={{ minHeight: '50px' }}>
            <div className={`alert alert-${message.type}`}>{message.text}</div>
        </div>
    );
}

export default Alert;
