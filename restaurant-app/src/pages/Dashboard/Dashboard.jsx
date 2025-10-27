import React from 'react';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import './Dashboard.css';

const Dashboard = () => {
  // अभी के लिए यह डेटा हम यहीं रख रहे हैं।
  // बाद में, यह डेटा local storage या state से आएगा।
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
          {/* डिज़ाइन में यहाँ कुछ प्लेसहोल्डर टेक्स्ट है */}
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

      {/* === बाकी सेक्शन (हम इन्हें बाद में बनाएँगे) === */}
      <div className="dashboard-main-content">
        <div className="stats-and-chart">
          {/* Stats Overview (Progress Bars) यहाँ आएगा */}
          {/* Revenue Chart (Graph) यहाँ आएगा */}
        </div>
        <div className="table-overview-container">
          {/* Table Overview (Grid) यहाँ आएगा */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;