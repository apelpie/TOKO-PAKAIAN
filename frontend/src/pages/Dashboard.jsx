import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

// Fallback gambar
const fallbackImage = 'https://via.placeholder.com/200x200?text=Produk';

// Format harga
const formatHarga = (harga) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(harga);
};

const Dashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('semua');

    // Ambil produk dari backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('accessToken');
                
                const response = await axios.get('http://localhost:3000/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // Response langsung array produk
                setProducts(response.data);
                
            } catch (err) {
                console.error('Error fetch products:', err);
                setError('Gagal mengambil data produk');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Ambil unique kategori dari produk
    const categories = ['semua', ...new Set(products.map(p => p.category_name || 'Lainnya'))];
    
    const filteredProducts = selectedCategory === 'semua' 
        ? products 
        : products.filter(p => (p.category_name || 'Lainnya') === selectedCategory);

    return (
        <div className="dashboard">
            {/* Hero Section - SELAMAT DATANG */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>
                        Selamat datang, {user?.name || 'Pelanggan'}! 👋
                    </h1>
                    <p className="role-badge">
                        Sebagai <strong>pelanggan</strong> di Daphne's
                    </p>
                    <p className="welcome-message">
                        Senang melihatmu lagi! Temukan koleksi terbaru kami.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary">
                            <i className="fas fa-shopping-bag"></i> 
                            Beli Sekarang
                        </button>
                        <button className="btn-secondary">
                            <i className="fas fa-play"></i> 
                            Lihat Katalog
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards - PESANAN & WISHLIST */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-shopping-bag"></i>
                    </div>
                    <div className="stat-info">
                        <h4>Pesanan Aktif</h4>
                        <p className="stat-number">3</p>
                        <span className="stat-label">Pesanan</span>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-heart"></i>
                    </div>
                    <div className="stat-info">
                        <h4>Wishlist</h4>
                        <p className="stat-number">12</p>
                        <span className="stat-label">Item</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="stat-info">
                        <h4>Poin Reward</h4>
                        <p className="stat-number">450</p>
                        <span className="stat-label">Poin</span>
                    </div>
                </div>
            </div>

            {/* Filter Kategori */}
            {products.length > 0 && (
                <div className="category-section">
                    <h2>Kategori Produk</h2>
                    <div className="category-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Produk Terbaru */}
            <div className="products-section">
                <div className="section-header">
                    <h2>
                        <i className="fas fa-fire" style={{ color: '#e74c3c' }}></i>
                        Produk Terbaru
                    </h2>
                    <a href="/produk" className="view-all">
                        Lihat Semua <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
                
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Memuat produk...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>
                            Coba Lagi
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-box-open"></i>
                        <p>Tidak ada produk</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <img 
                                        src={product.gambar || fallbackImage} 
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = fallbackImage;
                                        }}
                                    />
                                    {product.stock < 10 && (
                                        <span className="product-stock-badge">
                                            Stok {product.stock}
                                        </span>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="product-category">
                                        {product.category_name || 'Produk'}
                                    </p>
                                    <p className="product-desc">
                                        {product.description || 'Tidak ada deskripsi'}
                                    </p>
                                    <div className="product-price">
                                        {formatHarga(product.price)}
                                    </div>
                                    <div className="product-actions">
                                        <button className="btn-small">
                                            <i className="fas fa-shopping-cart"></i> 
                                            Keranjang
                                        </button>
                                        <button className="btn-wishlist">
                                            <i className="far fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;