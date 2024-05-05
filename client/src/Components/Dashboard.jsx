import React, { useEffect, useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ setAlertMessage }) {
    const { user, refreshSession } = useAuth();
    const navigate = useNavigate();
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [newBudget, setNewBudget] = useState({ id: '', category: '', amount: '' });
    const [newExpense, setNewExpense] = useState({ id: '', category: '', amount: '', date: new Date().toISOString().slice(0, 10) });

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

    const handleInputChange = (event, setter) => {
        setter(prev => ({ ...prev, [event.target.name]: event.target.value }));
        refreshSession();
    };

    const handleSelectChange = (event, setter) => {
        setter(prev => ({ ...prev, [event.target.name]: event.target.value }));
        refreshSession();
    };

    const handleEditBudget = (budget) => {
        setNewBudget(budget);
        refreshSession();  // Refresh the session when editing a budget
    };

    const handleEditExpense = (expense) => {
        setNewExpense(expense);
        refreshSession();  // Refresh the session when editing an expense
    };

    const handleAddOrUpdateBudget = () => {
        let url, method, data;
        if (newBudget.id) {
            url = `http://localhost:5000/api/budgets/${user.id}/${newBudget.id}`;
            method = 'put';
            data = { amount: newBudget.amount };
        } else {
            url = `http://localhost:5000/api/budgets`;
            method = 'post';
            data = { userId: user.id, category: newBudget.category, amount: newBudget.amount };
        }
        refreshSession();

        axios({
            method: method,
            url: url,
            data: data
        })
        .then(() => {
            setAlertMessage({ text: `${newBudget.id ? 'Updated' : 'Added'} budget successfully!`, type: 'success' });
            setNewBudget({ id: '', category: '', amount: '' });
            fetchBudgetsAndExpenses();
        })
        .catch(error => {
            setAlertMessage({ text: `Failed to ${newBudget.id ? 'update' : 'add'} budget.`, type: 'danger' });
        });
    };

    const handleDeleteBudget = (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            const newBudgets = budgets.filter(budget => budget.id !== id);
            setBudgets(newBudgets);
            refreshSession();

            axios.delete(`http://localhost:5000/api/budgets/${user.id}/${id}`)
                .then(() => {
                    fetchBudgetsAndExpenses();
                    setAlertMessage({ text: 'Budget deleted successfully!', type: 'success' });
                })
                .catch(error => {
                    setAlertMessage({ text: 'Failed to delete budget.', type: 'danger' });
                    setBudgets(budgets);
                });
        }
    };

    const handleAddOrUpdateExpense = () => {
        const url = newExpense.id ? `http://localhost:5000/api/expenses/${user.id}/${newExpense.id}` : `http://localhost:5000/api/expenses`;
        const method = newExpense.id ? 'put' : 'post';
        refreshSession();
        axios[method](url, { userId: user.id, category: newExpense.category, amount: newExpense.amount, date: newExpense.date })
            .then(() => {
                setAlertMessage({ text: `${newExpense.id ? 'Updated' : 'Added'} expense successfully!`, type: 'success' });
                setNewExpense({ id: '', category: '', amount: '', date: new Date().toISOString().slice(0, 10) });
                fetchBudgetsAndExpenses();
            })
            .catch(error => setAlertMessage({ text: `Failed to ${newExpense.id ? 'update' : 'add'} expense.`, type: 'danger' }));
    };

    const handleDeleteExpense = (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            const newExpenses = expenses.filter(expense => expense.id !== id);
            setExpenses(newExpenses);
            refreshSession();

            axios.delete(`http://localhost:5000/api/expenses/${user.id}/${id}`)
                .then(() => {
                    setAlertMessage({ text: 'Expense deleted successfully!', type: 'success' });
                })
                .catch(error => {
                    setAlertMessage({ text: 'Failed to delete expense.', type: 'danger' });
                    setExpenses(expenses);
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
                        <li key={budget.id}>
                            {budget.category}: ${budget.amount}
                            <button onClick={() => handleEditBudget(budget)} className="btn btn-info">Edit</button>
                            <button onClick={() => handleDeleteBudget(budget.id)} className="btn btn-danger">Delete</button>
                        </li>
                    ))}
                </ul>
                <div>
                    <input type="text" name="category" placeholder="Category" value={newBudget.category} onChange={(e) => handleInputChange(e, setNewBudget)} />
                    <input type="number" name="amount" placeholder="Amount" value={newBudget.amount} onChange={(e) => handleInputChange(e, setNewBudget)} />
                    <button onClick={handleAddOrUpdateBudget} className="btn btn-success">{newBudget.id ? 'Update' : 'Add'} Budget</button>
                </div>
            </div>
            <div>
                <h2>Expenses</h2>
                <ul>
                    {expenses.map(expense => (
                        <li key={expense.id}>
                            {expense.category} - ${expense.amount} on {new Date(expense.date).toLocaleDateString()}
                            <button onClick={() => handleEditExpense(expense)} className="btn btn-info">Edit</button>
                            <button onClick={() => handleDeleteExpense(expense.id)} className="btn btn-danger">Delete</button>
                        </li>
                    ))}
                </ul>
                <div>
                    <select name="category" value={newExpense.category} onChange={(e) => handleSelectChange(e, setNewExpense)}>
                        <option value="">Select a Category</option>
                        {budgets.map((budget) => (
                            <option key={budget.id} value={budget.category}>{budget.category}</option>
                        ))}
                    </select>
                    <input type="number" name="amount" placeholder="Amount" value={newExpense.amount} onChange={(e) => handleInputChange(e, setNewExpense)} />
                    <input type="date" name="date" value={newExpense.date} onChange={(e) => handleInputChange(e, setNewExpense)} />
                    <button onClick={handleAddOrUpdateExpense} className="btn btn-success">{newExpense.id ? 'Update' : 'Add'} Expense</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
