// routes/api.js
const express = require('express');
const router = express.Router();
const VeriDepo = require('../models/VeriDepo'); 
const kimlikDogrula = require('../middleware/authMiddleware'); 
const rolIzinVer = require('../middleware/roleMiddleware');
const YAZMA_ROLLERI = ['sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'];

async function _veriDepoGuncelle(anahtar, deger) {
    await VeriDepo.findOneAndUpdate(
        { anahtar },
        { deger },
        { upsert: true, new: true }
    );
}

// GET — Genel Veri Deposu Okuma
// GET — Genel Veri Deposu Okuma
router.get('/veri/:key', kimlikDogrula, async (req, res) => {
    try {
        const anahtar = decodeURIComponent(req.params.key);
        const kayit   = await VeriDepo.findOne({ anahtar }).lean();
        // Kayıt yoksa boş obje dön (404 değil) — yeni firma için normal durum
        if (!kayit) return res.json({});
        res.json(kayit.deger);
    } catch (e) {
        res.status(500).json({ hata: e.message });
    }
});

// POST — Genel Veri Deposu Yazma
router.post('/veri/:key', kimlikDogrula, rolIzinVer(...YAZMA_ROLLERI), async (req, res) => {
    try {
        const anahtar = decodeURIComponent(req.params.key);
        await _veriDepoGuncelle(anahtar, req.body);
        res.json({ basarili: true });
    } catch (e) {
        res.status(500).json({ hata: e.message });
    }
});

module.exports = router;