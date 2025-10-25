import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import OrdersTable from "../components/OrdersTable";
import TablesSection from "../components/TablesSection";
import ChefsSection from "../components/ChefsSection";
import ClientsSection from "../components/ClientsSection";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const [active, setActive] = useState("Analytics");
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/analytics`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data.analytics || {}))
      .catch((err) => console.error(err));
  }, []);

  const renderSection = () => {
    switch (active) {
      case "Tables":
        return <TablesSection />;
      case "Orders":
        return <OrdersTable />;
      case "Chefs":
        return <ChefsSection />;
      case "Clients":
        return <ClientsSection />;
      default:
        return (
          <div className={styles["stats-grid"]}>
            <StatCard title="Total Orders" value={analytics.totalOrders || 0} />
            <StatCard title="Revenue" value={`₹${analytics.totalRevenue || 0}`} />
            <StatCard title="Clients" value={analytics.totalClients || 0} />
            <StatCard title="Chefs" value={analytics.totalChefs || 0} />
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar active={active} setActive={setActive} />
      <main className={styles.dashboard}>
        <header className={styles["dashboard-header"]}>
          <h1>{active}</h1>
          <div className={styles["dashboard-user"]}>
            <img src="/profile.png" alt="User" />
            <span>Admin</span>
          </div>
        </header>

        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;
