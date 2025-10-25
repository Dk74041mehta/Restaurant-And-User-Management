import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";

const ChefsSection = () => {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/chefs`)
      .then((res) => res.json())
      .then((data) => setChefs(data.chefs || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.section}>
      <h2>Chefs</h2>
      <div className={styles["table-container"]}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Orders Assigned</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map((chef) => (
              <tr key={chef._id}>
                <td>{chef.name}</td>
                <td>{chef.specialty}</td>
                <td>{chef.ordersAssigned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChefsSection;
