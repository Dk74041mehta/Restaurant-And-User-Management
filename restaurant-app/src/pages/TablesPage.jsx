import React, { useState } from 'react';
import TableList from '../components/TableList';

const initialTables = [
  { id: 1, size: 4, reserved: false, name: '' },
  { id: 2, size: 2, reserved: true, name: 'VIP' },
  // add more sample tables as needed
];

export default function TablesPage() {
  const [tables, setTables] = useState(initialTables);

  return (
    <div className="container">
      <h1>Restaurant Tables</h1>
      <TableList tables={tables} />
      {/* Add buttons or forms to add/delete tables as needed */}
    </div>
  );
}
