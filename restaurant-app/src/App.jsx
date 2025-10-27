vimport React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LayoutDashboard, Users, Utensils, Table, ChefHat, Search, DollarSign, BarChart3, Clock, TrendingUp, Plus, Trash2, X, AlertTriangle, Check, ListChecks, ChevronDown, Edit3, Save, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Local Storage Utilities ---
const STORAGE_KEY = 'restaurant_dashboard_data_v3';

// Data ko Local Storage se load karne ka function
const loadState = () => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (e) {
        console.error("Error loading state from localStorage:", e);
        return undefined;
    }
};

// Data ko Local Storage mein save karne ka function
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (e) {
        console.error("Error saving state to localStorage:", e);
    }
};

const MAX_TABLES = 30; // Maximum number of tables 30 par set

// --- Mock Data ---

// Order Line Mock Data
const MOCK_ORDERS = [
  { id: 'ORD001', type: 'Dine In', location: 'Table 05', items: 3, processingTime: 120, status: 'Ongoing', time: '10:30 AM', chef: 'Mahesh' },
  { id: 'ORD002', type: 'Take Away', location: 'Take Away Counter', items: 5, processingTime: 0, status: 'Served', time: '10:45 AM', chef: 'Pritam' },
  { id: 'ORD003', type: 'Dine In', location: 'Table 12', items: 2, processingTime: 300, status: 'Ongoing', time: '10:50 AM', chef: 'Yash' },
  { id: 'ORD004', type: 'Dine In', location: 'Table 01', items: 8, processingTime: 0, status: 'Served', time: '11:00 AM', chef: 'Tenzin' },
  { id: 'ORD005', type: 'Take Away', location: 'Take Away Counter', items: 1, processingTime: 0, status: 'Cancelled', time: '11:15 AM', chef: null },
  { id: 'ORD006', type: 'Dine In', location: 'Table 08', items: 4, processingTime: 60, status: 'Ongoing', time: '11:20 AM', chef: 'Mahesh' },
];

// Menu Management Mock Data
const MOCK_MENU = [
    { id: 'M001', name: 'Butter Chicken', description: 'Creamy tomato gravy with tender chicken chunks.', price: 450, prepTime: 25, category: 'Main Course', stock: 50 },
    { id: 'M002', name: 'Tandoori Roti', description: 'Whole wheat bread cooked in tandoor.', price: 30, prepTime: 5, category: 'Breads', stock: 100 },
    { id: 'M003', name: 'Veg Biryani', description: 'Aromatic basmati rice cooked with mixed vegetables.', price: 350, prepTime: 30, category: 'Rice & Biryani', stock: 40 },
    { id: 'M004', name: 'Gulab Jamun', description: 'Soft fried dough balls soaked in rose syrup.', price: 150, prepTime: 10, category: 'Desserts', stock: 75 },
    { id: 'M005', name: 'Dal Makhani', description: 'Black lentils cooked in a creamy, buttery sauce.', price: 380, prepTime: 35, category: 'Main Course', stock: 45 },
];
const CATEGORIES = ['All', 'Main Course', 'Breads', 'Rice & Biryani', 'Desserts', 'Beverages'];

// Initial Tables Mock Data (if Local Storage is empty)
const initialMockTables = Array.from({ length: 15 }, (_, i) => ({
    id: `T${i + 1}-${Date.now() + i}`, // Unique ID for Local Storage
    number: i + 1,
    size: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
    reserved: i < 3 ? true : false,
    name: i === 0 ? 'Window View' : '',
    bookedBy: i < 3 ? 'Mock Customer' : null,
    persons: i < 3 ? [2, 4, 6, 8][Math.floor(Math.random() * 4)] : 0,
}));

