import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'

//  Local Storage and Utility Hooks 

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get item from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error, return initialValue
            console.error('Error reading localStorage key “' + key + '”: ', error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to localStorage.
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Save to state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error setting localStorage key “' + key + '”: ', error);
        }
    };
    return [storedValue, setValue];
};

// Utility hook for interval logic  
const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

// Initial Data 

const initialDashboardData = {
    chefs: 4,
    totalRevenue: 12000,
    totalOrders: 20,
    totalClients: 65,
    served: 9,
    dineIn: 5,
    takeaway: 6,
    chefOrders: [
        { name: 'Manesh', orders: 3 },
        { name: 'Pritam', orders: 7 },
        { name: 'Yash', orders: 5 },
        { name: 'Tenzen', orders: 8 },
    ],
    orderTypeProgress: [
        { name: 'Take Away', count: 6, total: 20, colorClass: 'bg-gray-700' },
        { name: 'Served', count: 9, total: 20, colorClass: 'bg-gray-500' },
        { name: 'Dine In', count: 5, total: 20, colorClass: 'bg-black' },
    ]
};

const initialTableList = Array.from({ length: 30 }, (_, i) => ({ 
    id: i + 1,
    name: null, 
    capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)], 
    isReserved: i < 7 ? true : false, 
}));

const initialOrderList = [
    { id: 'ORD001', type: 'Dine In', table: 5, items: 3, preparationTime: 480, startTime: Date.now() - (480000 / 2), isDone: false, assignedChef: 'Manesh' },
    { id: 'ORD002', type: 'Takeaway', address: '123 Main St', items: 5, preparationTime: 600, startTime: Date.now() - 50000, isDone: false, assignedChef: 'Pritam' },
    { id: 'ORD003', type: 'Dine In', table: 12, items: 2, preparationTime: 300, startTime: Date.now() - 305000, isDone: true, assignedChef: 'Yash' },
    { id: 'ORD004', type: 'Takeaway', address: '456 Oak Ave', items: 1, preparationTime: 120, startTime: Date.now() - 10000, isDone: false, assignedChef: 'Tenzen' },
    { id: 'ORD005', type: 'Dine In', table: 8, items: 4, preparationTime: 400, startTime: Date.now() - 30000, isDone: false, assignedChef: 'Manesh' },
];

const initialMenuData = [
    { 
        id: 'M001', 
        name: 'Classic Chicken Burger', 
        description: 'Juicy chicken patty, fresh lettuce, and our special sauce.', 
        price: 199, 
        averagePreparationTime: 15, // in minutes
        category: 'Burgers', 
        stock: 50,
        rating: 4.5
    },
    { 
        id: 'M002', 
        name: 'Margherita Pizza', 
        description: 'Classic cheese and tomato on a thin crust.', 
        price: 249, 
        averagePreparationTime: 20,
        category: 'Pizzas', 
        stock: 30,
        rating: 4.2
    },
    { 
        id: 'M003', 
        name: 'Peri-Peri Fries', 
        description: 'Crispy fries tossed in spicy peri-peri seasoning.', 
        price: 99, 
        averagePreparationTime: 5,
        category: 'Sides', 
        stock: 100,
        rating: 4.8
    },
    { 
        id: 'M004', 
        name: 'Veggie Wrap', 
        description: 'Fresh vegetables and hummus wrapped in a tortilla.', 
        price: 149, 
        averagePreparationTime: 10,
        category: 'Wraps', 
        stock: 40,
        rating: 3.9
    },
    { 
        id: 'M005', 
        name: 'Chocolate Lava Cake', 
        description: 'Warm chocolate cake with a molten center.', 
        price: 159, 
        averagePreparationTime: 12,
        category: 'Desserts', 
        stock: 25,
        rating: 4.7
    },
];

// Utility Components

// Card for displaying key analytical
const AnalyticsCard = ({ title, value }) => (
    <div className="analytics-card transition-all">
        <div className="analytics-card__value">{value}</div>
        <div className="analytics-card__title">{title}</div>
    </div>
);

//  Custom Order Summary Card 
const OrderSummaryMetricCard = ({ title, value }) => (
    <div className="metric-card transition-all">
        <div className="metric-card__value">{value}</div>
        <p className="metric-card__title">{title}</p>
    </div>
);

