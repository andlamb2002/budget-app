import React, { useState } from 'react';
import { useAuth } from '../Contexts/authContext'; 
import { useNavigate } from 'react-router-dom';

function LoginRegister() {
    const { login, register, message, setMessageWithTimeout } = useAuth(); 
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const [registerInfo, setRegisterInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleLogin = async () => {
        await login(loginInfo.email, loginInfo.password);
        if (message !== 'Failed to login') {
            navigate('/');  
        }
    };

    const handleRegister = async () => {
        if (registerInfo.password !== registerInfo.confirmPassword) {
            setMessageWithTimeout("Passwords do not match", 'error');
            return;
        }
        const success = await register(registerInfo.firstName, registerInfo.lastName, registerInfo.email, registerInfo.password);
        if (success) {
            navigate('/'); 
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
