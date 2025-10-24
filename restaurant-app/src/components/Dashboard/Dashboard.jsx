import { useState, useEffect } from 'react';
import Analytics from './Analytics';
import TableView from './TableView';
import OrderSummary from './OrderSummary';
import ChefAssignment from './ChefAssignment';
import { getAnalytics, getTables, getOrders, getChefs } from '../../utils/api';
import styles from './dashboard.module.css';

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsData, tablesData, ordersData, chefsData] = await Promise.all([
          getAnalytics(),
          getTables(),
          getOrders(),
          getChefs()
        ]);
        
        setAnalytics(analyticsData.analytics);
        setTables(tablesData.tables);
        setOrders(ordersData.orders);
        setChefs(chefsData.chefs);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}>⏳ Loading...</div>;
  if (error) return <div className={styles.error}>❌ Error: {error}</div>;

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Restaurant Dashboard</h1>
      
      <Analytics analytics={analytics} />
      
      <div className={styles.gridContainer}>
        <div className={styles.gridItem}>
          <TableView tables={tables} />
        </div>
        <div className={styles.gridItem}>
          <OrderSummary orders={orders} />
        </div>
      </div>
      
      <ChefAssignment chefs={chefs} orders={orders} />
    </div>
  );
}

export default Dashboard;
