// src/components/RevenueChart/RevenueChart.jsx
import React from 'react';
import './RevenueChart.css';

const RevenueChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Tables</h3> {/* Figma design में इस सेक्शन का टाइटल 'Tables' है */}
        <div className="chart-filter">Daily</div>
      </div>
      
      {/* ग्राफ का विज़ुअल प्लेसहोल्डर */}
      <div className="chart-placeholder">
        {/* यह एक डमी लाइन ग्राफ दिखाने के लिए है */}
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