import React from "react";
import { Utensils, Plus } from "lucide-react";

const Header = ({ onAddTable }) => (
  <header className="header">
    <div className="header-left">
      <Utensils size={28} />
      <h2>Restaurant Dashboard</h2>
    </div>
    {onAddTable && (
      <button className="add-btn" onClick={onAddTable}>
        <Plus size={18} /> Add Table
      </button>
    )}
  </header>
);

export default Header;
