import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <span role="img" aria-label="Restaurant Icon">🍽️</span> Logo
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/order-line" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>Order Line</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tables" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>Tables</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>Menu</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;