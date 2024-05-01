import React, { useState } from 'react';
import './App.css';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.text();
            setMessage(result);
        } catch (error) {
            console.error('Failed to register', error);
            setMessage('Failed to register');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.text();
            setMessage(result);
        } catch (error) {
            console.error('Failed to login', error);
            setMessage('Failed to login');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <h2>Register</h2>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="Email" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control mt-2" placeholder="Password" />
                    <button onClick={handleRegister} className="btn btn-primary mt-2">Register</button>
                </div>
                <div className="col-md-6">
                    <h2>Login</h2>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="Email" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control mt-2" placeholder="Password" />
                    <button onClick={handleLogin} className="btn btn-success mt-2">Login</button>
                </div>
            </div>
            {message && <p className="alert alert-info mt-3">{message}</p>}
        </div>
    );
}

export default App;
