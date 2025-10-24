import { useState, useEffect } from 'react';
import { getMenu, createMenuItem, deleteMenuItem } from '../../utils/api';
import MenuCard from './MenuCard';
import styles from './menu.module.css';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Burgers',
    averagePreparationTime: 15,
    stock: 0
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await getMenu();
      setMenuItems(data.menu);
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
      await createMenuItem(formData);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Burgers',
        averagePreparationTime: 15,
        stock: 0
      });
      setShowForm(false);
      await fetchMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await deleteMenuItem(id);
        await fetchMenu();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className={styles.loading}>⏳ Loading...</div>;

  return (
    <div className={styles.menuPage}>
      <div className={styles.header}>
        <h1>Menu Management</h1>
        <button
          className={styles.createBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Item'}
        </button>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className={styles.form}>
          <input
            type="text"
            placeholder="Item Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          ></textarea>
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option>Burgers</option>
            <option>Pizza</option>
            <option>Drinks</option>
            <option>Desserts</option>
          </select>
          <input
            type="number"
            placeholder="Prep Time (mins)"
            value={formData.averagePreparationTime}
            onChange={(e) => setFormData({ ...formData, averagePreparationTime: parseInt(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
          />
          <button type="submit" className={styles.submitBtn}>Create</button>
        </form>
      )}

      <div className={styles.menuGrid}>
        {filteredItems.map(item => (
          <MenuCard
            key={item._id}
            item={item}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default Menu;
