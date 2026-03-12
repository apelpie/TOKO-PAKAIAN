import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

// MOCK DATA
const MOCK_DATA = {
  stats: {
    todayRevenue: 2500000,
    todayOrders: 24,
    todayProductsSold: 45,
    lowStock: 3
  },
  weeklySales: [
    { day: 'Sen', value: 2500000 },
    { day: 'Sel', value: 3000000 },
    { day: 'Rab', value: 2800000 },
    { day: 'Kam', value: 3500000 },
    { day: 'Jum', value: 4200000 },
    { day: 'Sab', value: 3800000 },
    { day: 'Min', value: 4500000 }
  ],
  topProducts: [
    { id: 1, name: 'Kemeja Flanel', sold: 25, revenue: 2500000 },
    { id: 2, name: 'Dress Polos', sold: 20, revenue: 3000000 },
    { id: 3, name: 'Jeans Pria', sold: 18, revenue: 2700000 },
    { id: 4, name: 'Sweater Rajut', sold: 15, revenue: 1800000 }
  ],
  lowStockProducts: [
    { id: 1, name: 'Kemeja Putih L', stock: 2, category: 'Pria' },
    { id: 2, name: 'Jeans Hitam 32', stock: 1, category: 'Pria' },
    { id: 3, name: 'Kaos Polos Navy M', stock: 3, category: 'Unisex' }
  ]
};

// Component Stat Card
const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

// Component Simple Chart
const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="simple-chart">
      {data.map((item, index) => (
        <div key={index} className="chart-item">
          <div className="chart-bar-container">
            <div 
              className="chart-bar"
              style={{ 
                height: `${(item.value / maxValue) * 150}px`,
                backgroundColor: '#8B5CF6'
              }}
            />
          </div>
          <span className="chart-label">{item.day}</span>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [weeklySales, setWeeklySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    // Simulasi loading
    setTimeout(() => {
      setStats(MOCK_DATA.stats);
      setWeeklySales(MOCK_DATA.weeklySales);
      setTopProducts(MOCK_DATA.topProducts);
      setLowStockProducts(MOCK_DATA.lowStockProducts);
      setLoading(false);
    }, 500);
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="welcome-text">Selamat datang, {user?.name || 'Admin'}! 👋</p>
        </div>
        <div className="date-badge">
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard 
          icon="💰"
          title="Pendapatan Hari Ini"
          value={formatRupiah(stats.todayRevenue)}
          subtitle="+15% dari kemarin"
          color="primary"
        />
        <StatCard 
          icon="📦"
          title="Pesanan Hari Ini"
          value={stats.todayOrders}
          subtitle="12 pending"
          color="success"
        />
        <StatCard 
          icon="👕"
          title="Produk Terjual"
          value={stats.todayProductsSold}
          subtitle="Hari ini"
          color="info"
        />
        <StatCard 
          icon="⚠️"
          title="Stok Menipis"
          value={stats.lowStock}
          subtitle="Produk < 5"
          color="warning"
        />
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="section-header">
          <h2>📈 Grafik Penjualan Mingguan</h2>
          <div className="chart-actions">
            <button className="btn-filter active">Minggu Ini</button>
            <button className="btn-filter">Bulan Ini</button>
          </div>
        </div>
        <div className="chart-container">
          <SimpleBarChart data={weeklySales} />
        </div>
      </div>

      {/* Two Columns Grid */}
      <div className="dashboard-grid">
        {/* Top Products */}
        <div className="grid-card">
          <div className="card-header">
            <h2>🔥 Produk Terlaris Bulan Ini</h2>
          </div>
          <div className="product-list">
            {topProducts.map((product, index) => (
              <div key={product.id} className="product-item">
                <div className="product-rank">{index + 1}</div>
                <div className="product-details">
                  <div className="product-name">{product.name}</div>
                  <div className="product-stats">
                    <span>{product.sold} terjual</span>
                    <span className="product-price">{formatRupiah(product.revenue)}</span>
                  </div>
                </div>
                <button className="btn-update">Update</button>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="grid-card">
          <div className="card-header">
            <h2>⚠️ Stok Menipis</h2>
          </div>
          <div className="lowstock-list">
            {lowStockProducts.map(product => (
              <div key={product.id} className="lowstock-item">
                <div className="lowstock-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-category">{product.category}</div>
                </div>
                <div className="lowstock-actions">
                  <span className="stock-text">Stok: {product.stock}</span>
                  <button className="btn-update small">Update</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;