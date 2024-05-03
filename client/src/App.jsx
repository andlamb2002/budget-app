import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/authContext';
import LoginRegister from './Components/LoginRegister';
import Homepage from './Components/Homepage';
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <div className="container mt-3">
                    <Routes>
                        <Route path="/" element={<PrivateRoute><Homepage /></PrivateRoute>} />
                        <Route path="/login" element={<LoginRegister />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
