import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, 
  setPersistence, inMemoryPersistence 
} from 'firebase/auth'; 
// Firestore ke zaroori functions import karein
import { 
  getFirestore, doc, setDoc, collection, query, onSnapshot, 
  addDoc, deleteDoc, writeBatch, updateDoc,
  setLogLevel 
} from 'firebase/firestore'; 
import { LayoutDashboard, Users, Utensils, Table, ChefHat, Search, DollarSign, BarChart3, Clock, TrendingUp, Plus, Trash2, X, AlertTriangle, Check, ListChecks, ChevronDown, Edit3, Save, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Global variables (MUST BE USED)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

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


// Analytics Mock Data (retained for dashboard)
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


// --- Firebase Initialization and Auth Logic ---
const useFirebase = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // Auth readiness tracker

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const dbInstance = getFirestore(app);
      const authInstance = getAuth(app);
      
      // Persistence set to in-memory 
      setPersistence(authInstance, inMemoryPersistence);
      
      setDb(dbInstance);
      setAuth(authInstance);

      let unsubscribeAuth = () => {};

      const setupAuth = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authInstance, initialAuthToken);
          } else {
            await signInAnonymously(authInstance);
          }

          unsubscribeAuth = onAuthStateChanged(authInstance, (user) => {
            if (user) {
              setUserId(user.uid);
              console.log("Firebase Auth State Changed: Logged in. UID:", user.uid);
            } else {
              const fallbackId = 'anon-' + crypto.randomUUID();
              setUserId(fallbackId); 
              console.warn("Firebase Auth State Changed: No user found. Using fallback ID:", fallbackId);
            }
            setIsAuthReady(true);
          }, (error) => {
            console.error("onAuthStateChanged error:", error);
            setIsAuthReady(true); 
            setUserId('error-anon-' + crypto.randomUUID());
          });

        } catch (error) {
          console.error("Initial Firebase setup/sign-in failed:", error);
          setIsAuthReady(true);
          setUserId('error-fail-' + crypto.randomUUID());
        }
      };

      setupAuth();
      return () => unsubscribeAuth(); 
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setIsAuthReady(true);
      setUserId('init-fail-' + crypto.randomUUID());
    }
  }, []);

  return { db, auth, userId, isAuthReady }; 
};


// --- Tables Firestore Hook and Logic (Retained) ---

const useTablesData = (db, userId, isAuthReady) => { 
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !userId || !isAuthReady) { 
        setTables([]);
        setLoading(true);
        return;
    }

    const tablesCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'tables');
    const q = query(tablesCollectionRef); 

    setLoading(true);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTables = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      fetchedTables.sort((a, b) => (a.number || 0) - (b.number || 0));
      
      setTables(fetchedTables);
      setLoading(false);
      console.log(`Successfully fetched ${fetchedTables.length} tables.`);
    }, (error) => {
      console.error("Firestore Error Fetching Tables:", error.message);
      setLoading(false);
      setTables([]);
    });

    return () => {
      unsubscribe();
    };
  }, [db, userId, isAuthReady]); 

  return { tables, loading };
};

const handleAddTable = async (db, userId, tables, name, size) => {
  if (tables.length >= MAX_TABLES) {
    console.warn("Maximum table limit reached.");
    return;
  }
  
  const newTableNumber = tables.length + 1;

  try {
    const tablesCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'tables');
    await addDoc(tablesCollectionRef, {
      number: newTableNumber,
      size: size,
      reserved: false,
      name: name,
      bookedBy: null,
      persons: 0,
    });
    console.log("Table added successfully:", newTableNumber);
  } catch (error) {
    console.error("Error adding table:", error);
  }
};