// Single Table Card Component (for Tables Management)
const TableCard = ({ table, onDelete }) => {
    const cardClass = table.isReserved ? 'table-card--reserved' : 'table-card--unreserved';
    const capacityIconClass = table.isReserved ? 'table-card__capacity-icon--reserved' : 'table-card__capacity-icon--unreserved';
    const deleteIconClass = table.isReserved ? 'table-card__delete-btn--reserved' : 'table-card__delete-btn--unreserved';
    const capacityTextColor = table.isReserved ? 'table-card__capacity-text--reserved' : '';

    return (
        <div className={`table-card ${cardClass}`} onClick={() => console.log(`Table ${table.id} clicked`)}>
            {/* Top Row: Delete Button */}
            <div className="flex-justify-end w-full">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (table.isReserved) {
                            console.warn("Reserved tables cannot be deleted.");
                        } else {
                            onDelete(table.id);
                        }
                    }}
                    disabled={table.isReserved}
                    className={`table-card__delete-btn ${deleteIconClass} ${table.isReserved ? 'cursor-not-allowed' : ''}`}
                    title={table.isReserved ? "Reserved tables cannot be deleted" : "Delete Table"}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            
            {/* Middle: Table Number */}
            <div className="text-center">
                <p className="table-card__name">{table.name || 'Table'}</p>
                <p className="table-card__id">{table.id.toString().padStart(2, '0')}</p>
            </div>

            {/* Bottom Row */}
            <div className="flex-align-center text-sm font-semibold mt-1">
                <svg className={`w-4 h-4 mr-1 ${capacityIconClass}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8Z" />
                    <path d="M17 14.5C17 13.1193 15.6569 12 14 12C12.3431 12 11 13.1193 11 14.5V17H17V14.5Z" />
                    <path d="M5 5v14h14V5H5zm12 12H7v-3h10v3zM7 7h10v3H7V7z" opacity="0.3" fill="currentColor"/>
                </svg>
                {/* <span className={capacityTextColor}>{table.capacity} Persons</span> */}
            </div>
        </div>
    );
};

// Single Order Card Component (for Order Line) 
const OrderCard = ({ order, onOrderDone }) => {
    // Calculate initial time left
    const initialTimeLeftMs = Math.max(0, (order.preparationTime * 1000) - (Date.now() - order.startTime));
    const [timeLeftMs, setTimeLeftMs] = useState(initialTimeLeftMs);
    const [isProcessing, setIsProcessing] = useState(!order.isDone && initialTimeLeftMs > 0);
    
    // Auto-complete logic using interval
    useInterval(() => {
        if (isProcessing) {
            setTimeLeftMs(prev => {
                const newTime = prev - 1000;
                if (newTime <= 0) {
                    setIsProcessing(false);
                    // Automatically mark order as done
                    if (!order.isDone) {
                        onOrderDone(order.id);
                    }
                    return 0;
                }
                return newTime;
            });
        }
    }, isProcessing ? 1000 : null);
    
    // Function to format milliseconds into MM:SS
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const statusText = order.isDone ? 'Completed' : (isProcessing ? 'In Progress' : 'Pending');
    const statusClass = order.isDone ? 'status-tag--completed' : 
                        isProcessing ? 'status-tag--processing' :
                        'status-tag--pending';
    
    const timeDisplay = order.isDone ? 'DONE' : formatTime(timeLeftMs);
    
    const cardBgClass = order.isDone ? 'order-card--done' : 'order-card--active';
    const timerClass = order.isDone ? 'timer-value--done' : isProcessing ? 'timer-value--active' : 'timer-value--pending';
    const actionBtnClass = order.isDone ? 'action-btn--completed' : 'action-btn--mark-done';

    return (
        <div className={`order-card ${cardBgClass}`}>
            
            {/* Top Section: ID & Status */}
            <div className="order-card__header">
                <div>
                    <span className="order-card__id-label">Order ID</span>
                    <p className="order-card__id-value">{order.id}</p>
                </div>
                <div className={`order-card__status-tag ${statusClass}`}>
                    {statusText}
                </div>
            </div>

            {/* Middle Section: Details */}
            <div className="order-card__details space-y-2">
                <div className="order-card__detail-row">
                    <span>Type:</span>
                    <span>{order.type}</span>
                </div>
                <div className="order-card__detail-row">
                    <span>{order.type === 'Dine In' ? 'Table:' : 'Items:'}</span>
                    <span>
                        {order.type === 'Dine In' ? order.table.toString().padStart(2, '0') : `${order.items} items`}
                    </span>
                </div>
                <div className="order-card__detail-row">
                    <span>Chef:</span>
                    <span className="chef-name">{order.assignedChef}</span>
                </div>
            </div>

            {/* Bottom Section: Timer & Action */}
            <div className="order-card__footer">
                <div className="flex-col">
                    <span className="order-card__timer-label">Time Left</span>
                    <p className={`order-card__timer-value ${timerClass}`}>
                        {timeDisplay}
                    </p>
                </div>
              
            </div>
        </div>
    );
};

/** Single Menu Item Card */
const MenuItemCard = ({ item }) => {
    const stockClass = item.stock > 0 ? 'stock-tag--in' : 'stock-tag--out';
    const ratingColor = item.rating >= 4.5 ? 'text-yellow-500' : 'text-yellow-400';

    return (
        <div className="menu-card transition-all">
            <div className="menu-card__image-placeholder">
                Item Image Placeholder 
            </div>
            <div className="menu-card__content">
                <div>
                    <div className="flex-justify-between items-start">
                        <h3 className="menu-card__title">{item.name}</h3>
                    </div>
                    
                    <p className="menu-card__description">{item.description}</p>
                </div>

                <div className="menu-card__details space-y-2">
                    <div className="detail-row">
                        <span>Price:</span>
                        <span className="detail-row__price">₹{item.price}</span>
                    </div>
                    <div className="detail-row">
                        <span>Avg Prep Time:</span>
                        <span>{item.averagePreparationTime} Mins</span>
                    </div>
                    <div className="detail-row">
                        <span>Category:</span>
                        <span>{item.category}</span>
                    </div>
                    <div className="detail-row">
                        <span>Stock:</span>
                        <span className={`stock-tag ${stockClass}`}>{item.stock > 0 ? `${item.stock} In Stock` : 'Out of Stock'}</span>
                    </div>
                    <div className="rating-display">
                        <span className={`rating-text ${ratingColor}`}>{item.rating}</span>
                        <svg className={`rating-star ${ratingColor}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.001 8.71c-.783-.57-.381-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};


