import React from 'react';
import './Footer.css';

const Footer = ({ onMenuClick }) => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Daphne's</h3>
          <p>Menyediakan pakaian berkualitas dengan harga terjangkau sejak 2023.</p>
        </div>
        <div className="footer-section links">
          <h4>Jelajahi</h4>
          <ul>
            <li onClick={() => onMenuClick('katalog')}>Dashboard</li>
            <li onClick={() => onMenuClick('katalog')}>Produk</li>
            <li onClick={() => onMenuClick('katalog')}>Tentang Kami</li>
            <li onClick={() => onMenuClick('keranjang')}>Keranjang Saya</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Kontak Kami</h4>
          <p>📍 Alamat: Jl. Dago No. 123, Bandung</p>
          <p>📞 WA: 0812-3456-7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Daphne's. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;