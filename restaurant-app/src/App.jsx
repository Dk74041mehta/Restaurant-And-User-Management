// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';

// PAGES IMPORTS
import Dashboard from './pages/Dashboard/Dashboard'; 
import Tables from './pages/Tables/Tables'; // Tables Management पेज
// अभी के लिए डमी पेजेज
const OrderLine = () => <h2 style={{padding: '20px'}}>Order Line Page (Desktop - 6.png)</h2>; 
const Menu = () => <h2 style={{padding: '20px'}}>Menu Management Page (Desktop - 3.png)</h2>; 

// मुख्य लेआउट कंपोनेंट
const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          
          {/* Default Route: / */}
          <Route index element={<Dashboard />} /> 
          
          {/* Other Routes */}
          <Route path="order-line" element={<OrderLine />} />
          <Route path="tables" element={<Tables />} />
          <Route path="menu" element="<Menu />" />
          
        </Route>
        
        <Route path="*" element={<h1 style={{padding: '20px'}}>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;