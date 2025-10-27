import React from 'react';
import './SummaryCard.css';

// हम 'count' और 'title' को props के तौर पर ले रहे हैं
const SummaryCard = ({ count, title }) => {
  return (
    <div className="summary-card">
      <div className="card-count">{count}</div>
      <div className="card-title">{title}</div>
    </div>
  );
};

export default SummaryCard;