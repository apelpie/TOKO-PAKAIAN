import React from 'react';

// Komponen ini menerima data 'product' sebagai props
const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  return (
    <div className="item-card">
      <div className="item-image-container">
        <img src={product.gambar} alt={product.nama} className="product-img" />
      </div>
      
      <div className="item-details">
        <h3 className="item-name">{product.nama}</h3>
        <p className="item-price">Rp {product.harga.toLocaleString()}</p>
        <p className="item-stock">Sisa Stok: {product.stok}</p>
        
        <div className="action-buttons">
          {/* Tambahkan onClick={onBuyNow} di sini */}
          <button className="buy-now-btn" onClick={onBuyNow}>
            Beli Sekarang
          </button>
          
          {/* Tambahkan onClick={onAddToCart} di sini */}
          <button className="cart-icon-btn" onClick={onAddToCart}>
            🛒
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;