import React from "react";
import { Plus, Minus } from "lucide-react";

const QuantityControls = ({ quantity, onAdd, onRemove }) => (
  <div className="quantity-controls">
    <button onClick={onRemove}>
      <Minus size={14} />
    </button>
    <span>{quantity}</span>
    <button onClick={onAdd}>
      <Plus size={14} />
    </button>
  </div>
);

export default QuantityControls;
