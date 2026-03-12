import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

// Ikon sederhana (bisa pakai library ikon nanti, ini pake emoji dulu)
const icons = {
  dashboard: '📊',
  products: '👕',
  orders: '📦',
  customers: '👥',
  settings: '⚙️',
  logout: '🚪'
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>DAPHNE'S</h2>
        <p className="admin-role">Admin</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">{icons.dashboard}</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">{icons.products}</span>
          <span className="nav-text">Kelola Produk</span>
        </NavLink>

        <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">🏷️</span>
          <span className="nav-text">Kategori</span>
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">{icons.orders}</span>
          <span className="nav-text">Kelola Pesanan</span>
        </NavLink>

        <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">{icons.customers}</span>
          <span className="nav-text">Kelola Pelanggan</span>
        </NavLink>

        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">{icons.settings}</span>
          <span className="nav-text">Pengaturan</span>
        </NavLink>

        <button onClick={handleLogout} className="nav-link logout-btn">
          <span className="nav-icon">{icons.logout}</span>
          <span className="nav-text">Logout</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <p>© 2026 Daphne's</p>
      </div>
    </div>
  );
};

export default Sidebar;