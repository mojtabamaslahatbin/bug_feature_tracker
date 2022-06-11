import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    plugins: {
        title: {
            display: true,
            text: 'reported bugs and requested features per month',
        },
    },
    responsive: true,
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Done',
            data: [23, 45, 31, 24, 13, 36, 46],
            backgroundColor: '#00E396',
        },
        {
            label: 'InProgress',
            data: [41, 45, 34, 27, 35, 46, 24],
            backgroundColor: '#FEB019',
        },
        {
            label: 'Suspended',
            data: [11, 33, 41, 23, 31, 17, 25],
            backgroundColor: '#FF4560',
        },
    ],
};

const Chart = () => {
    return <Bar options={options} data={data}/>;
}

export default Chart