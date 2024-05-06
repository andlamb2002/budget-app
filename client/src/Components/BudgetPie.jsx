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

function BudgetPie({ budgets }) {
    const data = {
        labels: budgets.map(budget => budget.category),
        datasets: [{
            label: 'Budget Distribution',
            data: budgets.map(budget => budget.amount),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(199, 199, 199, 0.8)',
                'rgba(83, 102, 255, 0.8)',
                'rgba(40, 159, 64, 0.8)',
                'rgba(255, 99, 132, 0.8)'
            ],
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
            <h1>Budget Distribution</h1>
            <Pie data={data} options={options} />
        </div>
    );
}

export default BudgetPie;
