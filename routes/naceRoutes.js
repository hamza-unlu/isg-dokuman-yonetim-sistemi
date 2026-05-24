// routes/naceRoutes.js
const express = require('express');
const router  = express.Router();

const naceController = require('../controllers/naceController');
const kimlikDogrula  = require('../middleware/authMiddleware');
const rolIzinVer     = require('../middleware/roleMiddleware');

// Tüm rotalar için token doğrulaması zorunlu
router.use(kimlikDogrula);

// ─── OKUMA: Tüm giriş yapmış kullanıcılar okuyabilir ──────────────────────────
// (Firma ekleme formu da bu endpoint'i kullanacak)
router.get('/',    naceController.tumNaceKodlari);
router.get('/:id', naceController.naceGetir);

// ─── YAZMA: Sadece sistem_yoneticisi ──────────────────────────────────────────
router.post('/',      rolIzinVer('sistem_yoneticisi'), naceController.naceEkle);
router.put('/:id',    rolIzinVer('sistem_yoneticisi'), naceController.naceGuncelle);
router.delete('/:id', rolIzinVer('sistem_yoneticisi'), naceController.naceSil);

module.exports = router;