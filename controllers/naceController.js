// controllers/naceController.js
const Nace = require('../models/Nace');

// ─── Tüm NACE kodları (liste + arama + filtre) ────────────────────────────────
exports.tumNaceKodlari = async (req, res) => {
  try {
    const { arama, sinif } = req.query;
    const filtre = { aktif: { $ne: false } };

    if (sinif) filtre.sinif = sinif;

    // Arama: hem kod içinde hem tanım açıklamasında (case-insensitive)
    if (arama) {
      filtre.$or = [
        { kod:   { $regex: arama, $options: 'i' } },
        { tanim: { $regex: arama, $options: 'i' } },
      ];
    }

    const kodlar = await Nace.find(filtre).sort({ kod: 1 }).lean();
    res.json({ basarili: true, sayi: kodlar.length, veri: kodlar });
  } catch (err) {
    res.status(500).json({ hata: 'NACE kodları getirilirken hata oluştu.', detay: err.message });
  }
};

// ─── Tek NACE kodu getir ──────────────────────────────────────────────────────
exports.naceGetir = async (req, res) => {
  try {
    const nace = await Nace.findById(req.params.id);
    if (!nace) return res.status(404).json({ hata: 'NACE kodu bulunamadı.' });
    res.json({ basarili: true, veri: nace });
  } catch (err) {
    res.status(500).json({ hata: 'NACE kodu getirilirken hata oluştu.', detay: err.message });
  }
};

// ─── NACE kodu ekle ───────────────────────────────────────────────────────────
exports.naceEkle = async (req, res) => {
  try {
    const yeniNace = {
      ...req.body,
      ekleyenKullanici: req.kullanici._id,
    };
    const nace = await Nace.create(yeniNace);
    res.status(201).json({ basarili: true, mesaj: 'NACE kodu eklendi.', veri: nace });
  } catch (err) {
    // Aynı kodu ikinci kez eklemeye çalışma durumu
    if (err.code === 11000) {
      return res.status(400).json({ hata: 'Bu NACE kodu zaten kayıtlı.' });
    }
    res.status(400).json({ hata: 'NACE kodu eklenemedi.', detay: err.message });
  }
};

// ─── NACE kodu güncelle ───────────────────────────────────────────────────────
exports.naceGuncelle = async (req, res) => {
  try {
    const nace = await Nace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!nace) return res.status(404).json({ hata: 'NACE kodu bulunamadı.' });
    res.json({ basarili: true, mesaj: 'NACE kodu güncellendi.', veri: nace });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ hata: 'Bu NACE kodu başka bir kayıtta zaten kullanılıyor.' });
    }
    res.status(400).json({ hata: 'NACE kodu güncellenemedi.', detay: err.message });
  }
};

// ─── NACE kodu sil ────────────────────────────────────────────────────────────
exports.naceSil = async (req, res) => {
  try {
    const nace = await Nace.findByIdAndDelete(req.params.id);
    if (!nace) return res.status(404).json({ hata: 'NACE kodu bulunamadı.' });
    res.json({ basarili: true, mesaj: 'NACE kodu silindi.' });
  } catch (err) {
    res.status(500).json({ hata: 'NACE kodu silinemedi.', detay: err.message });
  }
};