import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ThankYou.module.css';

const ThankYou = () => {
  const navigate = useNavigate();

  // ⏳ Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>🎉</div>
        <h2>Thank You for Your Order!</h2>
        <p>Your delicious food is being prepared 🍕</p>
        <p className={styles.redirectText}>Redirecting you to Home in 5 seconds...</p>
      </div>
    </div>
  );
};

export default ThankYou;
