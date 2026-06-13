// routes/egitimRoutes.js
const express = require('express');
const router = express.Router();
const egitimController = require('../controllers/egitimController');

// 1. DÜZELTME: Süslü parantezler kaldırıldı!
const kimlikDogrula = require('../middleware/authMiddleware');
const rolIzinVer = require('../middleware/roleMiddleware');

const YAZMA_ROLLERI = ['sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'];

// Token doğrulaması tüm rotalar için geçerli
router.use(kimlikDogrula);

/**
 * @swagger
 * tags:
 *   name: Eğitimler
 *   description: İSG eğitim planlama ve takibi
 */

/**
 * @swagger
 * /api/egitimler:
 *   get:
 *     summary: Tüm eğitimleri listeler
 *     tags: [Eğitimler]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firmaId
 *         schema:
 *           type: string
 *         description: Belirli bir firmaya ait eğitimleri filtreler
 *     responses:
 *       200:
 *         description: Eğitim listesi döner (durum; Planlandı / Tamamlandı / İptal / Tarih Geçti)
 *       401:
 *         description: Token geçersiz veya eksik
 *   post:
 *     summary: Yeni eğitim planlar
 *     tags: [Eğitimler]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firma
 *               - tarih
 *             properties:
 *               firma:
 *                 type: string
 *                 description: Firma MongoDB ID
 *               egitimTuru:
 *                 type: string
 *                 description: Eğitim türü ID
 *               egitmenAdi:
 *                 type: string
 *               tarih:
 *                 type: string
 *                 format: date
 *               katilimciSayisi:
 *                 type: number
 *               mailGonder:
 *                 type: boolean
 *                 description: true ise firmaya e-posta bildirimi gönderilir
 *     responses:
 *       201:
 *         description: Eğitim başarıyla planlandı
 *       400:
 *         description: Geçersiz istek verisi
 */
router.route('/')
    .get(egitimController.tumEgitimler)
    .post(rolIzinVer(...YAZMA_ROLLERI), egitimController.egitimEkle);

/**
 * @swagger
 * /api/egitimler/{id}:
 *   put:
 *     summary: Eğitim kaydını günceller
 *     tags: [Eğitimler]
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
 *               durum:
 *                 type: string
 *                 enum: [Planlandı, Tamamlandı, İptal]
 *               tarih:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Eğitim başarıyla güncellendi
 *       404:
 *         description: Eğitim bulunamadı
 *   delete:
 *     summary: Eğitim kaydını siler
 *     tags: [Eğitimler]
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
 *         description: Eğitim başarıyla silindi
 *       404:
 *         description: Eğitim bulunamadı
 */
router.route('/:id')
    .put(rolIzinVer(...YAZMA_ROLLERI), egitimController.egitimGuncelle)
    .delete(rolIzinVer(...YAZMA_ROLLERI), egitimController.egitimSil);

module.exports = router;