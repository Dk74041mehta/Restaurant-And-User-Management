import { formatDate, getStatusColor } from '../../utils/helpers';
import styles from './orders.module.css';

function OrderCard({ order, onStatusUpdate }) {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#FFA500',
      'Cooking': '#FFA500',
      'Served': '#90EE90',
      'Done': '#87CEEB'
    };
    return colors[status] || '#999';
  };

  const getCardBgColor = (status) => {
    const bgColors = {
      'Pending': '#fff3e0',
      'Cooking': '#fff3e0',
      'Served': '#e8f5e9',
      'Done': '#e3f2fd'
    };
    return bgColors[status] || '#f5f5f5';
  };

  const statusOptions = ['Pending', 'Cooking', 'Served', 'Done'];
  const currentStatusIndex = statusOptions.indexOf(order.status);

  return (
    <div 
      className={styles.orderCard}
      style={{ backgroundColor: getCardBgColor(order.status) }}
    >
      <div className={styles.orderHeader}>
        <h3>Order #{order.orderId}</h3>
        <span 
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.type === 'Dine In' ? 'Dine In' : 'Take Away'}
        </span>
      </div>

      <div className={styles.orderInfo}>
        <p><strong>Client:</strong> {order.clientName}</p>
        <p><strong>Phone:</strong> {order.clientPhone}</p>
        <p><strong>Status:</strong> {order.status}</p>
        {order.tableNumber && <p><strong>Table:</strong> {order.tableNumber}</p>}
        <p><strong>Time:</strong> {formatDate(order.createdAt)}</p>
        <p><strong>Items:</strong> {order.items.length}</p>
      </div>

      <div className={styles.itemsList}>
        {order.items.map((item, idx) => (
          <div key={idx} className={styles.item}>
            <span>{item.quantity}x {item.name}</span>
            <span className={styles.price}>₹{item.price}</span>
          </div>
        ))}
      </div>

      <div className={styles.orderFooter}>
        <div className={styles.total}>
          <strong>Total: ₹{order.grandTotal}</strong>
        </div>
        <select
          value={order.status}
          onChange={(e) => onStatusUpdate(order._id, e.target.value)}
          className={styles.statusSelect}
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default OrderCard;
