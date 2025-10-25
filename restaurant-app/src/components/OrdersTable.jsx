import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.section}>
      <h2>Recent Orders</h2>
      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Client</th>
              <th>Type</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.clientName}</td>
                <td>{order.type}</td>
                <td>₹{order.grandTotal}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
