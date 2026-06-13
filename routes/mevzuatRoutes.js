// routes/mevzuatRoutes.js
const express = require('express');
const router  = express.Router();

const mevzuatController = require('../controllers/mevzuatController');
const kimlikDogrula     = require('../middleware/authMiddleware');
const rolIzinVer        = require('../middleware/roleMiddleware');

// Tüm yollar için token doğrulaması
router.use(kimlikDogrula);

/**
 * @swagger
 * tags:
 *   name: Mevzuat
 *   description: İSG yasal periyot kuralları yönetimi
 */

/**
 * @swagger
 * /api/mevzuat:
 *   get:
 *     summary: Tüm mevzuat kurallarını listeler
 *     tags: [Mevzuat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mevzuat kural listesi döner (tehlike sınıfı, periyot, kategori bilgileriyle)
 *   post:
 *     summary: Yeni mevzuat kuralı ekler (yalnızca sistem yöneticisi)
 *     tags: [Mevzuat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - anahtar
 *               - kategori
 *             properties:
 *               anahtar:
 *                 type: string
 *                 description: Kural tanımlayıcı anahtar (örn. egitim_az_tehlikeli)
 *               kategori:
 *                 type: string
 *                 enum: [egitim, muayene, rv, adp, tatbikat, kurul, ilkyardim, kkd]
 *               tehlikeSinifi:
 *                 type: string
 *                 enum: [Az Tehlikeli, Tehlikeli, Çok Tehlikeli, Hepsi]
 *               periyotGun:
 *                 type: number
 *                 description: Yasal yenileme süresi (gün cinsinden)
 *               aciklama:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kural başarıyla oluşturuldu
 *       403:
 *         description: Yetkisiz erişim
 */
router.get('/', mevzuatController.tumKurallar);
router.post('/', rolIzinVer('sistem_yoneticisi'), mevzuatController.kuralEkle);

/**
 * @swagger
 * /api/mevzuat/gecmis:
 *   get:
 *     summary: Tüm mevzuat değişiklik geçmişini (audit trail) listeler
 *     tags: [Mevzuat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Değişiklik geçmişi döner
 */
router.get('/gecmis', mevzuatController.tumGecmis);

/**
 * @swagger
 * /api/mevzuat/anahtar/{anahtar}:
 *   get:
 *     summary: Anahtar ile tek bir mevzuat kuralını getirir
 *     tags: [Mevzuat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: anahtar
 *         required: true
 *         schema:
 *           type: string
 *         description: Kural anahtarı (örn. egitim_az_tehlikeli)
 *     responses:
 *       200:
 *         description: Kural bilgisi döner
 *       404:
 *         description: Kural bulunamadı
 */
router.get('/anahtar/:anahtar', mevzuatController.anahtarIleGetir);

/**
 * @swagger
 * /api/mevzuat/{id}:
 *   get:
 *     summary: ID ile mevzuat kuralını getirir
 *     tags: [Mevzuat]
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
 *         description: Kural bilgisi döner
 *       404:
 *         description: Kural bulunamadı
 *   put:
 *     summary: Mevzuat kuralını günceller (yalnızca sistem yöneticisi)
 *     tags: [Mevzuat]
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
 *               periyotGun:
 *                 type: number
 *               aciklama:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kural başarıyla güncellendi
 *       403:
 *         description: Yetkisiz erişim
 *   delete:
 *     summary: Mevzuat kuralını siler (yalnızca sistem yöneticisi)
 *     tags: [Mevzuat]
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
 *         description: Kural başarıyla silindi
 *       403:
 *         description: Yetkisiz erişim
 */
router.get('/:id', mevzuatController.kuralGetir);
router.put('/:id', rolIzinVer('sistem_yoneticisi'), mevzuatController.kuralGuncelle);
router.delete('/:id', rolIzinVer('sistem_yoneticisi'), mevzuatController.kuralSil);

/**
 * @swagger
 * /api/mevzuat/{id}/gecmis:
 *   get:
 *     summary: Belirli bir kurala ait değişiklik geçmişini listeler
 *     tags: [Mevzuat]
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
 *         description: Kurala ait geçmiş değişiklikler döner
 */
router.get('/:id/gecmis', mevzuatController.kuralGecmisiGetir);

module.exports = router;