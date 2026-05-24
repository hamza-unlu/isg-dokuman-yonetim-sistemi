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

router.route('/')
    // 2. DÜZELTME: isverenFirmaFiltresi tanımlı olmadığı için hata verecekti, şimdilik kaldırdık. 
    // İleride eklersen tekrar buraya '.get(isverenFirmaFiltresi, ...)' şeklinde yazabilirsin.
    .get(egitimController.tumEgitimler) 
    .post(rolIzinVer(...YAZMA_ROLLERI), egitimController.egitimEkle);

router.route('/:id')
    .put(rolIzinVer(...YAZMA_ROLLERI), egitimController.egitimGuncelle)
    .delete(rolIzinVer(...YAZMA_ROLLERI), egitimController.egitimSil);

module.exports = router;