const pool = require('../db/pool');

exports.getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Gagal mengambil produk' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
        res.json(result.rows[0]);
    } catch {
        res.status(500).json({ message: 'Gagal mengambil produk' });
    }
};

exports.createProduct = async (req, res) => {
    const { name, price, category_id, stock, description } = req.body;
    try {
        await pool.query('INSERT INTO products (name, price, category_id, stock, description) VALUES ($1, $2, $3, $4, $5)', [name, price, category_id, stock, description]);
        res.status(201).json({ message: 'Produk berhasil ditambahkan' });
    } catch {
        res.status(500).json({ message: 'Gagal menambah produk' });
    }
};

exports.updateProduct = async (req, res) => {
    const {name, price, category_id, stock, description} = req.body;
    try {
        await pool.query('UPDATE products SET name=$1, price=$2, category_id=$3, stock=$4, description=$5 WHERE id=$6', [name, price, category_id, stock, description, req.params.id]);
        res.json({ message: 'Produk berhasil diperbarui' });
    } catch {
        res.status(500).json({ message: 'Gagal memperbarui produk' });
    }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    // 1. Cek apakah produk sedang digunakan di transaction_items
    const checkUse = await pool.query(
      `SELECT * FROM transaction_items WHERE product_id = $1`,
      [productId]
    );
    if (checkUse.rows.length > 0) {
      // ❗ Produk sedang dipakai → FAILED
      return res.status(400).json({
        message: "Produk tidak bisa dihapus karena sedang digunakan pada transaksi."
      });
    }
    // 2. Jika tidak dipakai, baru hapus
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }
    res.json({ message: "Produk berhasil dihapus." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus produk." });
  }
};
