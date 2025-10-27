import React from 'react';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import StatsOverview from '../../components/StatsOverview/StatsOverview';
import RevenueChart from '../../components/RevenueChart/RevenueChart';
import TableOverview from '../../components/TableOverview/TableOverview';
import './Dashboard.css';

const Dashboard = () => {
  const summaryData = [
    { title: 'Served', count: '09' },
    { title: 'Dine In', count: '05' },
    { title: 'Take Away', count: '06' },
  ];

  return (
    <div className="dashboard-container">
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

      <div className="summary-cards-container">
        {summaryData.map((item, index) => (
          <SummaryCard 
            key={index} 
            count={item.count} 
            title={item.title} 
          />
        ))}
      </div>

      <div className="dashboard-main-content">
        
        <div className="stats-and-chart-column">
          <StatsOverview />
          <RevenueChart />
        </div>
        
        <div className="table-overview-column">
          <TableOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;