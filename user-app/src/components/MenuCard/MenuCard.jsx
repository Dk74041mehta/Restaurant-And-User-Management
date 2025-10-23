import React from 'react';
import styles from './MenuCard.module.css';

const MenuCard = ({ item, addToCart }) => {
  return (
    <div className={styles.card}>
      <img src={item.image} alt={item.name} className={styles.image} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p className={styles.price}>₹{item.price}</p>
      <button onClick={() => addToCart(item)}>Add to Cart</button>
    </div>
  );
};

export default MenuCard;
