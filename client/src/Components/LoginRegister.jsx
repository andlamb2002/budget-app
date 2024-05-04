import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../Contexts/authContext'; 
import { useNavigate } from 'react-router-dom';

function LoginRegister({ setAlertMessage }) {
    const { login, register } = useAuth(); 
    const timeoutRef = useRef(null);
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const [registerInfo, setRegisterInfo] = useState({
        firstName: 'test', 
        lastName: 'test',
        email: 'test@gmail.com',
        password: '123456',
        confirmPassword: '123456'
    });

    const setAlertWithTimeout = useCallback((message) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setAlertMessage(message);
    }, [setAlertMessage]);

    useEffect(() => {
        if (sessionStorage.getItem("loggedOut") === "true") {
            setAlertWithTimeout({ text: "Logged out successfully!", type: 'success' });
            sessionStorage.removeItem("loggedOut"); 
        }
    }, [setAlertWithTimeout]);

    const handleLogin = async () => {
        const success = await login(loginInfo.email, loginInfo.password);
        if (success) {
            navigate('/');  
        } else {
            setAlertWithTimeout({ text: 'Incorrect email/password. Please try again.', type: 'danger' });
        }
    };

    const handleRegister = async () => {
        if (!registerInfo.firstName.trim() || !registerInfo.lastName.trim()) {
            setAlertMessage({ text: "First name and last name cannot be empty.", type: 'danger' });
            return;
        }
        if (registerInfo.password !== registerInfo.confirmPassword) {
            setAlertMessage({ text: "Passwords do not match. Please try again.", type: 'danger' });
            return;
        }
        const result = await register(registerInfo.firstName, registerInfo.lastName, registerInfo.email, registerInfo.password);
        if (result.success) {
            navigate('/');
        } else {
            setAlertMessage({ text: result.error, type: 'danger' });
        }
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <h2>Login</h2>
                <input
                    type="email"
                    value={loginInfo.email}
                    onChange={e => setLoginInfo({ ...loginInfo, email: e.target.value })}
                    className="form-control"
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={loginInfo.password}
                    onChange={e => setLoginInfo({ ...loginInfo, password: e.target.value })}
                    className="form-control mt-2"
                    placeholder="Password"
                />
                <button onClick={handleLogin} className="btn btn-success mt-2">Login</button>
            </div>
            <div className="col-md-6">
                <h2>Register</h2>
                <input
                    type="text"
                    value={registerInfo.firstName}
                    onChange={e => setRegisterInfo({ ...registerInfo, firstName: e.target.value })}
                    className="form-control"
                    placeholder="First Name"
                />
                <input
                    type="text"
                    value={registerInfo.lastName}
                    onChange={e => setRegisterInfo({ ...registerInfo, lastName: e.target.value })}
                    className="form-control mt-2"
                    placeholder="Last Name"
                />
                <input
                    type="email"
                    value={registerInfo.email}
                    onChange={e => setRegisterInfo({ ...registerInfo, email: e.target.value })}
                    className="form-control mt-2"
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={registerInfo.password}
                    onChange={e => setRegisterInfo({ ...registerInfo, password: e.target.value })}
                    className="form-control mt-2"
                    placeholder="Password"
                />
                <input
                    type="password"
                    value={registerInfo.confirmPassword}
                    onChange={e => setRegisterInfo({ ...registerInfo, confirmPassword: e.target.value })}
                    className="form-control mt-2"
                    placeholder="Repeat Password"
                />
                <button onClick={handleRegister} className="btn btn-primary mt-2">Register</button>
            </div>
        </div>
    );
}

export default LoginRegister;
