import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

const SwipeToOrderButton = ({ handleOrderPlace, grandTotal }) => {
  const [swiped, setSwiped] = useState(false);

  const handleSwipe = () => {
    setSwiped(true);
    setTimeout(() => {
      handleOrderPlace();
      setSwiped(false);
    }, 600);
  };

  return (
    <div className="swipe-container" onClick={handleSwipe}>
      <div className={`swipe-btn ${swiped ? "swiped" : ""}`}>
        <CheckCircle size={20} />
        <span>Swipe to Confirm ₹{grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default SwipeToOrderButton;
