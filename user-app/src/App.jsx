import React, { useState, useEffect, useCallback } from 'react';
import {
  initializeApp
} from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  onSnapshot,
  collection,
  query,
  setLogLevel,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

// --- CONFIGURATION & FIREBASE SETUP ---
// Global variables provided by the canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Mock Data for Initial UI Rendering
const MOCK_DATA = {
  analytics: {
    totalChef: 4,
    totalRevenue: 12000,
    totalOrders: 20,
    totalClients: 65,
  },
  summary: {
    served: 9,
    dineIn: 5,
    takeAway: 6,
  },
  chefs: [
    { name: 'Manesh', ordersTaken: 3 },
    { name: 'Pritam', ordersTaken: 7 },
    { name: 'Yash', ordersTaken: 5 },
    { name: 'Tenzen', ordersTaken: 8 },
  ],
};

// Placeholder for tables (30 total)
const generateInitialTables = () => {
  const tables = [];
  for (let i = 1; i <= 30; i++) {
    tables.push({
      id: i,
      name: `Table ${i}`,
      capacity: i % 4 === 0 ? 8 : i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
      isReserved: i % 7 === 0 || i % 11 === 0, // Mocking some reserved tables
      reservedFor: i % 7 === 0 ? 'Sharma' : i % 11 === 0 ? 'Vikas' : null,
    });
  }
  return tables;
};

// --- UTILITY COMPONENTS ---

const AnalyticsCard = ({ title, value, icon, bgColor, textColor }) => (
  <div className={`p-4 rounded-xl shadow-lg flex flex-col items-start justify-between h-full transform transition duration-300 hover:scale-[1.02] ${bgColor}`}>
    <div className="text-3xl font-bold">{icon}</div>
    <div className={`mt-2 ${textColor}`}>
      <div className="text-4xl font-extrabold">{value}</div>
      <p className="text-xs font-semibold uppercase opacity-80 mt-1">{title}</p>
    </div>
  </div>
);

const ChefStatus = ({ name, orders }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50 transition duration-150 px-2 rounded-lg">
    <span className="font-medium text-gray-700">{name}</span>
    <span className={`text-xl font-bold ${orders > 5 ? 'text-red-500' : 'text-green-500'} bg-white px-3 py-1 rounded-full shadow-inner`}>{orders}</span>
  </div>
);

