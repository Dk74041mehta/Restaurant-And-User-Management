import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../utils/api';
import OrderCard from './OrderCard';
import styles from './orders.module.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) return <div className={styles.loading}>⏳ Loading...</div>;

  return (
    <div className={styles.ordersPage}>
      <div className={styles.header}>
        <h1>Order Line</h1>
        <div className={styles.filters}>
          {['all', 'Pending', 'Cooking', 'Served', 'Done'].map(status => (
            <button
              key={status}
              className={`${styles.filterBtn} ${filter === status ? styles.active : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.ordersGrid}>
        {filteredOrders.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
}

export default Orders;
