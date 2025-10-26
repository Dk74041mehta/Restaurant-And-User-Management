// App.jsx (Fixed for common JSX errors, focusing on line 92 area)

import React, { useState } from 'react';
import './app.css';

// --- Icon Placeholders (Using simple text/emojis, but fixing potential JSX issue) ---
const NavIcon = ({ text, active, onClick }) => (
  <button className={`nav-icon ${active ? 'active' : ''}`} onClick={onClick}>
    {text}
  </button>
);

// --- Component 1: Analytics/Metrics Cards ---
const MetricCard = ({ title, value, unit = '' }) => (
  <div className="metric-card">
    <p className="card-value">{value}{unit}</p>
    <p className="card-title">{title}</p>
  </div>
);

const AnalyticsSection = () => (
  <div className="analytics-section">
    <MetricCard title="TOTAL CHEF" value="04" />
    <MetricCard title="TOTAL REVENUE" value="12K" unit="₹" />
    <MetricCard title="TOTAL ORDERS" value="20" />
    <MetricCard title="TOTAL CLIENTS" value="65" />
  </div>
);

// --- Component 2: Order Summary Metrics ---
const OrderSummaryMetrics = () => (
  <div className="order-summary-metrics">
    <div className="metric-card served">
      <p className="card-value">09</p>
      <p className="card-title">Served</p>
    </div>
    <div className="metric-card dine-in">
      <p className="card-value">05</p>
      <p className="card-title">Dine In</p>
    </div>
    <div className="metric-card takeaway">
      <p className="card-value">06</p>
      <p className="card-title">Take Away</p>
    </div>
  </div>
);

// --- Component 3: Tables View (Matching Design) ---
const TableCard = ({ number, reserved = false }) => {
  const isReserved = reserved;
  return (
    <div className={`table-card ${isReserved ? 'reserved' : 'unreserved'}`}>
      <span className="delete-icon">🗑️</span>
      <p className="table-number">Table {number < 10 ? `0${number}` : number}</p>
      <p className="table-capacity">&#x2302; 03</p> {/* Changed icon from ◱ to &#x2302; (House/Capacity) for compatibility */}
    </div>
  );
};

const TablesView = () => {
  const totalTables = 30;
  const tables = Array.from({ length: totalTables }, (_, i) => ({
    number: i + 1,
    reserved: [4, 5, 7, 9, 12, 17, 21, 22, 26, 27, 28, 29, 30].includes(i + 1),
  }));

  return (
    <div className="tables-container">
      <h3>Tables</h3>
      <div className="table-grid">
        {tables.map(table => (
          <TableCard key={table.number} number={table.number} reserved={table.reserved} />
        ))}
        {/* Add Table Button */}
        <div className="table-card add-table-button">
            <span className="plus-icon">+</span>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component (Combining Views) ---
const App = () => {
  const [currentView, setCurrentView] = useState('analytics');

  const Header = () => (
    <header className="app-header">
      <input 
        type="text" 
        placeholder="Search" 
        className="search-filter"
      />
    </header>
  );

  const Navigation = () => (
    <nav className="sidebar">
      {/* Icon Placeholders based on Figma design */}
      <NavIcon text="🏠" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
      <NavIcon text="📋" active={currentView === 'orders'} onClick={() => setCurrentView('orders')} />
      <NavIcon text="👨‍🍳" active={currentView === 'chef'} onClick={() => setCurrentView('chef')} />
      <NavIcon text="📊" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />
      <div className="sidebar-bottom-icon">
         <NavIcon text="👤" active={false} onClick={() => {}} />
      </div>
    </nav>
  );

  const DashboardView = () => (
    <div className="dashboard-content">
      {/* Top Row: Analytics & Order Summary */}
      <div className="dashboard-row-top">
        <div className="analytics-card-container">
          <h3>Analytics</h3>
          <AnalyticsSection />
          {/* Chef Assignment Chart Placeholder */}
          <div className="chef-assignment-placeholder">
            <h4>Chef Order Assignment</h4>
            <p>Manesh: 03 | Pritam: 07 | Yash: 05 | Tenzen: 08</p>
          </div>
        </div>

        <div className="order-summary-card-container">
          <div className="summary-header">
            <h3>Order Summary</h3>
            <div className="daily-filter">Daily &#9660;</div> {/* <--- FIX APPLIED HERE (&#9660; is down triangle) */}
          </div>
          <OrderSummaryMetrics />
          
          {/* Revenue Chart Placeholder */}
          <div className="revenue-graph-placeholder">
            <p>Revenue Graph (Line/Bar Chart)</p>
            <div className="line-graph-mock"></div>
            <div className="bar-chart-mock"></div>
            <p className="graph-labels">Mon Tue Wed Thur Fri Sat Sun</p>
          </div>
        </div>
      </div>

      {/* Tables View */}
      <div className="dashboard-row-bottom">
        <TablesView />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'analytics':
        return <DashboardView />;
      case 'orders':
        return <p>Order Summary/Order Line View (Click on 📋)</p>;
      case 'chef':
        return <p>Chef Configuration View (Click on 👨‍🍳)</p>;
      case 'home':
        return <p>Home View (Click on 🏠)</p>;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      <Navigation />
      <div className="main-content-wrapper">
        <Header />
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;