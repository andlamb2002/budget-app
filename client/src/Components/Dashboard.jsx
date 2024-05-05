import React, { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ setAlertMessage }) {
    const { user, refreshSession } = useAuth();
    const navigate = useNavigate();
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
    const [newExpense, setNewExpense] = useState({ category: '', amount: '', date: new Date().toISOString().slice(0, 10) });

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
            axios.get(`http://localhost:5000/api/budgets/${user.id}`)
                .then(response => setBudgets(response.data))
                .catch(error => setAlertMessage({ text: 'Failed to fetch budgets.', type: 'danger' }));

            axios.get(`http://localhost:5000/api/expenses/${user.id}`)
                .then(response => setExpenses(response.data))
                .catch(error => setAlertMessage({ text: 'Failed to fetch expenses.', type: 'danger' }));
        }
    };

    const handleAddBudget = () => {
        if (user && user.id && newBudget.category && newBudget.amount) {
            axios.post(`http://localhost:5000/api/budgets`, { userId: user.id, ...newBudget })
                .then(() => {
                    setAlertMessage({ text: 'Budget added successfully!', type: 'success' });
                    fetchBudgetsAndExpenses(); // Refresh the list
                })
                .catch(error => setAlertMessage({ text: 'Failed to add budget.', type: 'danger' }));
        }
    };

    const handleAddExpense = () => {
        if (user && user.id && newExpense.category && newExpense.amount && newExpense.date) {
            axios.post(`http://localhost:5000/api/expenses`, { userId: user.id, ...newExpense })
                .then(() => {
                    setAlertMessage({ text: 'Expense added successfully!', type: 'success' });
                    fetchBudgetsAndExpenses(); // Refresh the list
                })
                .catch(error => setAlertMessage({ text: 'Failed to add expense.', type: 'danger' }));
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
                <div>
                    <input type="text" placeholder="Category" value={newBudget.category} onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })} />
                    <input type="number" placeholder="Amount" value={newBudget.amount} onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })} />
                    <button onClick={handleAddBudget}>Add Budget</button>
                </div>
            </div>
            <div>
                <h2>Expenses</h2>
                <ul>
                    {expenses.map(expense => (
                        <li key={expense.id}>{expense.category} - ${expense.amount} on {new Date(expense.date).toLocaleDateString()}</li>
                    ))}
                </ul>
                <div>
                    <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}>
                        <option value="">Select a Category</option>
                        {budgets.map((budget) => (
                            <option key={budget.id} value={budget.category}>{budget.category}</option>
                        ))}
                    </select>
                    <input type="number" placeholder="Amount" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                    <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
                    <button onClick={handleAddExpense}>Add Expense</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
