// controllers/egitimTuruController.js
const EgitimTuru = require('../models/EgitimTuru');

// ─── Tüm eğitim türlerini listele (tüm kullanıcılar görür) ───
exports.tumEgitimTurleri = async (req, res) => {
    try {
        const turler = await EgitimTuru.find({ aktif: { $ne: false } })
            .populate('ekleyenKullanici', 'adSoyad')
            .sort({ ad: 1 })
            .lean();
        res.json({ basarili: true, veri: turler });
    } catch (err) {
        res.status(500).json({ hata: 'Eğitim türleri getirilemedi.', detay: err.message });
    }
};

// ─── Yeni eğitim türü ekle ───────────────────────────────────
exports.egitimTuruEkle = async (req, res) => {
    try {
        const { ad, sureSaat, aciklama, tehlikeSinifi, gecerlilikSuresiAy } = req.body;

        if (!ad || !ad.trim()) {
            return res.status(400).json({ hata: 'Eğitim adı zorunludur.' });
        }

        // Aynı isim var mı? (büyük-küçük harf duyarsız)
        const mevcut = await EgitimTuru.findOne({
            ad: { $regex: new RegExp(`^${ad.trim()}$`, 'i') }
        });
        if (mevcut) {
            return res.status(400).json({ hata: 'Bu isimde bir eğitim zaten mevcut.' });
        }

        const yeni = await EgitimTuru.create({
            ad:                 ad.trim(),
            sureSaat:           parseInt(sureSaat) || 0,
            aciklama:           aciklama || '',
            tehlikeSinifi:      tehlikeSinifi || 'Genel',
            gecerlilikSuresiAy: parseInt(gecerlilikSuresiAy) || 12,
            ekleyenKullanici:   req.kullanici._id
        });

        res.status(201).json({
            basarili: true,
            mesaj:    'Eğitim türü başarıyla eklendi.',
            veri:     yeni
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ hata: 'Bu isimde bir eğitim zaten mevcut.' });
        }
        res.status(400).json({ hata: 'Eğitim türü eklenemedi.', detay: err.message });
    }
};

// ─── Eğitim türü sil (soft delete) ───────────────────────────
exports.egitimTuruSil = async (req, res) => {
    try {
        const tur = await EgitimTuru.findById(req.params.id);
        if (!tur) return res.status(404).json({ hata: 'Eğitim türü bulunamadı.' });

        // Sadece sistem yöneticisi veya ekleyen kullanıcı silebilir
        const rol = req.kullanici.rol;
        if (rol !== 'sistem_yoneticisi' &&
            String(tur.ekleyenKullanici) !== String(req.kullanici._id)) {
            return res.status(403).json({
                hata: 'Sadece kendi eklediğiniz eğitim türlerini silebilirsiniz.'
            });
        }

        tur.aktif = false;
        await tur.save();
        res.json({ basarili: true, mesaj: 'Eğitim türü silindi.' });
    } catch (err) {
        res.status(500).json({ hata: 'Eğitim türü silinemedi.', detay: err.message });
    }
};