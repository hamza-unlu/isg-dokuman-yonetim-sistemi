// routes/mevzuatRoutes.js
const express = require('express');
const router  = express.Router();

const mevzuatController = require('../controllers/mevzuatController');
const kimlikDogrula     = require('../middleware/authMiddleware');
const rolIzinVer        = require('../middleware/roleMiddleware');

// Tüm yollar için token doğrulaması
router.use(kimlikDogrula);

// ─── OKUMA: Giriş yapmış tüm kullanıcılar okuyabilir ────────────────────
// (Frontend'deki doküman sayfası bu kuralları okuyarak hesaplar yapacak)
router.get('/',                    mevzuatController.tumKurallar);
router.get('/gecmis',              mevzuatController.tumGecmis);          // audit trail
router.get('/anahtar/:anahtar',    mevzuatController.anahtarIleGetir);    // program içi
router.get('/:id',                 mevzuatController.kuralGetir);
router.get('/:id/gecmis',          mevzuatController.kuralGecmisiGetir);  // kurala özel geçmiş

// ─── YAZMA: Sadece sistem_yoneticisi ────────────────────────────────────
router.post('/',      rolIzinVer('sistem_yoneticisi'), mevzuatController.kuralEkle);
router.put('/:id',    rolIzinVer('sistem_yoneticisi'), mevzuatController.kuralGuncelle);
router.delete('/:id', rolIzinVer('sistem_yoneticisi'), mevzuatController.kuralSil);

module.exports = router;