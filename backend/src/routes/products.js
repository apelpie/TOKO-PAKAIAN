/**
 * @swagger
 * tags:
 *   name: Products
 *   description: CRUD produk pakaian
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Ambil semua produk
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Daftar produk
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Ambil produk berdasarkan ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Produk ditemukan
 *       404:
 *         description: Produk tidak ditemukan
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tambah produk baru (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kaos Polos
 *               price:
 *                 type: number
 *                 example: 50000
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               stock:
 *                 type: number
 *                 example: 30
 *               description:
 *                 type: string
 *                 example: Kaos Polos
 *     responses:
 *       201:
 *         description: Produk berhasil ditambahkan
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update produk (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk yang ingin diupdate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kaos Polos
 *               price:
 *                 type: number
 *                 example: 50000
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               stock:
 *                 type: number
 *                 example: 30
 *               description:
 *                 type: string
 *                 example: Kaos Polos
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *       404:
 *         description: Produk tidak ditemukan
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Hapus produk (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk yang ingin dihapus
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const product = require("../controllers/productController");

router.get("/", auth.authenticate, auth.authorize(["admin"]), product.getAllProducts);
router.get("/:id", auth.authenticate, auth.authorize(["admin"]), product.getProductById);
router.post("/", auth.authenticate, auth.authorize(["admin"]), product.createProduct);
router.put("/:id", auth.authenticate, auth.authorize(["admin"]), product.updateProduct);
router.delete("/:id", auth.authenticate, auth.authorize(["admin"]), product.deleteProduct);

module.exports = router;
