// routes/authRoutes.js
const express = require('express');
const router  = express.Router();

const authController = require('../controllers/authController');
const kimlikDogrula  = require('../middleware/authMiddleware');
const rolIzinVer     = require('../middleware/roleMiddleware');
const profilFotoUpload  = require('../middleware/profilFotoUpload'); 

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Kimlik doğrulama ve kullanıcı yönetimi
 */

// ═══════════════════════════════════════════════
// AÇIK ENDPOINT'LER (token gerektirmez)
// ═══════════════════════════════════════════════

/**
 * @swagger
 * /api/auth/giris:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eposta, sifre]
 *             properties:
 *               eposta:
 *                 type: string
 *                 example: admin@unluitd.com
 *               sifre:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Giriş başarılı, JWT token döner
 *       401:
 *         description: Hatalı e-posta veya şifre
 */
router.post('/giris', authController.girisYap);

/**
 * @swagger
 * /api/auth/kayit:
 *   post:
 *     summary: Yeni kullanıcı kaydı (açık - sadece uzman/hekim)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [adSoyad, eposta, sifre]
 *             properties:
 *               adSoyad:
 *                 type: string
 *               eposta:
 *                 type: string
 *               sifre:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [isg_uzmani, isyeri_hekimi]
 *     responses:
 *       201:
 *         description: Hesap oluşturuldu, token döner
 *       400:
 *         description: Eksik veri veya e-posta zaten kayıtlı
 */
router.post('/kayit', authController.kayitOl);

/**
 * @swagger
 * /api/auth/sifre-unuttum:
 *   post:
 *     summary: Şifre sıfırlama bağlantısı ister
 *     tags: [Auth]
 *     description: |
 *       Verilen e-postaya şifre sıfırlama bağlantısı gönderir.
 *       Güvenlik nedeniyle e-posta kayıtlı olsa da olmasa da aynı yanıtı döner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eposta]
 *             properties:
 *               eposta:
 *                 type: string
 *                 example: hamza.unlu@unluosgb.com
 *     responses:
 *       200:
 *         description: İstek kabul edildi (e-posta varsa gönderilir)
 *       400:
 *         description: E-posta eksik
 *       500:
 *         description: E-posta gönderilemedi
 */
router.post('/sifre-unuttum', authController.sifreUnuttum);

/**
 * @swagger
 * /api/auth/sifre-sifirla/{token}:
 *   post:
 *     summary: Token ile yeni şifre belirler
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: E-posta ile gönderilen sıfırlama token'ı (15 dk geçerli)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [yeniSifre]
 *             properties:
 *               yeniSifre:
 *                 type: string
 *                 minLength: 6
 *                 example: "YeniSifre123!"
 *     responses:
 *       200:
 *         description: Şifre başarıyla güncellendi
 *       400:
 *         description: Token geçersiz, süresi dolmuş veya şifre kısa
 */
router.post('/sifre-sifirla/:token', authController.sifreSifirla);

// ═══════════════════════════════════════════════
// KORUMALI ENDPOINT'LER (token gerektirir)
// ═══════════════════════════════════════════════

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Oturum açmış kullanıcının bilgilerini getirir
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri döner
 *       401:
 *         description: Token geçersiz veya eksik
 */
router.get('/me', kimlikDogrula, authController.mevcutKullanici);

// ─────────────────────────────────────────
// ⭐ PROFİL YÖNETİMİ (giriş yapmış kullanıcı için)
// ─────────────────────────────────────────

/**
 * @swagger
 * /api/auth/profil-foto:
 *   post:
 *     summary: Kullanıcı profil fotoğrafını yükler/günceller
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilFoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fotoğraf başarıyla güncellendi
 *       400:
 *         description: Dosya eksik veya geçersiz format
 *       401:
 *         description: Token geçersiz veya eksik
 */
router.post(
    '/profil-foto',
    kimlikDogrula,
    profilFotoUpload.single('profilFoto'),
    authController.profilFotoYukle
);

/**
 * @swagger
 * /api/auth/profil-foto:
 *   delete:
 *     summary: Kullanıcı profil fotoğrafını kaldırır
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fotoğraf başarıyla silindi
 *       401:
 *         description: Token geçersiz veya eksik
 */
router.delete('/profil-foto', kimlikDogrula, authController.profilFotoSil);

/**
 * @swagger
 * /api/auth/sifre-degistir:
 *   post:
 *     summary: Oturum açmış kullanıcının şifresini değiştirir
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mevcutSifre, yeniSifre, yeniSifreTekrar]
 *             properties:
 *               mevcutSifre:
 *                 type: string
 *                 example: "eskisifre123"
 *               yeniSifre:
 *                 type: string
 *                 minLength: 6
 *                 example: "YeniSifre123!"
 *               yeniSifreTekrar:
 *                 type: string
 *                 example: "YeniSifre123!"
 *     responses:
 *       200:
 *         description: Şifre başarıyla değiştirildi
 *       400:
 *         description: Şifreler eşleşmiyor veya çok kısa
 *       401:
 *         description: Mevcut şifre hatalı
 */
router.post('/sifre-degistir', kimlikDogrula, authController.sifreDegistir);

/**
 * @swagger
 * /api/auth/kullanicilar:
 *   get:
 *     summary: Tüm kullanıcıları listeler (sadece sistem yöneticisi)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı listesi döner
 *       403:
 *         description: Yetkisiz erişim
 */
router.get(
    '/kullanicilar',
    kimlikDogrula,
    rolIzinVer('sistem_yoneticisi'),
    authController.kullanicilariListele
);

/**
 * @swagger
 * /api/auth/kullanicilar:
 *   post:
 *     summary: Yeni kullanıcı ekler (sadece sistem yöneticisi)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [adSoyad, eposta, sifre, rol]
 *             properties:
 *               adSoyad:
 *                 type: string
 *                 example: Ahmet Yılmaz
 *               eposta:
 *                 type: string
 *                 example: ahmet@unluitd.com
 *               sifre:
 *                 type: string
 *                 example: "123456"
 *               rol:
 *                 type: string
 *                 enum: [sistem_yoneticisi, isg_uzmani, isyeri_hekimi, isveren, izleyici]
 *                 example: isg_uzmani
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Eksik veya hatalı veri
 *       403:
 *         description: Yetkisiz erişim
 */
router.post(
    '/kullanicilar',
    kimlikDogrula,
    rolIzinVer('sistem_yoneticisi'),
    authController.kullaniciEkle
);

/**
 * @swagger
 * /api/auth/kullanicilar/{id}/rol:
 *   put:
 *     summary: Kullanıcının rolünü günceller (sadece sistem yöneticisi)
 *     tags: [Auth]
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
 *             required: [rol]
 *             properties:
 *               rol:
 *                 type: string
 *                 enum: [sistem_yoneticisi, isg_uzmani, isyeri_hekimi, isveren, izleyici]
 *     responses:
 *       200:
 *         description: Rol başarıyla güncellendi
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.put(
    '/kullanicilar/:id/rol',
    kimlikDogrula,
    rolIzinVer('sistem_yoneticisi'),
    authController.rolGuncelle
);

/**
 * @swagger
 * /api/auth/kullanicilar/{id}:
 *   delete:
 *     summary: Kullanıcıyı siler (sadece sistem yöneticisi)
 *     tags: [Auth]
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
 *         description: Kullanıcı başarıyla silindi
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.delete(
    '/kullanicilar/:id',
    kimlikDogrula,
    rolIzinVer('sistem_yoneticisi'),
    authController.kullaniciSil
);

module.exports = router;