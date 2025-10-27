import React from "react";

const MenuItem = ({ item, addToCart }) => {
  return (
    <div className="menu-item">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>₹{item.price}</p>
      <button onClick={() => addToCart(item)}>Add</button>
    </div>
  );
};

export default MenuItem;
