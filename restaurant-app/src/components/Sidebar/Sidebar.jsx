import { useLocation, useNavigate } from 'react-router-dom';
import styles from './sidebar.module.css';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/tables', label: 'Tables', icon: '🪑' },
    { path: '/orders', label: 'Orders', icon: '📋' },
    { path: '/menu', label: 'Menu', icon: '📖' }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        🍽️ Dashboard
      </div>
      
      <nav className={styles.nav}>
        {navItems.map(item => (
          <button
            key={item.path}
            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
