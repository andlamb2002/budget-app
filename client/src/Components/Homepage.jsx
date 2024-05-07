import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import TotalProgress from './TotalProgress';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Homepage({ setAlertMessage }) {
    const { user, justLoggedIn, refreshSession } = useAuth();
    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const fetchBudgetsAndExpenses = () => {
        if (user && user.id) {
            axios.get(`${API_URL}/api/budgets/${user.id}`)
                .then(response => {
                    const sortedBudgets = response.data.sort((a, b) => b.amount - a.amount);
                    setBudgets(sortedBudgets);
                })
                .catch(error => setAlertMessage({ text: 'Failed to fetch budgets.', type: 'danger' }));
    
            axios.get(`${API_URL}/api/expenses/${user.id}`)
                .then(response => {
                    const sortedExpenses = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setExpenses(sortedExpenses);
                })
                .catch(error => setAlertMessage({ text: 'Failed to fetch expenses.', type: 'danger' }));
        }
    };

    useEffect(() => {
        const setAlertWithTimeout = (message) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setAlertMessage(message);
        };

        if (!user) {
            navigate('/login');
        } else {
            if (justLoggedIn) {
                setAlertWithTimeout({ text: "Login successful!", type: 'success' });
            }
            refreshSession(); 
            fetchBudgetsAndExpenses();
        }
    }, [user, justLoggedIn, navigate, setAlertMessage]);

    return (
        <main className="text-center my-4">
            <h1>Hello, {user?.firstName} {user?.lastName}!</h1>
            {budgets.length > 0 && (
                <TotalProgress
                    budgets={budgets}
                    expenses={expenses}
                    aria-label="Total progress for budgets and expenses"
                />
            )}
            <section className="mt-3">
                <p className="fs-4">Go to your Dashboard to add monthly budgets and expenses.</p>
                <div
                    className="border border-dark rounded p-3 d-inline-block"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/dashboard')}
                    role="button"
                    aria-label="Go to Dashboard"
                >
                    <i className="bi bi-layout-text-sidebar-reverse" style={{ fontSize: '100px' }}></i>
                    <div className="fs-3 mt-2">Dashboard</div>
                </div>
            </section>
        </main>
    );    
}

export default Homepage;
