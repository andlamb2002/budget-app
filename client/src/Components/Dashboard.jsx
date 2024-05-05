import React, { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ setAlertMessage }) {
    const { user, refreshSession } = useAuth();
    const navigate = useNavigate();
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            refreshSession();
            fetchBudgetsAndExpenses();
        }
    }, [user, navigate, setAlertMessage]);

    const fetchBudgetsAndExpenses = () => {
        if (user) {
            user.getIdToken(true).then(token => {
                const headers = {
                    Authorization: `Bearer ${token}`
                };
                // Fetch budgets
                axios.get(`http://localhost:5000/api/budgets/${user.uid}`, { headers })
                    .then(response => {
                        setBudgets(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching budgets', error);
                        setAlertMessage({ text: 'Failed to fetch budgets.', type: 'error' });
                    });

                // Fetch expenses
                axios.get(`http://localhost:5000/api/expenses/${user.uid}`, { headers })
                    .then(response => {
                        setExpenses(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching expenses', error);
                        setAlertMessage({ text: 'Failed to fetch expenses.', type: 'error' });
                    });
            });
        }
    };

    return (
        <div>
            <h1>Dashboard of: {user?.firstName} {user?.lastName}</h1>
            <div>
                <h2>Budgets</h2>
                <ul>
                    {budgets.map(budget => (
                        <li key={budget.id}>{budget.category}: ${budget.amount}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Expenses</h2>
                <ul>
                    {expenses.map(expense => (
                        <li key={expense.id}>{expense.category} - ${expense.amount} on {new Date(expense.date).toLocaleDateString()}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;
