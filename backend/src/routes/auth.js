/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Login, Refresh Token, Logout
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: artic
 *               password:
 *                 type: string
 *                 example: rticmonkeys
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Password salah
 *       404:
 *         description: User tidak ditemukan
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Membuat access token baru dari refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token baru berhasil dibuat
 *       401:
 *         description: Refresh token tidak valid
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout berhasil
 */

const express = require("express");
const router = express.Router();
const auth = require("../Controllers/authController");

router.post("/login", auth.login);
router.post("/refresh", auth.refreshToken);
router.post("/logout", auth.logout);

module.exports = router;