// Analytics Mock Data 
const MOCK_STATS = [
  { title: "Kul Chefs", value: "04", icon: ChefHat, color: "bg-indigo-500", text: "text-indigo-500" },
  { title: "Kul Aamdani", value: "₹ 12K", icon: DollarSign, color: "bg-green-500", text: "text-green-500" },
  { title: "Kul Orders", value: "20", icon: Utensils, color: "bg-yellow-500", text: "text-yellow-500" },
  { title: "Kul Grahak", value: "65", icon: Users, color: "bg-rose-500", text: "text-rose-500" },
];
const MOCK_ORDER_SUMMARY = [
  { label: "Serve Kiye Gaye", count: 9, color: "bg-blue-100/50", text: "text-blue-600" },
  { label: "Dine In", count: 5, color: "bg-purple-100/50", text: "text-purple-600" },
  { label: "Take Away", count: 6, color: "bg-pink-100/50", text: "text-pink-600" },
];
const MOCK_REVENUE_DATA = [
  { name: 'Mon', Revenue: 4000 },
  { name: 'Tue', Revenue: 3000 },
  { name: 'Wed', Revenue: 2000 },
  { name: 'Thu', Revenue: 2780 },
  { name: 'Fri', Revenue: 1890 },
  { name: 'Sat', Revenue: 2390 },
  { name: 'Sun', Revenue: 3490 },
];
const MOCK_CHEF_PERFORMANCE = [
  { name: "Mahesh", orders: 3, status: "Busy" },
  { name: "Pritam", orders: 7, status: "Busy" },
  { name: "Yash", orders: 5, status: "Busy" },
  { name: "Tenzin", orders: 8, status: "Busy" },
  { name: "Anjali", orders: 2, status: "Available" },
];


// --- LOCAL STORAGE BASED TABLES LOGIC (Replacement for Firestore) ---

// Nayi table add karne ka function (Local State use karte hue)
const handleAddTable = (tables, setTables, name, size) => {
  if (tables.length >= MAX_TABLES) {
    console.warn("Maximum table limit reached.");
    return;
  }
  
  const newTableNumber = tables.length + 1;
  const newTable = {
      id: `T${newTableNumber}-${Date.now()}`, // Unique ID
      number: newTableNumber,
      size: size,
      reserved: false,
      name: name,
      bookedBy: null,
      persons: 0,
  };
  setTables(prev => [...prev, newTable]);
  console.log("Table added successfully:", newTableNumber);
};

// Table delete karne ka function (Local State use karte hue)
const handleDeleteTable = (tables, setTables, tableToDelete) => {
  if (tableToDelete.reserved) return; // Safety check

  const remainingToUpdate = tables
      .filter(t => t.id !== tableToDelete.id)
      .sort((a, b) => (a.number || 0) - (b.number || 0));

  // Re-sequence the remaining tables
  const newTables = remainingToUpdate.map((table, index) => ({
      ...table,
      number: index + 1,
  }));
  
  setTables(newTables);
  console.log(`Table T-${tableToDelete.number} deleted and tables re-sequenced.`);
};

// Table book/unbook karne ka function (Local State use karte hue)
const handleBookTable = (tables, setTables, tableToBook) => {
  const newReservedState = !tableToBook.reserved;
  
  const newTables = tables.map(t => 
      t.id === tableToBook.id
          ? {
              ...t,
              reserved: newReservedState,
              bookedBy: newReservedState ? 'Mock Customer Name' : null,
              persons: newReservedState ? t.size : 0,
          }
          : t
  );
  setTables(newTables);
  console.log(`Table T-${tableToBook.number} ${newReservedState ? 'booked' : 'unbooked'}.`);
};

