import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('/api/register', {
                email: registerEmail,
                password: registerPassword
            });
            setMessage(response.data);
        } catch (error) {
            console.error('Failed to register', error);
            setMessage('Failed to register');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/login', {
                email: loginEmail,
                password: loginPassword
            });
            setMessage(response.data);
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
                    <input 
                        type="email" 
                        value={registerEmail} 
                        onChange={e => setRegisterEmail(e.target.value)} 
                        className="form-control" 
                        placeholder="Email" 
                    />
                    <input 
                        type="password" 
                        value={registerPassword} 
                        onChange={e => setRegisterPassword(e.target.value)} 
                        className="form-control mt-2" 
                        placeholder="Password" 
                    />
                    <button onClick={handleRegister} className="btn btn-primary mt-2">Register</button>
                </div>
                <div className="col-md-6">
                    <h2>Login</h2>
                    <input 
                        type="email" 
                        value={loginEmail} 
                        onChange={e => setLoginEmail(e.target.value)} 
                        className="form-control" 
                        placeholder="Email" 
                    />
                    <input 
                        type="password" 
                        value={loginPassword} 
                        onChange={e => setLoginPassword(e.target.value)} 
                        className="form-control mt-2" 
                        placeholder="Password" 
                    />
                    <button onClick={handleLogin} className="btn btn-success mt-2">Login</button>
                </div>
            </div>
            {message && <p className="alert alert-info mt-3">{message}</p>}
        </div>
    );
}

export default App;
