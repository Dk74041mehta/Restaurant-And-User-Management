import React, { useState } from "react";
import CategoryBar from "../components/CategoryBar";
import MenuItem from "../components/MenuItem";

const HomePage = () => {
  const categories = ["All", "Pizza", "Burger", "Drinks", "Desserts"];
  const [activeCategory, setActiveCategory] = useState("All");

  const menuItems = [
    { id: 1, name: "Cheese Pizza", category: "Pizza", price: 199, image: "https://via.placeholder.com/120" },
    { id: 2, name: "Veg Burger", category: "Burger", price: 149, image: "https://via.placeholder.com/120" },
    { id: 3, name: "Cold Drink", category: "Drinks", price: 99, image: "https://via.placeholder.com/120" },
  ];

  const filtered = activeCategory === "All" ? menuItems : menuItems.filter(i => i.category === activeCategory);

  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="home">
      <CategoryBar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <div className="menu-grid">
        {filtered.map((item) => (
          <MenuItem key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
