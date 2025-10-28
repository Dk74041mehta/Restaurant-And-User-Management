import React from "react";

const CategoryNav = ({ categories, selected, onSelect }) => (
  <nav className="category-nav">
    <div className="category-list">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`category-btn ${selected === cat ? "active" : ""}`}
        >
          {cat}
        </button>
      ))}
    </div>
  </nav>
);

export default CategoryNav;
