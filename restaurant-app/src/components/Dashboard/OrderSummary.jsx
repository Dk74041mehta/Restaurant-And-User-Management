import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from './ordersummary.module.css';

function OrderSummary({ orders }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const dineInCount = orders.filter(o => o.type === 'Dine In').length;
    const takeAwayCount = orders.filter(o => o.type === 'Take Away').length;
    const servedCount = orders.filter(o => o.status === 'Done').length;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Dine In', 'Take Away', 'Served'],
          datasets: [{
            data: [dineInCount, takeAwayCount, servedCount],
            backgroundColor: [
              'rgba(255, 165, 0, 0.7)',
              'rgba(52, 152, 219, 0.7)',
              'rgba(39, 174, 96, 0.7)'
            ],
            borderColor: ['#F5A623', '#3498DB', '#27AE60'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [orders]);

  const servedCount = orders.filter(o => o.status === 'Done').length;
  const dineInCount = orders.filter(o => o.type === 'Dine In').length;
  const takeAwayCount = orders.filter(o => o.type === 'Take Away').length;

  return (
    <div className={styles.orderSummary}>
      <h3>Order Summary</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.label}>Served</span>
          <span className={styles.value}>{servedCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Dine In</span>
          <span className={styles.value}>{dineInCount}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Take Away</span>
          <span className={styles.value}>{takeAwayCount}</span>
        </div>
      </div>

      <canvas ref={chartRef} className={styles.chart}></canvas>
    </div>
  );
}

export default OrderSummary;