const handleDeleteTable = async (db, userId, tables, tableToDelete) => {
  try {
    const tablesCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'tables');
    const tableRef = doc(tablesCollectionRef, tableToDelete.id);
    
    await deleteDoc(tableRef);

    const remainingToUpdate = tables
        .filter(t => t.id !== tableToDelete.id)
        .sort((a, b) => (a.number || 0) - (b.number || 0));

    const batch = writeBatch(db);
    remainingToUpdate.forEach((table, index) => {
        const newNumber = index + 1;
        if (table.number !== newNumber) { 
            const ref = doc(tablesCollectionRef, table.id);
            batch.update(ref, { number: newNumber });
        }
    });
    await batch.commit();
    
    console.log(`Table T-${tableToDelete.number} deleted and tables re-sequenced via batch.`);
    
  } catch (error) {
    console.error("Error deleting table:", error);
  }
};

const handleBookTable = async (db, userId, tableToBook) => {
  try {
    const tablesCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'tables');
    const tableRef = doc(tablesCollectionRef, tableToBook.id);
    
    const newReservedState = !tableToBook.reserved;
    
    await updateDoc(tableRef, { 
      reserved: newReservedState,
      bookedBy: newReservedState ? 'Customer Name (Mock)' : null,
      persons: newReservedState ? tableToBook.size : 0,
    });
    console.log(`Table T-${tableToBook.number} ${newReservedState ? 'booked' : 'unbooked'}.`);
  } catch (error) {
    console.error("Error booking/unbooking table:", error);
  }
};

