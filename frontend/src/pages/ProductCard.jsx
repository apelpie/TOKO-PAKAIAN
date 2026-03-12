import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // product = { id, name, price, image, category }
  
  return (
    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <i className="fas fa-tshirt" style={{ fontSize: '40px', color: '#ccc' }}></i>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-price">
          Rp {product.price.toLocaleString('id-ID')}
        </div>
        <button className="btn-small">
          <i className="fas fa-shopping-cart"></i> Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;