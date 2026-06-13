// routes/personelRoutes.js
const express = require('express');
const router  = express.Router();

const personelController = require('../controllers/personelController');
const kimlikDogrula      = require('../middleware/authMiddleware');
const rolIzinVer         = require('../middleware/roleMiddleware');

router.use(kimlikDogrula);

/**
 * @swagger
 * tags:
 *   name: Personel
 *   description: Personel yönetimi
 */

/**
 * @swagger
 * /api/personel:
 *   get:
 *     summary: Tüm personeli listeler
 *     tags: [Personel]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firmaId
 *         schema:
 *           type: string
 *         description: Belirli bir firmaya ait personeli filtreler
 *     responses:
 *       200:
 *         description: Personel listesi döner
 *       401:
 *         description: Token geçersiz veya eksik
 *   post:
 *     summary: Yeni personel ekler
 *     tags: [Personel]
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
 *               - soyad
 *               - tcKimlik
 *               - firma
 *             properties:
 *               ad:
 *                 type: string
 *               soyad:
 *                 type: string
 *               tcKimlik:
 *                 type: string
 *                 description: 11 haneli TC Kimlik No (Mernis algoritmasıyla doğrulanır)
 *               gorev:
 *                 type: string
 *               iseGirisTarihi:
 *                 type: string
 *                 format: date
 *               firma:
 *                 type: string
 *                 description: Firma MongoDB ID
 *     responses:
 *       201:
 *         description: Personel başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz TC Kimlik No veya eksik alan
 *       403:
 *         description: Yetkisiz erişim
 */
router.get('/', personelController.tumPersonel);
router.post('/', rolIzinVer('sistem_yoneticisi', 'isg_uzmani'), personelController.personelEkle);

/**
 * @swagger
 * /api/personel/uyarilar:
 *   get:
 *     summary: Süresi yaklaşan veya geçen muayene/sertifika uyarılarını listeler
 *     tags: [Personel]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uyarı listesi döner (kırmızı/sarı öncelik renklendirmesiyle)
 */
router.get('/uyarilar', personelController.personelUyarilari);

/**
 * @swagger
 * /api/personel/{id}:
 *   get:
 *     summary: Belirli bir personeli getirir
 *     tags: [Personel]
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
 *         description: Personel bilgisi döner
 *       404:
 *         description: Personel bulunamadı
 *   put:
 *     summary: Personel bilgilerini günceller
 *     tags: [Personel]
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
 *               soyad:
 *                 type: string
 *               gorev:
 *                 type: string
 *     responses:
 *       200:
 *         description: Personel başarıyla güncellendi
 *       404:
 *         description: Personel bulunamadı
 *   delete:
 *     summary: Personeli siler
 *     tags: [Personel]
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
 *         description: Personel başarıyla silindi
 *       404:
 *         description: Personel bulunamadı
 */
router.get('/:id', personelController.personelGetir);
router.put('/:id', rolIzinVer('sistem_yoneticisi', 'isg_uzmani'), personelController.personelGuncelle);
router.delete('/:id', rolIzinVer('sistem_yoneticisi', 'isg_uzmani'), personelController.personelSil);

module.exports = router;