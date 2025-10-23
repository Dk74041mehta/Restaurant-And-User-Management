import React, { useState } from 'react';
import OrderList from '../components/OrderList';

const initialOrders = [
  { id: 101, items: [{ name: 'Coca-Cola', quantity: 1 }, { name: 'Apple Pie', quantity: 1 }], status: 'Processing', table: 5 },
  { id: 102, items: [{ name: 'Double Cheeseburger', quantity: 1 }], status: 'Done', table: 5 }
  // add more sample orders as needed
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);

  return (
    <div className="container">
      <h1>Current Orders</h1>
      <OrderList orders={orders} />
      {/* Add processing logic or polling for real-time updates */}
    </div>
  );
}
