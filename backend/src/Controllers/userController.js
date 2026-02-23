const bcrypt = require('bcrypt');
const pool = require('../db/pool');

exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id_user, username, role FROM users WHERE id_user = $1', 
            [req.user.id_user]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengambil profil' });
    }
};


exports.register = async (req, res) => {
    const { name, username, email, password, role } = req.body;
    try {
        // cek username/email
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) return res.status(400).json({ message: 'Username sudah terpakai' });

        const existingEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingEmail.rows.length > 0) return res.status(400).json({ message: 'Email sudah terpakai' });

        // hash password
        const hash = await bcrypt.hash(password, 10);

        // insert user
        await pool.query(
            'INSERT INTO users (name, username, email, password, role) VALUES ($1, $2, $3, $4, $5)',
            [name, username, email, hash, role]
        );

        res.status(201).json({ message: 'User berhasil didaftarkan' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mendaftarkan user' });
    }
};

exports.deactivateUser = async (req, res) => {
  const { id_user } = req.body;
  const currentUser = req.user.id_user;
  // ❌ Cegah admin menonaktifkan dirinya sendiri
  if (Number(id_user) === Number(currentUser)) {
    return res.status(403).json({
      pesan: "Admin tidak boleh menonaktifkan dirinya sendiri"
    });
  }
  try {
    const result = await pool.query(
      "UPDATE users SET role = 'inactive' WHERE id_user = $1 RETURNING id_user, username, role",
      [id_user]
    );
    if (!result.rows.length) {
      return res.status(404).json({ pesan: "User tidak ditemukan" });
    }
    res.json({
      pesan: "User berhasil dinonaktifkan",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("DEACTIVATE USER ERROR:", err);
    res.status(500).json({ pesan: "Terjadi kesalahan saat menonaktifkan user" });
  }
};

exports.activateUser = async (req, res) => {
    const { id_user } = req.body; 
    const currentUser = req.user.id_user; // admin yang sedang login

    try {
        if (Number(id_user) === Number(currentUser)) {
            return res.status(400).json({
                message: 'Admin tidak dapat mengaktifkan akunnya sendiri'
            });
        }

        // update role dari 'inactive' menjadi 'pelanggan' (atau role default)
        const result = await pool.query(
            'UPDATE users SET role = $1 WHERE id_user = $2 RETURNING *',
            ['pelanggan', id_user] // ganti 'pelanggan' sesuai role default
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json({ message: 'User berhasil diaktifkan', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengaktifkan user' });
    }
};
