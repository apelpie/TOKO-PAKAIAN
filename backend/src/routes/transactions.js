/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Pengelolaan transaksi
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil semua transaksi
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua transaksi
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Buat transaksi baru
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total:
 *                 type: number
 *                 example: 100000
 *               paid:
 *                 type: number
 *                 example: 100000
 *               cashier_id:
 *                 type: integer
 *                 example: 1
 *               customer_id:
 *                 type: integer
 *                 example: 1
 
 *     responses:
 *       201:
 *         description: Transaksi berhasil ditambahkan
 *       500:
 *         description: Gagal menambah transaksi
 */

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Ambil transaksi berdasarkan ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID transaksi
 *     responses:
 *       200:
 *         description: Transaksi berhasil diambil
 *       404:
 *         description: Transaksi tidak ditemukan
 */

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update transaksi berdasarkan ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID transaksi yang ingin diupdate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total:
 *                 type: number
 *                 example: 150000
 *               paid:
 *                 type: number
 *                 example: 160000
 *     responses:
 *       200:
 *         description: Transaksi berhasil diperbarui
 *       500:
 *         description: Gagal memperbarui transaksi
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const trx = require("../controllers/transactionController");

router.get("/", auth.authenticate, auth.authorize(["admin", "kasir"]), trx.getAllTransactions);
router.get("/:id", auth.authenticate, auth.authorize(["kasir", "pelanggan"]), trx.getTransactionById);
router.post("/", auth.authenticate, auth.authorize(["kasir"]), trx.createTransaction);
router.put("/:id", auth.authenticate, auth.authorize(["kasir"]), trx.updateTransaction);

module.exports = router;