// Confirmation Modal (Retained, prop changes applied)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, table }) => {
  if (!isOpen) return null;
  const isReserved = table.reserved;

  // Use correct local logic
  const confirmAction = () => {
      onConfirm(table);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center">
          <div className={`p-3 rounded-full ${isReserved ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'} mb-4`}>
            {isReserved ? <AlertTriangle className="h-6 w-6" /> : <Trash2 className="h-6 w-6" />}
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">
            {isReserved ? "Deletion Allowed Nahi" : `Table ${String(table.number).padStart(2, '0')} Delete Karein?`}
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            {isReserved 
              ? "Reserved tables ko delete nahi kiya ja sakta. Pehle table ko 'unbook' karein."
              : "Kya aap waaqai is table ko permanent delete karna chahte hain? Remaining tables re-sequence ho jayenge."
            }
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          {!isReserved && (
            <button 
              type="button" 
              onClick={confirmAction} 
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-lg transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// TableIconSVG, TableCard, AddTableDottedBox, AddTableModal (Modified props)
const TableIconSVG = ({ isReserved }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`w-12 h-12 transition-colors ${isReserved ? 'text-white' : 'text-indigo-500'}`}
  >
    <rect x="3" y="7" width="18" height="10" rx="2" ry="2" />
    <line x1="7" y1="7" x2="7" y2="17" />
    <line x1="17" y1="7" x2="17" y2="17" />
  </svg>
);

const TableCard = ({ table, tables, setTables }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isReserved = table.reserved;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = () => {
    if (!isReserved) {
        handleDeleteTable(tables, setTables, table);
    }
    setShowDeleteConfirm(false);
  };

  const handleToggleBooking = () => {
    handleBookTable(tables, setTables, table);
  };

  return (
    <>
      <div 
        className={`relative p-4 rounded-xl shadow-lg border-2 flex flex-col items-center justify-center transition-all duration-300 transform hover:shadow-xl cursor-pointer min-h-[150px] ${
          isReserved 
            ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
            : 'bg-white text-gray-800 border-gray-200 hover:border-indigo-500'
        }`}
        onClick={handleToggleBooking}
        title={isReserved ? `Reserved: ${table.bookedBy || 'Unknown'}` : 'Available: Click to book'}
      >
        <button 
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-md disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          title={isReserved ? "Reserved Table Delete Nahi Ho Sakta" : "Delete Table"}
          disabled={isReserved}
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <TableIconSVG isReserved={isReserved} />

        {table.name && (
          <p className="text-xs font-medium opacity-90 truncate max-w-full mt-1">({table.name})</p>
        )}
        
        <p className={`text-2xl font-extrabold ${isReserved ? 'text-white' : 'text-gray-800'} mt-1`}>
          {String(table.number).padStart(2, '0')}
        </p>

        <div className="absolute bottom-2 right-2 flex items-center p-1 px-2 rounded-full bg-black/10 backdrop-blur-[1px] text-white">
          <Users className="w-3 h-3 mr-1" />
          <span className="text-xs font-semibold">{table.size}</span>
        </div>

        {isReserved && (
          <div className="absolute bottom-2 left-2 text-xs font-bold bg-white text-red-600 px-2 py-0.5 rounded-full shadow-inner">
            Reserved
          </div>
        )}
      </div>
      
      <ConfirmationModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        table={table}
      />
    </>
  );
};

const AddTableDottedBox = ({ onClick, isMax }) => (
  <button
    onClick={onClick}
    disabled={isMax}
    className={`min-h-[150px] flex flex-col items-center justify-center p-4 rounded-xl border-4 border-dashed transition-colors 
      ${isMax 
        ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
        : 'border-indigo-400 text-indigo-600 hover:bg-indigo-50 cursor-pointer'
      }`}
    title={isMax ? `Maximum limit (${MAX_TABLES}) reached` : 'Naya table jodein'}
  >
    <Plus className="w-8 h-8 mb-2" />
    <span className="text-sm font-semibold">Naya Table Jodein</span>
    {isMax && <span className="text-xs mt-1">(Max {MAX_TABLES})</span>}
  </button>
);

const AddTableModal = ({ isMax, onClose, onAdd }) => {
  const [tableName, setTableName] = useState('');
  const [chairSize, setChairSize] = useState(4);
  const chairOptions = [2, 4, 6, 8];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isMax) return;
    onAdd(tableName.trim(), chairSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Naya Table Jodein</h3>
        
        {isMax ? (
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 font-semibold">Maximum Table Limit Reached ({MAX_TABLES}).</p>
            <p className="text-sm text-gray-500 mt-1">Aap aur table nahi jod sakte.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tableName" className="block text-sm font-medium text-gray-700 mb-1">
                Table Name (Optional)
              </label>
              <input
                type="text"
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Ex. Window View"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chairs ki Sankhya (Number of Chairs)
              </label>
              <div className="flex space-x-3">
                {chairOptions.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setChairSize(size)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all border-2 ${
                      chairSize === size 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg transition-colors"
              >
                Table Banayein
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// TablesView (Modified props)
const TablesView = ({ tables, setTables, searchQuery }) => {
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const isMaxTables = tables.length >= MAX_TABLES;
  const tablesLoading = false; // Always false since using local state

  const filteredTables = useMemo(() => {
    if (!searchQuery) return tables;
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return tables.filter(table => 
      String(table.number).includes(searchQuery) || 
      table.name?.toLowerCase().includes(lowerCaseQuery)
    );
  }, [tables, searchQuery]);

  // Use useCallback to memoize the functions passed down
  const onAddTable = useCallback((name, size) => {
    handleAddTable(tables, setTables, name, size);
  }, [tables, setTables]);

  const handleConfirmDelete = useCallback((tableToDelete) => {
      handleDeleteTable(tables, setTables, tableToDelete);
  }, [tables, setTables]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Tables / Chairs ({tables.length}/{MAX_TABLES})</h2>
        <div className="flex space-x-4 text-sm font-medium">
            <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>Reserved ({tables.filter(t => t.reserved).length})</span>
            </div>
            <div className="flex items-center">
                <span className="w-3 h-3 bg-white border border-gray-300 rounded-full mr-2"></span>
                <span>Available ({tables.filter(t => !t.reserved).length})</span>
            </div>
        </div>
      </div>

      {tablesLoading ? (
        <div className="text-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-indigo-600">Loading Tables...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          
          {filteredTables.map(table => (
            <TableCard 
              key={table.id} 
              table={table} 
              tables={tables} 
              setTables={setTables}
            />
          ))}

          <AddTableDottedBox 
            onClick={() => setShowAddTableModal(true)} 
            isMax={isMaxTables} 
          />
        </div>
      )}

      {showAddTableModal && (
        <AddTableModal 
          isMax={isMaxTables} 
          onClose={() => setShowAddTableModal(false)} 
          onAdd={onAddTable}
        />
      )}
    </div>
  );
};


// --- ORDER LINE SECTION ---

const OrderCard = ({ order }) => {
    // Get color based on status
    const getColorClass = (status) => {
        switch (status) {
            case 'Ongoing':
                return 'bg-amber-100 border-amber-300 text-amber-800'; // Light Orange
            case 'Served':
                return 'bg-green-100 border-green-300 text-green-800'; // Light Green
            case 'Cancelled':
                return 'bg-red-100 border-red-300 text-red-800';
            default:
                return 'bg-white border-gray-200 text-gray-800';
        }
    };

    const isOngoing = order.status === 'Ongoing';

    return (
        <div className={`p-5 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl ${getColorClass(order.status)}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase opacity-70">Order ID</span>
                    <span className="text-lg font-bold">{order.id}</span>
                </div>
                
                <div className={`px-3 py-1 text-sm font-bold rounded-full border-2 ${
                    isOngoing ? 'border-amber-500 bg-amber-200' : 
                    order.status === 'Served' ? 'border-green-500 bg-green-200' : 
                    'border-red-500 bg-red-200'
                }`}>
                    {order.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                    <Table className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium">{order.location}</span>
                </div>
                <div className="flex items-center">
                    <ListChecks className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium">{order.items} Items</span>
                </div>
                <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium">{order.time}</span>
                </div>
                <div className="flex items-center">
                    <ChefHat className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium">{order.chef || 'Unassigned'}</span>
                </div>
            </div>

            {isOngoing && (
                <div className="mt-4 pt-3 border-t border-gray-300">
                    <div className="flex justify-between items-center text-sm font-semibold">
                        <span>Processing Time:</span>
                        <span className="text-amber-600 font-bold">
                            {Math.floor(order.processingTime / 60).toString().padStart(2, '0')}:
                            {(order.processingTime % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                    {/* Mock Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                            className="bg-amber-500 h-2.5 rounded-full" 
                            style={{ width: `${(1 - (order.processingTime / 300)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
            
            {order.status === 'Served' && (
                <div className="mt-4 pt-3 border-t border-gray-300 text-center">
                    <p className="text-green-600 font-bold flex items-center justify-center">
                        <Check className="w-5 h-5 mr-2" /> Complete
                    </p>
                </div>
            )}
            
             {order.status === 'Cancelled' && (
                <div className="mt-4 pt-3 border-t border-gray-300 text-center">
                    <p className="text-red-600 font-bold flex items-center justify-center">
                        <X className="w-5 h-5 mr-2" /> Cancelled
                    </p>
                </div>
            )}

        </div>
    );
};

const OrderLineView = ({ orders, searchQuery }) => {
    const [filterStatus, setFilterStatus] = useState('All'); 

    const filteredOrders = useMemo(() => {
        let result = orders;

        // 1. Filter by Status
        if (filterStatus !== 'All') {
            result = result.filter(order => order.status === filterStatus);
        }

        // 2. Filter by Search Query
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter(order =>
                order.id.toLowerCase().includes(lowerCaseQuery) ||
                order.location.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // Sort: Ongoing first, then by time
        result.sort((a, b) => {
            if (a.status === 'Ongoing' && b.status !== 'Ongoing') return -1;
            if (a.status !== 'Ongoing' && b.status === 'Ongoing') return 1;
            // Fallback: sort by ID or time (for mock simplicity, we use ID)
            return a.id.localeCompare(b.id);
        });

        return result;
    }, [filterStatus, searchQuery, orders]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order Line ({filteredOrders.length} Orders)</h2>
                
                {/* Status Filter Dropdown */}
                <div className="relative inline-block text-left">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Served">Served</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-lg text-gray-500">
                    <Utensils className="w-10 h-10 mx-auto mb-3" />
                    <p className="text-lg">Koi Orders Nahi Mile.</p>
                    <p className="text-sm">Try changing the filter or search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};


// --- MENU MANAGEMENT SECTION ---

// Menu Item Model
const EMPTY_MENU_ITEM = {
    id: null,
    name: '',
    description: '',
    price: 0,
    prepTime: 15, // Changed from averagePreparationTime for brevity
    category: CATEGORIES[1], // Default to first real category
    stock: 0,
};

// Modal for adding/editing menu item (COMPLETED)
const MenuItemModal = ({ isOpen, onClose, item, onSave, onDelete }) => {
    const [formData, setFormData] = useState(item || EMPTY_MENU_ITEM);

    useEffect(() => {
        setFormData(item || EMPTY_MENU_ITEM);
    }, [item]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic Validation
        if (!formData.name || !formData.category || formData.price <= 0 || formData.stock < 0 || formData.prepTime <= 0) {
            // Using console.error instead of alert as per instructions
            console.error("Please fill all required fields correctly (Name, Category, Price > 0, Prep Time > 0, Stock >= 0).");
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    {item ? <Edit3 className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                    {item ? 'Menu Item Edit Karein' : 'Naya Menu Item Jodein'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                            >
                                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Description (Completed) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="2"
                            placeholder="Briefly describe the dish..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="1" step="any"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* Prep Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (Mins)</label>
                            <input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} required min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Available</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4">
                        {item && (
                            <button 
                                type="button"
                                onClick={() => { onDelete(item.id); onClose(); }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center shadow-md"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </button>
                        )}
                        <div className='flex space-x-3 ml-auto'>
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg transition-colors flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" /> {item ? 'Save Changes' : 'Add Item'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MenuCard = ({ item, onEdit }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex justify-between items-center transition duration-300 hover:shadow-xl hover:border-indigo-300">
        <div className="min-w-0 pr-3">
            <h4 className="text-lg font-bold text-gray-800 truncate">{item.name}</h4>
            <p className="text-xs text-gray-500 truncate">{item.description}</p>
            <p className="text-sm font-medium text-indigo-600 mt-1">₹{item.price.toFixed(2)}</p>
        </div>
        <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">{item.stock} in Stock</p>
            <p className="text-xs text-gray-500">Prep: {item.prepTime} mins</p>
            <button
                onClick={() => onEdit(item)}
                className="mt-2 text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded-full hover:bg-indigo-50"
            >
                <Edit3 className="w-4 h-4" />
            </button>
        </div>
    </div>
);


const MenuManagementView = ({ menu, setMenu, searchQuery }) => {
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const filteredMenu = useMemo(() => {
        let result = menu;

        // 1. Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(item => item.category === selectedCategory);
        }

        // 2. Filter by Search Query
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(lowerCaseQuery) ||
                item.description.toLowerCase().includes(lowerCaseQuery)
            );
        }

        return result;
    }, [menu, selectedCategory, searchQuery]);
    
    // CRUD Operations (Local Storage based)
    const handleSaveItem = useCallback((itemData) => {
        setMenu(prevMenu => {
            if (itemData.id) {
                // Edit existing
                return prevMenu.map(item => item.id === itemData.id ? itemData : item);
            } else {
                // Add new
                const newId = 'M' + String(prevMenu.length + 1).padStart(3, '0') + '-' + Date.now();
                return [...prevMenu, { ...itemData, id: newId }];
            }
        });
    }, [setMenu]);

    const handleDeleteItem = useCallback((itemId) => {
        setMenu(prevMenu => prevMenu.filter(item => item.id !== itemId));
    }, [setMenu]);


    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleOpenNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Menu Management ({filteredMenu.length} Items)</h2>
                <button
                    onClick={handleOpenNew}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg transition-colors flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" /> Item Jodein
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 shadow-sm ${
                            selectedCategory === category
                                ? 'bg-indigo-600 text-white shadow-indigo-400/50'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {filteredMenu.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-lg text-gray-500">
                    <Package className="w-10 h-10 mx-auto mb-3" />
                    <p className="text-lg">Koi Menu Item Nahi Mila.</p>
                    <p className="text-sm">Try changing the category or search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenu.map(item => (
                        <MenuCard key={item.id} item={item} onEdit={handleOpenEdit} />
                    ))}
                </div>
            )}
            
            {isModalOpen && (
                <MenuItemModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    item={editingItem}
                    onSave={handleSaveItem}
                    onDelete={handleDeleteItem}
                />
            )}
        </div>
    );
};


// --- Analytics Section Components ---

const StatCard = ({ title, value, icon: Icon, color, text }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg flex items-center transition duration-300 transform hover:scale-[1.02] hover:shadow-xl">
        <div className={`p-3 rounded-full ${color} bg-opacity-20 mr-4`}>
            <Icon className={`w-6 h-6 ${text}`} />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const ChefPerformanceCard = ({ chef }) => (
    <div className="flex justify-between items-center p-4 border-b last:border-b-0">
        <div className="flex items-center space-x-3">
            <span className="text-2xl">👨‍🍳</span>
            <span className="font-semibold text-gray-800">{chef.name}</span>
        </div>
        <div className="text-center">
            <span className="text-xl font-bold text-indigo-600">{chef.orders.toString().padStart(2, '0')}</span>
            <p className="text-xs text-gray-500">Orders</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${chef.status === 'Busy' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
            {chef.status}
        </span>
    </div>
);


// --- MAIN APP COMPONENT ---

const App = () => {
    // Load state from Local Storage or use initial mocks
    const savedState = useMemo(() => loadState(), []); 
    
    const [tables, setTables] = useState(savedState?.tables || initialMockTables);
    const [orders, setOrders] = useState(savedState?.orders || MOCK_ORDERS);
    const [menu, setMenu] = useState(savedState?.menu || MOCK_MENU);
    
    // Other mock data for read-only sections
    const stats = MOCK_STATS; 
    const orderSummary = MOCK_ORDER_SUMMARY;
    const revenueData = MOCK_REVENUE_DATA;
    const chefPerformance = MOCK_CHEF_PERFORMANCE;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard'); // Tabs: dashboard, tables, orderLine, menu

    // Local Storage Persistence useEffect
    useEffect(() => {
        saveState({ tables, orders, menu });
        console.log("State saved to Local Storage.");
    }, [tables, orders, menu]); // Save whenever these core states change

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSearchQuery(''); // Clear search when switching tabs
    };

    // Rendered Content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'tables':
                return <TablesView tables={tables} setTables={setTables} searchQuery={searchQuery} />;
            case 'orderLine':
                return <OrderLineView orders={orders} searchQuery={searchQuery} />;
            case 'menu':
                return <MenuManagementView menu={menu} setMenu={setMenu} searchQuery={searchQuery} />;
            case 'dashboard':
            default:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Dashboard Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Orders Summary & Revenue Graph */}
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-indigo-500" /> Orders & Revenue Summary</h3>
                                
                                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                                    {orderSummary.map((item, index) => (
                                        <div key={index} className={`p-3 rounded-lg ${item.color}`}>
                                            <p className={`text-2xl font-bold ${item.text}`}>{item.count.toString().padStart(2, '0')}</p>
                                            <p className="text-sm text-gray-600">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                                
                                <h4 className="text-lg font-medium text-gray-800 mb-2 flex items-center"><TrendingUp className="w-4 h-4 mr-1 text-green-500" /> Weekly Revenue</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                            <XAxis dataKey="name" stroke="#333" />
                                            <YAxis tickFormatter={(tick) => `₹${(tick / 1000).toFixed(1)}K`} stroke="#333" />
                                            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                                            <Bar dataKey="Revenue" fill="#4f46e5" radius={[5, 5, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Right Column (Chef Performance) */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><ChefHat className="w-5 h-5 mr-2 text-red-500" /> Chef Performance</h3>
                                <div className="divide-y divide-gray-100">
                                    {chefPerformance.map(chef => (
                                        <ChefPerformanceCard key={chef.name} chef={chef} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter antialiased">
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                        <span className="text-3xl text-indigo-600">🍜</span>
                        <h1 className="text-2xl font-bold text-gray-900">Restaurant Ops Hub</h1>
                    </div>
                    {/* Search Filter */}
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Tables, Orders, ya Menu Search Karein..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="p-2 pl-10 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-inner"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="bg-white p-2 rounded-xl shadow-lg mb-8 flex space-x-1 sm:space-x-3 overflow-x-auto sticky top-20 z-10">
                    {[
                        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
                        { id: 'tables', name: 'Tables', icon: Table },
                        { id: 'orderLine', name: 'Order Line', icon: Utensils },
                        { id: 'menu', name: 'Menu', icon: Package },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300/50'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Analytics Section (Always Visible) */}
                <section className="mb-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map(stat => (
                            <StatCard 
                                key={stat.title} 
                                title={stat.title} 
                                value={stat.value} 
                                icon={stat.icon} 
                                color={stat.color} 
                                text={stat.text}
                            />
                        ))}
                    </div>
                </section>
                
                {/* Main Content Area */}
                {renderContent()}

            </main>
        </div>
    );
};

export default App;
