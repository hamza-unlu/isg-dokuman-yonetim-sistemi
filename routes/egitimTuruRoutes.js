// routes/egitimTuruRoutes.js
const express = require('express');
const router  = express.Router();
const egitimTuruController = require('../controllers/egitimTuruController');
const kimlikDogrula = require('../middleware/authMiddleware');
const rolIzinVer    = require('../middleware/roleMiddleware');

const YAZMA_ROLLERI = ['sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'];

router.use(kimlikDogrula);

router.route('/')
    .get(egitimTuruController.tumEgitimTurleri)
    .post(rolIzinVer(...YAZMA_ROLLERI), egitimTuruController.egitimTuruEkle);

router.delete('/:id',
    rolIzinVer(...YAZMA_ROLLERI),
    egitimTuruController.egitimTuruSil
);

module.exports = router;