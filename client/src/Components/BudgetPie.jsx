import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, PieController);

function generateColor(index) {
    var r = (index * 33 + 254) % 255;
    var g = (index * 100 + 10) % 255;
    var b = (index * 167 + 10) % 255;
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
}

function BudgetPie({ budgets }) {
    if (budgets.length === 0) {
        return (
            <div style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                <p>Please add a budget to track your Budget Pie Chart.</p>
            </div>
        );
    }

    const colors = budgets.map((_, index) => generateColor(index));
    const data = {
        labels: budgets.map(budget => budget.category),
        datasets: [{
            label: 'Budget Distribution',
            data: budgets.map(budget => budget.amount),
            backgroundColor: colors,
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'black',
                    font: {
                        size: 14
                    }
                }
            },
        },
        layout: {
            padding: 20
        }
    };

    return (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}> 
            <h2>Budget Pie Chart</h2>
            <Pie data={data} options={options} />
        </div>
    );
}

export default BudgetPie;
