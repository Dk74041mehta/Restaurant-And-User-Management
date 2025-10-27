// src/components/TableOverview/TableOverview.jsx
import React from 'react';
import './TableOverview.css';

// 30 टेबल्स का डमी डेटा
const tables = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  number: String(i + 1).padStart(2, '0'),
  isReserved: i % 5 === 0 || i % 7 === 0, 
  seats: 4, 
}));

const TableOverview = () => {
  return (
    <div className="table-overview-card">
      <div className="table-overview-header">
        <h3>Tables</h3>
        <p className="available-count">Availab <span>{tables.filter(t => !t.isReserved).length}</span></p>
      </div>

      <div className="tables-grid">
        {tables.map((table) => (
          <div 
            key={table.id} 
            className={`table-item ${table.isReserved ? 'reserved' : 'available'}`}
          >
            <span className="table-title">Table</span>
            <span className="table-number">{table.number}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableOverview;