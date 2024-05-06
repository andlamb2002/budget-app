import React, { useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import axios from 'axios';
import API_URL from '../config'; 

function ExpenseTable({ expenses, setExpenses, budgets, fetchBudgetsAndExpenses, setAlertMessage }) {
    const { user, refreshSession } = useAuth();
    const [newExpense, setNewExpense] = useState({ id: '', category: '', amount: '', date: new Date().toISOString().slice(0, 10) });

    const handleInputChange = (event, setter) => {
        setter(prev => ({ ...prev, [event.target.name]: event.target.value }));
        refreshSession();
    };

    const handleSelectChange = (event, setter) => {
        setter(prev => ({ ...prev, [event.target.name]: event.target.value }));
        refreshSession();
    };

    const handleEditExpense = (expense) => {
        setNewExpense(expense);
        refreshSession(); 
    };

    const handleAddOrUpdateExpense = () => {
        const url = newExpense.id ? `${API_URL}/api/expenses/${user.id}/${newExpense.id}` : `${API_URL}/api/expenses`;
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

            axios.delete(`${API_URL}/api/expenses/${user.id}/${id}`)
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
    );
}

export default ExpenseTable;
