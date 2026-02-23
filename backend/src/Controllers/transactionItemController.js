const pool = require('../db/pool');

exports.getItemsByTransaction = async (req, res) => {
  try {
    // Ambil transaksi dulu
    const trx = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [req.params.transaction_id]
    );

    if (trx.rows.length === 0) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    const transaksi = trx.rows[0];

    // ❗ Pelanggan hanya boleh melihat transaksi miliknya sendiri
    if (req.user.role === "pelanggan" && transaksi.customer_id !== req.user.id_user) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    // Admin & Kasir aman, lanjutkan
    const result = await pool.query(
      'SELECT * FROM transaction_items WHERE transaction_id = $1',
      [req.params.transaction_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data item transaksi' });
  }
};

// Tambah item ke transaksi
exports.addItem = async (req, res) => {
  const { transaction_id, product_id, qty, price } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO transaction_items (transaction_id, product_id, qty, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [transaction_id, product_id, qty, price]
    );

    res.status(201).json({
      message: 'Item berhasil ditambahkan ke transaksi',
      item: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambah item transaksi' });
  }
};

// Update item transaksi
exports.updateItem = async (req, res) => {
  const { product_id, qty, price } = req.body;

  try {
    const result = await pool.query(
      `UPDATE transaction_items 
       SET product_id = COALESCE($1, product_id),
           qty = COALESCE($2, qty),
           price = COALESCE($3, price),
           update_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [product_id, qty, price, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    res.json({ message: "Item berhasil diperbarui", item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui item transaksi" });
  }
};

// Hapus item transaksi
exports.deleteItem = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM transaction_items WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    res.json({ message: "Item berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus item transaksi" });
  }
};
