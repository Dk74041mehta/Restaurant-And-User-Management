import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const total = cart.reduce((acc, i) => acc + i.price, 0);

  const handleCheckout = () => {
    localStorage.removeItem("cart");
    navigate("/thankyou");
  };

  return (
    <div className="checkout">
      <h2>🛒 Checkout</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} className="checkout-item">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <h3>Total: ₹{total}</h3>
          <button onClick={handleCheckout}>Confirm Order</button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
