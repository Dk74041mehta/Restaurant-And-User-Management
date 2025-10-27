// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, NavLink } from 'react-router-dom';

// =======================================================
// 1. Local Storage Utilities (Tables Management के लिए)
// =======================================================

const STORAGE_KEY = 'RESTAURANT_TABLES';
const MAX_TABLES = 30; // Maximum tables limit

const getTables = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// टेबल को सेव करते समय Sequential Numbering सुनिश्चित करें
const saveTables = (tables) => {
  const reindexedTables = tables
    .filter(t => t && t.chairs && t.chairs > 0) 
    .map((table, index) => ({
      ...table,
      id: index + 1, // नया sequential ID
      number: String(index + 1).padStart(2, '0'), // 01, 02, 03...
    }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reindexedTables));
  return reindexedTables;
};


// =======================================================
// 2. Layout Components (Sidebar & AppLayout)
// =======================================================

const Sidebar = () => (
    <nav className="sidebar">
        <div className="sidebar-logo">🍽️ Company Logo</div> 
        <ul className="sidebar-nav">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>Analytics</span></NavLink></li>
            <li><NavLink to="/tables" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>Chairs</span></NavLink></li>
            <li><NavLink to="/order-line" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>Order Line</span></NavLink></li>
            <li><NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span>Menu Management</span></NavLink></li>
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
// 3. Dashboard Components (Desktop - 1: Analytics)
// =======================================================

// A. Top 4 Summary Cards (Horizontal)
const TopStatsCard = ({ title, count, icon }) => (
    <div className="top-stats-card card-style">
        <span className="card-icon">{icon}</span>
        <div className="card-details">
            <div className="card-count">{count}</div>
            <div className="card-title">{title}</div>
        </div>
    </div>
);

const TopSummaryRow = () => {
    const data = [
        { title: 'TOTAL CHEF', count: '04', icon: '👨‍🍳' },
        { title: 'TOTAL REVENUE', count: '₹ 12K', icon: '💰' },
        { title: 'TOTAL ORDERS', count: '20', icon: '📝' },
        { title: 'TOTAL CLIENTS', count: '65', icon: '👥' },
    ];
    return (
        <div className="top-summary-row">
            {data.map((item, index) => (
                <TopStatsCard key={index} {...item} />
            ))}
        </div>
    );
};

// B. Order Summary 3 Cards
const SummaryCard = ({ count, title }) => (
    <div className="summary-card card-style">
        <div className="card-count">{count}</div>
        <div className="card-title">{title}</div>
    </div>
);

// C. Revenue Stats Overview (Progress Bars)
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

// D. RevenueChart Component (Placeholder Graph)
const RevenueChart = () => (
    <div className="chart-card card-style">
        <div className="chart-header">
            <h3>Revenue</h3>
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

// E. TableOverview Component (Dashboard Grid - Small)
const TableOverview = () => {
    // Note: This is the small view for Dashboard, not the main Tables page
    const tables = getTables();
    // Default 30 dummy tables or real tables (Dashboard view)
    const displayTables = tables.length > 0 ? tables : Array.from({ length: 30 }, (_, i) => ({ id: i + 1, number: String(i + 1).padStart(2, '0'), isReserved: i % 5 === 0, seats: 4 }));

    return (
        <div className="table-overview-card card-style">
            <div className="table-overview-header">
                <h3>Tables</h3>
                <p className="available-count">Availab <span>{displayTables.filter(t => !t.isReserved).length}</span></p>
            </div>
            <div className="tables-grid">
                {displayTables.slice(0, 30).map((table) => (
                    <div 
                        key={table.id} 
                        className={`table-item ${table.isReserved ? 'reserved' : 'available'}`}
                        title={`Table ${table.number} (${table.seats} Chairs)`}
                    >
                        <span className="table-title">Table</span>
                        <span className="table-number">{table.number}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// F. Chef Order List
const ChefOrderList = () => {
    // Dummy Data based on Figma/PDF
    const chefData = [
        { name: 'Manesh', orders: 3 },
        { name: 'Pritam', orders: 7 },
        { name: 'Yash', orders: 5 },
        { name: 'Tenzen', orders: 8 },
    ];
    return (
        <div className="chef-list-card card-style">
            <h3>Chef Name & Order Taken</h3>
            <div className="chef-list-header">
                <span>Chef Name</span>
                <span>Order Taken</span>
            </div>
            <ul className="chef-list">
                {chefData.map((chef, index) => (
                    <li key={index}>
                        <span>{chef.name}</span>
                        <span>{String(chef.orders).padStart(2, '0')}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


// G. Main Dashboard Page (Analytics)
const Dashboard = () => {
    const summaryData = [
        { title: 'Served', count: '09' },
        { title: 'Dine In', count: '05' },
        { title: 'Take Away', count: '06' },
    ];
    
    return (
        <div className="dashboard-container">
            
            {/* === 1. TOP HEADER + SEARCH BAR === */}
            <div className="dashboard-top-header">
                <input type="text" placeholder="Filter..." className="search-filter-input" />
            </div>

            {/* === 2. ROW 1: 4 TOP SUMMARY CARDS (Horizontal) === */}
            <TopSummaryRow />

            {/* === 3. ROW 2: MAIN CONTENT (2 Columns) === */}
            <div className="dashboard-main-content">
                
                {/* LEFT COLUMN */}
                <div className="stats-and-chart-column">
                    
                    {/* Order Summary (3 Cards) */}
                    <div className="order-summary-section">
                        <div className="section-header">
                            <h2>Order Summary</h2>
                            {/* Dummy text from PDF */}
                            <p>hijokpirngntop[gtgkoikokyhikoy[phokphnoy</p> 
                        </div>
                        <div className="summary-cards-container">
                            {summaryData.map((item, index) => (
                                <SummaryCard key={index} {...item} />
                            ))}
                        </div>
                    </div>
                    
                    {/* Revenue Section */}
                    <RevenueChart />
                    <StatsOverview />
                    
                    {/* Chef Name and Order Taken Card */}
                    <ChefOrderList />
                </div>
                
                {/* RIGHT COLUMN */}
                <div className="table-overview-column">
                    <TableOverview />
                </div>
            </div>
        </div>
    );
};


// =======================================================
// 4. Tables Management Page (Chairs - Desktop - 2)
// =======================================================

const Tables = () => {
    const [tables, setTables] = useState(getTables());
    const [showAddForm, setShowAddForm] = useState(false);
    const [chairCount, setChairCount] = useState(4); 
    const [tableName, setTableName] = useState('');
    
    useEffect(() => {
        setTables(getTables());
    }, []);

    const handleToggleForm = () => {
        if (tables.length >= MAX_TABLES) {
            alert(`Maximum ${MAX_TABLES} tables allowed. Please delete a table to add a new one.`);
            return;
        }
        // Toggle the form visibility
        setShowAddForm(prev => !prev);
    };

    const handleCreateTable = (e) => {
        e.preventDefault();
        
        if (tables.length >= MAX_TABLES) {
             alert(`Maximum ${MAX_TABLES} tables allowed. You cannot create more.`);
             return;
        }

        const newTable = {
            name: tableName || null, // Table name is optional
            chairs: chairCount,
            isReserved: false,
        };

        const updatedTables = saveTables([...tables, newTable]);
        setTables(updatedTables);
        
        setTableName('');
        setChairCount(4);
        setShowAddForm(false);
    };

    const handleDeleteTable = (id) => {
        // Reserved tables cannot be deleted
        const tableToDelete = tables.find(table => table.id === id);
        if (tableToDelete?.isReserved) {
            alert("Reserved tables cannot be deleted.");
            return;
        }
        
        if (window.confirm("Are you sure you want to delete this table?")) {
            const updatedTables = tables.filter(table => table.id !== id);
            const newTables = saveTables(updatedTables); // This re-indexes
            setTables(newTables);
        }
    };
    
    const availableSizes = [2, 4, 6, 8];
    
    // Default 30 dummy tables if local storage is empty
    const displayTables = tables.length > 0 ? tables : Array.from({ length: MAX_TABLES }, (_, i) => ({
        id: i + 1,
        number: String(i + 1).padStart(2, '0'),
        chairs: 4,
        isReserved: false, 
        isDummy: true // Added flag for dummy tables
    }));

    // If using dummy tables, only show the add card if storage is empty
    const showAddCard = tables.length < MAX_TABLES && !showAddForm;


    return (
        <div className="tables-container page-padding">
            <header className="tables-header">
                <h1>Tables</h1>
            </header>

            
            {/* Tables Grid */}
            <div className="tables-grid-full">
                
                {/* 1. Add Table Card (+) - Only if max limit not reached and form is closed */}
                {showAddCard && (
                    <div 
                        className="add-table-placeholder card-style"
                        onClick={handleToggleForm}
                        title="Add New Table"
                    >
                        <span className="plus-icon">+</span>
                    </div>
                )}

                {/* 2. Form (Optional/Floating) - Appears when triggered */}
                {showAddForm && tables.length < MAX_TABLES && (
                    <form onSubmit={handleCreateTable} className="add-table-form-floating card-style">
                        
                        {/* Title (hidden, but for semantics) */}
                        <div className="form-group">
                            <label htmlFor="tableName">Table name (optional)</label>
                            <input
                                id="tableName"
                                type="text"
                                placeholder="31"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                            />
                        </div>

                        {/* Chair Selector */}
                        <div className="form-group">
                            <label>Chair</label>
                            <div className="chair-selector">
                                {availableSizes.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`chair-option ${chairCount === size ? 'active' : ''}`}
                                        onClick={() => setChairCount(size)}
                                    >
                                        {String(size).padStart(2, '0')} 
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions-full">
                             <button type="submit" className="create-btn">Create</button>
                        </div>
                    </form>
                )}
                
                {/* 3. Dynamic Table Cards (Real or Dummy) */}
                {displayTables.map(table => (
                    <div 
                        key={table.id} 
                        className={`table-item-full card-style ${table.isDummy ? 'dummy' : ''}`}
                    >
                        
                        {/* Top Right: Delete Button (Only for non-dummy, non-reserved tables) */}
                        {!table.isDummy && (
                            <button 
                                className="delete-btn" 
                                onClick={() => handleDeleteTable(table.id)}
                                disabled={table.isReserved} 
                                title={table.isReserved ? 'Reserved tables cannot be deleted' : 'Delete Table'}
                            >
                                <span className="delete-icon">🗑️</span>
                            </button>
                        )}
                        
                        {/* Center: Table Number and Label */}
                        <div className="table-content-pdf">
                            <span className="table-label-pdf">Table</span>
                            <span className="table-number-pdf">{table.number}</span>
                        </div>
                        
                        {/* Bottom Right: Chair Count (e.g., A 04) */}
                        <span className="table-chairs-pdf">
                           A {String(table.chairs || 4).padStart(2, '0')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};


// =======================================================
// 5. Order Line Page (Desktop - 6)
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
    // Dummy Order Data
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
// 6. Menu Management Page (Desktop - 3)
// =======================================================

const MenuItemCard = ({ item }) => (
    <div className="menu-item-card-full card-style">
        <div className="item-image-placeholder">{item.name[0]}</div>
        <div className="item-details">
            <h4 className="item-name">{item.name}</h4>
            <p className="item-description">Description: {item.description}</p>
            <p className="item-price">Price: ₹{item.price}</p>
            <p className="item-prep-time">Average Prep Time: {item.averagePreparationTime}</p>
            <p className="item-category">Category: {item.category}</p>
            <div className="item-footer-full">
                <span className={`item-stock ${item.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                    InStock: {item.stock > 0 ? 'Yes' : 'No'}
                </span>
                <span className="item-rating">Rating: {item.rating} ⭐</span>
            </div>
        </div>
    </div>
);

const Menu = () => {
    // Dummy Menu Data with all fields as per SRD
    const menuItems = [
        { id: 1, name: 'Tandoori Roti', description: 'Classic Indian bread', price: 50, averagePreparationTime: '10 Mins', category: 'Bread', stock: 50, rating: 4.5 },
        { id: 2, name: 'Chicken Biryani', description: 'Spicy chicken rice dish', price: 250, averagePreparationTime: '20 Mins', category: 'Rice', stock: 15, rating: 4.8 },
        { id: 3, name: 'Paneer Tikka', description: 'Grilled paneer cubes', price: 180, averagePreparationTime: '15 Mins', category: 'Starter', stock: 5, rating: 4.2 },
        { id: 4, name: 'Masala Dosa', description: 'South Indian pancake', price: 100, averagePreparationTime: '10 Mins', category: 'South Indian', stock: 30, rating: 4.0 },
        { id: 5, name: 'Gulab Jamun', description: 'Sweet milk solids balls', price: 80, averagePreparationTime: '5 Mins', category: 'Dessert', stock: 20, rating: 4.6 },
        { id: 6, name: 'Burger', description: 'Description from Burger King', price: 199, averagePreparationTime: '20 Mins', category: 'Burgers', stock: 25, rating: 4.5 },
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
            
            <div className="menu-items-grid-full">
                {menuItems.map(item => (
                    <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};


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