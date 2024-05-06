import React from 'react';
import { ProgressBar } from 'react-bootstrap';

function TotalProgress({ budgets, expenses }) {
    if (budgets.length === 0) {
        return (
            <div style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                <p>Please add a budget to track your Total Budget.</p>
            </div>
        );
    }

    const totalBudget = budgets.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const progressPercentage = Math.min(100, (totalExpenses / totalBudget) * 100);

    const progressLabel = `${totalExpenses.toFixed(2)} / ${totalBudget.toFixed(2)}`;
    const variant = totalExpenses > totalBudget ? 'danger' : 'success';

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '1.2rem' }}>
                <h2>Total Budget</h2>
                <span>{progressLabel}</span>
            </div>
            <ProgressBar now={progressPercentage} label={`${progressPercentage.toFixed(2)}%`} variant={variant} style={{ height: '30px' }} />
            <div style={{ fontSize: '1.5rem', color: 'black' }}>
                {totalExpenses > totalBudget ? (
                    <p>You are over budget by ${Math.abs(totalBudget - totalExpenses).toFixed(2)}!</p>
                ) : (
                    <p>You have ${Math.abs(totalBudget - totalExpenses).toFixed(2)} left to spend!</p>
                )}
            </div>
        </div>
    );
}

export default TotalProgress;
