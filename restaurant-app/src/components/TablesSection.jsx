import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";

const TablesSection = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/tables`)
      .then((res) => res.json())
      .then((data) => setTables(data.tables || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.section}>
      <h2>Table Management</h2>
      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th>Table #</th>
              <th>Name</th>
              <th>Chairs</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((t) => (
              <tr key={t._id}>
                <td>{t.tableNumber}</td>
                <td>{t.tableName}</td>
                <td>{t.chairs}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablesSection;
