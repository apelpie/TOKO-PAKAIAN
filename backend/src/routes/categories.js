/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: CRUD kategori pakaian
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Ambil semua kategori
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Daftar kategori
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Ambil kategori berdasarkan ID
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Kategori ditemukan
 *       404:
 *         description: Tidak ditemukan
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tambah kategori baru (admin)
 *     tags: [Categories]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategori berhasil ditambahkan
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori yang ingin diupdate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kemeja Pria
 *               description:
 *                 type: string
 *                 example: Kategori pakaian pria
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       404:
 *         description: Kategori tidak ditemukan
 *       500:
 *         description: Gagal memperbarui kategori
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Hapus kategori (admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori yang ingin dihapus
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 *       500:
 *         description: Gagal menghapus kategori
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const category = require("../Controllers/categoryController");

router.get("/", auth.authenticate, auth.authorize(["admin"]), category.getAllCategories);
router.get("/:id", auth.authenticate, auth.authorize(["admin"]), category.getCategoryById);
router.post("/", auth.authenticate, auth.authorize(["admin"]), category.createCategory);
router.put("/:id", auth.authenticate, auth.authorize(["admin"]), category.updateCategory);
router.delete("/:id", auth.authenticate, auth.authorize(["admin"]), category.deleteCategory);

module.exports = router;
