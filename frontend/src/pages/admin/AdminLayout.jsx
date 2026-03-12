import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-content">
          <Outlet /> {/* Ini tempat halaman dashboard, produk, dll akan dirender */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;