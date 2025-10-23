import React, { useEffect, useState } from 'react';
import { API } from '../api/api';
import Navbar from '../components/Navbar/Navbar';
import MenuCard from '../components/MenuCard/MenuCard';
import styles from './Home.module.css';

const Home = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await API.get('/menu');
      setMenu(res.data);
    };
    fetchMenu();
  }, []);

const addToCart = (item) => {
  const existing = JSON.parse(localStorage.getItem('cart')) || [];
  const updated = [...existing, item];
  localStorage.setItem('cart', JSON.stringify(updated));
  alert(`${item.name} added to cart!`);
};


  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2>🍕 Our Menu</h2>
        <div className={styles.grid}>
          {menu.map((item) => (
            <MenuCard key={item._id} item={item} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
