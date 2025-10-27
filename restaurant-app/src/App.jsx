// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, NavLink } from 'react-router-dom';

// =======================================================
// 1. Local Storage Utilities (Tables Management के लिए)
// =======================================================

const STORAGE_KEY = 'RESTAURANT_TABLES';

// Local Storage से टेबल्स डेटा लोड करें
const getTables = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// टेबल्स को Local Storage में सेव करें और Sequential Numbering सुनिश्चित करें
const saveTables = (tables) => {
  // फ़िल्टर और री-इंडेक्सिंग (SRD Requirement: Deleting a table reshuffles numbering)
  const reindexedTables = tables
    .filter(t => t && t.chairs && t.chairs > 0) // Invalid entries हटा दें
    .map((table, index) => ({
      ...table,
      id: index + 1, // नया sequential ID
      number: String(index + 1).padStart(2, '0'), // Sequential number (01, 02, ...)
    }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reindexedTables));
  return reindexedTables;
};


// =======================================================
// 2. Dashboard Components (Desktop - 1.pdf)
// =======================================================

// A. SummaryCard Component
const SummaryCard = ({ count, title }) => (
    <div className="summary-card">
        <div className="card-count">{count}</div>
        <div className="card-title">{title}</div>
    </div>
);

// B. StatsOverview Component (Progress Bars)
const StatsOverview = () => {
    const statsData = [
        { name: 'Take Away', percentage: 75, color: '#007bff' },
        { name: 'Served', percentage: 47, color: '#28a745' },
        { name: 'Dine In', percentage: 55, color: '#ffc107' },
    ];
    return (
        <div className="stats-card card-style">
            <h3>Revenue</h3>
            <div className="stats-list">
                {statsData.map((stat) => (
                    <div key={stat.name} className="stat-item">
                        <div className="stat-info">
                            <span>{stat.name}</span>
                            <span>{stat.percentage}%</span>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" 
                                 style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// C. RevenueChart Component (Placeholder Graph)
const RevenueChart = () => (
    <div className="chart-card card-style">
        <div className="chart-header">
            <h3>Revenue Chart</h3>
            <div className="chart-filter">Daily</div>
        </div>
        <div className="chart-placeholder">
            <div className="dummy-chart-line"></div>
            <div className="chart-labels">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thur</span>
                <span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
        </div>
    </div>
);

// D. TableOverview Component (Dashboard Grid)
const TableOverview = () => {
    const tables = getTables(); // Local Storage से लाइव डेटा
    const displayTables = tables.slice(0, 30); // Max 30 display करें

    return (
        <div className="table-overview-card card-style">
            <div className="table-overview-header">
                <h3>Tables</h3>
                <p className="available-count">Availab <span>{displayTables.filter(t => !t.isReserved).length}</span></p>
            </div>
            <div className="tables-grid">
                {displayTables.length > 0 ? (
                    displayTables.map((table) => (
                        <div 
                            key={table.id} 
                            className={`table-item ${table.isReserved ? 'reserved' : 'available'}`}
                            title={`Table ${table.number} (${table.chairs} Chairs)`}
                        >
                            <span className="table-title">Table</span>
                            <span className="table-number">{table.number}</span>
                        </div>
                    ))
                ) : (
                    <p className="no-tables-msg">Go to Tables page to create tables.</p>
                )}
            </div>
        </div>
    );
};

// E. Dashboard Page
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
                    </select>
                </div>
            </div>

            <div className="summary-cards-container">
                {summaryData.map((item, index) => (
                    <SummaryCard key={index} count={item.count} title={item.title} />
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


// =======================================================
// 3. Tables Management Page (Desktop - 2.pdf)
// =======================================================

const Tables = () => {
    const [tables, setTables] = useState(getTables());
    const [showAddForm, setShowAddForm] = useState(false);
    const [chairCount, setChairCount] = useState(4); // Default
    const [tableName, setTableName] = useState('');
    
    useEffect(() => {
        // कंपोनेंट लोड होने पर Local Storage से डेटा लोड करें
        setTables(getTables());
    }, []);

    const handleCreateTable = (e) => {
        e.preventDefault();
        
        const newTable = {
            name: tableName || null, // Optional table name
            chairs: chairCount,
            isReserved: false, // Initially unreserved
        };

        const updatedTables = saveTables([...tables, newTable]);
        setTables(updatedTables);
        
        // Form reset
        setTableName('');
        setChairCount(4);
        setShowAddForm(false);
    };

    const handleDeleteTable = (id) => {
        // उस table को array से हटाएँ जिसका id मैच करता है
        const updatedTables = tables.filter(table => table.id !== id);
        
        // re-index और save करें
        const newTables = saveTables(updatedTables);
        setTables(newTables);
    };
    
    // SRD: Available table sizes: 2, 4, 6, 8
    const availableSizes = [2, 4, 6, 8];

    return (
        <div className="tables-container page-padding">
            <header className="tables-header">
                <h1>Tables Management</h1>
                <button 
                    className="add-table-btn" 
                    onClick={() => setShowAddForm(prev => !prev)}
                >
                    {showAddForm ? 'Cancel' : '+ Add New Table'}
                </button>
            </header>

            {/* Add New Table Form */}
            {showAddForm && (
                <form onSubmit={handleCreateTable} className="add-table-form-container card-style">
                    <h3>Create New Table</h3>
                    <div className="form-group">
                        <label htmlFor="tableName">Table Name (optional)</label>
                        <input
                            id="tableName"
                            type="text"
                            placeholder="Enter table name"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Chairs (Size)</label>
                        <div className="chair-selector">
                            {availableSizes.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`chair-option ${chairCount === size ? 'active' : ''}`}
                                    onClick={() => setChairCount(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="create-btn">Create</button>
                </form>
            )}

            {/* Tables Grid */}
            <div className="tables-grid-full">
                {tables.length > 0 ? (
                    tables.map(table => (
                        <div key={table.id} className="table-item-full card-style">
                            {/* Figma डिज़ाइन के अनुसार */}
                            <button 
                                className="delete-btn" 
                                onClick={() => handleDeleteTable(table.id)}
                                // SRD: Reserved tables cannot be deleted (अभी simple delete है)
                                disabled={table.isReserved} 
                                title={table.isReserved ? 'Reserved tables cannot be deleted' : 'Delete Table'}
                            >
                                {/* Delete Icon Placeholder */}
                                <span className="delete-icon">✕</span>
                            </button>
                            
                            <span className="table-number">Table {table.number}</span>
                            <span className="table-chairs">Chairs: {table.chairs}</span>
                            <span className="table-status">
                                {table.isReserved ? 'RESERVED' : 'AVAILABLE'}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="no-tables-msg">Please use the "Add New Table" button to create tables.</p>
                )}
            </div>
        </div>
    );
};


// =======================================================
// 4. Order Line Page (Desktop - 6.png)
// =======================================================

const OrderCard = ({ order }) => (
    <div className={`order-card card-style ${order.status.toLowerCase().replace(' ', '-')}`}>
        <div className="order-header">
            <span className="order-status">{order.status}</span>
            <span className="order-id">#ORD-{order.id}</span>
        </div>
        <div className="order-details">
            <p className="order-type">
                {order.type === 'Dine In' ? `Table: ${order.table}` : 'Takeaway'}
            </p>
            <p className="order-chef">Chef: {order.chef}</p>
        </div>
        <ul className="order-items-list">
            {order.items.map((item, index) => (
                <li key={index}>{item.qty}x {item.name}</li>
            ))}
        </ul>
        <div className="order-footer">
            <span className="processing-time">Processing: {order.time}</span>
            <span className="item-count">Total Items: {order.totalItems}</span>
        </div>
    </div>
);

const OrderLine = () => {
    // डमी ऑर्डर डेटा (Figma Desktop - 6.png के अनुसार)
    const orders = [
        { id: 101, status: 'Processing', type: 'Dine In', table: '05', chef: 'Manesh', time: '10m', totalItems: 3, items: [{name: 'Biryani', qty: 1}, {name: 'Naan', qty: 2}] },
        { id: 102, status: 'Done', type: 'Take Away', chef: 'Pritam', time: '0m', totalItems: 5, items: [{name: 'Pizza', qty: 1}, {name: 'Coke', qty: 4}] },
        { id: 103, status: 'Processing', type: 'Dine In', table: '12', chef: 'Yash', time: '5m', totalItems: 2, items: [{name: 'Dal', qty: 1}, {name: 'Rice', qty: 1}] },
        { id: 104, status: 'New', type: 'Take Away', chef: 'Unassigned', time: '15m', totalItems: 4, items: [{name: 'Burger', qty: 4}] },
    ];
    
    return (
        <div className="order-line-container page-padding">
            <div className="order-line-header">
                <h1>Order Line</h1>
                <div className="filter-options">
                    <input type="text" placeholder="Search Order ID" className="search-input" />
                    <select className="filter-dropdown">
                        <option>All Status</option>
                        <option>New</option>
                        <option>Processing</option>
                        <option>Done</option>
                    </select>
                </div>
            </div>
            
            <div className="orders-grid">
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
};


// =======================================================
// 5. Menu Management Page (Desktop - 3.png)
// =======================================================

const MenuItemCard = ({ item }) => (
    <div className="menu-item-card card-style">
        <div className="item-image-placeholder">{item.category[0]}</div>
        <div className="item-details">
            <h4 className="item-name">{item.name}</h4>
            <p className="item-category">{item.category}</p>
            <div className="item-footer">
                <span className="item-price">₹{item.price}</span>
                <span className={`item-stock ${item.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                    Stock: {item.stock}
                </span>
            </div>
        </div>
    </div>
);

const Menu = () => {
    // डमी मेनू डेटा (Figma Desktop - 3.png के अनुसार)
    const menuItems = [
        { id: 1, name: 'Tandoori Roti', price: 50, category: 'Bread', stock: 50 },
        { id: 2, name: 'Chicken Biryani', price: 250, category: 'Rice', stock: 15 },
        { id: 3, name: 'Paneer Tikka', price: 180, category: 'Starter', stock: 5 },
        { id: 4, name: 'Masala Dosa', price: 100, category: 'South Indian', stock: 30 },
        { id: 5, name: 'Gulab Jamun', price: 80, category: 'Dessert', stock: 20 },
    ];

    return (
        <div className="menu-container page-padding">
            <div className="menu-header">
                <h1>Menu Management</h1>
                <div className="menu-actions">
                    <input type="text" placeholder="Search Menu Items" className="search-input" />
                    <select className="filter-dropdown">
                        <option>All Categories</option>
                        <option>Bread</option>
                        <option>Rice</option>
                        <option>Starter</option>
                    </select>
                    <button className="add-menu-btn">+ Add Item</button>
                </div>
            </div>
            
            <div className="menu-items-grid">
                {menuItems.map(item => (
                    <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};


// =======================================================
// 6. Layout Components (Sidebar & AppLayout)
// =======================================================

const Sidebar = () => (
    <nav className="sidebar">
        <div className="sidebar-logo">🍽️ Admin Dashboard</div>
        <ul className="sidebar-nav">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>Dashboard</span></NavLink></li>
            <li><NavLink to="/order-line" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>Order Line</span></NavLink></li>
            <li><NavLink to="/tables" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>Tables</span></NavLink></li>
            <li><NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>Menu</span></NavLink></li>
        </ul>
    </nav>
);

const AppLayout = () => (
    <div className="app-layout">
        <Sidebar />
        <main className="content-area">
            <Outlet />
        </main>
    </div>
);


// =======================================================
// 7. Main App Router
// =======================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="order-line" element={<OrderLine />} />
          <Route path="tables" element={<Tables />} />
          <Route path="menu" element={<Menu />} />
        </Route>
        <Route path="*" element={<h1 style={{padding: '20px'}}>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;