// routes/mevzuatTakipRoutes.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT TAKİP ROUTES
// ═══════════════════════════════════════════════════════════════════════════

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/mevzuatTakipController');

// ─── DURUM VE LİSTELEME ────────────────────────────────────────────────────
router.get('/durum',         ctrl.durum);
router.get('/liste',         ctrl.liste);
router.get('/detay/:id',     ctrl.detay);

// ─── CRUD ──────────────────────────────────────────────────────────────────
router.post  ('/ekle',          ctrl.ekle);
router.put   ('/guncelle/:id',  ctrl.guncelle);
router.delete('/sil/:id',       ctrl.sil);
router.patch ('/durum/:id',     ctrl.aktifPasifYap);

// ─── İŞLEMLER ──────────────────────────────────────────────────────────────
router.post('/test-url',         ctrl.urlTestEt);
router.post('/tara',             ctrl.simdiTara);
router.post('/tekrar-dene/:id',  ctrl.tekrarDene);

// ─── ONAY YÖNETİMİ ─────────────────────────────────────────────────────────
router.get ('/bekleyenler',          ctrl.bekleyenler);
router.get ('/versiyonlar/:anahtar', ctrl.versiyonlar);
router.post('/onayla/:id',           ctrl.onayla);
router.post('/reddet/:id',           ctrl.reddet);
router.get ('/pdf/:id',              ctrl.pdfIndir);

// ─── CRON AYAR YÖNETİMİ ────────────────────────────────────────────────────
router.get ('/ayar/cron', ctrl.cronAyariGetir);
router.post('/ayar/cron', ctrl.cronAyariKaydet);

// ─── KURAL GÜNCELLEME & AUDIT ──────────────────────────────────────────────
router.get ('/mevzuat-kurallari',     ctrl.mevzuatKurallariniGetir);
router.get ('/bekleyen-detay/:id',    ctrl.bekleyenDetay);
router.post('/onayla-ve-uygula/:id',  ctrl.onaylaVeUygula);

// ─── ⭐ DİFF GÖRÜNTÜLEME (Adım 7.B) ────────────────────────────────────────
router.get('/fark/:id', ctrl.farkGoster);

module.exports = router;