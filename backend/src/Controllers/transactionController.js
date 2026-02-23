const pool = require('../db/pool');

exports.getAllTransactions = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "kasir") {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    const result = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil transaksi' });
  }
};


exports.getTransactionById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });

    const trx = result.rows[0];
    // Admin tidak boleh akses transaksi by id
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    if (req.user.role === "pelanggan" && trx.customer_id !== req.user.id_user) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    res.json(trx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil transaksi' });
  }
};

exports.createTransaction = async (req, res) => {
    const { total, paid, cashier_id, customer_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO transactions (total, paid, cashier_id, customer_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [total, paid, cashier_id, customer_id]
        );

        res.status(201).json({
            message: 'Transaksi berhasil ditambahkan',
            transaction: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal menambah transaksi' });
    }
};


exports.updateTransaction = async (req, res) => {
  if (req.user.role !== "kasir") {
    return res.status(403).json({ message: "Akses ditolak" });
  }

  const { total, paid } = req.body; // boleh update total dan paid saja

  try {
    const trx = await pool.query('SELECT * FROM transactions WHERE id=$1', [req.params.id]);
    if (trx.rows.length === 0) return res.status(404).json({ message: 'Transaksi tidak ditemukan' });

    await pool.query(
      'UPDATE transactions SET total=$1, paid=$2 WHERE id=$3',
      [total, paid, req.params.id]
    );

    res.json({ message: 'Transaksi berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui transaksi' });
  }
};
