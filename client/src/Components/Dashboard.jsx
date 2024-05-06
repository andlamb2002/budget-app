import React, { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import BudgetTable from './BudgetTable';
import ExpenseTable from './ExpenseTable';
import BudgetPie from './BudgetPie';
import ExpenseProgress from './ExpenseProgress';
import TotalProgress from './TotalProgress';

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

    return (
        <div>
            <h1>Dashboard of: {user?.firstName} {user?.lastName}</h1>
            <TotalProgress
                budgets={budgets}
                expenses={expenses}
            />
            <div>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <BudgetTable 
                            budgets={budgets}
                            setBudgets={setBudgets}
                            expenses={expenses}
                            fetchBudgetsAndExpenses={fetchBudgetsAndExpenses}
                            setAlertMessage={setAlertMessage}
                        />
                    </div>
                    <div className="col-md-6">
                        <ExpenseTable
                            expenses={expenses}
                            setExpenses={setExpenses}
                            budgets={budgets}
                            fetchBudgetsAndExpenses={fetchBudgetsAndExpenses}
                            setAlertMessage={setAlertMessage}
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <BudgetPie 
                            budgets={budgets} 
                        />
                    </div>
                    <div className="col-md-6">
                        <ExpenseProgress
                            budgets={budgets}
                            expenses={expenses}
                        />
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default Dashboard;
