// routes/personelRoutes.js
const express = require('express');
const router  = express.Router();

const personelController = require('../controllers/personelController');
const kimlikDogrula      = require('../middleware/authMiddleware');
const rolIzinVer         = require('../middleware/roleMiddleware');

router.use(kimlikDogrula);

// GET /api/personel
router.get('/', personelController.tumPersonel);

// GET /api/personel/uyarilar
router.get('/uyarilar', personelController.personelUyarilari);

// GET /api/personel/:id
router.get('/:id', personelController.personelGetir);

// POST /api/personel
router.post('/', rolIzinVer('sistem_yoneticisi', 'isg_uzmani'), personelController.personelEkle);

// PUT /api/personel/:id
router.put('/:id', rolIzinVer('sistem_yoneticisi', 'isg_uzmani'), personelController.personelGuncelle);

// DELETE /api/personel/:id
router.delete('/:id', rolIzinVer('sistem_yoneticisi', 'isg_uzmani'), personelController.personelSil);

module.exports = router;