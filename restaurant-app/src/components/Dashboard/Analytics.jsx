import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getFilteredAnalytics } from '../../utils/api';
import styles from './Analytics.module.css';

function Analytics({ analytics }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [filterType, setFilterType] = useState('daily');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getFilteredAnalytics(filterType);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };

    fetchChartData();
  }, [filterType]);

  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    const dates = chartData.dataPoints?.map(dp => dp.date) || [];
    const revenues = chartData.dataPoints?.map(dp => dp.total) || [];

    const rootStyles = getComputedStyle(document.documentElement);
    const colorPrimary = rootStyles.getPropertyValue('--color-primary') || '#2D80B4';

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Revenue',
          data: revenues,
          borderColor: colorPrimary.trim(),
          backgroundColor: 'rgba(45, 128, 180, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.metricsGrid}>
        <MetricCard label="Total Orders" value={analytics.totalOrders} icon="📋" />
        <MetricCard label="Total Revenue" value={`₹${analytics.totalRevenue}`} icon="💰" />
        <MetricCard label="Total Clients" value={analytics.totalClients} icon="👥" />
        <MetricCard label="Total Chefs" value={analytics.totalChefs} icon="👨‍🍳" />
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3>Revenue Trend</h3>
          <div className={styles.filterButtons}>
            {['daily', 'weekly', 'monthly', 'yearly'].map(type => (
              <button
                key={type}
                className={`${styles.filterBtn} ${filterType === type ? styles.active : ''}`}
                onClick={() => setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <canvas ref={chartRef} className={styles.chart}></canvas>
      </div>
    </div>
  );
}

// MOVE THIS FUNCTION OUTSIDE THE Analytics function, don't nest in Analytics!
function MetricCard({ label, value, icon }) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricInfo}>
        <p className={styles.metricLabel}>{label}</p>
        <p className={styles.metricValue}>{value}</p>
      </div>
    </div>
  );
}

export default Analytics;