// MENU MANAGEMENT COMPONENT
const MenuManagement = ({ menu }) => {
    return (
        <div className="flex-col p-6 space-y-6">
            
            <div className="menu-grid overflow-y-auto pb-4">
                {menu.length > 0 ? (
                    menu.map(item => (
                        <MenuItemCard 
                            key={item.id} 
                            item={item} 
                        />
                    ))
                ) : (
                    <p className="orders-grid-full-span text-center text-gray-500 p-10">No menu items found.</p>
                )}
            </div>
        </div>
    );
};



// --- TABLE CARD COMPONENT ---
// const TableCard = ({ table, onDelete }) => (
//   <div
//     className={`table-card ${
//       table.isReserved ? "table-card--reserved" : "table-card--unreserved"
//     }`}
//   >
//     <div className="flex justify-between w-full">
//       <span className="table-card__name">{table.name || "Unnamed"}</span>
//       <button
//         className={`table-card__delete-btn ${
//           table.isReserved
//             ? "table-card__delete-btn--reserved"
//             : "table-card__delete-btn--unreserved"
//         }`}
//         onClick={() => !table.isReserved && onDelete(table.id)}
//         disabled={table.isReserved}
//         title={
//           table.isReserved
//             ? "Cannot delete reserved table"
//             : "Delete this table"
//         }
//       >
//         <Trash2 size={18} />
//       </button>
//     </div>
//     <div className="table-card__id">#{table.id}</div>
//     <div
//       className={`table-card__capacity-text ${
//         table.isReserved
//           ? "table-card__capacity-text--reserved"
//           : "table-card__capacity-icon--unreserved"
//       }`}
//     >
//       Capacity: {table.capacity}
//     </div>
//   </div>
// );

