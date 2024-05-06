import React from 'react';
import { ProgressBar } from 'react-bootstrap';

function ExpenseProgress({ budgets, expenses }) {
    const getExpenseTotal = (category) => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    };

    return (
        <div>
            <h2>Expense Progress</h2>
            {budgets.map(budget => {
                const expenseTotal = getExpenseTotal(budget.category);
                const progress = Math.min(100, (expenseTotal / budget.amount) * 100);
                const progressLabel = `${expenseTotal.toFixed(2)} / ${budget.amount.toFixed(2)}`;

                return (
                    <div key={budget.id} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>{budget.category}</strong>
                            <span>{progressLabel}</span>
                        </div>
                        <ProgressBar now={progress} label={`${progress.toFixed(2)}%`} variant={expenseTotal >= budget.amount ? 'danger' : 'success'} />
                    </div>
                );
            })}
        </div>
    );
}

export default ExpenseProgress;
