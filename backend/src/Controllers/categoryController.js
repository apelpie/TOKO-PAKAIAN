const pool = require('../db/pool');

// GET /categories - semua role bisa (admin, kasir, pelanggan)
exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.status(200).json(result.rows);
   } catch (error) { 
    console.error('Error saat mengambil kategori:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar kategori.' });
  }
};

// GET /categories/:id - semua role bisa (admin, kasir, pelanggan)
exports.getCategoryById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil kategori.' });
  }
};

// POST /categories - hanya admin
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  // ✅ Validasi input: name dan description harus ada
  if (!name || !description) {
    return res.status(400).json({
      pesan: "Data kategori tidak lengkap. 'name' dan 'description' wajib diisi."
    });
  }
  try {
    const result = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json({
      pesan: "Kategori berhasil dibuat.",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    res.status(500).json({ pesan: "Gagal membuat kategori." });
  }
};

// PUT /categories/:id - hanya admin
exports.updateCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });

    res.status(200).json({ message: 'Kategori berhasil diperbarui.', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui kategori.' });
  }
};

exports.deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    // 1. cek apakah kategori dipakai produk
    const checkProduct = await pool.query(
      "SELECT * FROM products WHERE category_id = $1",
      [id]
    );
    if (checkProduct.rows.length > 0) {
      return res.status(400).json({
        message: "Kategori tidak bisa dihapus karena masih dipakai produk"
      });
    }
     // 2. hapus kategori karena aman
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }
    res.json({ message: "Kategori berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus kategori" });
  }
};

