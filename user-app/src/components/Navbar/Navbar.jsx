import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>🍴 FoodZone</h1>
      <ul className={styles.navLinks}>
        <li>Home</li>
        <li>Checkout</li>
      </ul>
    </nav>
  );
};

export default Navbar;
