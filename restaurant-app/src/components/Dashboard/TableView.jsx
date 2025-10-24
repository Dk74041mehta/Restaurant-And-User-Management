import { useState, useEffect } from 'react';
import { updateTableStatus, getTables } from '../../utils/api';
import styles from './tableview.module.css';

function TableView({ tables: initialTables }) {
  const [tables, setTables] = useState(initialTables);

  useEffect(() => {
    setTables(initialTables);
  }, [initialTables]);

  const toggleTableStatus = async (tableId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Available' ? 'Reserved' : 'Available';
      await updateTableStatus(tableId, newStatus);
      
      setTables(tables.map(t => 
        t._id === tableId ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
      console.error('Error updating table status:', err);
    }
  };

  const reservedCount = tables.filter(t => t.status === 'Reserved').length;
  const availableCount = tables.filter(t => t.status === 'Available').length;

  return (
    <div className={styles.tableView}>
      <div className={styles.header}>
        <h3>Tables</h3>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <span className={styles.statDot} style={{ backgroundColor: '#27AE60' }}></span>
            Available: {availableCount}
          </span>
          <span className={styles.statItem}>
            <span className={styles.statDot} style={{ backgroundColor: '#3498DB' }}></span>
            Reserved: {reservedCount}
          </span>
        </div>
      </div>

      <div className={styles.tablesGrid}>
        {tables.map(table => (
          <button
            key={table._id}
            className={`${styles.tableCard} ${styles[table.status.toLowerCase()]}`}
            onClick={() => toggleTableStatus(table._id, table.status)}
            title={`Table ${table.tableNumber} - ${table.status}`}
          >
            <div className={styles.tableNumber}>
              Table {String(table.tableNumber).padStart(2, '0')}
            </div>
            <div className={styles.tableChairs}>
              {table.chairs} Chairs
            </div>
            <div className={styles.tableStatus}>
              {table.status}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TableView;
