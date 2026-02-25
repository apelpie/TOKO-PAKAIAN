// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../pages/ProductCard"; 
import "./Dashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import fotoKaos from "../assets/kaos-putih.jpeg";
import fotoKemeja from "../assets/kemeja-merah.jpeg";
import fotoCardigan from "../assets/cardigan-rajut.jpeg";
import fotoPinggang from "../assets/ikat-pinggang-kulit.jpeg";
import fotoJaket from "../assets/jaket-denim.jpeg";
import fotoJeans from "../assets/jeans-pria.jpeg";
import fotoRok from "../assets/rok-hitam.jpeg";
import fotoTopi from "../assets/topi-baseball.jpeg";

function Dashboard() {
  const navigate = useNavigate();

  const [view, setView] = useState("katalog"); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const namaUser = localStorage.getItem("name");
  const roleUser = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const products = [
    { id: 1, nama: 'Kaos Polos Putih', harga: 75000, stok: 30, desc: 'Kaos bahan katun putih polos', gambar: fotoKaos },
    { id: 2, nama: 'Kemeja Flanel Merah', harga: 120000, stok: 15, desc: 'Kemeja flanel motif kotak merah', gambar: fotoKemeja },
    { id: 3, nama: 'Celana Jeans Pria', harga: 200000, stok: 25, desc: 'Celana jeans denim biru', gambar: fotoJeans },
    { id: 4, nama: 'Rok Hitam Pendek', harga: 95000, stok: 10, desc: 'Rok pendek bahan katun hitam', gambar: fotoRok },
    { id: 5, nama: 'Topi Baseball', harga: 50000, stok: 25, desc: 'Topi gaya baseball warna hitam', gambar: fotoTopi },
    { id: 6, nama: 'Ikat Pinggang Kulit', harga: 85000, stok: 10, desc: 'Ikat pinggang kulit coklat', gambar: fotoPinggang },
    { id: 7, nama: 'Jaket Denim', harga: 220000, stok: 14, desc: 'Jaket denim biru kancing logam', gambar: fotoJaket},
    { id: 8, nama: 'Cardigan Rajut', harga: 150000, stok: 12, desc: 'Cardigan rajut warna cream', gambar: fotoCardigan },
  ];

const handleAddToCart = (item) => {
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);
  if (existingItem) {
    setCart(cart.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
    ));
  } else {
    setCart([...cart, { ...item, qty: 1 }]);
  }
};

const updateQuantity = (id, delta) => {
  setCart(cart.map((item) => {
    if (item.id === id) {
      const newQty = item.qty + delta;
      return { ...item, qty: newQty > 0 ? newQty : 1 }; 
    }
    return item;
  }));
};

const removeFromCart = (id) => {
  setCart(cart.filter((item) => item.id !== id));
};

const handleCheckoutAll = () => {
  alert("Pesanan Berhasil!");
  setCart([]);
  setView("katalog"); 
};

const totalPrice = cart.reduce((acc, item) => acc + (item.harga * item.qty), 0);

  const handleBuyNow = (item) => {
    setSelectedProduct(item);
    setView("checkout"); 
  };

const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

const handleDeleteProduct = (id) => {
  if (window.confirm("Yakin ingin menghapus produk ini dari katalog?")) {
    // Di M4 nanti, ini akan disambungkan ke API/Database
    alert(`Produk dengan ID ${id} berhasil dihapus.`);
  }
};

