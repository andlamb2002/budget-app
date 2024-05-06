import React, { useState } from 'react';
import { useAuth } from '../Contexts/authContext';
import axios from 'axios';
import API_URL from '../config';

function ExpenseTable({ expenses, setExpenses, budgets, fetchBudgetsAndExpenses, setAlertMessage }) {
    const { user, refreshSession } = useAuth();
    const [newExpense, setNewExpense] = useState({ category: '', amount: '', date: new Date().toISOString().slice(0, 10) });
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editExpense, setEditExpense] = useState({ category: '', amount: '', date: new Date().toISOString().slice(0, 10) });
    const [showAddExpense, setShowAddExpense] = useState(false); 

    const handleInputChange = (event, field) => {
        setNewExpense(prev => ({ ...prev, [field]: event.target.value }));
        refreshSession();
    };

    const toggleAddExpense = () => {
        setShowAddExpense(!showAddExpense);
        setNewExpense({ category: '', amount: '', date: new Date().toISOString().slice(0, 10) }); 
        refreshSession();
    };

    const handleAddExpense = () => {
        const url = `${API_URL}/api/expenses`;
        refreshSession();
        axios.post(url, { userId: user.id, ...newExpense })
            .then(() => {
                setAlertMessage({ text: 'Added expense successfully!', type: 'success' });
                fetchBudgetsAndExpenses();
                setNewExpense({ category: '', amount: '', date: new Date().toISOString().slice(0, 10) }); 
                toggleAddExpense();
            })
            .catch(error => {
                setAlertMessage({ text: 'Failed to add expense.', type: 'danger' });
            });
    };

    const startEdit = (expense) => {
        setEditingExpenseId(expense.id);
        setEditExpense({ ...expense });
        refreshSession();
    };

    const handleInputChangeForEdit = (event, field) => {
        setEditExpense(prev => ({ ...prev, [field]: event.target.value }));
        refreshSession();
    };

    const handleSaveEdit = () => {
        const url = `${API_URL}/api/expenses/${user.id}/${editExpense.id}`;
        refreshSession();
        axios.put(url, { userId: user.id, ...editExpense })
            .then(() => {
                setAlertMessage({ text: 'Updated expense successfully!', type: 'success' });
                stopEdit();
                fetchBudgetsAndExpenses();
            })
            .catch(error => {
                setAlertMessage({ text: 'Failed to update expense.', type: 'danger' });
            });
    };

    const stopEdit = () => {
        setEditingExpenseId(null);
        setEditExpense({ category: '', amount: '', date: new Date().toISOString().slice(0, 10) });
        refreshSession();
    };

    const handleDeleteExpense = (id) => {
        refreshSession();
        axios.delete(`${API_URL}/api/expenses/${user.id}/${id}`)
            .then(() => {
                setAlertMessage({ text: 'Expense deleted successfully!', type: 'success' });
                fetchBudgetsAndExpenses();
            })
            .catch(error => {
                setAlertMessage({ text: 'Failed to delete expense.', type: 'danger' });
            });
    };

    return (
        <div>
            <h2>Expenses</h2>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th className="col-3">Category</th>
                        <th className="col-3">Amount</th>
                        <th className="col-3">Date</th>
                        <th className="col-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(expense => (
                        <tr key={expense.id}>
                            <td className="col-3">
                                {editingExpenseId === expense.id ? (
                                    <select 
                                        value={editExpense.category} 
                                        onChange={(e) => handleInputChangeForEdit(e, 'category')} 
                                        className="form-control">
                                        {budgets.map((budget) => (
                                            <option key={budget.id} value={budget.category}>{budget.category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span onClick={() => startEdit(expense)}>{expense.category}</span>
                                )}
                            </td>
                            <td className="col-3">
                                {editingExpenseId === expense.id ? (
                                    <input 
                                        type="number"
                                        value={editExpense.amount} 
                                        onChange={(e) => handleInputChangeForEdit(e, 'amount')} 
                                        className="form-control"
                                    />
                                ) : (
                                    <span onClick={() => startEdit(expense)}>${parseFloat(expense.amount)}</span>
                                )}
                            </td>
                            <td className="col-3">
                                {editingExpenseId === expense.id ? (
                                    <input 
                                        type="date"
                                        value={editExpense.date}
                                        onChange={(e) => handleInputChangeForEdit(e, 'date')} 
                                        className="form-control"
                                    />
                                ) : (
                                    <span onClick={() => startEdit(expense)}>{new Date(expense.date).toLocaleDateString()}</span>
                                )}
                            </td>
                            <td className="col-3">
                                {editingExpenseId === expense.id ? (
                                    <>
                                        <button onClick={handleSaveEdit} className="btn btn-success">Save</button>
                                        <button onClick={stopEdit} className="btn btn-danger">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleDeleteExpense(expense.id)} className="btn btn-danger">Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showAddExpense ? (
                <div className="mt-2 row">
                    <div className="col">
                        <select name="category" value={newExpense.category} onChange={(e) => handleInputChange(e, 'category')} className="form-control">
                            <option value="">Category</option>
                            {budgets.map(budget => (
                                <option key={budget.id} value={budget.category}>{budget.category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <input type="number" name="amount" placeholder="Amount" value={newExpense.amount} onChange={(e) => handleInputChange(e, 'amount')} className="form-control" />
                    </div>
                    <div className="col">
                        <input type="date" name="date" placeholder="Date" value={newExpense.date} onChange={(e) => handleInputChange(e, 'date')} className="form-control" />
                    </div>
                    <div className="col-auto">
                        <button onClick={handleAddExpense} className="btn btn-success">Add Expense</button>
                        <button onClick={toggleAddExpense} className="btn btn-danger">Cancel</button>
                    </div>
                </div>
            ) : (
                <button onClick={toggleAddExpense} className="btn btn-success">+ Add Expense</button>
            )}
        </div>
    );
}

export default ExpenseTable;
