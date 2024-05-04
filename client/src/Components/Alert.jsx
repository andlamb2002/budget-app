import React from 'react';
import { useAuth } from '../Contexts/authContext'; 

function Alert({ propMessage }) {
    const { sessionWarningActive, refreshSession, message: contextMessage } = useAuth();

    let message = propMessage && propMessage.text ? propMessage : contextMessage;

    return (
        <div className="container mt-3" style={{ minHeight: '50px' }}>
            {sessionWarningActive ? (
                <div className="alert alert-warning">
                    Your session will expire soon.{" "}
                    <button onClick={refreshSession} className="btn btn-sm btn-primary">Refresh Session</button>
                </div>
            ) : (
                message && message.text && (
                    <div className={`alert alert-${message.type}`}>{message.text}</div>
                )
            )}
            {!sessionWarningActive && (!message || !message.text) && (
                <div style={{ height: '50px' }}></div>
            )}
        </div>
    );
}

export default Alert;
