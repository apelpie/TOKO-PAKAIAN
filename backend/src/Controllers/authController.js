const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ pesan: "User tidak ditemukan" });
    }

    const data = user.rows[0];

    // 🚫 Cek apakah user sudah dinonaktifkan
    if (data.role === "inactive") {
      return res.status(403).json({ pesan: "Akun Anda sudah dinonaktifkan" });
    }

    const valid = await bcrypt.compare(password, data.password);
    if (!valid) {
      return res.status(401).json({ pesan: "Password salah" });
    }

    // ACCESS TOKEN (1 jam)
    const accessToken = jwt.sign(
      {
        id_user: data.id_user,
        role: data.role,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // REFRESH TOKEN (7 hari)
    const refreshToken = jwt.sign(
      {
        id_user: data.id_user,
        role: data.role,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      pesan: "Login berhasil",
      accessToken,
      refreshToken,
      // TAMBAHKAN OBJEK USER DI BAWAH INI:
      user: {
        name: data.name, // Ini mengambil kolom 'name' dari tabel users di DB
        role: data.role  // Ini mengambil kolom 'role' dari tabel users di DB
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ pesan: "Gagal login" });
  }
};

exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: 'Refresh token tidak ditemukan' });
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            {
                id_user: payload.id_user,  // ✔ gunakan id_user
                role: payload.role
            },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        res.status(401).json({
            message: 'Refresh token tidak valid atau kadaluarsa'
        });
    }
};

exports.logout = (req, res) => {
    res.json({
        message: 'Logout berhasil (client cukup hapus token di sisi front-end)'
    });
};
