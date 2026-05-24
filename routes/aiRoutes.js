// routes/aiRoutes.js
const express = require('express');
const router  = express.Router();

const aiController  = require('../controllers/aiController');
const kimlikDogrula = require('../middleware/authMiddleware');

// Tüm yollar için giriş yapmış olma zorunlu
router.use(kimlikDogrula);

// ─── ENDPOINTS ───────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/ai/siniflandir:
 *   post:
 *     tags: [Yapay Zeka]
 *     summary: Yüklenen belgeyi AI ile sınıflandırır
 *     description: |
 *       PDF'ten çıkarılmış metni Google Gemini API'ye gönderir,
 *       belgenin hangi İSG kategorisine ait olduğunu tespit eder.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metin:
 *                 type: string
 *                 description: PDF'ten çıkarılmış belge metni
 *                 example: "Bu bir risk değerlendirme raporudur..."
 *     responses:
 *       200:
 *         description: Sınıflandırma başarılı
 */
router.post('/siniflandir', aiController.dokumaniSiniflandir);

/**
 * @swagger
 * /api/ai/saglik:
 *   get:
 *     tags: [Yapay Zeka]
 *     summary: AI servisinin durumunu kontrol eder
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Servis sağlık durumu
 */
router.get('/saglik', aiController.saglikKontrol);

/**
 * @swagger
 * /api/ai/mobil-siniflandir:
 *   post:
 *     tags: [Yapay Zeka]
 *     summary: Mobil için PDF dosyasından doğrudan sınıflandırma
 *     description: |
 *       PDF dosyasını Base64 dataUrl olarak alır, sunucuda metni
 *       çıkarır ve AI ile sınıflandırır. Mobile uygulama için.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataUrl:
 *                 type: string
 *                 description: Base64 formatında PDF (data:application/pdf;base64,...)
 *     responses:
 *       200:
 *         description: Sınıflandırma başarılı
 */
router.post('/mobil-siniflandir', aiController.mobilSiniflandir);

/**
 * @swagger
 * /api/ai/sohbet:
 *   post:
 *     tags: [Yapay Zeka]
 *     summary: AI Sohbet Asistanı - Doğal dilde soru sor
 *     description: |
 *       Kullanıcı doğal dilde sistemdeki veriler hakkında soru sorar,
 *       AI sistem verilerine bakarak yanıt verir.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soru:
 *                 type: string
 *                 description: Kullanıcının sorusu
 *                 example: "ABC İnşaat'ın eğitim durumu nedir?"
 *               gecmisMesajlar:
 *                 type: array
 *                 description: Önceki sohbet mesajları (opsiyonel)
 *     responses:
 *       200:
 *         description: AI yanıtı
 */
router.post('/sohbet', aiController.sohbet);

module.exports = router;