const TableItem = ({ table }) => {
  const bgColor = table.isReserved ? 'bg-red-500/90' : 'bg-white';
  const ringColor = table.isReserved ? 'ring-red-600' : 'ring-green-600';
  const textColor = table.isReserved ? 'text-white' : 'text-gray-800';

  return (
    <div
      className={`relative p-4 h-24 rounded-xl shadow-md cursor-pointer transition duration-200 transform hover:scale-105 ${bgColor} ring-2 ${ringColor} ${textColor}`}
      title={table.isReserved ? `Reserved for: ${table.reservedFor}` : 'Available'}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="text-xs font-semibold uppercase">
          Table {table.id}
        </div>
        <div className="text-xl font-extrabold">
          {table.name || `T-${table.id}`}
        </div>
        <div className="absolute bottom-1 right-1 text-sm opacity-90 font-medium">
          Seats: {table.capacity}
        </div>
      </div>
      {table.isReserved && (
        <span className="absolute top-1 right-1 text-xs bg-black/30 text-white rounded-full px-2 py-0.5">Reserved</span>
      )}
    </div>
  );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [analyticsData, setAnalyticsData] = useState(MOCK_DATA.analytics);
  const [summaryData, setSummaryData] = useState(MOCK_DATA.summary);
  const [chefData, setChefData] = useState(MOCK_DATA.chefs);
  const [tables, setTables] = useState(generateInitialTables());
  const [filter, setFilter] = useState('Daily');

  // 1. Firebase Initialization and Authentication
  useEffect(() => {
    if (!firebaseConfig) {
      console.error("Firebase config is missing.");
      return;
    }

    try {
      setLogLevel('debug');
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authService = getAuth(app);

      setDb(firestore);
      setAuth(authService);

      // Authentication Listener
      const unsubscribe = onAuthStateChanged(authService, async (user) => {
        if (user) {
          setUserId(user.uid);
          console.log("User authenticated:", user.uid);
        } else {
          // If no user, sign in anonymously or with custom token
          try {
            if (initialAuthToken) {
              const userCredential = await signInWithCustomToken(authService, initialAuthToken);
              setUserId(userCredential.user.uid);
            } else {
              const userCredential = await signInAnonymously(authService);
              setUserId(userCredential.user.uid);
            }
          } catch (error) {
            console.error("Firebase auth failed:", error);
            setUserId(null); // Ensure userId is null on failure
          }
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setIsAuthReady(true);
    }
  }, []);

  // 2. Real-time Data Listeners (onSnapshot)
  useEffect(() => {
    if (!db || !userId || !isAuthReady) return;

    // Collection path for public/shared restaurant data
    const RESTAURANT_DATA_PATH = `artifacts/${appId}/public/data/restaurantData`;
    const dataRef = doc(db, RESTAURANT_DATA_PATH, 'currentStatus');

    // Listener for all dashboard data
    const unsubscribeData = onSnapshot(dataRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAnalyticsData(data.analytics || MOCK_DATA.analytics);
        setSummaryData(data.summary || MOCK_DATA.summary);
        setChefData(data.chefs || MOCK_DATA.chefs);
        // Note: Tables should ideally come from a separate collection for easier management
      } else {
        console.log("No dashboard status found. Using mock data.");
        // Optionally, create initial data here if it doesn't exist
        // setDoc(dataRef, { analytics: MOCK_DATA.analytics, summary: MOCK_DATA.summary, chefs: MOCK_DATA.chefs, timestamp: serverTimestamp() }, { merge: true });
      }
    }, (error) => {
      console.error("Error fetching restaurant status:", error);
    });
    
    // Listener for Tables Collection (assuming tables are in a sub-collection for scalability)
    const tablesCollectionRef = collection(db, `artifacts/${appId}/public/data/tables`);
    const unsubscribeTables = onSnapshot(tablesCollectionRef, (snapshot) => {
      if (!snapshot.empty) {
        const updatedTables = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: parseInt(doc.id), // Assuming doc ID is the table number
        }));
        // Sort numerically
        updatedTables.sort((a, b) => a.id - b.id);
        setTables(updatedTables);
      } else {
        console.log("No custom tables found. Using initial mock tables.");
        // In a real app, you'd populate the database with 30 tables initially
      }
    }, (error) => {
      console.error("Error fetching tables:", error);
    });

    return () => {
      unsubscribeData();
      unsubscribeTables();
    };
  }, [db, userId, isAuthReady]); // Re-run effect if Firebase state changes

  // Placeholder function for table configuration (to be implemented)
  const handleCreateTable = (e) => {
    e.preventDefault();
    console.log("Create Table logic triggered.");
    // Firestore logic to add a new table document
  };

  // State for the new table form
  const [newTableName, setNewTableName] = useState('');
  const [newTableChairs, setNewTableChairs] = useState(2);

  // Simple Revenue Graph Placeholder (since we can't use d3 or recharts here)
  const RevenueGraph = () => {
    // Mock data points for a weekly trend
    const weeklyData = [
      { day: 'Mon', revenue: 1200 },
      { day: 'Tue', revenue: 1800 },
      { day: 'Wed', revenue: 1500 },
      { day: 'Thur', revenue: 2200 },
      { day: 'Fri', revenue: 3000 },
      { day: 'Sat', revenue: 4500 },
      { day: 'Sun', revenue: 3800 },
    ];
    const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));

    return (
      <div className="h-40 flex items-end justify-between px-2 pt-2 bg-white/50 rounded-lg shadow-inner mt-4">
        {weeklyData.map((d, index) => (
          <div key={d.day} className="flex flex-col items-center h-full justify-end">
            <div
              className={`w-4 md:w-6 lg:w-8 rounded-t-full bg-blue-500 hover:bg-blue-600 transition-all duration-300`}
              style={{ height: `${(d.revenue / maxRevenue) * 90}%` }}
              title={`Revenue on ${d.day}: ₹${d.revenue}`}
            ></div>
            <span className="text-xs mt-1 text-gray-700 font-semibold">{d.day}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-inter">
      {/* Header and Search */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <svg className="w-8 h-8 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 4a1 1 0 00-2 0v6.586l-.293-.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L15 10.586V4a1 1 0 00-2 0v6h-2V4a1 1 0 00-2 0v6H7V4z" />
          </svg>
          <span className="text-indigo-600">Q</span>Tech Restaurant
        </h1>
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Filter..."
            className="w-full p-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-md"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      {/* Analytics Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b pb-2">Analytics Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <AnalyticsCard
            title="TOTAL CHEFS"
            value={analyticsData.totalChef}
            icon="👨‍🍳"
            bgColor="bg-white"
            textColor="text-gray-800"
          />
          <AnalyticsCard
            title="TOTAL REVENUE"
            value={`₹${(analyticsData.totalRevenue / 1000).toFixed(1)}K`}
            icon="💰"
            bgColor="bg-white"
            textColor="text-green-600"
          />
          <AnalyticsCard
            title="TOTAL ORDERS"
            value={analyticsData.totalOrders}
            icon="📋"
            bgColor="bg-white"
            textColor="text-indigo-600"
          />
          <AnalyticsCard
            title="TOTAL CLIENTS"
            value={analyticsData.totalClients}
            icon="👤"
            bgColor="bg-white"
            textColor="text-red-500"
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="grid grid-cols-12 gap-8">
        {/* Left Column: Orders Summary and Graph */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Orders Summary & Revenue */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Orders Summary (Revenue)</h3>
            
            {/* Summary Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6 text-center">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-extrabold text-indigo-600">{summaryData.served}</p>
                <p className="text-xs font-semibold uppercase text-indigo-500 mt-1">Served</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-extrabold text-green-600">{summaryData.dineIn}</p>
                <p className="text-xs font-semibold uppercase text-green-500 mt-1">Dine In</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-extrabold text-yellow-600">{summaryData.takeAway}</p>
                <p className="text-xs font-semibold uppercase text-yellow-500 mt-1">Take Away</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-extrabold text-red-600">₹{analyticsData.totalRevenue}</p>
                <p className="text-xs font-semibold uppercase text-red-500 mt-1">Revenue</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-full text-sm font-medium">
                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`py-2 px-4 rounded-full transition ${filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-500">Revenue Analysis ({filter})</p>
            </div>

            {/* Revenue Graph Placeholder */}
            <RevenueGraph />

          </div>

          {/* Table Configuration Section */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Add/Configure Table</h3>
            <form onSubmit={handleCreateTable} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Table Name (optional)"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <select
                value={newTableChairs}
                onChange={(e) => setNewTableChairs(parseInt(e.target.value))}
                className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {[2, 4, 6, 8].map(size => (
                  <option key={size} value={size}>Chairs: {size}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Tables and Chef Status */}
        <div className="col-span-12 lg:col-span-4 space-y-8">

          {/* Tables View */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Tables ({tables.filter(t => !t.isReserved).length} Available)</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {tables.map(table => (
                <TableItem key={table.id} table={table} />
              ))}
            </div>
            <div className="flex justify-start mt-4 space-x-4 text-sm font-medium">
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-white ring-2 ring-green-600 mr-2"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-red-500 ring-2 ring-red-600 mr-2"></span>
                <span>Reserved</span>
              </div>
            </div>
          </div>

          {/* Chef Order Status */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Order Taken (Chefs)</h3>
            <div className="space-y-3">
              {chefData.map(chef => (
                <ChefStatus key={chef.name} name={chef.name} orders={chef.ordersTaken} />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer / User ID Display */}
      <footer className="mt-8 pt-4 border-t text-sm text-gray-500 flex justify-between items-center">
        <p>Dashboard App ID: <span className="font-mono text-gray-700">{appId}</span></p>
        <p>User ID: <span className="font-mono text-gray-700">{userId || 'N/A (Auth Failed)'}</span></p>
      </footer>
    </div>
  );
};

export default App;