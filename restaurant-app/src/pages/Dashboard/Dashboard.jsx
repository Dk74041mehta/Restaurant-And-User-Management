// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import StatsOverview from '../../components/StatsOverview/StatsOverview';
import RevenueChart from '../../components/RevenueChart/RevenueChart';
import TableOverview from '../../components/TableOverview/TableOverview'; // NEW
import './Dashboard.css';

const Dashboard = () => {
  // अभी के लिए डमी डेटा। Local Storage का काम हम बाद में करेंगे।
  const summaryData = [
    { title: 'Served', count: '09' },
    { title: 'Dine In', count: '05' },
    { title: 'Take Away', count: '06' },
  ];

  return (
    <div className="dashboard-container">
      {/* === हेडर === */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Order Summary</h2>
          <p>hijokpirngntop[gtgkoikokyhikoy[phokphnoy</p>
        </div>
        <div className="header-right">
          <select className="filter-dropdown">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* === समरी कार्ड्स === */}
      <div className="summary-cards-container">
        {summaryData.map((item, index) => (
          <SummaryCard 
            key={index} 
            count={item.count} 
            title={item.title} 
          />
        ))}
      </div>

      {/* === मुख्य कंटेंट: Stats, Chart और Tables === */}
      <div className="dashboard-main-content">
        
        {/* लेफ्ट कॉलम: Stats Overview and Revenue Chart */}
        <div className="stats-and-chart-column">
          <StatsOverview />
          <RevenueChart />
        </div>
        
        {/* राइट कॉलम: Table Overview (Tables Grid) */}
        <div className="table-overview-column">
          <TableOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;