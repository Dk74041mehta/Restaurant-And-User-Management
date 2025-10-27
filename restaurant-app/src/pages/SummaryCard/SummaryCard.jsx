// src/components/SummaryCard/SummaryCard.jsx
import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ count, title }) => {
  return (
    <div className="summary-card">
      <div className="card-count">{count}</div>
      <div className="card-title">{title}</div>
    </div>
  );
};

export default SummaryCard;