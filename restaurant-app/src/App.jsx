// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar'; // Sidebar कंपोनेंट
import './index.css'; // Global CSS (अगर आप styles index.css में रख रहे हैं)

// PAGES IMPORTS
import Dashboard from './pages/Dashboard/Dashboard'; 
// Tables Management पेज (Desktop - 2.pdf) - अभी डमी
const Tables = () => <h2>Tables Management Page</h2>; 
// Order Line पेज (Desktop - 6.png) - अभी डमी
const OrderLine = () => <h2>Order Line Page</h2>; 
// Menu Management पेज (Desktop - 3.png) - अभी डमी
const Menu = () => <h2>Menu Management Page</h2>; 

// मुख्य लेआउट कंपोनेंट (Sidebar + Content Area)
const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content-area">
        {/* Outlet यहाँ नेस्टेड राउट्स (Nested Routes) के पेज रेंडर करेगा */}
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AppLayout को पैरेंट रूट (Parent Route) बनाया गया है */}
        <Route path="/" element={<AppLayout />}>
          
          {/* Default Route: / */}
          <Route index element={<Dashboard />} /> 
          
          {/* /order-line */}
          <Route path="order-line" element={<OrderLine />} />
          
          {/* /tables */}
          <Route path="tables" element={<Tables />} />
          
          {/* /menu */}
          <Route path="menu" element={<Menu />} />
          
        </Route>
        
        {/* 404 (Optional) */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;