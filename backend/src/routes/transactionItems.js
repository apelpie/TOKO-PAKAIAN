/**
 * @swagger
 * tags:
 *   name: Transaction Items
 *   description: Pengelolaan item pada transaksi
 */

/**
 * @swagger
 * /transaction-items/{transaction_id}:
 *   get:
 *     summary: Ambil semua item berdasarkan transaction_id
 *     tags: [Transaction Items]
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
 * /transaction-items:
 *   post:
 *     summary: Tambah item ke transaksi
 *     tags: [Transaction Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_id:
 *                 type: integer
 *               product_id:
 *                 type: integer
 *               qty:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item transaksi berhasil ditambahkan
 *       500:
 *         description: Gagal menambah item transaksi
 */

/**
 * @swagger
 * /transaction-items/{id}:
 *   put:
 *     summary: Update item transaksi
 *     tags: [Transaction Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID item transaksi
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
 *         description: Item transaksi berhasil diperbarui
 *       500:
 *         description: Gagal memperbarui item transaksi
 */

/**
 * @swagger
 * /transaction-items/{id}:
 *   delete:
 *     summary: Hapus item transaksi
 *     tags: [Transaction Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID item transaksi
 *     responses:
 *       200:
 *         description: Item transaksi berhasil dihapus
 *       500:
 *         description: Gagal menghapus item transaksi
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const item = require("../Controllers/transactionItemController");

// Hanya auth.authenticate → rule detail ada di controller
router.get("/:transaction_id", auth.authenticate, item.getItemsByTransaction);
// Kasir boleh tambah item
router.post("/", auth.authenticate, auth.authorize(["kasir"]), item.addItem);
// Kasir boleh update item transaksi
router.put("/:id", auth.authenticate, auth.authorize(["kasir"]), item.updateItem);
// Kasir boleh hapus item
router.delete("/:id", auth.authenticate, auth.authorize(["kasir"]), item.deleteItem);

module.exports = router;
