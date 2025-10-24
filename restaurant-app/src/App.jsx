import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

// ----------------------------------------------------------------------
// 1. API Configuration and Functions (Integrated from api/api.js)
// ----------------------------------------------------------------------

// *** यहां सुधार किया गया है! ***
// अब यह .env फ़ाइल से VITE_API_URL पढ़ेगा
const BASE_URL = import.meta.env.VITE_API_URL; 

if (!BASE_URL) {
  // अगर env variable नहीं मिला, तो console में error दिखाओ 
  console.error("FATAL: VITE_API_URL is not defined in the environment. Please check your .env file.");
}

const api = axios.create({
  // BASE_URL का उपयोग करें
  baseURL: BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const getOverallAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data.analytics;
};

const getFilteredAnalytics = async (filterType = 'monthly') => {
  const response = await api.get(`/analytics/filter?type=${filterType}`);
  return response.data;
};

const getChefs = async () => {
  const response = await api.get('/chefs');
  return response.data.chefs;
};

const getTables = async () => {
  const response = await api.get('/tables');
  return response.data.tables;
};

const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data.orders;
};

// ----------------------------------------------------------------------
// 2. Helper Functions and Constants
// ----------------------------------------------------------------------

const formatCurrency = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

// ----------------------------------------------------------------------
// 3. Reusable Components (StatCard & Sidebar)
// ----------------------------------------------------------------------

