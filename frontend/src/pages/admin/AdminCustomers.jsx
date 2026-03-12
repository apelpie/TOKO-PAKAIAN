import { useState, useEffect } from 'react';
import API from '../../api';
import './AdminCustomers.css';

// Modal Detail Pelanggan
const CustomerDetailModal = ({ isOpen, onClose, customer, onToggleStatus, currentUser }) => {
  if (!isOpen || !customer) return null;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleToggleStatus = () => {
    const newStatus = customer.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    
    // Cek apakah ini akun sendiri (sesuai hak akses: admin tidak bisa nonaktifkan diri sendiri)
    if (customer.id === currentUser?.id_user) {
      alert('Tidak dapat menonaktifkan akun sendiri!');
      return;
    }
    
    if (window.confirm(`Yakin ingin ${newStatus === 'Aktif' ? 'mengaktifkan' : 'menonaktifkan'} pelanggan ini?`)) {
      onToggleStatus(customer.id, newStatus);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detail Pelanggan</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="customer-detail-content">
          {/* Profil */}
          <div className="customer-profile">
            <div className="customer-avatar">
              {customer.name?.charAt(0) || 'U'}
            </div>
            <div className="customer-name-section">
              <h3>{customer.name}</h3>
              <p>@{customer.username}</p>
            </div>
            <span className={`status-badge ${customer.status?.toLowerCase() === 'aktif' ? 'aktif' : 'nonaktif'}`}>
              {customer.status || 'Aktif'}
            </span>
          </div>

          {/* Info Detail */}
          <div className="detail-section">
            <h3>Informasi Pribadi</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{customer.email || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role</span>
                <span className="detail-value">{customer.role}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Bergabung</span>
                <span className="detail-value">
                  {customer.created_at 
                    ? new Date(customer.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : '-'
                  }
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ID Pelanggan</span>
                <span className="detail-value">#{customer.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className={`btn-status ${customer.status === 'Aktif' ? 'deactivate' : 'activate'}`}
            onClick={handleToggleStatus}
            disabled={customer.id === currentUser?.id_user} // Disable jika akun sendiri
          >
            {customer.id === currentUser?.id_user 
              ? 'Akun Sendiri' 
              : customer.status === 'Aktif' 
                ? 'Nonaktifkan Akun' 
                : 'Aktifkan Akun'
            }
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Register Admin
const RegisterAdminModal = ({ isOpen, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    onRegister(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Register Admin Baru</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div className="form-group">
              <label>Konfirmasi Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="kasir">Kasir</option>
              <option value="pelanggan">Pelanggan</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Register Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Komponen Utama
const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ========== API CALLS ==========

  // GET current user profile
  const getCurrentUser = async () => {
    try {
      const response = await API.get('/users/profile');
      console.log('Current user:', response.data);
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  // GET all users (dari endpoint /users yang baru kita tambah)
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/users');
      console.log('All users:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Gagal memuat data pelanggan');
    } finally {
      setLoading(false);
    }
  };

  // PUT deactivate user
  const deactivateUser = async (id) => {
    try {
      await API.put('/users/deactivate', { id_user: id });
      alert('Pengguna berhasil dinonaktifkan');
      fetchCustomers(); // Refresh data
      setModalOpen(false);
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert(`Gagal: ${error.response?.data?.pesan || error.response?.data?.message || 'Unknown error'}`);
    }
  };

  // PUT activate user
  const activateUser = async (id) => {
    try {
      await API.put('/users/activate', { id_user: id });
      alert('Pengguna berhasil diaktifkan');
      fetchCustomers(); // Refresh data
      setModalOpen(false);
    } catch (error) {
      console.error('Error activating user:', error);
      alert(`Gagal: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  // POST register new admin
  const registerAdmin = async (data) => {
    try {
      await API.post('/users/register', {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role
      });
      
      alert(`${data.role} baru berhasil ditambahkan: ${data.name}`);
      setRegisterModalOpen(false);
      fetchCustomers(); // Refresh data
    } catch (error) {
      console.error('Error registering user:', error);
      alert(`Gagal: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  // Load data saat komponen mount
  useEffect(() => {
    fetchCustomers();
    getCurrentUser();
  }, []);

  // Filter users
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Semua' || customer.status === statusFilter;
    const matchesRole = roleFilter === 'Semua' || customer.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handle view detail
  const handleViewDetail = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  // Handle toggle status
  const handleToggleStatus = (id, newStatus) => {
    if (newStatus === 'Nonaktif') {
      deactivateUser(id);
    } else {
      activateUser(id);
    }
  };

  // Hitung statistik
  const totalActive = customers.filter(c => c.status === 'Aktif').length;
  const totalInactive = customers.filter(c => c.status === 'Nonaktif').length;
  const totalAdmins = customers.filter(c => c.role === 'admin').length;
  const totalCashiers = customers.filter(c => c.role === 'kasir').length;
  const totalCustomers = customers.filter(c => c.role === 'pelanggan').length;

  const statuses = ['Semua', 'Aktif', 'Nonaktif'];
  const roles = ['Semua', 'admin', 'kasir', 'pelanggan'];

  if (loading) {
    return (
      <div className="customers-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data pelanggan...</p>
      </div>
    );
  }

  return (
    <div className="admin-customers">
      {/* Header */}
      <div className="customers-header">
        <div>
          <h1>Kelola Pelanggan & Admin</h1>
          <p className="customers-count">
            Total: {customers.length} • Aktif: {totalActive} • Nonaktif: {totalInactive}
          </p>
          <p className="customers-count">
            Admin: {totalAdmins} • Kasir: {totalCashiers} • Pelanggan: {totalCustomers}
          </p>
        </div>
        <button 
          className="btn-add"
          onClick={() => setRegisterModalOpen(true)}
        >
          + Tambah User Baru
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari nama, username, atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role === 'Semua' ? 'Semua Role' : role}
              </option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Bergabung</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td className="customer-name">{customer.name}</td>
                  <td>@{customer.username}</td>
                  <td>{customer.email || '-'}</td>
                  <td>
                    <span className={`role-badge ${customer.role}`}>
                      {customer.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${customer.status?.toLowerCase() === 'aktif' ? 'aktif' : 'nonaktif'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    {customer.created_at 
                      ? new Date(customer.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      : '-'
                    }
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetail(customer)}
                      title="Lihat Detail"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      <CustomerDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customer={selectedCustomer}
        onToggleStatus={handleToggleStatus}
        currentUser={currentUser}
      />

      {/* Modal Register */}
      <RegisterAdminModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegister={registerAdmin}
      />
    </div>
  );
};

export default AdminCustomers;