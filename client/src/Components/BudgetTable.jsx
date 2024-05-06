import React, { useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import axios from 'axios';
import API_URL from '../config';

function BudgetTable({ budgets, setBudgets, fetchBudgetsAndExpenses, setAlertMessage }) {
    const { user, refreshSession } = useAuth();
    const [newBudget, setNewBudget] = useState({ id: '', category: '', amount: '' });

    const handleInputChange = (event, setter) => {
        setter(prev => ({ ...prev, [event.target.name]: event.target.value }));
        refreshSession();
    };

    const handleEditBudget = (budget) => {
        setNewBudget(budget);
        refreshSession();  
    };

    const handleAddOrUpdateBudget = () => {
        let url, method, data;
        if (newBudget.id) {
            url = `${API_URL}/api/budgets/${user.id}/${newBudget.id}`;
            method = 'put';
            data = { amount: newBudget.amount };
        } else {
            url = `${API_URL}/api/budgets`;
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

            axios.delete(`${API_URL}/api/budgets/${user.id}/${id}`)
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

    return (
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
    );
}

export default BudgetTable;