// Confirmation Modal (Retained)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, table }) => {
  if (!isOpen) return null;
  const isReserved = table.reserved;

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
              onClick={onConfirm} 
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
// TableIconSVG, TableCard, AddTableDottedBox, AddTableModal (Retained)
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
const TableCard = ({ db, userId, table, tables }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isReserved = table.reserved;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = () => {
    if (!isReserved) {
        handleDeleteTable(db, userId, tables, table);
    }
    setShowDeleteConfirm(false);
  };

  const handleToggleBooking = () => {
    handleBookTable(db, userId, table);
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
// TablesView (Retained)
const TablesView = ({ db, userId, tables, tablesLoading, searchQuery }) => {
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const isMaxTables = tables.length >= MAX_TABLES;

  const filteredTables = useMemo(() => {
    if (!searchQuery) return tables;
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return tables.filter(table => 
      String(table.number).includes(searchQuery) || 
      table.name?.toLowerCase().includes(lowerCaseQuery)
    );
  }, [tables, searchQuery]);

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
              db={db} 
              userId={userId} 
              table={table} 
              tables={tables}
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
          onAdd={(name, size) => handleAddTable(db, userId, tables, name, size)}
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

const OrderLineView = ({ searchQuery }) => {
    const [filterStatus, setFilterStatus] = useState('All'); // Added Filter State

    const filteredOrders = useMemo(() => {
        let result = MOCK_ORDERS;

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
    }, [filterStatus, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order Line ({filteredOrders.length} Orders)</h2>
                
                {/* Status Filter Dropdown (Added Filter Button) */}
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

// Menu Item Model (For state management in Menu Management)
const EMPTY_MENU_ITEM = {
    id: null,
    name: '',
    description: '',
    price: 0,
    averagePreparationTime: 15, // in minutes
    category: CATEGORIES[1], // Default to first real category
    stock: 0,
};

// Modal for adding/editing menu item
const MenuItemModal = ({ isOpen, onClose, item, onSave }) => {
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
        // Basic Validation (you can add more)
        if (!formData.name || !formData.category || formData.price <= 0 || formData.stock < 0) {
            alert("Please fill all required fields correctly.");
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
                    
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} min="1" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        {/* Prep Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (Min)</label>
                            <input type="number" name="averagePreparationTime" value={formData.averagePreparationTime} onChange={handleChange} min="1" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                         {/* Stock */}
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-6 py-2 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg transition-colors flex items-center"
                        >
                            <Save className="w-5 h-5 mr-2" /> Save Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Menu Management View
const MenuManagementView = ({ searchQuery }) => {
    const [menuItems, setMenuItems] = useState(MOCK_MENU);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Filtered Menu Items
    const filteredMenuItems = useMemo(() => {
        let result = menuItems;

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
    }, [menuItems, selectedCategory, searchQuery]);
    
    // Handlers
    const handleSaveItem = (itemData) => {
        if (itemData.id) {
            // Edit existing item
            setMenuItems(prev => prev.map(item => item.id === itemData.id ? itemData : item));
            console.log("Updated Menu Item:", itemData.name);
        } else {
            // Add new item
            const newId = 'M' + String(menuItems.length + 1).padStart(3, '0');
            const newItem = { ...itemData, id: newId };
            setMenuItems(prev => [...prev, newItem]);
            console.log("Added New Menu Item:", newItem.name);
        }
    };
    
    const handleDeleteItem = (id) => {
        // Use custom modal for confirmation (we will use a simple confirm for now in this mock)
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            setMenuItems(prev => prev.filter(item => item.id !== id));
            console.log(`Deleted Menu Item: ${id}`);
        }
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        setEditingItem(null); // Clear editing item for 'Add' mode
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            
            {/* Header and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Menu Management ({filteredMenuItems.length} Items)</h2>
                <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg transition-colors flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" /> Naya Item Jodein
                </button>
            </div>

            {/* Category Filter Tabs (Desktop 6 Design) */}
            <div className="flex space-x-3 overflow-x-auto pb-2 border-b border-gray-200">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            selectedCategory === cat
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Item List */}
            <div className="space-y-4">
                {filteredMenuItems.length === 0 ? (
                     <div className="text-center p-10 bg-white rounded-xl shadow-lg text-gray-500">
                        <Package className="w-10 h-10 mx-auto mb-3" />
                        <p className="text-lg">Koi Items Nahi Mile.</p>
                        <p className="text-sm">Try changing the filter or search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredMenuItems.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between transition-shadow hover:shadow-lg border-l-4 border-indigo-600">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="text-lg font-bold text-gray-900 truncate">{item.name} <span className="text-sm font-normal text-gray-500 ml-2">({item.id})</span></h3>
                                    <p className="text-sm text-gray-600 mb-2 truncate">{item.description}</p>
                                    <div className="flex space-x-4 text-sm font-medium text-gray-700">
                                        <p className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-1 text-green-600" /> ₹ {item.price}</p>
                                        <p className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-indigo-600" /> {item.averagePreparationTime} min</p>
                                        <p className="flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1 text-blue-600" /> Stock: {item.stock}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleOpenEdit(item)}
                                        title="Edit Item"
                                        className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
                                    >
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        title="Delete Item"
                                        className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Menu Item Add/Edit Modal */}
            <MenuItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={editingItem}
                onSave={handleSaveItem}
            />
        </div>
    );
};


// --- Analytics Dashboard Components (Retained) ---

const StatsCard = ({ title, value, icon: Icon, color, text }) => (
  <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center justify-between transition-transform hover:scale-[1.02]">
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className={`w-6 h-6 text-white`} />
    </div>
  </div>
);

const OrderSummaryCard = () => (
  <div className="bg-white p-6 rounded-2xl shadow-xl h-full flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
      <select className="text-sm border rounded-lg p-1">
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
    </div>
    <div className="space-y-4 flex-grow">
      {MOCK_ORDER_SUMMARY.map((item, index) => (
        <div key={index} className={`flex items-center p-4 rounded-xl ${item.color}`}>
          <div className={`w-2 h-2 rounded-full mr-3 ${item.color.replace('/50', '').replace('100', '600')}`}></div>
          <span className="text-sm font-medium text-gray-700 flex-grow">{item.label}</span>
          <span className={`text-xl font-bold ${item.text}`}>{item.count}</span>
        </div>
      ))}
    </div>
  </div>
);

const RevenueChartCard = () => (
  <div className="bg-white p-6 rounded-2xl shadow-xl h-full flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">Revenue Chart</h3>
      <select className="text-sm border rounded-lg p-1">
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
        <option>Yearly</option>
      </select>
    </div>
    <div className="flex-grow min-h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={MOCK_REVENUE_DATA}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(value) => `₹${value / 1000}K`} />
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
            labelFormatter={(label) => `Day: ${label}`}
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
          />
          <Bar dataKey="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ChefPerformanceCard = () => (
  <div className="bg-white p-6 rounded-2xl shadow-xl col-span-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Chef Performance (Orders Taken)</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Chef Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders Taken</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {MOCK_CHEF_PERFORMANCE.map((chef, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                <ChefHat className="w-4 h-4 mr-2 text-indigo-500" />
                {chef.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{String(chef.orders).padStart(2, '0')}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    chef.status === 'Busy' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {chef.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AnalyticsView = () => (
    <div className="space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_STATS.map((stat, index) => (
            <StatsCard key={index} {...stat} />
            ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 h-auto">
            <div className="col-span-1">
            <OrderSummaryCard />
            </div>
            <div className="lg:col-span-1 xl:col-span-2">
            <RevenueChartCard />
            </div>
        </section>

        <section>
            <ChefPerformanceCard />
        </section>
    </div>
);


// 1. Sidebar Component (Icons Only)
const Sidebar = ({ activeTab, setActiveTab, userId }) => {
  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
    { id: 'tables', label: 'Tables/Chairs', icon: Table },
    { id: 'orderline', label: 'Order Line', icon: Utensils },
    { id: 'menu', label: 'Menu Management', icon: BarChart3 },
  ];

  return (
    <div className="w-20 bg-white border-r border-gray-100 p-4 hidden md:flex flex-col items-center shadow-lg z-10 transition-all duration-300">
      <div className="flex items-center justify-center h-16 mb-6">
        <span className="text-xl font-extrabold text-gray-800 tracking-wider">R</span>
      </div>
      <nav className="space-y-4 w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200 text-[10px] text-gray-500 w-full text-center">
        <p className="font-semibold mb-1">User ID:</p>
        <p className="break-all leading-tight">{userId ? userId : 'Anon'}</p>
        <p className="mt-1 text-xs">{typeof __initial_auth_token !== 'undefined' ? 'Auth' : 'Anon'}</p>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const { db, auth, userId, isAuthReady } = useFirebase(); 
  const { tables, loading: tablesLoading } = useTablesData(db, userId, isAuthReady);

  // Clear search query when tab changes
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-indigo-600">Authenticating User...</p>
      </div>
    );
  }

  if (!db || !userId) {
     return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 font-bold">Error: Firebase failed to initialize or determine user ID.</p>
      </div>
    );
  }

  // Determine the search placeholder based on the active tab
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'tables':
        return 'Search Table Number or Name...';
      case 'orderline':
        return 'Search Order ID or Table/Location...';
      case 'menu':
        return 'Search Menu Item Name or Description...';
      default:
        return 'Search...';
    }
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsView />;
      case 'tables':
        return (
          <TablesView 
            db={db} 
            userId={userId} 
            tables={tables} 
            tablesLoading={tablesLoading} 
            searchQuery={searchQuery}
          />
        );
      case 'orderline':
        return <OrderLineView searchQuery={searchQuery} />; // New Order Line View
      case 'menu':
        return <MenuManagementView searchQuery={searchQuery} />; // New Menu Management View
      default:
        return <div className="p-6 text-gray-500">Select a Tab</div>;
    }
  };


  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar (Icons Only) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userId={userId} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header/Filter Section */}
        <header className="bg-white p-4 md:p-6 border-b border-gray-200 flex items-center justify-between shadow-md z-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
            {activeTab === 'analytics' ? 'Analytics Dashboard' : activeTab === 'tables' ? 'Tables / Chairs Management' : activeTab === 'orderline' ? 'Order Line' : 'Menu Management'}
          </h1>
          <div className="relative flex items-center w-full max-w-sm md:max-w-md">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {renderContent()}
          <div className="h-4"></div>
        </main>
      </div>
    </div>
  );
};

export default App;