const StatCard = ({ icon, value, label, bgColorClass, iconColorClass }) => {
  return (
    <div className="stat-card">
      <div className={`stat-card__icon ${bgColorClass} ${iconColorClass}`}>
        {icon}
      </div>
      <div className="stat-card__content">
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
};

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-nav">
                {/* Logo Placeholder */}
                <div className="sidebar-icon sidebar-icon--active" title="Dashboard">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                {/* Other Icons (for future pages) */}
                <div className="sidebar-icon" title="Orders">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </div>
                <div className="sidebar-icon" title="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                </div>
                <div className="sidebar-icon" title="Chefs">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l1.65 4.95 5.3 1.07-3.66 3.49 1.1 5.38-4.39-2.73-4.39 2.73 1.1-5.38L3 8.02l5.3-1.07L10 2z"></path></svg>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// 4. Main App Component (Dashboard Logic)
// ----------------------------------------------------------------------

function App() {
  const [analytics, setAnalytics] = useState(null);
  const [chefs, setChefs] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueFilter, setRevenueFilter] = useState('monthly');
  const revenueChartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Initial Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      // Check if BASE_URL is available before fetching
      if (!BASE_URL) {
          setError("API URL is missing. Check VITE_API_URL in .env file.");
          setLoading(false);
          return;
      }
      
      try {
        const [overall, chefList, tableList, orderList] = await Promise.all([
          getOverallAnalytics(),
          getChefs(),
          getTables(),
          getOrders(),
        ]);
        setAnalytics(overall);
        setChefs(chefList);
        setTables(tableList);
        setOrders(orderList);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        // Error message updated to be more descriptive
        setError("Could not load dashboard data. Check backend connection or the API URL.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Revenue Chart Logic ---
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const filteredData = await getFilteredAnalytics(revenueFilter);
        drawRevenueChart(filteredData.dataPoints);
      } catch (err) {
        console.error("Failed to fetch filtered analytics:", err);
      }
    };
    
    // Only fetch if initial data is loaded and no general error
    if (!loading && !error) {
        fetchRevenueData();
    }
    
    // Cleanup previous chart instance
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [revenueFilter, loading, error]);

  const drawRevenueChart = (dataPoints) => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = revenueChartRef.current.getContext('2d');
    
    // Map data points
    const labels = dataPoints.map(p => p.date.split('T')[0]); // Use only date part
    const data = dataPoints.map(p => p.total);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Revenue',
          data: data,
          borderColor: '#21808d', // var(--color-teal-500)
          backgroundColor: 'rgba(33, 128, 141, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } }
      },
    });
  };
  
  // --- Order Summary Calculation ---
  const calculateOrderSummary = () => {
    // orders data is from the /orders endpoint
    const servedOrders = orders.filter(o => o.status === 'Served' || o.status === 'Done').length;
    const dineInOrders = orders.filter(o => o.type === 'Dine In').length;
    const takeawayOrders = orders.filter(o => o.type === 'Take Away').length;
    return { servedOrders, dineInOrders, takeawayOrders };
  };

  const orderSummary = calculateOrderSummary();

  // --- Chef Workload Calculation (Moved out of JSX) ---
  const maxOrders = chefs.length > 0 ? Math.max(...chefs.map(c => c.ordersAssigned)) : 1;

  if (loading) return <div className="loading-screen" style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px'}}>Loading Dashboard...</div>;
  if (error) return <div className="error-screen" style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red', fontSize: '20px'}}>{error}</div>;

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content main-content--full">
        
        {/* Row 1: Top Header Row */}
        <div className="top-header-row justify-between">
          <div className="flex items-center gap-16">
            <div className="white-circle-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 7-7 7-7-7 7-7zM5 12l7 7 7-7"></path></svg>
            </div>
            <div className="search-input-container">
              <input type="text" className="search-input" placeholder="Search orders, tables, or menu..." />
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
        </div>

        {/* Row 2: Analytics Heading */}
        <div className="analytics-heading-row">
          <h1 className="analytics-title">Analytics Dashboard</h1>
        </div>

        {/* Row 3: Stats Cards Row - INTEGRATION POINT 1 */}
        <div className="stats-cards-row">
          <StatCard
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
            value={formatCurrency(analytics.totalRevenue)}
            label="Total Revenue"
            bgColorClass="bg-red-400" iconColorClass="text-red-500"
          />
          <StatCard
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>}
            value={analytics.totalOrders}
            label="Total Orders"
            bgColorClass="bg-teal-400" iconColorClass="text-teal-500"
          />
          <StatCard
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
            value={analytics.totalClients}
            label="Total Clients"
            bgColorClass="bg-orange-400" iconColorClass="text-orange-500"
          />
          <StatCard
            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l1.65 4.95 5.3 1.07-3.66 3.49 1.1 5.38-4.39-2.73-4.39 2.73 1.1-5.38L3 8.02l5.3-1.07L10 2z"></path></svg>}
            value={analytics.totalChefs}
            label="Total Chefs"
            bgColorClass="bg-blue-400" iconColorClass="text-blue-500"
          />
        </div>

        {/* Row 4: THREE SECTIONS HORIZONTAL Layout */}
        <div className="three-sections-horizontal">
          
          {/* Section 1: Order Summary / Metrics */}
          <div className="section-order-summary">
            <div className="chart-section" style={{ flex: 1 }}>
              <div className="chart-header">
                <h4 className="chart-title">Order Metrics</h4>
                {/* Filter kept for display consistency, logic uses 'monthly' revenue data */}
                <select className="chart-filter dashboard-filter" defaultValue="monthly">
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div className="order-metrics-vertical">
                {/* Dine In */}
                <div className="metric-box">
                  <span className="metric-label">Dine In Orders</span>
                  <span className="metric-value">{orderSummary.dineInOrders}</span>
                </div>
                {/* Takeaway */}
                <div className="metric-box">
                  <span className="metric-label">Takeaway Orders</span>
                  <span className="metric-value">{orderSummary.takeawayOrders}</span>
                </div>
                {/* Served */}
                <div className="metric-box">
                  <span className="metric-label">Orders Served</span>
                  <span className="metric-value">{orderSummary.servedOrders}</span>
                </div>
                {/* Total Revenue - Repeat for clarity */}
                <div className="metric-box">
                  <span className="metric-label">Total Revenue</span>
                  <span className="metric-value-lg">{formatCurrency(analytics.totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Revenue Graph - INTEGRATION POINT 2 (Chart.js) */}
          <div className="section-revenue">
            <div className="chart-section" style={{ flex: 1 }}>
              <div className="chart-header">
                <h4 className="chart-title">{revenueFilter.charAt(0).toUpperCase() + revenueFilter.slice(1)} Revenue</h4>
                <select 
                  className="chart-filter dashboard-filter" 
                  value={revenueFilter}
                  onChange={(e) => setRevenueFilter(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="chart-container">
                <canvas ref={revenueChartRef}></canvas>
              </div>
            </div>
          </div>

          {/* Section 3: Tables View - INTEGRATION POINT 3 */}
          <div className="section-tables">
            <div className="chart-section" style={{ flex: 1 }}>
              <div className="chart-header">
                <h4 className="chart-title">Tables (Reserved: {tables.filter(t => t.status === 'Reserved').length})</h4>
              </div>
              <div className="tables-grid-three-section">
                {tables.map(table => (
                  <div 
                    key={table._id}
                    className={`table-item-three-section ${table.status === 'Reserved' ? 'table-item-three-section--reserved' : 'table-item-three-section--available'}`}
                  >
                    {table.tableNumber} ({table.chairs})
                  </div>
                ))}
              </div>
              <div className="tables-legend mt-8">
                <div className="legend-item"><span className="legend-color legend-color--reserved"></span> Reserved</div>
                <div className="legend-item"><span className="legend-color legend-color--available"></span> Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Chef Workload (Using Horizontal Progress Bars) - INTEGRATION POINT 4 */}
        <div className="chef-workload-row">
            <div className="chart-section">
                <h4 className="chart-title">Chef Workload (Orders Assigned)</h4>
                <div className="horizontal-chart-container">
                    
                    {chefs.sort((a, b) => b.ordersAssigned - a.ordersAssigned).map((chef) => (
                        <div key={chef._id} className="progress-item">
                            <span className="progress-label">{chef.name}</span>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    // maxOrders is now defined outside of JSX
                                    style={{ width: `${(chef.ordersAssigned / maxOrders) * 100}%` }} 
                                ></div>
                            </div>
                            <span className="progress-value">{chef.ordersAssigned}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;