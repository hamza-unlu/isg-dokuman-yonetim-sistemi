// routes/firmaRoutes.js
const express = require('express');
const router  = express.Router();

const firmaController = require('../controllers/firmaController');
const kimlikDogrula   = require('../middleware/authMiddleware');
const rolIzinVer      = require('../middleware/roleMiddleware');

// Tüm route'lar korumalı
router.use(kimlikDogrula);

/**
 * @swagger
 * tags:
 *   name: Firmalar
 *   description: Firma yönetimi
 */

/**
 * @swagger
 * /api/firmalar:
 *   get:
 *     summary: Tüm firmaları listeler
 *     tags: [Firmalar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Firma listesi döner
 *       401:
 *         description: Token geçersiz veya eksik
 *   post:
 *     summary: Yeni firma ekler
 *     tags: [Firmalar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ad
 *               - tehlikeSinifi
 *             properties:
 *               ad:
 *                 type: string
 *                 description: Firma adı
 *               tehlikeSinifi:
 *                 type: string
 *                 enum: [Az Tehlikeli, Tehlikeli, Çok Tehlikeli]
 *               calisanSayisi:
 *                 type: number
 *               sgkSicilNo:
 *                 type: string
 *               naceKodu:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Firma başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz istek verisi
 *       403:
 *         description: Yetkisiz erişim
 */
router.get('/', firmaController.tumFirmalar);
router.post('/', rolIzinVer('sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'), firmaController.firmaEkle);

/**
 * @swagger
 * /api/firmalar/{id}:
 *   get:
 *     summary: Belirli bir firmayı getirir
 *     tags: [Firmalar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Firma MongoDB ID
 *     responses:
 *       200:
 *         description: Firma bilgisi döner
 *       404:
 *         description: Firma bulunamadı
 *   put:
 *     summary: Firma bilgilerini günceller
 *     tags: [Firmalar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ad:
 *                 type: string
 *               tehlikeSinifi:
 *                 type: string
 *                 enum: [Az Tehlikeli, Tehlikeli, Çok Tehlikeli]
 *               calisanSayisi:
 *                 type: number
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Firma başarıyla güncellendi
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Firma bulunamadı
 *   delete:
 *     summary: Firmayı siler (yalnızca sistem yöneticisi)
 *     tags: [Firmalar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Firma başarıyla silindi
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Firma bulunamadı
 */
router.get('/:id', firmaController.firmaGetir);
router.put('/:id', rolIzinVer('sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'), firmaController.firmaGuncelle);
router.delete('/:id', rolIzinVer('sistem_yoneticisi'), firmaController.firmaSil);

/**
 * @swagger
 * /api/firmalar/{id}/istatistik:
 *   get:
 *     summary: Firma İSG uyum istatistiklerini döner
 *     tags: [Firmalar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Firma MongoDB ID
 *     responses:
 *       200:
 *         description: Tamamlanan/eksik kart sayıları ve uyum yüzdesi
 *       404:
 *         description: Firma bulunamadı
 */
router.get('/:id/istatistik', firmaController.firmaIstatistik);

module.exports = router;