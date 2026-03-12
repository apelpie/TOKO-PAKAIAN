// src/db/pool.js baru 
const { Pool } = require('pg');
require('dotenv').config(); // Baca file .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // WAJIB untuk Supabase!
  }
});

// Test koneksi (opsional, buat debug)
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err.message);
  } else {
    console.log('✅ Berhasil konek ke Supabase');
    release();
  }
});

module.exports = pool;

// src/db/pool.js lama
// const { Pool } = require('pg');
// require('dotenv').config();

// Implementasi Pool koneksi
// const pool = new Pool({
    // host: process.env.DB_HOST || 'localhost',
    // port: process.env.DB_PORT || 5433,
    // user: process.env.DB_USER || 'postgres',
    // password: process.env.DB_PASSWORD || 'postgres',
    // database: process.env.DB_DATABASE || 'tokopakaian' // Sesuai nama DB 
// });

// module.exports = pool ;