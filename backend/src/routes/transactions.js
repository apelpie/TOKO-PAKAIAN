/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Pengelolaan transaksi lengkap dengan itemnya
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionItem:
 *       type: object
 *       properties:
 *         product_id:
 *           type: integer
 *           example: 1
 *         qty:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 50000
 *     Transaction:
 *       type: object
 *       properties:
 *         paid:
 *           type: number
 *           example: 100000
 *         cashier_id:
 *           type: integer
 *           example: 1
 *         customer_id:
 *           type: integer
 *           example: 2
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TransactionItem'
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil semua transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua transaksi
 *       403:
 *         description: Akses ditolak
 */

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Ambil transaksi berdasarkan ID (termasuk item-itemnya)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil transaksi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Transaction'
 *                 - type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     total:
 *                       type: number
 *                     transaction_date:
 *                       type: string
 *                       format: date
 *       404:
 *         description: Transaksi tidak ditemukan
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Buat transaksi baru beserta item-itemnya
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaksi berhasil ditambahkan
 *       500:
 *         description: Gagal menambah transaksi
 */

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update transaksi dan item-itemnya
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paid:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TransactionItem'
 *     responses:
 *       200:
 *         description: Transaksi berhasil diperbarui
 *       500:
 *         description: Gagal memperbarui transaksi
 */

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Hapus transaksi beserta item-itemnya
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *       500:
 *         description: Gagal menghapus transaksi
 */

/**
 * @swagger
 * /transactions/{transaction_id}/items:
 *   get:
 *     summary: Ambil semua item berdasarkan transaction_id
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID transaksi untuk mengambil itemnya
 *     responses:
 *       200:
 *         description: Berhasil mengambil item transaksi
 *       403:
 *         description: Akses ditolak
 *       404:
 *         description: Transaksi tidak ditemukan
 */

/**
 * @swagger
 * /transactions/{transaction_id}/items:
 *   post:
 *     summary: Tambah item ke transaksi yang sudah ada
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionItem'
 *     responses:
 *       201:
 *         description: Item berhasil ditambahkan
 */

/**
 * @swagger
 * /transactions/items/{id}:
 *   put:
 *     summary: Update item transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qty:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item berhasil diperbarui
 */

/**
 * @swagger
 * /transactions/items/{id}:
 *   delete:
 *     summary: Hapus item transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item berhasil dihapus
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const trx = require("../controllers/transactionController");

// Transaction routes (dengan items)
router.get("/", auth.authenticate, trx.getAllTransactions);
router.get("/:id", auth.authenticate, trx.getTransactionById);
router.post("/", auth.authenticate, auth.authorize(["kasir"]), trx.createTransaction);
router.put("/:id", auth.authenticate, auth.authorize(["kasir"]), trx.updateTransaction);
router.delete("/:id", auth.authenticate, auth.authorize(["kasir"]), trx.deleteTransaction);

// Item routes (opsional - bisa diakses melalui transaction atau standalone)
router.get("/:transaction_id/items", auth.authenticate, trx.getItemsByTransaction);
router.post("/:transaction_id/items", auth.authenticate, auth.authorize(["kasir"]), trx.addItem);
router.put("/items/:id", auth.authenticate, auth.authorize(["kasir"]), trx.updateItem);
router.delete("/items/:id", auth.authenticate, auth.authorize(["kasir"]), trx.deleteItem);

module.exports = router;