const handleEditProduct = (item) => {
  setSelectedProduct(item);
  setView("edit-produk"); // View baru untuk form edit nanti
};

  return (
    <div className="dashboard-wrapper">
      {view === "katalog" && (
        <Navbar 
          onBrandClick={setView} 
          cartCount={cart.length} 
          onCartClick={() => setView("keranjang")}
          onLogout={handleLogout} 
        />
      )}

    {view === "katalog" && (
      <>
          <div className="hero-container">
            <div className="hero-card">
              <div className="hero-content">
                <div className="hero-welcome-group">
                  <p className="hero-welcome">
                    Selamat datang, <strong>{namaUser}</strong>
                  </p>
                  <p className="hero-role">
                    Sebagai <strong>{roleUser}</strong> di Daphne's.
                  </p>
                </div>
                <h1 className="hero-title">Temukan Gaya Terbaikmu di Daphne's</h1>
                <p className="hero-description">
                  Koleksi pakaian eksklusif dengan kualitas premium dan tren terbaru. 
                  Tampil percaya diri setiap hari bersama Daphne's Clothing.
                </p>
                <button className="hero-btn" onClick={() => {
                  const el = document.getElementById("katalog-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}>
                  Beli Sekarang
                </button>
              </div>          
              <div className="hero-image-placeholder">
                 <span className="hero-icon">🛍️</span>
              </div>
            </div>
          </div>
       </>
    )}

      <main className={`main-content ${view !== "katalog" ? "full-screen-view" : ""}`}>
        {view === "katalog" && (
          <>
            <div className="section-intro" id="katalog-section">
              <h3>Katalog Produk Terbaru</h3>
            </div>
           <div className="catalog-grid">
             {products.map((item) => (
                 <div key={item.id} className="product-card-wrapper">
                  key={item.id} 
                  product={item} 
                  onAddToCart={() => handleAddToCart(item)} 
                  onBuyNow={() => handleBuyNow(item)} 
                  <ProductCard product={item} />
                <div className="product-actions-pro">
                 {roleUser === "admin" ? (
                    // Jika Admin: Muncul Tombol Kelola
                    <div className="admin-controls">
                       <button className="edit-btn" onClick={() => handleEditProduct(item)}>📝 Edit</button>
                       <button className="delete-btn" onClick={() => handleDeleteProduct(item.id)}>🗑️ Hapus</button>
                    </div>
                ) : (
                    // Jika User/Customer: Muncul Tombol Belanja
                    <div className="user-controls">
                       <button className="cart-btn" onClick={() => handleAddToCart(item)}>🛒 Keranjang</button>
                       <button className="buy-btn" onClick={() => handleBuyNow(item)}>⚡ Beli</button>
                    </div>
                  )}
               </div>
             </div>
          ))}
       </div>
      </>
    )}

        {view === "checkout" && selectedProduct && (
        <div className="checkout-container-pro">
          <div className="checkout-header">
             <button className="back-link" onClick={() => setView("katalog")}>← Kembali ke Toko</button>
             <h2>Konfirmasi Pesanan</h2>
          </div>
          <div className="checkout-body">
            <div className="product-preview">
              <img src={selectedProduct.gambar} alt={selectedProduct.nama} />
              <div className="product-spec">
                <h3>{selectedProduct.nama}</h3>
                <p className="price-tag">Rp {selectedProduct.harga.toLocaleString()}</p>
              </div>
            </div>
            <div className="payment-summary">
              <h4>Ringkasan Pembayaran</h4>
              <div className="summary-line"><span>Harga Barang</span> <span>Rp {selectedProduct.harga.toLocaleString()}</span></div>
              <div className="summary-line"><span>Biaya Layanan</span> <span>Gratis</span></div>
              <hr />
              <div className="summary-line total"><span>Total Tagihan</span> <span>Rp {selectedProduct.harga.toLocaleString()}</span></div>
              <button className="pay-now-btn" onClick={() => { alert("Pembayaran Berhasil!"); setView("katalog"); }}>Bayar Sekarang</button>
            </div>
          </div>
        </div>
      )}

     {view === "keranjang" && (
       <div className="cart-view">
         <button className="back-btn" onClick={() => setView("katalog")}>← Lanjut Belanja</button>
         <h2>Keranjang Belanja ({cart.length})</h2>
         {cart.length === 0 ? (
         <p>Keranjang masih kosong.</p>
       ) : (
          <div className="cart-container-pro">
            <div className="cart-list">
             {cart.map((item) => (
              <div key={item.id} className="cart-item-row-pro">
                <div className="item-info">
                  <strong>{item.nama}</strong>
                  <span> Rp {item.harga.toLocaleString()}</span>
                </div>
              
                  <div className="item-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <button className="delete-item" onClick={() => removeFromCart(item.id)}>🗑️</button>
                 </div>
              
                  <div className="item-subtotal">
                   Subtotal: Rp {(item.harga * item.qty).toLocaleString()}
                 </div>
               </div>
              ))}
          </div>

        <div className="cart-summary-box">
          <h3>Ringkasan Belanja</h3>
          <div className="summary-line">
            <span>Total Bayar:</span>
            <strong className="total-price-text">Rp {totalPrice.toLocaleString()}</strong>
          </div>
          <button className="confirm-pay-btn" onClick={handleCheckoutAll}>
            Checkout Semua
          </button>
        </div>
      </div>
    )}
  </div>
)}
      </main>
      {view === "katalog" && <Footer onMenuClick={(target) => setView(target)} />}
    </div>
  );
}

export default Dashboard;