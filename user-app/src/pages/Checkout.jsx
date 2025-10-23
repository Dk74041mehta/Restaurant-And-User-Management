import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api/api';
import Navbar from '../components/Navbar/Navbar';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();

  // 🛒 Cart dummy data for now (we'll connect later with real cart state)
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    type: 'Take Away',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientPhone || cart.length === 0) {
      alert('Please fill details and add items to cart!');
      return;
    }

    try {
      const res = await API.post('/orders', {
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientAddress: formData.clientAddress,
        type: formData.type,
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      });

      if (res.data.success) {
        alert('✅ Order placed successfully!');
        localStorage.removeItem('cart');
        navigate('/thankyou');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.checkout}>
        <h2>🧾 Checkout</h2>

        <form onSubmit={handlePlaceOrder} className={styles.form}>
          <label>Full Name</label>
          <input type="text" name="clientName" onChange={handleChange} required />

          <label>Phone Number</label>
          <input type="text" name="clientPhone" onChange={handleChange} required />

          <label>Address</label>
          <textarea name="clientAddress" rows="3" onChange={handleChange}></textarea>

          <label>Order Type</label>
          <select name="type" onChange={handleChange}>
            <option>Take Away</option>
            <option>Dine In</option>
          </select>

          <button type="submit" className={styles.btn}>Place Order</button>
        </form>

        <div className={styles.summary}>
          <h3>🛍️ Order Summary</h3>
          {cart.length === 0 ? (
            <p>No items added yet</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity || 1} — ₹{item.price * (item.quantity || 1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
