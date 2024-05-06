import React, { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import BudgetTable from './BudgetTable';
import ExpenseTable from './ExpenseTable';

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
        if (user && user.id) {
            axios.get(`${API_URL}/api/budgets/${user.id}`)
                .then(response => setBudgets(response.data))
                .catch(error => setAlertMessage({ text: 'Failed to fetch budgets.', type: 'danger' }));

            axios.get(`${API_URL}/api/expenses/${user.id}`)
                .then(response => setExpenses(response.data))
                .catch(error => setAlertMessage({ text: 'Failed to fetch expenses.', type: 'danger' }));
        }
    };

    return (
        <div>
            <h1>Dashboard of: {user?.firstName} {user?.lastName}</h1>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <BudgetTable 
                        budgets={budgets}
                        setBudgets={setBudgets}
                        expenses={expenses}
                        fetchBudgetsAndExpenses={fetchBudgetsAndExpenses}
                        setAlertMessage={setAlertMessage}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <ExpenseTable
                        expenses={expenses}
                        setExpenses={setExpenses}
                        budgets={budgets}
                        fetchBudgetsAndExpenses={fetchBudgetsAndExpenses}
                        setAlertMessage={setAlertMessage}
                    />
                </div>
            </div>
            {/* Placeholder for future data visualizations */}
            <div>
                {/* Data visualization components will go here */}
            </div>
        </div>
    );
}

export default Dashboard;
