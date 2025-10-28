import React from "react"
import { NavLink } from "react-router-dom"

export default function Sidebar() {
  const navItems = [
    { path: "/", icon: "📊", label: "Dashboard" },
    { path: "/tables", icon: "🍽️", label: "Tables" },
    { path: "/menu", icon: "🍔", label: "Menu" },
    { path: "/orders", icon: "🧾", label: "Orders" },
  ]

  return (
    <aside className="sidebar">
      <div className="circle avatar-empty" />
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `nav-btn ${isActive ? "active-nav" : ""}`
            }
          >
            <span>{item.icon}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom-space">
        <div className="circle avatar-empty small" />
      </div>
    </aside>
  )
}
