import { useState, useEffect } from 'react';
import API from '../../api';
import './AdminCategories.css';

// Modal Tambah/Edit Kategori
const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [category]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Kategori *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Pria, Wanita, Anak"
              required
            />
          </div>

          <div className="form-group">
            <label>Deskripsi (Opsional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Deskripsi kategori..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              {category ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Komponen Utama AdminCategories
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Ambil semua kategori
  // Ambil semua kategori
const fetchCategories = async () => {
  setLoading(true);
  try {
    const response = await API.get('/categories');
    console.log('Categories:', response.data);
    setCategories(response.data);
    
    // Setelah dapat kategori, ambil jumlah produk per kategori
    await fetchProductCounts(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    alert('Gagal memuat data kategori');
  } finally {
    setLoading(false);
  }
};

// Ambil jumlah produk untuk setiap kategori
const fetchProductCounts = async (categories) => {
  try {
    // Ambil semua produk
    const productsResponse = await API.get('/products');
    const allProducts = productsResponse.data;
    
    const counts = {};
    
    // Hitung manual: filter produk berdasarkan category_id
    categories.forEach(category => {
      const count = allProducts.filter(
        product => product.category_id === category.id
      ).length;
      counts[category.id] = count;
    });
    
    console.log('Product counts per category:', counts);
    setProductCounts(counts);
  } catch (error) {
    console.error('Error fetching product counts:', error);
  }
};

  // Alternatif: Kalau ada endpoint khusus untuk hitung produk per kategori
  // const fetchProductCounts = async () => {
  //   try {
  //     const response = await API.get('/categories/product-counts');
  //     const counts = {};
  //     response.data.forEach(item => {
  //       counts[item.category_id] = item.count;
  //     });
  //     setProductCounts(counts);
  //   } catch (error) {
  //     console.error('Error fetching product counts:', error);
  //   }
  // };

  // Tambah kategori
  const addCategory = async (data) => {
    try {
      await API.post('/categories', data);
      alert('Kategori berhasil ditambahkan!');
      setModalOpen(false);
      fetchCategories(); // Refresh data
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Gagal menambahkan kategori');
    }
  };

  // Edit kategori
  const updateCategory = async (id, data) => {
    try {
      await API.put(`/categories/${id}`, data);
      alert('Kategori berhasil diperbarui!');
      setModalOpen(false);
      fetchCategories(); // Refresh data
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Gagal memperbarui kategori');
    }
  };

  // Hapus kategori
  const deleteCategory = async (id) => {
    if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
    
    try {
      await API.delete(`/categories/${id}`);
      alert('Kategori berhasil dihapus!');
      fetchCategories(); // Refresh data
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Gagal menghapus kategori');
    }
  };

  // Load data
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle simpan dari modal
  const handleSaveCategory = (formData) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
  };

  // Dapatkan icon berdasarkan nama kategori
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('atasan') || name.includes('top')) return '👚';
    if (name.includes('bawahan') || name.includes('bottom')) return '🩳';
    if (name.includes('outerwear') || name.includes('outer')) return '🧥';
    if (name.includes('aksesoris') || name.includes('accessory')) return '🕶️';
    if (name.includes('pakaian dalam') || name.includes('underwear')) return '👙';
    return '📦'; // default
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
        <p>Memuat kategori...</p>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      {/* Header */}
      <div className="categories-header">
        <div>
          <h1>Kategori Produk</h1>
          <p className="categories-count">Total {categories.length} kategori</p>
        </div>
        <button 
          className="btn-add"
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
        >
          + Tambah Kategori
        </button>
      </div>

      {/* Grid Kategori */}
      <div className="categories-grid">
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-icon">
                {getCategoryIcon(category.name)}
              </div>
              
              <div className="category-info">
                <h3>{category.name}</h3>
                <p className="category-description">
                  {category.description || 'Tidak ada deskripsi'}
                </p>
                <div className="category-meta">
                  <span className="product-count">
                    {productCounts[category.id] || 0} Produk
                  </span>
                  <span className="created-date">
                    {new Date(category.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="category-actions">
                <button 
                  className="btn-edit"
                  onClick={() => {
                    setEditingCategory(category);
                    setModalOpen(true);
                  }}
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => deleteCategory(category.id)}
                  title="Hapus"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-categories">
            <p>Belum ada kategori</p>
            <button className="btn-add" onClick={() => setModalOpen(true)}>
              + Tambah Kategori Pertama
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default AdminCategories;