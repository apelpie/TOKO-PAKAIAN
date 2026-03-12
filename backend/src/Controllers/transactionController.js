const pool = require('../db/pool');

// Helper function untuk cek akses transaksi
const checkTransactionAccess = async (transactionId, user) => {
  const trx = await pool.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
  if (trx.rows.length === 0) {
    return { error: 'Transaksi tidak ditemukan', status: 404 };
  }
  
  const transaction = trx.rows[0];
  
  if (user.role === "pelanggan" && transaction.customer_id !== user.id_user) {
    return { error: "Akses ditolak", status: 403 };
  }
  
  return { transaction };
};

// ========== TRANSACTIONS ==========
exports.getAllTransactions = async (req, res) => {
  try {
    let query = 'SELECT * FROM transactions ORDER BY id DESC';
    let params = [];
    
    // Jika pelanggan, hanya lihat transaksinya sendiri
    if (req.user.role === "pelanggan") {
      query = 'SELECT * FROM transactions WHERE customer_id = $1 ORDER BY id DESC';
      params = [req.user.id_user];
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil transaksi' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const access = await checkTransactionAccess(req.params.id, req.user);
    if (access.error) {
      return res.status(access.status).json({ message: access.error });
    }

    // Ambil items juga
    const items = await pool.query(
      'SELECT * FROM transaction_items WHERE transaction_id = $1',
      [req.params.id]
    );

    res.json({
      ...access.transaction,
      items: items.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil transaksi' });
  }
};

exports.createTransaction = async (req, res) => {
  const { items, paid, cashier_id, customer_id } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Hitung total dari items
    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Insert transaction
    const trxResult = await client.query(
      `INSERT INTO transactions (total, paid, cashier_id, customer_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [total, paid, cashier_id || req.user.id_user, customer_id]
    );

    const transaction = trxResult.rows[0];

    // Insert items
    for (const item of items) {
      await client.query(
        `INSERT INTO transaction_items (transaction_id, product_id, qty, price)
         VALUES ($1, $2, $3, $4)`,
        [transaction.id, item.product_id, item.qty, item.price]
      );
    }

    await client.query('COMMIT');

    // Ambil items yang baru saja diinsert
    const itemsResult = await client.query(
      'SELECT * FROM transaction_items WHERE transaction_id = $1',
      [transaction.id]
    );

    res.status(201).json({
      message: 'Transaksi berhasil ditambahkan',
      transaction: {
        ...transaction,
        items: itemsResult.rows
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Gagal menambah transaksi' });
  } finally {
    client.release();
  }
};

exports.updateTransaction = async (req, res) => {
  const { items, paid } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const access = await checkTransactionAccess(req.params.id, req.user);
    if (access.error) {
      await client.query('ROLLBACK');
      return res.status(access.status).json({ message: access.error });
    }

    // Hitung total baru dari items
    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update transaction
    await client.query(
      'UPDATE transactions SET total = $1, paid = $2, update_at = CURRENT_TIMESTAMP WHERE id = $3',
      [total, paid, req.params.id]
    );

    // Hapus items lama
    await client.query('DELETE FROM transaction_items WHERE transaction_id = $1', [req.params.id]);

    // Insert items baru
    for (const item of items) {
      await client.query(
        `INSERT INTO transaction_items (transaction_id, product_id, qty, price)
         VALUES ($1, $2, $3, $4)`,
        [req.params.id, item.product_id, item.qty, item.price]
      );
    }

    await client.query('COMMIT');

    res.json({ message: 'Transaksi berhasil diperbarui' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui transaksi' });
  } finally {
    client.release();
  }
};

exports.deleteTransaction = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const access = await checkTransactionAccess(req.params.id, req.user);
    if (access.error) {
      await client.query('ROLLBACK');
      return res.status(access.status).json({ message: access.error });
    }

    // Hapus items dulu (ON DELETE CASCADE di DB sebenarnya sudah otomatis)
    await client.query('DELETE FROM transaction_items WHERE transaction_id = $1', [req.params.id]);
    
    // Hapus transaction
    await client.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);

    await client.query('COMMIT');

    res.json({ message: 'Transaksi berhasil dihapus' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus transaksi' });
  } finally {
    client.release();
  }
};

// ========== GET ITEMS BY TRANSACTION ID ==========
exports.getItemsByTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transaction_id;
    
    // Ambil transaksi dulu untuk cek akses
    const trx = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [transactionId]
    );

    if (trx.rows.length === 0) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    const transaksi = trx.rows[0];

    // Cek akses: Pelanggan hanya boleh melihat transaksi miliknya sendiri
    if (req.user.role === "pelanggan" && transaksi.customer_id !== req.user.id_user) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    // Admin & Kasir aman, lanjutkan ambil items
    const result = await pool.query(
      'SELECT * FROM transaction_items WHERE transaction_id = $1',
      [transactionId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data item transaksi' });
  }
};

// ========== ITEM OPERATIONS (opsional, jika masih perlu endpoint terpisah) ==========
exports.addItem = async (req, res) => {
  const { product_id, qty, price } = req.body;
  const transactionId = req.params.transaction_id;

  try {
    // Cek akses ke transaction
    const access = await checkTransactionAccess(transactionId, req.user);
    if (access.error) {
      return res.status(access.status).json({ message: access.error });
    }

    const result = await pool.query(
      `INSERT INTO transaction_items (transaction_id, product_id, qty, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [transactionId, product_id, qty, price]
    );

    // Update total transaction
    await pool.query(
      `UPDATE transactions 
       SET total = total + ($2 * $3), update_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [transactionId, price, qty]
    );

    res.status(201).json({
      message: 'Item berhasil ditambahkan',
      item: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambah item' });
  }
};

exports.updateItem = async (req, res) => {
  const { qty, price } = req.body;
  const itemId = req.params.id;

  try {
    // Ambil item lama untuk hitung selisih
    const oldItem = await pool.query('SELECT * FROM transaction_items WHERE id = $1', [itemId]);
    if (oldItem.rows.length === 0) {
      return res.status(404).json({ message: 'Item tidak ditemukan' });
    }

    const oldQty = oldItem.rows[0].qty;
    const oldPrice = oldItem.rows[0].price;
    const transactionId = oldItem.rows[0].transaction_id;

    // Cek akses ke transaction
    const access = await checkTransactionAccess(transactionId, req.user);
    if (access.error) {
      return res.status(access.status).json({ message: access.error });
    }

    // Update item
    const result = await pool.query(
      `UPDATE transaction_items 
       SET qty = COALESCE($1, qty),
           price = COALESCE($2, price),
           update_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [qty, price, itemId]
    );

    // Hitung selisih total
    const newQty = qty || oldQty;
    const newPrice = price || oldPrice;
    const oldTotal = oldQty * oldPrice;
    const newTotal = newQty * newPrice;
    const diff = newTotal - oldTotal;

    // Update total transaction
    await pool.query(
      `UPDATE transactions 
       SET total = total + $1, update_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [diff, transactionId]
    );

    res.json({ 
      message: 'Item berhasil diperbarui', 
      item: result.rows[0] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    // Ambil item untuk dapat transaction_id
    const item = await pool.query('SELECT * FROM transaction_items WHERE id = $1', [req.params.id]);
    if (item.rows.length === 0) {
      return res.status(404).json({ message: 'Item tidak ditemukan' });
    }

    const transactionId = item.rows[0].transaction_id;
    const itemTotal = item.rows[0].qty * item.rows[0].price;

    // Cek akses ke transaction
    const access = await checkTransactionAccess(transactionId, req.user);
    if (access.error) {
      return res.status(access.status).json({ message: access.error });
    }

    // Hapus item
    await pool.query('DELETE FROM transaction_items WHERE id = $1', [req.params.id]);

    // Update total transaction
    await pool.query(
      `UPDATE transactions 
       SET total = total - $1, update_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [itemTotal, transactionId]
    );

    res.json({ message: 'Item berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus item' });
  }
};