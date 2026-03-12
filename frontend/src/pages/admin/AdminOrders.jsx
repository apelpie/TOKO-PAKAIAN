import { useState, useEffect } from 'react';
import './AdminOrders.css';

// Mock Data Transaksi
const MOCK_TRANSACTIONS = [
  { 
    id: 'TRX001', 
    customer: 'Andi', 
    cashier: 'Kasir 1', 
    total: 450000, 
    paid: 500000, 
    change: 50000,
    status: 'Selesai',
    date: '2026-03-11',
    items: [
      { name: 'Kemeja Flanel', qty: 2, price: 150000, subtotal: 300000 },
      { name: 'Jeans Pria', qty: 1, price: 150000, subtotal: 150000 }
    ]
  },
  { 
    id: 'TRX002', 
    customer: 'Siti', 
    cashier: 'Kasir 1', 
    total: 750000, 
    paid: 750000, 
    change: 0,
    status: 'Selesai',
    date: '2026-03-11',
    items: [
      { name: 'Dress Polos', qty: 2, price: 200000, subtotal: 400000 },
      { name: 'Sweater Rajut', qty: 2, price: 175000, subtotal: 350000 }
    ]
  },
  { 
    id: 'TRX003', 
    customer: 'Budi', 
    cashier: 'Kasir 2', 
    total: 230000, 
    paid: 250000, 
    change: 20000,
    status: 'Selesai',
    date: '2026-03-10',
    items: [
      { name: 'Kaos Polos', qty: 1, price: 80000, subtotal: 80000 },
      { name: 'Kemeja Batik', qty: 1, price: 150000, subtotal: 150000 }
    ]
  },
  { 
    id: 'TRX004', 
    customer: 'Ani', 
    cashier: 'Kasir 1', 
    total: 580000, 
    paid: 600000, 
    change: 20000,
    status: 'Diproses',
    date: '2026-03-12',
    items: [
      { name: 'Jeans Pria', qty: 2, price: 250000, subtotal: 500000 },
      { name: 'Kaos Polos', qty: 1, price: 80000, subtotal: 80000 }
    ]
  },
  { 
    id: 'TRX005', 
    customer: 'Citra', 
    cashier: 'Kasir 3', 
    total: 125000, 
    paid: 125000, 
    change: 0,
    status: 'Menunggu',
    date: '2026-03-12',
    items: [
      { name: 'Kemeja Flanel', qty: 1, price: 125000, subtotal: 125000 }
    ]
  }
];

// Modal Detail Transaksi
const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-lg">
        <div className="modal-header">
          <h2>Detail Pesanan {order.id}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="order-detail">
          <div className="detail-section">
            <h3>Informasi Pesanan</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">ID Pesanan</span>
                <span className="detail-value">{order.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tanggal</span>
                <span className="detail-value">
                  {new Date(order.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pelanggan</span>
                <span className="detail-value">{order.customer}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Kasir</span>
                <span className="detail-value">{order.cashier}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Detail Item</h3>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{formatRupiah(item.price)}</td>
                    <td>{formatRupiah(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="detail-section payment-info">
            <h3>Pembayaran</h3>
            <div className="payment-summary">
              <div className="summary-row">
                <span>Total</span>
                <span className="total-value">{formatRupiah(order.total)}</span>
              </div>
              <div className="summary-row">
                <span>Dibayar</span>
                <span>{formatRupiah(order.paid)}</span>
              </div>
              <div className="summary-row">
                <span>Kembali</span>
                <span className="change-value">{formatRupiah(order.change)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen Utama AdminOrders
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setOrders(MOCK_TRANSACTIONS);
      setLoading(false);
    }, 500);
  }, []);

  // Filter pesanan
  const filteredOrders = orders.filter(order => {
    // Search by ID or customer
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter status
    const matchesStatus = statusFilter === 'Semua' || order.status === statusFilter;
    
    // Filter tanggal
    const matchesDate = !dateFilter || order.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Hitung total pendapatan
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);

  // Handle view detail
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  // Handle update status
  const handleUpdateStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    alert(`Status pesanan ${id} diubah menjadi ${newStatus}`);
  };

  // Format currency
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  // Get unique statuses for filter
  const statuses = ['Semua', ...new Set(orders.map(o => o.status))];

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Memuat pesanan...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {/* Header */}
      <div className="orders-header">
        <div>
          <h1>Kelola Pesanan</h1>
          <p className="orders-count">
            Total {filteredOrders.length} pesanan • 
            Pendapatan {formatRupiah(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari ID atau nama pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-date"
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Pelanggan</th>
              <th>Kasir</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.cashier}</td>
                  <td className="order-total">{formatRupiah(order.total)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {new Date(order.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </td>
                  <td className="action-buttons">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetail(order)}
                      title="Lihat Detail"
                    >
                      👁️
                    </button>
                    <select 
                      className="status-select"
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Tidak ada pesanan yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      <OrderDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminOrders;