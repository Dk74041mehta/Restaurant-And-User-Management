import React from "react";
import styles from "../styles/Dashboard.module.css";
import { FaChartPie, FaChair, FaList, FaUserTie, FaUsers } from "react-icons/fa";

const Sidebar = ({ active, setActive }) => {
  const items = [
    { name: "Analytics", icon: <FaChartPie /> },
    { name: "Tables", icon: <FaChair /> },
    { name: "Orders", icon: <FaList /> },
    { name: "Chefs", icon: <FaUserTie /> },
    { name: "Clients", icon: <FaUsers /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles["sidebar-logo"]}>🍽️ Restaurant</div>
      <div className={styles["sidebar-menu"]}>
        {items.map((item) => (
          <div
            key={item.name}
            className={`${styles["sidebar-item"]} ${
              active === item.name ? styles.active : ""
            }`}
            onClick={() => setActive(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
