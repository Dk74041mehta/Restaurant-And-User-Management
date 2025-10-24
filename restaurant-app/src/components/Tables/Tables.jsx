import { useState, useEffect } from 'react';
import { getTables, createTable, deleteTable } from '../../utils/api';
import styles from './tables.module.css';

function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ chairs: 2, tableName: '' });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await getTables();
      setTables(data.tables);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTable(formData);
      setFormData({ chairs: 2, tableName: '' });
      setShowForm(false);
      await fetchTables();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this table?')) {
      try {
        await deleteTable(id);
        await fetchTables();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className={styles.loading}>⏳ Loading...</div>;

  return (
    <div className={styles.tablesPage}>
      <div className={styles.header}>
        <h1>Tables Management</h1>
        <button 
          className={styles.createBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Create Table'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className={styles.form}>
          <label>
            Number of Chairs:
            <input
              type="number"
              min="1"
              max="10"
              value={formData.chairs}
              onChange={(e) => setFormData({ ...formData, chairs: parseInt(e.target.value) })}
              required
            />
          </label>
          <label>
            Table Name (Optional):
            <input
              type="text"
              value={formData.tableName}
              onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
              placeholder="e.g., Window Seat"
            />
          </label>
          <button type="submit" className={styles.submitBtn}>Create</button>
        </form>
      )}

      <div className={styles.tablesGrid}>
        {tables.map(table => (
          <div key={table._id} className={styles.tableCard}>
            <div className={styles.tableInfo}>
              <h3>Table {String(table.tableNumber).padStart(2, '0')}</h3>
              <p>{table.chairs} Chairs</p>
              {table.tableName && <p className={styles.tableName}>{table.tableName}</p>}
              <p className={styles.status}>{table.status}</p>
            </div>
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(table._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tables;
