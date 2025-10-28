import React from 'react';
import QuantityControls from './QuantityControls';

const MenuItemCard = ({ item, cart, setCart }) => {
  const cartItem = cart.find(i => i.id === item.id);

  const handleAdd = () => {
    setCart(prev => {
      const exist = prev.find(i => i.id === item.id);
      if (exist) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemove = () => {
    setCart(prev => {
      return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
    });
  };

  return (
    <div className="menu-item-card">
      <div className="item-image">
        <img src={item.imageUrl} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
      </div>
      <div className="item-details">
        <div className="item-name">{item.name}</div>
        <div className="item-price">₹{item.price}</div>
      </div>
      {cartItem ? (
        <QuantityControls quantity={cartItem.quantity} onAdd={handleAdd} onRemove={handleRemove} />
      ) : (
        <button className="add-button-plus" onClick={handleAdd}>+</button>
      )}
    </div>
  );
};

export default MenuItemCard;
