import styles from './menu.module.css';

function MenuCard({ item, onDelete }) {
  return (
    <div className={styles.menuCard}>
      <div className={styles.cardImage}>
        🍕 Image
      </div>
      
      <div className={styles.cardContent}>
        <h3>{item.name}</h3>
        <p className={styles.description}>{item.description}</p>
        
        <div className={styles.details}>
          <span className={styles.price}>₹{item.price}</span>
          <span className={styles.category}>{item.category}</span>
        </div>
        
        <div className={styles.meta}>
          <p>⏱️ {item.averagePreparationTime} mins</p>
          <p>📦 Stock: {item.stock}</p>
        </div>
      </div>
      
      <button
        className={styles.deleteBtn}
        onClick={() => onDelete(item._id)}
      >
        Delete
      </button>
    </div>
  );
}

export default MenuCard;
