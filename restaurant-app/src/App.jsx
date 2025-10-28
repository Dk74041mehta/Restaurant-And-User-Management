import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Local Storage and Utility Hooks ---

/**
 * Custom hook to manage state persistence using localStorage.
 * Initializes state from localStorage on load and saves changes automatically.
 */
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

/** Utility hook for interval logic (e.g., order countdown). */
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

// --- Mock Initial Data (Used if localStorage is empty) ---

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

// --- Utility Components ---

/** Card for displaying key analytical metrics. */
const AnalyticsCard = ({ title, value }) => (
    <div className="analytics-card transition-all">
        <div className="analytics-card__value">{value}</div>
        <div className="analytics-card__title">{title}</div>
    </div>
);

/** Custom Order Summary Card */
const OrderSummaryMetricCard = ({ title, value }) => (
    <div className="metric-card transition-all">
        <div className="metric-card__value">{value}</div>
        <p className="metric-card__title">{title}</p>
    </div>
);

/** Single Table Card Component (for Tables Management) */
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

            {/* Bottom Row: Capacity (Chair Icon) */}
            <div className="flex-align-center text-sm font-semibold mt-1">
                {/* Simple chair/person icon using inline SVG */}
                <svg className={`w-4 h-4 mr-1 ${capacityIconClass}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8Z" />
                    <path d="M17 14.5C17 13.1193 15.6569 12 14 12C12.3431 12 11 13.1193 11 14.5V17H17V14.5Z" />
                    <path d="M5 5v14h14V5H5zm12 12H7v-3h10v3zM7 7h10v3H7V7z" opacity="0.3" fill="currentColor"/>
                </svg>
                <span className={capacityTextColor}>{table.capacity} Persons</span>
            </div>
        </div>
    );
};

/** Single Order Card Component (for Order Line) */
const OrderCard = ({ order, onOrderDone }) => {
    // Calculate initial time left: (preparationTime * 1000) - (currentTime - startTime)
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
                
                <button 
                    onClick={() => onOrderDone(order.id)}
                    disabled={order.isDone}
                    className={`order-card__action-btn ${actionBtnClass}`}
                >
                    {order.isDone ? 'Completed' : 'Mark Done'}
                </button>
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


// --- MENU MANAGEMENT COMPONENT ---
const MenuManagement = ({ menu }) => {
    return (
        <div className="flex-col p-6 space-y-6">
            <h2 className="header__title">Menu Management</h2>
            
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

// --- TABLES COMPONENT ---
const TablesManagement = ({ tables, setTables }) => {
    const MAX_TABLES = 30;
    const [newTableCapacity, setNewTableCapacity] = useState(4);
    const [newTableName, setNewTableName] = useState('');
    const [limitMessage, setLimitMessage] = useState(null);
    const availableCapacities = [2, 4, 6, 8];

    // Handles the addition of a new table
    const handleAddTable = () => {
        if (tables.length >= MAX_TABLES) {
            setLimitMessage(`Maximum limit of ${MAX_TABLES} tables reached.`);
            return;
        }

        const maxId = tables.reduce((max, table) => Math.max(max, table.id), 0);
        const newTable = {
            id: maxId + 1, //Simple sequential ID generation
            name: newTableName || null,
            capacity: newTableCapacity,
            isReserved: false,
        };
        
        //Update local storage state
        setTables(prev => [...prev, newTable].sort((a, b) => a.id - b.id));
        setNewTableName('');
        setNewTableCapacity(4);
        // Close the creation modal
        document.getElementById('addTableModal').classList.add('hidden');
        console.log(`Table ${newTable.id} added.`);
    };

    // Handles deletion and ensures sequential ID numbering
    const handleDeleteTable = (idToDelete) => {
        const tableToDelete = tables.find(t => t.id === idToDelete);
        if (tableToDelete && tableToDelete.isReserved) {
            console.warn("Reserved tables cannot be deleted.");
            return;
        }

        // Filter out the deleted table
        let updatedTables = tables.filter(table => table.id !== idToDelete);
        
        // Reshuffle table numbering to be sequential (SRD requirement: 1, 2, 3...)
        updatedTables = updatedTables.map((table, index) => ({
            ...table,
            id: index + 1,
        }));

        setTables(updatedTables);
        console.log(`Table ${idToDelete} deleted and tables renumbered.`);
    };

    const handleOpenAddTableModal = () => {
        if (tables.length >= MAX_TABLES) {
            setLimitMessage(`Maximum limit of ${MAX_TABLES} tables reached.`);
        } else {
            document.getElementById('addTableModal').classList.remove('hidden');
        }
    };

    return (
        <div className="flex-col p-6 space-y-6">
            <h2 className="header__title">Tables Management</h2>
            
            <div className="tables-grid">
                {/* Existing Tables Grid */}
                {tables.map(table => (
                    <TableCard key={table.id} table={table} onDelete={handleDeleteTable} />
                ))}

                {/* Add New Table Block */}
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

            {/* Modal for Adding Table (Custom, avoiding alert/confirm) */}
            <div id="addTableModal" className="hidden modal-overlay">
                <div className="modal-content w-full max-w-sm">
                    <div className="modal-header">
                        <h3 className="modal-header__title">Create New Table</h3>
                        <button onClick={() => document.getElementById('addTableModal').classList.add('hidden')} className="modal-close-btn">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
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
                                onChange={(e) => setNewTableCapacity(parseInt(e.target.value))}
                                className="modal-input bg-white"
                            >
                                {availableCapacities.map(cap => (
                                    <option key={cap} value={cap}>{cap} Persons</option>
                                ))}
                            </select>
                        </label>
                        <button
                            onClick={handleAddTable}
                            className="modal-submit-btn"
                        >
                            Create Table
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Custom Modal for Maximum Table Limit Message */}
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

// --- ORDERS COMPONENT ---
const OrdersSummary = ({ orders, setOrders }) => {
    
    const handleOrderDone = (orderId) => {
        // Update local storage state
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, isDone: true } : order
        ));
        console.log(`Order ${orderId} marked as done.`);
    };

    // Filter to only show active (not done) orders
    const activeOrders = orders.filter(o => !o.isDone);
    const completedOrders = orders.filter(o => o.isDone);

    return (
        <div className="flex-col p-6 space-y-6">
            <h2 className="header__title">Order Line (Active Orders)</h2>

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

            {/* Section for Completed Orders (Optional, for reference) */}
            {completedOrders.length > 0 && (
                <div className="mt-8 pt-6 border-t-gray">
                    <h3 className="text-xl font-semibold-gray-700 mb-4">Completed Orders ({completedOrders.length})</h3>
                    <div className="orders-grid order-card--done-opacity">
                         {completedOrders.slice(0, 4).map(order => ( // Show last 4 completed orders
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


// --- DASHBOARD COMPONENT ---
const AnalyticsDashboard = ({ data }) => {
    return (
        <div className="flex-col p-6 space-y-6">
            <h2 className="header__title">Analytics Dashboard</h2>

            {/* Top Metrics Grid */}
            <div className="dashboard-grid dashboard-grid-4-cols">
                <AnalyticsCard title="Total Chefs" value={data.chefs} />
                <AnalyticsCard title="Total Revenue" value={`₹${(data.totalRevenue / 1000).toFixed(1)}K`} />
                <AnalyticsCard title="Total Orders" value={data.totalOrders} />
                <AnalyticsCard title="Total Clients" value={data.totalClients} />
            </div>

            {/* Orders Summary and Tables/Chef Config */}
            <div className="dashboard-grid dashboard-grid-3-cols">
                {/* Orders Summary (2/3rds width) */}
                <div className="col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold-gray-800 mb-4 border-b-gray pb-2">Orders Summary</h3>
                    
                    {/* Summary Metrics */}
                    <div className="dashboard-grid-3-cols gap-4 mb-6">
                        <OrderSummaryMetricCard title="Served Orders" value={data.served.toString().padStart(2, '0')} />
                        <OrderSummaryMetricCard title="Dine In Orders" value={data.dineIn.toString().padStart(2, '0')} />
                        <OrderSummaryMetricCard title="Takeaway Orders" value={data.takeaway.toString().padStart(2, '0')} />
                    </div>

                    {/* Progress Bars (Mocked Graph) */}
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

                {/* Chef Configuration (1/3rd width) */}
                <div className="col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold-gray-800 mb-4 border-b-gray pb-2">Chef Configuration</h3>
                    <p className="text-sm-gray-500 mb-4">Orders assigned based on least current load.</p>
                    
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


// --- MAIN APP COMPONENT ---
const App = () => {
    // State using local storage for persistence
    const [currentPage, setCurrentPage] = useLocalStorage('currentPage', 'analytics');
    const [dashboardData, setDashboardData] = useLocalStorage('dashboardData', initialDashboardData);
    const [tables, setTables] = useLocalStorage('tables', initialTableList);
    const [orders, setOrders] = useLocalStorage('orders', initialOrderList);
    const [menu, setMenu] = useLocalStorage('menu', initialMenuData);
    
    // --- Navigation and Layout ---

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
        <style>
        {`
            /* Global Styles and Resets */
            * {
                box-sizing: border-box;
                font-family: 'Inter', sans-serif;
            }
            body, #root {
                margin: 0;
                padding: 0;
                height: 100vh;
                width: 100vw;
            }
            .font-sans { font-family: 'Inter', sans-serif; }
            .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
            .h-screen { height: 100vh; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-white { background-color: white; }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
            .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
            .rounded-xl { border-radius: 0.75rem; }
            .transition-all { transition: all 0.3s ease-in-out; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .flex-1 { flex: 1; }
            .p-4 { padding: 1rem; }
            .p-6 { padding: 1.5rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .space-y-6 > * + * { margin-top: 1.5rem; }
            .w-full { width: 100%; }
            .text-center { text-align: center; }
            .text-gray-500 { color: #6b7280; }
            .text-indigo-600 { color: #4f46e5; }
            .text-sm { font-size: 0.875rem; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-3xl { font-size: 1.875rem; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .font-extrabold { font-weight: 800; }
            .uppercase { text-transform: uppercase; }
            .capitalize { text-transform: capitalize; }
            .hidden { display: none; }
            .flex-justify-end { display: flex; justify-content: flex-end; }
            .flex-align-center { display: flex; align-items: center; }
            .flex-justify-between { display: flex; justify-content: space-between; }
            .flex-items-start { display: flex; align-items: flex-start; }
            .border-b-gray { border-bottom: 1px solid #e5e7eb; }

            /* Main Layout */
            .app-container {
                display: flex;
                height: 100vh;
                background-color: #f3f4f6;
            }
            .sidebar {
                width: 256px; /* w-64 */
                background-color: white;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                padding: 1rem;
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
            }
            .main-content {
                flex: 1;
                overflow-y: auto;
            }

            /* Header */
            .header {
                background-color: white;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                padding: 1rem;
                position: sticky;
                top: 0;
                z-index: 10;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .header__title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #1f2937;
            }
            .header__search-container {
                width: 33.333333%; /* w-1/3 */
            }
            .header__search-input {
                padding: 0.5rem;
                border: 1px solid #d1d5db;
                border-radius: 0.5rem;
                width: 100%;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                transition: border-color 0.15s ease, box-shadow 0.15s ease;
            }
            .header__search-input:focus {
                outline: none;
                border-color: #4f46e5; 
                box-shadow: 0 0 0 1px #4f46e5;
            }

            /* Navigation Items */
            .nav-item {
                display: flex;
                align-items: center;
                padding: 1rem;
                border-radius: 0.75rem;
                font-size: 0.875rem;
                font-weight: 600;
                transition: all 0.2s ease;
                width: 100%;
                text-align: left;
            }
            .nav-item__icon {
                margin-right: 0.75rem;
                width: 1.5rem; /* w-6 */
                height: 1.5rem; /* h-6 */
            }
            .nav-item--default {
                color: #4b5563; /* text-gray-600 */
            }
            .nav-item--default:hover {
                background-color: #f3f4f6; /* hover:bg-gray-100 */
            }
            .nav-item--active {
                background-color: #4f46e5; /* bg-indigo-600 */
                color: white;
                box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.05);
            }

            /* --- Dashboard & Analytics Styles --- */
            .dashboard-grid {
                display: grid;
                gap: 1.5rem; /* gap-6 */
                grid-template-columns: repeat(1, 1fr);
            }
            @media (min-width: 640px) {
                .dashboard-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            @media (min-width: 1024px) { /* lg: */
                .dashboard-grid-4-cols {
                    grid-template-columns: repeat(4, 1fr);
                }
                .dashboard-grid-3-cols {
                    grid-template-columns: repeat(3, 1fr);
                }
                .col-span-2 {
                    grid-column: span 2 / span 2;
                }
                .col-span-1 {
                    grid-column: span 1 / span 1;
                }
            }

            .analytics-card {
                background-color: white;
                padding: 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;
                min-height: 140px;
                border-top: 4px solid #4f46e5;
                cursor: default;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .analytics-card:hover {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                transform: scale(1.02);
            }
            .analytics-card__value {
                font-size: 2.25rem;
                font-weight: 700;
                color: #1f2937;
                margin-top: 0.25rem;
            }
            .analytics-card__title {
                font-size: 0.875rem;
                font-weight: 500;
                color: #6b7280;
                text-transform: uppercase;
                margin-top: 1rem;
            }

            .metric-card {
                background-color: white;
                padding: 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 120px;
                border-top: 4px solid #d1d5db;
            }
            .metric-card__value {
                font-size: 2.25rem;
                font-weight: 800;
                color: #1f2937;
            }
            .metric-card__title {
                font-size: 0.875rem;
                font-weight: 500;
                color: #6b7280;
                margin-top: 0.25rem;
            }

            /* Progress Bars */
            .progress-bar-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.25rem;
                font-size: 0.875rem;
                font-weight: 500;
                color: #374151;
            }
            .progress-bar-track {
                width: 100%;
                background-color: #e5e7eb;
                border-radius: 9999px;
                height: 0.625rem;
            }
            .progress-bar-fill {
                height: 0.625rem;
                border-radius: 9999px;
                transition: width 0.5s ease;
            }
            .bg-gray-700 { background-color: #374151; }
            .bg-gray-500 { background-color: #6b7280; }
            .bg-black { background-color: #1f2937; }

            /* Chef Configuration */
            .chef-config__item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                background-color: #f9fafb;
                border-radius: 0.5rem;
            }
            .chef-config__name {
                font-weight: 600;
                color: #4b5563;
            }
            .chef-config__orders {
                font-size: 1.125rem;
                font-weight: 700;
                color: #4f46e5;
            }


            /* --- Tables Management Styles --- */
            .tables-grid {
                display: grid;
                gap: 1rem;
                padding: 1rem;
                border-radius: 0.75rem;
                background-color: #f9fafb;
                box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 768px) {
                .tables-grid { grid-template-columns: repeat(3, 1fr); }
            }
            @media (min-width: 1024px) {
                .tables-grid { grid-template-columns: repeat(4, 1fr); }
            }
            @media (min-width: 1280px) {
                .tables-grid { grid-template-columns: repeat(6, 1fr); }
            }

            .table-card {
                padding: 1rem;
                border-radius: 0.75rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s ease;
                width: 100%;
                height: 128px;
                cursor: pointer;
            }
            .table-card--unreserved {
                background-color: white;
                color: #1f2937;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                border: 1px solid #e5e7eb;
            }
            .table-card--unreserved:hover {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .table-card--reserved {
                background-color: #059669;
                color: white;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            .table-card__delete-btn {
                padding: 0.25rem;
                border-radius: 9999px;
                transition: color 0.2s ease;
            }
            .table-card__delete-btn--unreserved {
                color: #9ca3af;
            }
            .table-card__delete-btn--unreserved:hover {
                color: #ef4444;
            }
            .table-card__delete-btn--reserved {
                color: #a7f3d0;
                opacity: 0.5;
                cursor: not-allowed;
            }
            .table-card__name {
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: uppercase;
                opacity: 0.8;
            }
            .table-card__id {
                font-size: 1.875rem;
                font-weight: 800;
            }
            .table-card__capacity-icon--unreserved {
                color: #4f46e5;
            }
            .table-card__capacity-icon--reserved {
                color: #a7f3d0;
            }
            .table-card__capacity-text--reserved {
                color: rgba(255, 255, 255, 0.8);
            }

            /* Add New Table Block */
            .table-card--add-new {
                border: 2px dashed #d1d5db;
                padding: 1rem;
                border-radius: 0.75rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 128px;
                background-color: white;
                transition: border-color 0.2s ease;
            }
            .table-card--add-new:hover {
                border-color: #4f46e5;
            }
            .table-card--add-new-btn {
                font-size: 2.25rem;
                color: #9ca3af;
                transition: color 0.2s ease;
            }
            .table-card--add-new:hover .table-card--add-new-btn {
                color: #4f46e5;
            }
            .text-sm-gray-500 {
                font-size: 0.875rem;
                color: #6b7280;
                margin-top: 0.5rem;
            }

            /* --- Modals (Custom, replacing alerts) --- */
            .modal-overlay {
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 50;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            .modal-content {
                background-color: white;
                border-radius: 0.75rem;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                width: 100%;
                max-width: 448px;
                transition: all 0.2s ease;
            }

            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header__title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #1f2937;
            }
            .modal-close-btn {
                color: #9ca3af;
                transition: color 0.2s ease;
            }
            .modal-close-btn:hover {
                color: #4b5563;
            }
            .modal-body {
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .modal-input-label {
                display: block;
            }
            .modal-input-span {
                color: #374151;
                font-weight: 500;
            }
            .modal-input {
                margin-top: 0.25rem;
                display: block;
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #d1d5db;
                border-radius: 0.5rem;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }
            .modal-input:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 1px #4f46e5;
            }
            .modal-submit-btn {
                width: 100%;
                background-color: #4f46e5;
                color: white;
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                font-weight: 600;
                box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
                transition: background-color 0.15s ease;
            }
            .modal-submit-btn:hover {
                background-color: #4338ca;
            }

            /* Limit Message Modal */
            .limit-modal-content {
                max-width: 320px;
                padding: 1.5rem;
                text-align: center;
            }
            .limit-modal-title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #dc2626;
                margin-bottom: 0.75rem;
            }
            .limit-modal-text {
                color: #374151;
                margin-bottom: 1.25rem;
            }
            .limit-modal-btn {
                width: 100%;
                background-color: #dc2626;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                font-weight: 600;
                transition: background-color 0.15s ease;
            }
            .limit-modal-btn:hover {
                background-color: #b91c1c;
            }


            /* --- Orders Summary Styles --- */
            .orders-grid {
                display: grid;
                gap: 1.5rem; /* gap-6 */
                grid-template-columns: repeat(1, 1fr);
            }
            @media (min-width: 640px) { .orders-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (min-width: 1024px) { .orders-grid { grid-template-columns: repeat(3, 1fr); } }
            @media (min-width: 1280px) { .orders-grid { grid-template-columns: repeat(4, 1fr); } }
            .orders-grid-full-span {
                grid-column: 1 / -1;
            }

            .order-card {
                padding: 1.25rem; /* p-5 */
                border-radius: 0.75rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 100%;
                min-height: 180px;
                transition: all 0.2s ease;
            }
            .order-card--active {
                background-color: white;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                border-top: 4px solid #4f46e5;
            }
            .order-card--done {
                background-color: white;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                border-top: 4px solid #10b981;
            }
            .order-card--done-opacity {
                opacity: 0.6;
            }

            .order-card__header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.75rem;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 0.5rem;
            }
            .order-card__id-label {
                font-size: 0.75rem;
                font-weight: 500;
                color: #6b7280;
                text-transform: uppercase;
            }
            .order-card__id-value {
                font-size: 1.125rem;
                font-weight: 700;
                color: #1f2937;
            }

            .order-card__status-tag {
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.75rem;
                font-weight: 600;
                border: 1px solid;
                align-self: center;
                white-space: nowrap;
            }
            .status-tag--completed { background-color: #d1fae5; border-color: #34d399; color: #065f46; }
            .status-tag--processing { background-color: #fef3c7; border-color: #fbbf24; color: #b45309; }
            .status-tag--pending { background-color: #fee2e2; border-color: #f87171; color: #b91c1c; }

            .order-card__details {
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
                color: #4b5563;
            }
            .order-card__detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            .order-card__detail-row span:first-child { font-weight: 500; }
            .order-card__detail-row span:last-child { font-weight: 600; color: #1f2937; }
            .order-card__detail-row .chef-name { color: #4f46e5; }

            .order-card__footer {
                padding-top: 0.75rem;
                margin-top: 0.75rem;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .order-card__timer-label {
                font-size: 0.75rem;
                font-weight: 500;
                color: #6b7280;
                text-transform: uppercase;
            }
            .order-card__timer-value {
                font-size: 1.5rem;
                font-weight: 800;
            }
            .timer-value--done { color: #10b981; }
            .timer-value--active { color: #4f46e5; }
            .timer-value--pending { color: #dc2626; }

            .order-card__action-btn {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
                font-weight: 600;
                border-radius: 0.5rem;
                transition: all 0.15s ease;
                border: none;
                cursor: pointer;
            }
            .action-btn--mark-done {
                background-color: #4f46e5;
                color: white;
                box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3), 0 2px 4px -2px rgba(79, 70, 229, 0.05);
            }
            .action-btn--mark-done:hover:not(:disabled) {
                background-color: #4338ca;
            }
            .action-btn--completed {
                background-color: #10b981;
                color: white;
                opacity: 0.7;
                cursor: not-allowed;
                box-shadow: none;
            }

            /* --- Menu Card Styles --- */
            .menu-grid {
                display: grid;
                gap: 1.5rem;
                grid-template-columns: repeat(1, 1fr);
            }
            @media (min-width: 768px) { .menu-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (min-width: 1024px) { .menu-grid { grid-template-columns: repeat(3, 1fr); } }

            .menu-card {
                background-color: white;
                border-radius: 0.75rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                display: flex;
                flex-direction: column;
                transition: all 0.2s ease;
            }
            .menu-card:hover {
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                transform: scale(1.01);
            }
            .menu-card__image-placeholder {
                height: 12rem;
                background-color: #e5e7eb;
                border-top-left-radius: 0.75rem;
                border-top-right-radius: 0.75rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6b7280;
                font-size: 0.875rem;
            }
            .menu-card__content {
                padding: 1.25rem;
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }
            .menu-card__title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #1f2937;
                margin-bottom: 0.25rem;
            }
            .menu-card__description {
                font-size: 0.875rem;
                color: #6b7280;
                margin-bottom: 0.75rem;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
            }

            .menu-card__details {
                padding-top: 0.5rem;
                font-size: 0.875rem;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #374151;
                margin-bottom: 0.5rem;
            }
            .detail-row span:first-child { font-weight: 500; }

            .detail-row__price {
                font-weight: 700;
                font-size: 1.25rem;
                color: #4f46e5;
            }

            .stock-tag {
                font-weight: 700;
                padding: 0.125rem 0.5rem;
                border-radius: 9999px;
                font-size: 0.75rem;
            }
            .stock-tag--in { color: #059669; background-color: #d1fae5; }
            .stock-tag--out { color: #dc2626; background-color: #fee2e2; }

            .rating-display {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding-top: 0.5rem;
            }
            .rating-text {
                font-size: 0.875rem;
                font-weight: 700;
            }
            .rating-star {
                width: 1rem;
                height: 1rem;
                margin-left: 0.25rem;
            }
            .text-yellow-500 { color: #f59e0b; }
            .text-yellow-400 { color: #fbbf24; }
        `}
        </style>
        <div className="app-container">
            
            {/* Left Sidebar Navigation */}
            <nav className="sidebar shadow-xl space-y-4">
                <div className="text-2xl font-bold text-indigo-600 mb-6 p-2">
                    Restaurant POS
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