// --- MAIN COMPONENT ---
const TablesManagement = ({ tables, setTables }) => {
  const MAX_TABLES = 30;
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableName, setNewTableName] = useState("");
  const [limitMessage, setLimitMessage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const availableCapacities = [2, 4, 6, 8];

  // Add new table
  const handleAddTable = () => {
    if (tables.length >= MAX_TABLES) {
      setLimitMessage(`Maximum limit of ${MAX_TABLES} tables reached.`);
      return;
    }

    const maxId = tables.reduce((max, table) => Math.max(max, table.id), 0);
    const newTable = {
      id: maxId + 1,
      name: newTableName || null,
      capacity: newTableCapacity,
      isReserved: false,
    };

    setTables((prev) => [...prev, newTable].sort((a, b) => a.id - b.id));
    setNewTableName("");
    setNewTableCapacity(4);
    setShowAddModal(false); // ✅ close modal after adding
    console.log(`Table ${newTable.id} added.`);
  };

  // Delete table
  const handleDeleteTable = (idToDelete) => {
    const tableToDelete = tables.find((t) => t.id === idToDelete);
    if (tableToDelete && tableToDelete.isReserved) {
      console.warn("Reserved tables cannot be deleted.");
      return;
    }

    let updatedTables = tables.filter((table) => table.id !== idToDelete);
    updatedTables = updatedTables.map((table, index) => ({
      ...table,
      id: index + 1,
    }));

    setTables(updatedTables);
    console.log(`Table ${idToDelete} deleted and renumbered.`);
  };

  // Open modal
  const handleOpenAddTableModal = () => {
    if (tables.length >= MAX_TABLES) {
      setLimitMessage(`Maximum limit of ${MAX_TABLES} tables reached.`);
    } else {
      setShowAddModal(true);
    }
  };

  return (
    <div className="flex-col p-6 space-y-6">

      <div className="tables-grid">
        {tables.map((table) => (
          <TableCard key={table.id} table={table} onDelete={handleDeleteTable} />
        ))}

        {/* Add new table card */}
        <div className="table-card--add-new transition-colors">
          <button
            onClick={handleOpenAddTableModal}
            className="table-card--add-new-btn transition-colors"
            title="Add New Table"
          >
            +
          </button>
          <p className="text-sm-gray-500 mt-2">Add New Table</p>
        </div>
      </div>

      {/* Add Table Modal */}
    {showAddModal && (
  <div className="modal-overlay">
    <div className="modal-content w-full max-w-sm">
      <div className="modal-header">
        <h3 className="modal-header__title">Create New Table</h3>
        <button
          onClick={() => setShowAddModal(false)}
          className="modal-close-btn"
        >
          ✕
        </button>
      </div>

      <div className="modal-body space-y-4">
        <label className="modal-input-label">
          <span className="modal-input-span">Table Name (Optional):</span>
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            className="modal-input"
            placeholder="e.g., Booth 5"
          />
        </label>

        <label className="modal-input-label">
          <span className="modal-input-span">Capacity:</span>
          <select
            value={newTableCapacity}
            onChange={(e) => setNewTableCapacity(Number(e.target.value))}
            className="modal-input bg-white"
          >
            {availableCapacities.map((cap) => (
              <option key={cap} value={cap}>
                {cap} Persons
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            handleAddTable();
            setShowAddModal(false); 
          }}
          className="modal-submit-btn"
        >
          Create Table
        </button>
      </div>
    </div>
  </div>
)}

      {/* Limit Message Modal */}
      {limitMessage && (
        <div className="modal-overlay">
          <div className="modal-content limit-modal-content">
            <h3 className="limit-modal-title">Limit Reached</h3>
            <p className="limit-modal-text">{limitMessage}</p>
            <button
              onClick={() => setLimitMessage(null)}
              className="limit-modal-btn"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



// ORDERS COMPONENT 
const OrdersSummary = ({ orders, setOrders }) => {
    
    const handleOrderDone = (orderId) => {
        // Update local storage state
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, isDone: true } : order
        ));
        console.log(`Order ${orderId} marked as done.`);
    };

    // Filter to only show active 
    const activeOrders = orders.filter(o => !o.isDone);
    const completedOrders = orders.filter(o => o.isDone);

    return (
        <div className="flex-col p-6 space-y-6">
            <h2 className="header__title">Order Line</h2>

            <div className="orders-grid">
                {activeOrders.length > 0 ? (
                    activeOrders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onOrderDone={handleOrderDone} 
                        />
                    ))
                ) : (
                    <p className="orders-grid-full-span text-center text-gray-500 p-10 bg-white rounded-xl shadow-lg">
                        No active orders at the moment. Time for a break!
                    </p>
                )}
            </div>

            {/* Section for Completed Order */}
            {completedOrders.length > 0 && (
                <div className="mt-8 pt-6 border-t-gray">
                    <h3 className="text-xl font-semibold-gray-700 mb-4">Completed Orders ({completedOrders.length})</h3>
                    <div className="orders-grid order-card--done-opacity">
                         {completedOrders.slice(0, 4).map(order => ( 
                            <OrderCard 
                                key={order.id} 
                                order={order} 
                                onOrderDone={handleOrderDone} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


// DASHBOARD COMPONENT
const AnalyticsDashboard = ({ data }) => {
    return (
        <div className="flex-col p-6 space-y-6">
            <h2 className="header__title">Analytics</h2>

            {/* Top Metrics Grid */}
            <div className="dashboard-grid dashboard-grid-4-cols">
                <AnalyticsCard title="Total Chefs" value={data.chefs} />
                <AnalyticsCard title="Total Revenue" value={`₹${(data.totalRevenue / 1000).toFixed(1)}K`} />
                <AnalyticsCard title="Total Orders" value={data.totalOrders} />
                <AnalyticsCard title="Total Clients" value={data.totalClients} />
            </div>

            {/* Orders Summary and Tables*/}
            <div className="dashboard-grid dashboard-grid-3-cols">
                {/* Orders Summary */}
                <div className="col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold-gray-800 mb-4 border-b-gray pb-2">Orders Summary</h3>
                    
                    {/* Summary Metrics */}
                    <div className="dashboard-grid-3-cols gap-4 mb-6">
                        <OrderSummaryMetricCard title="Served Orders" value={data.served.toString().padStart(2, '0')} />
                        <OrderSummaryMetricCard title="Dine In Orders" value={data.dineIn.toString().padStart(2, '0')} />
                        <OrderSummaryMetricCard title="Takeaway Orders" value={data.takeaway.toString().padStart(2, '0')} />
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-4 pt-4 progress-container">
                        {data.orderTypeProgress.map((item, index) => (
                            <div key={index}>
                                <div className="progress-bar-label">
                                    <span>{item.name}</span>
                                    <span>{item.count} / {item.total}</span>
                                </div>
                                <div className="progress-bar-track">
                                    <div 
                                        className={`progress-bar-fill ${item.colorClass}`} 
                                        style={{ width: `${(item.count / item.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chef Configuration */}
                <div className="col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold-gray-800 mb-4 border-b-gray pb-2">Chef </h3>
                    
                    <div className="space-y-3">
                        {data.chefOrders.map((chef, index) => (
                            <div key={index} className="chef-config__item">
                                <span className="chef-config__name">{chef.name}</span>
                                <span className="chef-config__orders">{chef.orders} Orders</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// MAIN APP COMPONENT 
const App = () => {
    // State using local storage for persistence
    const [currentPage, setCurrentPage] = useLocalStorage('currentPage', 'analytics');
    const [dashboardData, setDashboardData] = useLocalStorage('dashboardData', initialDashboardData);
    const [tables, setTables] = useLocalStorage('tables', initialTableList);
    const [orders, setOrders] = useLocalStorage('orders', initialOrderList);
    const [menu, setMenu] = useLocalStorage('menu', initialMenuData);
    
    // Navigation and Layout

    const renderPage = () => {
        switch (currentPage) {
            case 'analytics':
                return <AnalyticsDashboard data={dashboardData} />;
            case 'tables':
                return <TablesManagement 
                            tables={tables} 
                            setTables={setTables} 
                        />;
            case 'orders':
                return <OrdersSummary 
                            orders={orders} 
                            setOrders={setOrders} 
                        />;
            case 'menu':
                return <MenuManagement 
                            menu={menu} 
                            setMenu={setMenu} 
                        />;
            default:
                return <AnalyticsDashboard data={dashboardData} />;
        }
    };

    const navItems = [
        { id: 'analytics', name: 'Analytics', icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11V3h2v8h-2zm-6 4V3h2v12h-2zm-6 4V3h2v16H4z"/></svg>
        )},
        { id: 'orders', name: 'Order Line', icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z"/></svg>
        )},
        { id: 'tables', name: 'Tables', icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10h16v7H4v-7zm18 9v2H2v-2h20zM2 7h20v2H2V7zm5-4h10v2H7V3z"/></svg>
        )},
        { id: 'menu', name: 'Menu Management', icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 10h18v2H3zm0-4h18v2H3zm0 8h18v2H3zm0 4h18v2H3z"/></svg>
        )},
    ];

    const NavItem = ({ id, name, icon }) => (
        <button
            onClick={() => setCurrentPage(id)}
            className={`nav-item transition-all ${currentPage === id 
                    ? 'nav-item--active' 
                    : 'nav-item--default'
                }`}
        >
            <span className="nav-item__icon">{icon}</span>
            <span>{name}</span>
        </button>
    );

    return (
        <>
     
        <div className="app-container">
            
            {/* Left Sidebar Navigation */}
            <nav className="sidebar shadow-xl space-y-4">
                <div className="text-2xl font-bold text-indigo-600 mb-6 p-2">
                </div>
                {navItems.map(item => <NavItem key={item.id} {...item} />)}
            </nav>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Header/Search Area */}
                <header className="header">
                    <h1 className="header__title capitalize">{currentPage.replace(/(\b\w)/g, s => s.toUpperCase()).replace('Mgmt', 'Management')}</h1>
                    {/* Search filter: blurs the rest of the container except the searched item. */}
                    <div className="header__search-container">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="header__search-input"
                        />
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 h-full">
                    {renderPage()}
                </div>
            </main>
        </div>
        </>
    );
};

export default App;
