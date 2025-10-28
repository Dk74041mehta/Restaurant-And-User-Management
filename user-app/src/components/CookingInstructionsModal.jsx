import React, { useState } from "react";
import { X } from "lucide-react";

const CookingInstructionsModal = ({ onClose, onSave }) => {
  const [instructions, setInstructions] = useState("");

  const handleSave = () => {
    onSave(instructions);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Cooking Instructions</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <textarea
          placeholder="Enter special requests..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CookingInstructionsModal;
