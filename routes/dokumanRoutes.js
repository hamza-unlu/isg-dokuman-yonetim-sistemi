// routes/dokumanRoutes.js
const express = require('express');
const router  = express.Router();

const dokumanController = require('../controllers/dokumanController');
const kimlikDogrula     = require('../middleware/authMiddleware');
const rolIzinVer        = require('../middleware/roleMiddleware');

router.use(kimlikDogrula);

/**
 * @swagger
 * tags:
 *   name: Dokümanlar
 *   description: İSG doküman yönetimi
 */

/**
 * @swagger
 * /api/dokumanlar/kritik:
 *   get:
 *     summary: Kritik dokümanları listeler
 *     tags: [Dokümanlar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kritik doküman listesi döner
 *       401:
 *         description: Token geçersiz veya eksik
 */
router.get('/kritik', dokumanController.kritikDokumanlar);

/**
 * @swagger
 * /api/dokumanlar/mobil-anasayfa:
 *   get:
 *     summary: Mobil uygulama için optimize edilmiş anasayfa verileri
 *     tags: [Dokümanlar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mobil anasayfa verileri döner (kritik, uyarı, eğitimler, özet)
 */
router.get('/mobil-anasayfa', dokumanController.mobilAnasayfaVerileri);

router.get('/uzman/:firmaId',  dokumanController.uzmanGetir);
router.post('/uzman/:firmaId', dokumanController.uzmanKaydet);

/**
 * @swagger
 * /api/dokumanlar/mobil-firma-detay/{firmaId}:
 *   get:
 *     summary: Mobil için firma detayı (13 kategori sayıları)
 *     tags: [Dokümanlar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: firmaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Firma + 13 kategori bilgisi
 */
router.get('/mobil-firma-detay/:firmaId', dokumanController.mobilFirmaDetay);

/**
 * @swagger
 * /api/dokumanlar/mobil-kategori/{firmaId}/{kategori}:
 *   get:
 *     summary: Mobil için bir kategorinin belgelerini listeler
 *     tags: [Dokümanlar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: firmaId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: kategori
 *         required: true
 *         schema:
 *           type: string
 *           enum: [rv, adp, tatbikat, denetim, kkd, kurul, egitim, muayene, ilkyardim, olcum, temsilci, destek, uzman]
 *     responses:
 *       200:
 *         description: Kategori belgeleri listelenir
 */
router.get('/mobil-kategori/:firmaId/:kategori', dokumanController.mobilKategoriBelgeleri);

// Mobil için belge ekleme (VeriDepo'ya yazar - web ile aynı yere)
router.post('/mobil-belge-ekle',
    rolIzinVer('sistem_yoneticisi', 'isg_uzmani','isyeri_hekimi'),
    dokumanController.mobilBelgeEkle
);
router.delete('/mobil-belge-sil',
    rolIzinVer('sistem_yoneticisi', 'isg_uzmani','isyeri_hekimi'),
    dokumanController.mobilBelgeSil
);
router.put('/mobil-belge-guncelle',
    rolIzinVer('sistem_yoneticisi', 'isg_uzmani','isyeri_hekimi'),
    dokumanController.mobilBelgeGuncelle
);
router.post('/mobil-belge-yeni-surum',
    rolIzinVer('sistem_yoneticisi', 'isg_uzmani','isyeri_hekimi'),
    dokumanController.mobilBelgeYeniSurum
);
/**
 * @swagger
 * /api/dokumanlar/mobil-belge/{firmaId}/{kategori}/{belgeAdi}:
 *   get:
 *     summary: Belge içeriğini (dataUrl) döndürür
 *     tags: [Dokümanlar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: firmaId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: kategori
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: belgeAdi
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Belge dataUrl ile döner
 */
router.get('/mobil-belge/:firmaId/:kategori/:belgeAdi', dokumanController.mobilBelgeIcerik);

router.post('/mail-gonder',
  rolIzinVer('sistem_yoneticisi', 'isg_uzmani','isyeri_hekimi'),
  dokumanController.dokumanMailGonder
);

router.post('/kurul-mail-gonder',
  rolIzinVer('sistem_yoneticisi', 'isg_uzmani','isyeri_hekimi'),
  dokumanController.kurulMailGonder
);

// ═══════════════════════════════════════════════════════════════════════
// GENEL ROUTE'LAR
// ═══════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/dokumanlar:
 *   get:
 *     summary: Tüm dokümanları listeler
 *     tags: [Dokümanlar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doküman listesi döner
 *       401:
 *         description: Token geçersiz veya eksik
 *   post:
 *     summary: Yeni doküman ve dosya ekler
 *     tags: [Dokümanlar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               baslik:
 *                 type: string
 *               tur:
 *                 type: string
 *               dosya:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Doküman başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz istek verisi
 */
router.route('/')
  .get(dokumanController.tumDokumanlar)
  .post(rolIzinVer('sistem_yoneticisi', 'isg_uzmani','isyeri_hekimi'), dokumanController.dokumanEkle);

// ═══════════════════════════════════════════════════════════════════════
// PARAMETRELİ ROUTE'LAR (En sona — her path'i yakalayabilir)
// ═══════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /api/dokumanlar/{id}:
 *   get:
 *     summary: Belirli bir dokümanı getirir
 *     tags: [Dokümanlar]
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
 *         description: Doküman bilgisi döner
 *       404:
 *         description: Doküman bulunamadı
 *   put:
 *     summary: Dokümanı günceller
 *     tags: [Dokümanlar]
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
 *               baslik:
 *                 type: string
 *               durum:
 *                 type: string
 *                 enum: [aktif, pasif, kritik]
 *     responses:
 *       200:
 *         description: Doküman başarıyla güncellendi
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Doküman bulunamadı
 *   delete:
 *     summary: Dokümanı siler
 *     tags: [Dokümanlar]
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
 *         description: Doküman başarıyla silindi
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Doküman bulunamadı
 */
router.route('/:id')
  .get(dokumanController.dokumanGetir)
  .put(rolIzinVer('sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'), dokumanController.dokumanGuncelle)
  .delete(rolIzinVer('sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'), dokumanController.dokumanSil);

module.exports = router;