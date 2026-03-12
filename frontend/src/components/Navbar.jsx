import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // ❌ Jangan tampilkan navbar di halaman login
  if (location.pathname === '/login') {
    return null;
  }
  
  return (
    <nav className="navbar">
      <div className="logo">
        Daphne's<span>.</span>
      </div>
      
      {user && ( // ✅ Hanya tampilkan menu jika user sudah login
        <>
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
            <Link to="/produk" className={location.pathname === '/produk' ? 'active' : ''}>Produk</Link>
            <Link to="/tentang" className={location.pathname === '/tentang' ? 'active' : ''}>Tentang</Link>
          </div>
          
          <div className="user-profile">
            <i className="fas fa-user-circle"></i>
            <span>Halo, {user?.name || 'User'}! 🎉</span>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;