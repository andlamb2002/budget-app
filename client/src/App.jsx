import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/authContext';
import LoginRegister from './Components/LoginRegister';
import Homepage from './Components/Homepage';
import Header from './Components/Header';
import Dashboard from './Components/Dashboard';
import Alert from './Components/Alert';
import Footer from './Components/Footer';
import PrivateRoute from './Components/PrivateRoute';

function App() {
    const [alertMessage, setAlertMessage] = useState({ text: '', type: 'info' });

    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="fixed-top">
                    <Header />
                    <Alert propMessage={alertMessage} />
                </div>
                <div className="d-flex flex-column min-vh-100">
                    <div className="container mt-5 pt-5"> 
                        <div style={{ height: '100px', visibility: 'hidden' }}></div>
                        <Routes>
                            <Route path="/" element={<PrivateRoute><Homepage setAlertMessage={setAlertMessage} /></PrivateRoute>} />
                            <Route path="/login" element={<LoginRegister setAlertMessage={setAlertMessage} />} />
                            <Route path="/dashboard" element={<PrivateRoute><Dashboard setAlertMessage={setAlertMessage} /></PrivateRoute>} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
