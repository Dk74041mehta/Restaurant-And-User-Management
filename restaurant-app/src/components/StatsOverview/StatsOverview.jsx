// src/components/StatsOverview/StatsOverview.jsx
import React from 'react';
import './StatsOverview.css';

const statsData = [
  { name: 'Take Away', percentage: 75, color: '#007bff' },
  { name: 'Served', percentage: 47, color: '#28a745' },
  { name: 'Dine In', percentage: 55, color: '#ffc107' },
];

const StatsOverview = () => {
  return (
    <div className="stats-card">
      <h3>Revenue</h3>
      <div className="stats-list">
        {statsData.map((stat) => (
          <div key={stat.name} className="stat-item">
            <div className="stat-info">
              <span>{stat.name}</span>
              <span>{stat.percentage}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;