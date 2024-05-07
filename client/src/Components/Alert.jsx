import React, { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/authContext'; 

function Alert({ propMessage }) {
    const { sessionWarningActive, refreshSession, message: contextMessage } = useAuth();
    const [displayMessage, setDisplayMessage] = useState({ text: '', type: 'info' });

    useEffect(() => {
        const activeMessage = propMessage && propMessage.text ? propMessage : contextMessage;
        setDisplayMessage(activeMessage);

        if (activeMessage.text && !sessionWarningActive) {
            const timer = setTimeout(() => {
                setDisplayMessage({ text: '', type: 'info' });
            }, 3000); 

            return () => clearTimeout(timer);
        }
    }, [propMessage, contextMessage]);

    return (
        <div className="container mt-3" aria-live="polite" style={{ minHeight: '50px' }}>
            {sessionWarningActive ? (
                <div className="alert alert-warning" role="alert">
                    Your session will expire soon.{" "}
                    <button onClick={refreshSession} className="btn btn-sm btn-primary">Refresh Session</button>
                </div>
            ) : (
                displayMessage.text && (
                    <div className={`alert alert-${displayMessage.type}`} role="alert">
                        {displayMessage.text}
                    </div>
                )
            )}
            {!sessionWarningActive && !displayMessage.text && (
                <div style={{ height: '50px' }}></div>
            )}
        </div>
    );
}

export default Alert;
