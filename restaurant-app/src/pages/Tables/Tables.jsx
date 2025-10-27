// src/pages/Tables/Tables.jsx
import React, { useState } from 'react';
import './Tables.css';

const Tables = () => {
    // Local Storage का इस्तेमाल अगले स्टेप में करेंगे
    const [tables, setTables] = useState([]); 
    const [showAddForm, setShowAddForm] = useState(false);

    // TODO: अगले स्टेप में यहाँ Local Storage Functions और Form Logic आएगा

    return (
        <div className="tables-container">
            <header className="tables-header">
                <h1>Tables Management</h1>
                <button 
                    className="add-table-btn" 
                    onClick={() => setShowAddForm(prev => !prev)} // Toggle form
                >
                    {showAddForm ? 'Close Form' : '+ Add New Table'}
                </button>
            </header>

            {/* Add New Table Form (Figma Desktop - 2.pdf के अनुसार) */}
            {showAddForm && (
                <div className="add-table-form-container">
                    <h3>Create New Table</h3>
                    <p>Table Creation Form (Figma) will be built here in the next step, along with Local Storage logic.</p>
                </div>
            )}

            {/* Tables Grid */}
            <div className="tables-grid-full">
                {tables.length === 0 ? (
                    <p>No tables added yet. Please use the "Add New Table" button.</p>
                ) : (
                    tables.map(table => (
                        <div key={table.id} className="table-item-full">
                            {/* डमी टेबल डिस्प्ले */}
                            <span className="table-number">Table {table.number}</span>
                            <span className="table-name">{table.name || 'No Name'}</span>
                            <span className="table-chairs">Chairs: {table.chairs}</span>
                            {/* TODO: Delete Button will go here */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Tables;