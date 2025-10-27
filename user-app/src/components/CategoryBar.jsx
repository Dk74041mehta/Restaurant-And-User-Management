import React from "react";

const CategoryBar = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={activeCategory === cat ? "active" : ""}
          onClick={() => setActiveCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
