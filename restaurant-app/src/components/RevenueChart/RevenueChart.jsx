import React from 'react';
import './RevenueChart.css';

const RevenueChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Revenue</h3>
        <div className="chart-filter">Daily</div>
      </div>
      
      <div className="chart-placeholder">
        <div className="dummy-chart-line"></div>
        
        <div className="chart-labels">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thur</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;