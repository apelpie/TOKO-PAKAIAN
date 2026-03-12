const pool = require('../db/pool');

// GET all products
exports.getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengambil produk' });
    }
};

// GET product by id
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengambil produk' });
    }
};

// CREATE product
exports.createProduct = async (req, res) => {
    try {
        const { name, category_id, price, stock, description } = req.body;
        let image = null;
        
        if (req.file) {
            image = req.file.filename;
        }
        
        const result = await pool.query(
            `INSERT INTO products (name, category_id, price, stock, description, image, created_at, update_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
            [name, category_id, price, stock, description || '', image]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal menambah produk' });
    }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category_id, price, stock, description } = req.body;
        
        // Cek produk ada
        const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        
        let image = existing.rows[0].image;
        if (req.file) {
            image = req.file.filename;
        }
        
        const result = await pool.query(
            `UPDATE products 
             SET name = $1, category_id = $2, price = $3, stock = $4, 
                 description = $5, image = $6, update_at = NOW() 
             WHERE id = $7 RETURNING *`,
            [name, category_id, price, stock, description || '', image, id]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengupdate produk' });
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
