import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import DashboardPage from './pages/DashboardPage';
import TablesPage from './pages/TablesPage';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import styles from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/menu" element={<MenuPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
