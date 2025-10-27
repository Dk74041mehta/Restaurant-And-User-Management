// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';

// अपने पेज कंपोनेंट्स को यहाँ import करें (अभी के लिए हम डमी बना रहे हैं)
// const Dashboard = () => <h2>Dashboard Page</h2>;
// const OrderLine = () => <h2>Order Line Page</h2>;
const OrderLine = () => <h2>Order Line Page</h2>;
const Tables = () => <h2>Tables Page</h2>;
const Menu = () => <h2>Menu Page</h2>;

// यह हमारा मेन लेआउट कंपोनेंट है
const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content-area">
        {/* बाकी पेज यहाँ रेंडर होंगे */}
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* हम AppLayout को मेन रूट बनाते हैं */}
        <Route path="/" element={<AppLayout />}>
          {/* नेस्टेड रूट्स (Nested Routes) */}
          <Route index element={<Dashboard />} /> {/* index मतलब default route for "/" */}
          <Route path="order-line" element={<OrderLine />} />
          <Route path="tables" element={<Tables />} />
          <Route path="menu" element={<Menu />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;