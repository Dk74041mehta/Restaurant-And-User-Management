import { useState, useEffect, useCallback, useMemo } from 'react';
// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, query, orderBy, setDoc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
// Icon Imports
import { Loader2, Zap, Utensils, Users, DollarSign, Calendar, Filter, BarChart2, CheckCircle, Clock, MapPin, Menu, ChevronRight, X, PlusCircle, Trash2, Edit, Tag, Clock3, Package, BookOpen, User, Send } from 'lucide-react';
// Chart Imports
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement
);

// Global Variables are MANDATORY for Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Utility Functions
const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec} Min`;
};

// --- FIREBASE CONTEXT & HOOKS ---

// Hook for Firebase Initialization and Auth
const useFirebase = () => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [firebaseError, setFirebaseError] = useState(null);

    useEffect(() => {
        try {
            if (Object.keys(firebaseConfig).length === 0) {
                setFirebaseError("Firebase config is missing. Data persistence will not work.");
                setIsAuthReady(true);
                return;
            }
            
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const authInstance = getAuth(app);

            setDb(firestore);
            setAuth(authInstance);

            const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    if (initialAuthToken) {
                        try {
                            const userCredential = await signInWithCustomToken(authInstance, initialAuthToken);
                            setUserId(userCredential.user.uid);
                        } catch (error) {
                            console.error("Custom token sign-in failed:", error);
                            setFirebaseError("Authentication failed. Check token or rules.");
                            await signInAnonymously(authInstance);
                            setUserId(authInstance.currentUser.uid);
                        }
                    } else {
                        await signInAnonymously(authInstance);
                        setUserId(authInstance.currentUser.uid);
                    }
                }
                setIsAuthReady(true);
            });

            return () => unsubscribe();
        } catch (e) {
            console.error("Firebase Initialization Error:", e);
            setFirebaseError("Failed to initialize Firebase. Check console.");
            setIsAuthReady(true);
        }
    }, []);

    return { db, auth, userId, isAuthReady, firebaseError };
};

// Hook for Menu Management (from previous step)
const useMenu = (db, userId) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const menuCollectionPath = useMemo(() => 
        db && userId ? `artifacts/${appId}/users/${userId}/menu_items` : null, 
    [db, userId]);

    useEffect(() => {
        if (!menuCollectionPath) return;

        setLoading(true);
        const q = collection(db, menuCollectionPath);
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMenuItems(items);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching menu items:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [menuCollectionPath, db]);

    const addMenuItem = async (itemData) => {
        if (!menuCollectionPath) return;
        
        try {
            const item = {
                ...itemData,
                price: parseFloat(itemData.price),
                averagePreparationTime: parseInt(itemData.averagePreparationTime),
                stock: parseInt(itemData.stock),
                createdAt: serverTimestamp(),
            };
            await addDoc(collection(db, menuCollectionPath), item);
        } catch (e) {
            console.error("Error adding menu item:", e);
        }
    };

    const deleteMenuItem = async (itemId) => {
        if (!menuCollectionPath) return;
        try {
            await deleteDoc(doc(db, menuCollectionPath, itemId));
        } catch (e) {
            console.error("Error deleting menu item:", e);
        }
    };

    return { menuItems, addMenuItem, deleteMenuItem, loading };
};

// --- Hook for Chefs Management (NEW) ---
const useChefs = (db, userId) => {
    const [chefs, setChefs] = useState([]);
    const chefsCollectionPath = useMemo(() => 
        db && userId ? `artifacts/${appId}/users/${userId}/chefs` : null, 
    [db, userId]);

    const defaultChefs = [
        { name: "Manesh", orders: 0 },
        { name: "Pritam", orders: 0 },
        { name: "Yash", orders: 0 },
        { name: "Tenzen", orders: 0 },
    ];

    useEffect(() => {
        if (!chefsCollectionPath) return;

        const chefsCollectionRef = collection(db, chefsCollectionPath);
        
        const unsubscribe = onSnapshot(chefsCollectionRef, async (snapshot) => {
            let fetchedChefs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            if (fetchedChefs.length === 0) {
                // Initialize chefs if the collection is empty
                const batch = db.batch();
                defaultChefs.forEach(chef => {
                    const newChefRef = doc(chefsCollectionRef);
                    batch.set(newChefRef, { ...chef, createdAt: serverTimestamp() });
                });
                await batch.commit();
                // We'll rely on the snapshot listener to update state once the batch commits
            } else {
                setChefs(fetchedChefs.sort((a, b) => a.orders - b.orders));
            }
        }, (error) => {
            console.error("Error fetching chefs:", error);
        });

        return () => unsubscribe();
    }, [chefsCollectionPath, db]);

    return { chefs };
};

// --- Hook for Orders Management (NEW) ---
const useOrders = (db, userId, chefs, menuItems) => {
    const [orders, setOrders] = useState([]);
    const ordersCollectionPath = useMemo(() => 
        db && userId ? `artifacts/${appId}/users/${userId}/orders` : null, 
    [db, userId]);

    useEffect(() => {
        if (!ordersCollectionPath) return;

        const q = collection(db, ordersCollectionPath);
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = Date.now();
            const fetchedOrders = snapshot.docs.map(doc => {
                const order = { id: doc.id, ...doc.data() };
                
                // --- COUNTDOWN LOGIC (Refresh based) ---
                if (order.status === 'Processing' && order.estimatedPrepTime && order.assignedTime) {
                    const assignedTimeMs = order.assignedTime.toMillis();
                    const elapsedSeconds = Math.floor((now - assignedTimeMs) / 1000);
                    const estimatedTimeSeconds = order.estimatedPrepTime; // Stored in seconds
                    
                    let remaining = estimatedTimeSeconds - elapsedSeconds;
                    
                    if (remaining <= 0) {
                        order.remainingTime = 0;
                        order.status = 'Done';
                        // Auto-update status to Done in Firestore (async, no state change here)
                        updateDoc(doc(db, ordersCollectionPath, order.id), { status: 'Done', doneAt: serverTimestamp() }).catch(e => console.error("Auto update failed:", e));
                    } else {
                        order.remainingTime = remaining;
                    }
                }
                
                return order;
            });
            setOrders(fetchedOrders.sort((a, b) => (b.assignedTime?.toMillis() || 0) - (a.assignedTime?.toMillis() || 0)));
        }, (error) => {
            console.error("Error fetching orders:", error);
        });

        return () => unsubscribe();
    }, [ordersCollectionPath, db]);

    // Function to assign order to the chef with the minimum current orders
    const assignOrderToChef = useCallback(() => {
        if (!chefs || chefs.length === 0) return null;
        
        // Chefs are already sorted by `orders` count in useChefs hook
        const leastBusyChef = chefs[0];
        
        // Handle ties by picking randomly (SRD requirement: Random if chefs have same number of orders)
        const minOrders = leastBusyChef.orders;
        const leastBusyChefs = chefs.filter(chef => chef.orders === minOrders);
        const randomChefIndex = Math.floor(Math.random() * leastBusyChefs.length);
        
        return leastBusyChefs[randomChefIndex];
    }, [chefs]);

    // Function to calculate total estimated preparation time for an order (in seconds)
    const calculateTotalPrepTime = (items) => {
        // Base prep time (e.g., 2 minutes for processing)
        let totalTime = 120; // 2 minutes in seconds
        
        items.forEach(orderItem => {
            const menuItem = menuItems.find(m => m.id === orderItem.menuItemId);
            if (menuItem) {
                totalTime += (orderItem.quantity * (menuItem.averagePreparationTime || 5) * 60); // minutes to seconds
            }
        });
        return totalTime;
    };

    // Function to create and store a new order
    const createOrder = async (orderData) => {
        if (!ordersCollectionPath || menuItems.length === 0 || chefs.length === 0) {
             console.error("Cannot create order: Missing dependencies (DB, Menu, or Chefs).");
             return;
        }

        const assignedChef = assignOrderToChef();
        if (!assignedChef) return;

        try {
            const totalPrepTime = calculateTotalPrepTime(orderData.items);
            
            const newOrder = {
                orderId: generateUniqueId().substring(0, 8).toUpperCase(),
                ...orderData,
                status: 'Processing',
                chefId: assignedChef.id,
                chefName: assignedChef.name,
                assignedTime: serverTimestamp(),
                estimatedPrepTime: totalPrepTime, // in seconds
                
            };

            // 1. Add the new order
            const orderRef = await addDoc(collection(db, ordersCollectionPath), newOrder);
            
            // 2. Update the assigned chef's order count atomically (requires chef collection path)
            const chefDocRef = doc(db, `artifacts/${appId}/users/${userId}/chefs`, assignedChef.id);
            await updateDoc(chefDocRef, { orders: assignedChef.orders + 1 });
            
            console.log(`Order ${newOrder.orderId} created and assigned to ${assignedChef.name}`);
            return orderRef.id;

        } catch (e) {
            console.error("Error creating order:", e);
        }
    };

    // Function to mark an order as served/done (for the dashboard user)
    const markOrderServed = async (order) => {
        if (!order.chefId || order.status === 'Served' || order.status === 'Done') return;

        try {
            // 1. Update order status
            await updateDoc(doc(db, ordersCollectionPath, order.id), { 
                status: 'Served', 
                servedAt: serverTimestamp() 
            });

            // 2. Decrease chef's order count (assuming chef data is fresh)
            const chefDocRef = doc(db, `artifacts/${appId}/users/${userId}/chefs`, order.chefId);
            const currentChef = chefs.find(c => c.id === order.chefId);
            if (currentChef) {
                await updateDoc(chefDocRef, { orders: Math.max(0, currentChef.orders - 1) });
            }
        } catch (e) {
            console.error("Error marking order served:", e);
        }
    };

    return { orders, createOrder, markOrderServed };
};


// --- UI COMPONENTS ---

const AnalyticsCard = ({ icon, title, value, colorClass }) => (
    <div className={`p-5 rounded-xl shadow-lg bg-white border-b-4 ${colorClass} transition duration-300 hover:shadow-xl`}>
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">{title}</span>
            {icon}
        </div>
        <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

const ChartContainer = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg col-span-full lg:col-span-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h2>
        {children}
    </div>
);

// Order Line Card (Updated to use real data)
const OrderLineCard = ({ order, onMarkServed }) => {
    const isProcessing = order.status === 'Processing';
    const isDone = order.status === 'Done';
    const isServed = order.status === 'Served';

    let statusColor, statusText, statusIcon;

    if (isServed) {
        statusColor = 'bg-green-100 text-green-800';
        statusText = 'Served';
        statusIcon = <CheckCircle className="h-4 w-4 mr-1" />;
    } else if (isDone) {
        statusColor = 'bg-blue-100 text-blue-800';
        statusText = 'Ready to Serve';
        statusIcon = <CheckCircle className="h-4 w-4 mr-1" />;
    } else if (isProcessing) {
        statusColor = 'bg-yellow-100 text-yellow-800';
        statusText = `Ongoing: ${formatTime(order.remainingTime)}`;
        statusIcon = <Clock className="h-4 w-4 mr-1" />;
    } else {
        statusColor = 'bg-gray-100 text-gray-800';
        statusText = order.status;
        statusIcon = <Clock className="h-4 w-4 mr-1" />;
    }
    
    const timeDisplay = order.assignedTime?.toDate()?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || 'N/A';
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="bg-white p-5 rounded-xl shadow-xl border-l-4 border-green-500 transition duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-start mb-3 border-b pb-2">
                <div>
                    <span className="text-xl font-bold text-gray-900">#{order.orderId}</span>
                    <div className="flex items-center mt-1 space-x-2">
                        <span className="text-sm font-medium text-gray-600 flex items-center">
                            {order.type === 'Dine In' ? <Utensils className="h-4 w-4 mr-1 text-green-500" /> : <MapPin className="h-4 w-4 mr-1 text-blue-500" />} 
                            {order.type === 'Dine In' ? `Table-${order.tableNumber}` : 'Take Away'}
                        </span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-sm text-gray-600">{timeDisplay}</span>
                    </div>
                </div>
                <div className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor} flex items-center`}>
                    {statusIcon}
                    {statusText}
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-lg font-semibold text-green-600">{totalItems} Items</p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                        <User className="h-4 w-4 mr-1" /> Chef: {order.chefName}
                    </p>
                </div>
                
                <div className="text-right">
                    <p className="text-sm font-semibold mt-1">{order.type}</p>
                    {isDone && !isServed && (
                        <button
                            onClick={() => onMarkServed(order)}
                            className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Mark Served
                        </button>
                    )}
                    {(isProcessing) && (
                         <span className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded-lg">
                            Estimated: {formatTime(order.estimatedPrepTime)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- MENU MANAGEMENT PAGE (REUSED) ---

const MenuItemForm = ({ onSubmit, initialData = {}, buttonText }) => {
    // ... (MenuItemForm component remains the same for brevity, assuming it was correct in the previous turn) ...
    const [item, setItem] = useState({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        averagePreparationTime: initialData.averagePreparationTime || '',
        category: initialData.category || 'Main Course',
        stock: initialData.stock || 0,
    });
    
    const categories = ["Appetizer", "Main Course", "Dessert", "Beverage", "Side Dish"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(item);
        setItem({ name: '', description: '', price: '', averagePreparationTime: '', category: 'Main Course', stock: 0 }); // Reset form
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Item Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input type="text" name="name" label="Name" value={item.name} onChange={handleChange} required />
                <Input type="number" name="price" label="Price (₹)" value={item.price} onChange={handleChange} required step="0.01" />
                <Input type="number" name="averagePreparationTime" label="Prep Time (mins)" value={item.averagePreparationTime} onChange={handleChange} required />
                <Input type="number" name="stock" label="Initial Stock" value={item.stock} onChange={handleChange} required />
            </div>
            <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                    name="category"
                    value={item.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    rows="3"
                    value={item.description}
                    onChange={handleChange}
                    placeholder="A brief description of the dish."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                ></textarea>
            </div>
            
            <button 
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
            >
                <PlusCircle className="h-5 w-5 mr-2" /> {buttonText}
            </button>
        </form>
    );
};

const Input = ({ label, name, type, value, onChange, required = false, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
            {...props}
        />
    </div>
);

const MenuManagementPage = ({ userId, db }) => {
    const { menuItems, addMenuItem, deleteMenuItem, loading } = useMenu(db, userId);

    const handleDelete = (itemId, itemName) => {
        // Simple console message instead of alert/confirm
        console.log(`Attempting to delete item: ${itemName}`);
        deleteMenuItem(itemId);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-4">
                <BookOpen className="inline h-8 w-8 text-blue-600 mr-2" /> Menu Management
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Menu Item Form */}
                <div className="lg:col-span-1">
                    <MenuItemForm onSubmit={addMenuItem} buttonText="Add New Menu Item" />
                </div>

                {/* Menu Items List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Menu ({menuItems.length} Items)</h2>
                    
                    {loading && (
                        <div className="flex justify-center items-center p-10 bg-white rounded-xl shadow-lg">
                            <Loader2 className="animate-spin h-6 w-6 text-blue-500 mr-3" />
                            <p>Loading Menu...</p>
                        </div>
                    )}
                    
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {menuItems.map(item => (
                            <div key={item.id} className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-blue-500 flex justify-between items-start transition hover:shadow-xl">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900 truncate">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                                    
                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                        <span className="flex items-center text-green-600 font-semibold"><DollarSign className="h-4 w-4 mr-1" /> ₹{item.price?.toFixed(2) || '0.00'}</span>
                                        <span className="flex items-center text-purple-600"><Tag className="h-4 w-4 mr-1" /> {item.category}</span>
                                        <span className="flex items-center text-yellow-600"><Clock3 className="h-4 w-4 mr-1" /> {item.averagePreparationTime} mins</span>
                                        <span className="flex items-center text-red-600"><Package className="h-4 w-4 mr-1" /> Stock: {item.stock}</span>
                                    </div>
                                </div>

                                <div className="flex space-x-2 ml-4">
                                    <button 
                                        onClick={() => handleDelete(item.id, item.name)}
                                        className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-gray-100" 
                                        title="Delete"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN RESTAURANT DASHBOARD ---
const RestaurantDashboard = ({ userId, db }) => {
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    // Assuming tables hook is defined elsewhere or will be added later
    // For now, only using chefs, orders, and menu for the Order Line focus
    const { chefs } = useChefs(db, userId);
    const { menuItems } = useMenu(db, userId); // Need menu items to calculate prep time
    const { orders, createOrder, markOrderServed } = useOrders(db, userId, chefs, menuItems);

    const processingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Done');
    
    // Mock data for analytics and charts 
    const analyticsData = { totalChefs: chefs.length, totalRevenue: '₹12K', totalOrders: orders.length, totalClients: 65 };
    const mockChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ label: 'Revenue', data: [1200, 1900, 3000, 5000, 2000, 3500, 4500], backgroundColor: 'rgba(52, 211, 153, 0.7)', borderColor: 'rgb(16, 185, 129)', borderWidth: 1 }],
    };
    const summaryMetrics = [
        { title: 'Processing', value: processingOrders.length, icon: <Clock className="h-6 w-6 text-yellow-500" /> },
        { title: 'Done (Ready)', value: orders.filter(o => o.status === 'Done').length, icon: <CheckCircle className="h-6 w-6 text-blue-500" /> },
        { title: 'Served', value: orders.filter(o => o.status === 'Served').length, icon: <Utensils className="h-6 w-6 text-green-500" /> },
        { title: 'Total Chefs', value: chefs.length, icon: <User className="h-6 w-6 text-purple-500" /> },
    ];

    // --- TEMPORARY TEST ORDER FUNCTION ---
    const handleCreateTestOrder = () => {
        if (menuItems.length === 0) {
            console.warn("Please add some menu items first in the Menu Management page!");
            return;
        }

        const items = [
            { menuItemId: menuItems[0].id, quantity: 1, name: menuItems[0].name },
            { menuItemId: menuItems[1]?.id || menuItems[0].id, quantity: 2, name: menuItems[1]?.name || menuItems[0].name },
        ];
        
        const testOrder = {
            type: Math.random() < 0.5 ? 'Dine In' : 'Take Away',
            tableNumber: Math.floor(Math.random() * 15) + 1, // Mock table number
            items: items,
            customerName: 'Test Customer',
            phoneNumber: '9999999999',
        };

        if (testOrder.type === 'Take Away') {
            delete testOrder.tableNumber;
        }

        createOrder(testOrder);
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h1 className="text-3xl font-extrabold text-gray-900">Restaurant Dashboard</h1>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <button 
                        onClick={handleCreateTestOrder}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-700"
                    >
                        <Send className="h-4 w-4 mr-2" /> Create Test Order
                    </button>
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-green-700">
                        <Zap className="h-4 w-4 mr-2" /> Quick Action
                    </button>
                </div>
            </header>

            {/* Analytics Section */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard title="TOTAL CHEFS" value={analyticsData.totalChefs} colorClass="border-green-500" icon={<Utensils className="h-6 w-6 text-green-500" />} />
                <AnalyticsCard title="TOTAL REVENUE" value={analyticsData.totalRevenue} colorClass="border-blue-500" icon={<DollarSign className="h-6 w-6 text-blue-500" />} />
                <AnalyticsCard title="TOTAL ORDERS" value={analyticsData.totalOrders} colorClass="border-purple-500" icon={<Zap className="h-6 w-6 text-purple-500" />} />
                <AnalyticsCard title="CHEFS LOAD" value={`${chefs[0]?.name || 'N/A'}: ${chefs[0]?.orders || 0} orders`} colorClass="border-yellow-500" icon={<Users className="h-6 w-6 text-yellow-500" />} />
            </section>

            {/* Orders Summary, Revenue Chart, and Chefs */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Orders Summary Metrics */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Order Line Summary</h2>
                    <div className="space-y-4">
                        {summaryMetrics.map(m => (
                            <div key={m.title} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    {m.icon}
                                    <span className="ml-3 font-medium text-gray-600">{m.title}</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart */}
                <ChartContainer title="Revenue Graph (Weekly)">
                    <Bar options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: false } } }} data={mockChartData} />
                </ChartContainer>

                {/* Chefs and Order Status */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Chef Load Status</h2>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {chefs.map(chef => (
                             <div key={chef.id} className="bg-gray-50 p-4 rounded-xl shadow-md flex items-center justify-between transition hover:shadow-lg">
                                <div>
                                    <p className="font-semibold text-gray-800">{chef.name}</p>
                                    <p className="text-sm text-gray-500 font-bold text-blue-600">Orders: {chef.orders}</p>
                                </div>
                                {chef.orders < 2 ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Clock className="h-6 w-6 text-red-500" />}
                            </div>
                        ))}
                    </div>
                </div>

            </section>
            
            {/* Order Line Section (Live Data) */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Order Line (Processing & Ready Orders: {processingOrders.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {processingOrders.map(order => (
                        <OrderLineCard 
                            key={order.id} 
                            order={order} 
                            onMarkServed={markOrderServed} 
                        />
                    ))}
                    {processingOrders.length === 0 && (
                        <p className="col-span-full text-center p-8 bg-white rounded-xl text-gray-500">No active orders currently processing.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

// --- TABLE MANAGEMENT PLACEHOLDERS (OMITTED FOR BREVITY - Assume functional) ---
const TableCard = ({ table, onDelete }) => <div className="p-4 bg-gray-200 rounded-xl">Table {table.number}</div>;
const TableManagementModal = ({ isOpen, onClose, addTable }) => null;
const useTables = (db, userId) => ({ tables: [], addTable: () => {}, deleteTable: () => {} });


// --- USER APPLICATION COMPONENTS (PLACEHOLDERS) ---
const UserHome = () => (
    <div className="p-8 text-center bg-blue-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-blue-800">User Home (Menu)</h1>
        <p className="text-lg mt-2 text-blue-600">Categories aur Menu Items yahan aayenge (iPhone 13 Pro Max - 1.pdf)</p>
    </div>
);

const Checkout = () => (
    <div className="p-8 text-center bg-yellow-50 min-h-screen">
        <h1 className="text-4xl font-extrabold text-yellow-800">Checkout Page</h1>
        <p className="text-lg mt-2 text-yellow-600">Dine In / Takeaway details aur Swipe to Order yahan aayega (iPhone 13 Pro Max - 3.pdf)</p>
    </div>
);


// --- MAIN APPLICATION ENTRY POINT ---
const App = () => {
    // page state: 'dashboard', 'user_home', 'checkout', 'menu_management'
    const [page, setPage] = useState('dashboard'); 
    
    // Auth and Database setup
    const { db, auth, userId, isAuthReady, firebaseError } = useFirebase();
    
    // We still need the useTables hook for the tables tab to work, even if not used in dashboard right now
    const { tables, addTable, deleteTable } = useTables(db, userId); 
    
    // Conditional Rendering Check: Error handling
    if (firebaseError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
                <div className="text-center p-8 bg-white shadow-xl rounded-xl border-t-4 border-red-500">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Firebase Error</h1>
                    <p className="text-gray-700">{firebaseError}</p>
                    <p className="text-sm text-gray-500 mt-4">User ID: {userId || 'N/A'}</p>
                </div>
            </div>
        );
    }
    
    // Conditional Rendering Check: Loading state (waiting for Firebase Auth)
    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <Loader2 className="animate-spin h-8 w-8 text-green-500 mr-3" />
                <p className="text-white text-xl font-medium">Authenticating & Loading Data...</p> 
            </div>
        );
    }

    const renderPage = () => {
        switch (page) {
            case 'user_home':
                return <UserHome userId={userId} db={db} setPage={setPage} />;
            case 'checkout':
                return <Checkout userId={userId} db={db} setPage={setPage} />;
            case 'menu_management':
                return <MenuManagementPage userId={userId} db={db} setPage={setPage} />;
            case 'dashboard':
            default:
                return <RestaurantDashboard userId={userId} db={db} />;
        }
    };

    return (
        <div className="font-sans">
             {/* Global Navigation Bar */}
            <div className="flex justify-center p-4 bg-gray-800 shadow-lg sticky top-0 z-10">
                <div className="flex space-x-4">
                    <button 
                        onClick={() => setPage('dashboard')} 
                        className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'dashboard' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        <Utensils className="inline h-4 w-4 mr-2" /> Dashboard
                    </button>
                    <button 
                        onClick={() => setPage('menu_management')} 
                        className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'menu_management' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        <BookOpen className="inline h-4 w-4 mr-2" /> Menu Management
                    </button>
                    <button 
                        onClick={() => setPage('user_home')} 
                        className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'user_home' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        <Menu className="inline h-4 w-4 mr-2" /> User Menu
                    </button>
                    <button 
                        onClick={() => setPage('checkout')} 
                        className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'checkout' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        <ChevronRight className="inline h-4 w-4 mr-2" /> Checkout
                    </button>
                </div>
            </div>
            {/* Main Content */}
            {renderPage()}
            {/* User ID Display (Mandatory for multi-user apps) */}
            <div className="fixed bottom-0 right-0 p-2 bg-gray-800 text-white text-xs rounded-tl-lg shadow-2xl">
                User ID: <span className="font-mono font-bold text-yellow-300">{userId}</span>
            </div>
        </div>
    );
};

export default App;
