// routes/firmaRoutes.js
const express = require('express');
const router  = express.Router();

const firmaController = require('../controllers/firmaController');
const kimlikDogrula   = require('../middleware/authMiddleware');
const rolIzinVer      = require('../middleware/roleMiddleware');

// Tüm route'lar korumalı
router.use(kimlikDogrula);

// GET  /api/firmalar
router.get('/', firmaController.tumFirmalar);

// GET  /api/firmalar/:id
router.get('/:id', firmaController.firmaGetir);

// GET  /api/firmalar/:id/istatistik
router.get('/:id/istatistik', firmaController.firmaIstatistik);

// POST /api/firmalar  (sadece yönetici ve ISG uzmanı)
router.post('/', rolIzinVer('sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'), firmaController.firmaEkle);

// PUT  /api/firmalar/:id
router.put('/:id', rolIzinVer('sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'), firmaController.firmaGuncelle);
// DELETE /api/firmalar/:id (sadece yönetici)
router.delete('/:id', rolIzinVer('sistem_yoneticisi'), firmaController.firmaSil);

module.exports = router;