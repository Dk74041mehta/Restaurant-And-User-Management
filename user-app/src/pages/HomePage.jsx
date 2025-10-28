import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import MenuItemCard from '../components/MenuItemCard';
import { CATEGORIES } from '../utils/constants';

const HomePage = ({ cart, setCart, navigateTo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // filter logic
  const filteredItems = useMemo(() => {
    // pretend you have mockMenu imported
    let items = mockMenu;
    if (selectedCategory !== 'All') {
      items = items.filter(i => i.category === selectedCategory);
    }
    if (searchTerm) {
      items = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return items;
  }, [searchTerm, selectedCategory]);

  return (
    <div style={{display:'flex', flexDirection:'column', flexGrow:1}}>
      <Header />
      {/* search + category nav */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search Menu"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <span className="search-icon">
          {/* icon svg */}
        </span>
      </div>
      <nav className="category-nav">
        <div className="category-list">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setSearchTerm(''); }}
              className={`category-button ${selectedCategory === cat ? 'category-button-active' : 'category-button-default'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>
      <div style={{flexGrow:1, overflowY:'auto'}}>
        <main className="menu-item-list">
          <h2 style={{fontSize:'1.25rem',fontWeight:'700',color:'#1F2937'}}>{selectedCategory}</h2>
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              cart={cart}
              setCart={setCart}
            />
          ))}
          {filteredItems.length === 0 && (
            <p style={{textAlign:'center', color:'#6B7280', padding:'2.5rem 0'}}>
              No items found.
            </p>
          )}
        </main>
      </div>
      {cart.length > 0 && (
        <footer className="footer-checkout" onClick={() => navigateTo('checkout')}>
          <div className="checkout-button-bar">
            <div className="checkout-summary-text">
              {cart.length} Item(s) | <span style={{fontWeight:'800'}}>₹{cart.reduce((acc,i)=>acc + i.price*i.quantity,0).toFixed(2)}</span>
            </div>
            <div className="checkout-next-text">
              <span>Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default HomePage;
