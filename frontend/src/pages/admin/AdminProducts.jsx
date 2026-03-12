import { useState, useEffect } from 'react';
import API from '../../api';
import './AdminProducts.css';

// Modal Detail Produk
const DetailModal = ({ isOpen, onClose, product, categories }) => {
  console.log('DetailModal - isOpen:', isOpen);
  console.log('DetailModal - product:', product);
  console.log('DetailModal - categories:', categories);
  
  if (!isOpen || !product) return null;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  // Dapatkan nama kategori dari ID
  const getCategoryName = (categoryId) => {
    console.log('getCategoryName - looking for ID:', categoryId, 'Type:', typeof categoryId);
    console.log('getCategoryName - categories available:', categories);
    
    if (!categories || !Array.isArray(categories)) {
      console.log('Categories not available or not array');
      return '-';
    }
    
    // Cari dengan perbandingan number
    const category = categories.find(c => c.id === Number(categoryId));
    console.log('Found category:', category);
    
    return category ? category.name : '-';
  };

  // Test panggil fungsi
  const categoryName = getCategoryName(product.category_id);
  console.log('Category name result:', categoryName);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detail Produk</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="detail-content">
          <div className="detail-row">
            <div className="detail-label">Gambar</div>
            <div className="detail-value">
              {product.image ? (
                <img 
                  src={`http://localhost:3000/uploads/${product.image}`}
                  alt={product.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <span className="detail-image">📦</span>
              )}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Nama Produk</div>
            <div className="detail-value">{product.name}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Kategori</div>
            <div className="detail-value">{getCategoryName(product.category_id)}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Harga</div>
            <div className="detail-value">{formatRupiah(product.price)}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Stok</div>
            <div className="detail-value">
              <span className={`stock-badge ${product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'normal'}`}>
                {product.stock} {product.stock === 0 ? '(Habis)' : product.stock <= 5 ? '(Menipis)' : '(Tersedia)'}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <span className={`status-badge ${product.stock > 0 ? 'tersedia' : 'habis'}`}>
                {product.stock > 0 ? 'Tersedia' : 'Habis'}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Deskripsi</div>
            <div className="detail-value description-text">
              {product.description || 'Tidak ada deskripsi'}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">ID Produk</div>
            <div className="detail-value">#{product.id}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Terakhir Update</div>
            <div className="detail-value">
              {new Date(product.update_at || product.created_at).toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Component untuk Tambah/Edit Produk
const ProductModal = ({ isOpen, onClose, product, onSave, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '', // Ubah dari category jadi category_id
    price: '',
    stock: '',
    description: '',
    image: null
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category_id: product.category_id || product.category?.id || '', // Ambil category_id
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        image: null
      });
    } else {
      setFormData({
        name: '',
        category_id: categories[0]?.id || '', // Pakai ID kategori pertama
        price: '',
        stock: '',
        description: '',
        image: null
      });
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Produk *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Kemeja Flanel"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kategori *</label>
              <select 
                name="category_id" 
                value={formData.category_id} 
                onChange={handleChange} 
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Harga *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Rp"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stok *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Gambar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              {product?.image && !formData.image && (
                <small>Gambar lama: {product.image}</small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Deskripsi produk..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              {product ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Komponen Utama AdminProducts
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [stockFilter, setStockFilter] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [categories, setCategories] = useState([]); // Array of {id, name}

  // ========== API CALLS ==========
  
  // GET all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await API.get('/products');
      console.log('Products:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  };

  // GET categories
  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      console.log('Categories:', response.data);
      setCategories(response.data); // Simpan array kategori lengkap dengan id
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // POST new product
  const addProduct = async (productData) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('category_id', productData.category_id); // Kirim category_id
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('description', productData.description || '');
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Produk berhasil ditambahkan!');
      setModalOpen(false);
      fetchProducts(); // Refresh data
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Gagal menambahkan produk');
    }
  };

  // PUT update product
  const updateProduct = async (id, productData) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('category_id', productData.category_id); // Kirim category_id
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('description', productData.description || '');
      if (productData.image) {
        formData.append('image', productData.image);
      }

      const response = await API.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Produk berhasil diperbarui!');
      setModalOpen(false);
      fetchProducts(); // Refresh data
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Gagal memperbarui produk');
    }
  };

  // DELETE product
  const deleteProduct = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    
    try {
      await API.delete(`/products/${id}`);
      alert('Produk berhasil dihapus!');
      fetchProducts(); // Refresh data
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk');
    }
  };

  // GET product by id (untuk detail)
  const getProductById = async (id) => {
    try {
      const response = await API.get(`/products/${id}`);
      setViewingProduct(response.data);
    } catch (error) {
      console.error('Error fetching product detail:', error);
      alert('Gagal memuat detail produk');
    }
  };

  // Load data saat komponen mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Helper: dapatkan nama kategori dari ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '-';
  };

  // Filter produk
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Untuk filter kategori, bandingkan dengan ID
    let matchesCategory = true;
    if (categoryFilter !== 'Semua') {
      matchesCategory = product.category_id === parseInt(categoryFilter);
    }
    
    const matchesStock = 
      stockFilter === 'Semua' ? true :
      stockFilter === 'Tersedia' ? product.stock > 0 :
      stockFilter === 'Habis' ? product.stock === 0 :
      stockFilter === 'Menipis' ? product.stock > 0 && product.stock <= 5 : true;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Handle tambah produk
  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Handle edit produk
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // Handle detail produk
  const handleViewDetail = (product) => {
    console.log('Viewing product:', product);
    getProductById(product.id);
    setDetailModalOpen(true);
    console.log('Modal open set to:', true); 
  };

  // Handle simpan produk (tambah/edit)
  const handleSaveProduct = (formData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
  };

  // Format currency
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  if (loading && products.length === 0) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Memuat produk...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <div>
          <h1>Kelola Produk</h1>
          <p className="products-count">Total {products.length} produk</p>
        </div>
        <button className="btn-add" onClick={handleAddProduct}>
          + Tambah Produk
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="Semua">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select 
            value={stockFilter} 
            onChange={(e) => setStockFilter(e.target.value)}
            className="filter-select"
          >
            <option value="Semua">Semua Stok</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Menipis">Menipis (≤5)</option>
            <option value="Habis">Habis</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
  {filteredProducts.length > 0 ? (
    filteredProducts.map(product => (
      <tr key={product.id}>
        <td className="product-image">
          {product.image ? (
            <img 
              src={`http://localhost:3000/uploads/${product.image}`}
              alt={product.name}
              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
            />
          ) : (
            <span className="image-placeholder">📦</span>
          )}
        </td>
        <td className="product-name">{product.name}</td>
        <td>{getCategoryName(product.category_id)}</td>
        <td className="product-price">{formatRupiah(product.price)}</td>
        <td>
          <span className={`stock-badge ${product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'normal'}`}>
            {product.stock}
          </span>
        </td>
        <td>
          <span className={`status-badge ${product.stock > 0 ? 'tersedia' : 'habis'}`}>
            {product.stock > 0 ? 'Tersedia' : 'Habis'}
          </span>
        </td>
        <td className="action-buttons">
          <button 
            className="btn-view"
            onClick={() => handleViewDetail(product)}
            title="Detail"
          >
            👁️
          </button>
          <button 
            className="btn-edit"
            onClick={() => handleEditProduct(product)}
            title="Edit"
          >
            ✏️
          </button>
          <button 
            className="btn-delete"
            onClick={() => deleteProduct(product.id)}
            title="Hapus"
          >
            🗑️
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="no-data">
        Tidak ada produk yang ditemukan
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
      />

      {/* Modal Detail */}
      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={viewingProduct}
        categories={categories}  // <-- TAMBAHKAN INI!
      />
    </div>
  );
};

export default AdminProducts;