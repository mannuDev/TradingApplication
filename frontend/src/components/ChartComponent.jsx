import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ productName, pricePerUnit }) => {
  // Generate dummy price history data
  const generatePriceData = () => {
    const days = 30;
    const data = [];
    const labels = [];
    let currentPrice = pricePerUnit * 0.9; // Start 10% lower

    for (let i = days; i >= 0; i--) {
      labels.push(`${i} days ago`);
      currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02); // Random walk
      data.push(currentPrice.toFixed(2));
    }

    return { labels, data };
  };

  const { labels, data } = generatePriceData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Price (₹)',
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${productName} - Price History (Last 30 Days)`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;

