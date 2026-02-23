/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manajemen user
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Ambil profil user yang sedang login
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil user berhasil diambil
 *       500:
 *         description: Gagal mengambil profil
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Suci Ganyeng
 *               username:
 *                 type: string
 *                 example: cifael
 *               email:
 *                 type: string
 *                 example: sukasuci@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: kasir
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *       500:
 *         description: Gagal mendaftarkan user
 */

/**
 * @swagger
 * /users/deactivate:
 *   put:
 *     summary: Nonaktifkan user lain (admin tidak bisa nonaktifkan dirinya sendiri)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: User berhasil dinonaktifkan
 *       400:
 *         description: Admin tidak bisa menonaktifkan dirinya sendiri
 *       404:
 *         description: User tidak ditemukan
 */

/**
 * @swagger
 * /users/activate:
 *   put:
 *     summary: Aktifkan user lain (admin tidak bisa aktifkan dirinya sendiri)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_user:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: User berhasil diaktifkan
 *       400:
 *         description: Admin tidak bisa mengaktifkan dirinya sendiri
 *       404:
 *         description: User tidak ditemukan
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const userController = require("../controllers/userController");

router.get("/profile", auth.authenticate, userController.getProfile);
router.post("/register", auth.authenticate, auth.authorize(['admin']), userController.register);
router.put("/deactivate", auth.authenticate, auth.authorize(["admin"]), userController.deactivateUser);
router.put("/activate", auth.authenticate, auth.authorize(["admin"]), userController.activateUser);

module.exports = router;
