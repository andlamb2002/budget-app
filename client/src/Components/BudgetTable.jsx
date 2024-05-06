import React, { useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import axios from 'axios';
import API_URL from '../config';

function BudgetTable({ budgets, setBudgets, expenses, fetchBudgetsAndExpenses, setAlertMessage }) {
    const { user, refreshSession } = useAuth();
    const [newBudget, setNewBudget] = useState({ id: '', category: '', amount: '' });
    const [editingBudgetId, setEditingBudgetId] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [showAddBudget, setShowAddBudget] = useState(false); 

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewBudget(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
        refreshSession();
    };

    const handleAmountChange = (event) => {
        setEditAmount(event.target.value);
        refreshSession();
    };

    const toggleAddBudget = () => {
        setShowAddBudget(!showAddBudget);
        setNewBudget({ id: '', category: '', amount: '' }); 
        refreshSession();
    };

    const handleAddBudget = () => {
        const url = `${API_URL}/api/budgets`;
        const method = 'post';
        const data = { userId: user.id, category: newBudget.category, amount: parseFloat(newBudget.amount) || 0 };
        refreshSession();

        axios({
            method: method,
            url: url,
            data: data
        })
        .then(() => {
            setAlertMessage({ text: 'Added budget successfully!', type: 'success' });
            toggleAddBudget(); 
            fetchBudgetsAndExpenses();
        })
        .catch(error => {
            setAlertMessage({ text: 'Failed to add budget.', type: 'danger' });
        });
    };

    const startEdit = (budget) => {
        setEditingBudgetId(budget.id);
        setEditAmount(budget.amount);
        refreshSession();
    };

    const stopEdit = () => {
        setEditingBudgetId(null);
        refreshSession();
    };

    const handleUpdateAmount = (budgetId) => {
        if (editAmount !== '') {
            const data = {
                userId: user.id,
                amount: parseFloat(editAmount) || 0
            };
            axios.put(`${API_URL}/api/budgets/${user.id}/${budgetId}`, data)
                .then(() => {
                    setAlertMessage({ text: 'Budget updated successfully!', type: 'success' });
                    stopEdit();
                    fetchBudgetsAndExpenses();
                })
                .catch(error => {
                    setAlertMessage({ text: 'Failed to update budget.', type: 'danger' });
                });
        } else {
            stopEdit(); 
        }
    };

    const handleDeleteBudget = (id) => {
        refreshSession();
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

    const calculateTotalExpenses = (category) => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    };

    const totalBudget = budgets.reduce((acc, budget) => acc + parseFloat(budget.amount), 0).toFixed(2);
    const totalExpenses = budgets.reduce((acc, budget) => acc + calculateTotalExpenses(budget.category), 0).toFixed(2);

    return (
        <div>
            <h2>Budgets</h2>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th className="col-3">Category</th>
                        <th className="col-3">Budget</th>
                        <th className="col-3">Expenses</th>
                        <th className="col-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {budgets.map(budget => (
                        <tr key={budget.id}>
                            <td className="col-3">{budget.category}</td>
                            <td className="col-3">
                                {editingBudgetId === budget.id ? (
                                    <input
                                        type="number"
                                        value={parseFloat(editAmount)} 
                                        onChange={handleAmountChange}
                                        className="form-control"
                                        autoFocus
                                    />
                                ) : (
                                    <span onClick={() => startEdit(budget)}>
                                        ${parseFloat(budget.amount).toFixed(2)}
                                    </span>
                                )}
                            </td>
                            <td className="col-3">${calculateTotalExpenses(budget.category).toFixed(2)}</td>
                            <td className="col-3">
                                {editingBudgetId === budget.id ? (
                                    <div>
                                        <div className="mb-2">
                                            <button onClick={() => handleUpdateAmount(budget.id)} className="btn btn-success">Save</button>
                                        </div>
                                        <div>
                                            <button onClick={stopEdit} className="btn btn-danger">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => handleDeleteBudget(budget.id)} className="btn btn-danger">Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Total:</strong></td>
                        <td>${totalBudget}</td>
                        <td>${totalExpenses}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
            {showAddBudget ? (
                <div>
                    <input type="text" name="category" placeholder="Category" value={newBudget.category} onChange={handleInputChange} class="me-2" />
                    <input type="number" name="amount" placeholder="Budget" value={parseFloat(newBudget.amount)} onChange={handleInputChange} class="me-2" />
                    <button onClick={handleAddBudget} className="btn btn-success me-2">Add</button>
                    <button onClick={toggleAddBudget} className="btn btn-danger">Cancel</button>
                </div>
            ) : (
                <button onClick={toggleAddBudget} className="btn btn-success btn-block">+ Add Budget</button>
            )}
        </div>
    );
}

export default BudgetTable;
