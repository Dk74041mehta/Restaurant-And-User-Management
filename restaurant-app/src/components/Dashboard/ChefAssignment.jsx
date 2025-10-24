import styles from './chefassignment.module.css';

function ChefAssignment({ chefs, orders }) {
  return (
    <div className={styles.chefAssignment}>
      <h3>Chef Assignments</h3>
      
      <div className={styles.chefList}>
        {chefs.map(chef => (
          <div key={chef._id} className={styles.chefCard}>
            <div className={styles.chefHeader}>
              <h4 className={styles.chefName}>{chef.name}</h4>
              <span className={styles.specialty}>{chef.specialty || 'General'}</span>
            </div>
            
            <div className={styles.chefStats}>
              <div className={styles.stat}>
                <span className={styles.label}>Orders Assigned</span>
                <span className={styles.value}>{chef.ordersAssigned}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Current Orders</span>
                <span className={styles.value}>{chef.currentOrders?.length || 0}</span>
              </div>
            </div>

            <div className={styles.orderList}>
              {chef.currentOrders?.map((orderId, idx) => (
                <div key={orderId} className={styles.orderItem}>
                  Order #{idx + 1}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChefAssignment;
