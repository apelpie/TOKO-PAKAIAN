// src/db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

// Implementasi Pool koneksi
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'tokopakaian' // Sesuai nama DB 
});

module.exports = pool ;