import React from 'react';
import { ShoppingCart, LogOut } from 'lucide-react'; // Panggil icon-nya
import './Navbar.css'; // pastikan file CSS ini ada dan di-import!

const Navbar = ({ onBrandClick, cartCount, onCartClick, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => onBrandClick('katalog')}>
        <h2>Daphne's</h2>
      </div>
      
      <ul className="nav-links">
        <li onClick={() => onBrandClick('katalog')}>Dashboard</li>
        <li onClick={() => onBrandClick('katalog')}>Produk</li>
        <li>Tentang</li>
      </ul>

      <div className="nav-actions">
        <div className="nav-cart-container" onClick={onCartClick}>
          <ShoppingCart size={22} strokeWidth={2} />
          {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </div>
        
        {/* Tombol Logout dengan icon */}
        <button className="logout-mini-btn" onClick={onLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;