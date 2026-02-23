// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

// Muat variabel lingkungan
dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware Global
app.use(cors());
app.use(express.json()); // Body parser untuk JSON

// Swagger UI Dokumentasi
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import Route BARU
const authRoutes = require('./src/routes/auth');
const usersRoutes = require('./src/routes/users'); // Untuk /profile
const categoriesRoutes = require('./src/routes/categories');
const productsRoutes = require('./src/routes/products');
const transactionsRoutes = require('./src/routes/transactions');
const transactionItemsRoutes = require("./src/routes/transactionItems");

// Route Utama
app.get('/', (req, res) => {
    res.send('API CITRA Berjalan! 🚀');
});

// Hubungkan Route dengan Prefix API
app.use('/auth', authRoutes); // /api/auth/login, /api/auth/logout

app.use('/users', usersRoutes); // /api/users/profile

app.use('/categories', categoriesRoutes); // /api/categories
app.use('/products', productsRoutes); // /api/products

app.use('/transactions', transactionsRoutes); // /api/transactions
app.use("/transaction-items", transactionItemsRoutes);

// Penanganan 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan. Periksa kembali URL dan metode HTTP Anda.' });
});

// Listener Server
app.listen(port, () => {
    console.log(`✅ Server berjalan di : http://localhost:${port}`);
    console.log(`📘 Dokumentasi Swagger: http://localhost:${port}/api-docs`);
});