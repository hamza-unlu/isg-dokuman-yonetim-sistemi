// controllers/mevzuatController.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT KURAL CONTROLLER
// ───────────────────────────────────────────────────────────────────────────
// CRUD işlemlerinin yanında her güncelleme için otomatik geçmiş kaydı tutar.
// Değer değişmediği sürece geçmişe satır yazılmaz (gürültü önlenir).
// ═══════════════════════════════════════════════════════════════════════════

const Mevzuat        = require('../models/Mevzuat');
const MevzuatGecmisi = require('../models/MevzuatGecmisi');

// ─── Tüm kuralları listele (grup + sınıf filtresiyle) ─────────────────────
exports.tumKurallar = async (req, res) => {
    try {
        const { grup, tehlikeSinifi, arama } = req.query;
        const filtre = { aktif: { $ne: false } };

        if (grup)           filtre.grup          = grup;
        if (tehlikeSinifi)  filtre.tehlikeSinifi = tehlikeSinifi;

        if (arama) {
            filtre.$or = [
                { kuralAdi:      { $regex: arama, $options: 'i' } },
                { aciklama:      { $regex: arama, $options: 'i' } },
                { mevzuatKaynak: { $regex: arama, $options: 'i' } },
            ];
        }

        const kurallar = await Mevzuat.find(filtre)
            .sort({ grup: 1, kuralAdi: 1, tehlikeSinifi: 1 })
            .lean();

        res.json({ basarili: true, sayi: kurallar.length, veri: kurallar });
    } catch (err) {
        res.status(500).json({ hata: 'Mevzuat kuralları getirilemedi.', detay: err.message });
    }
};

// ─── Tek kural getir ─────────────────────────────────────────────────────
exports.kuralGetir = async (req, res) => {
    try {
        const kural = await Mevzuat.findById(req.params.id);
        if (!kural) return res.status(404).json({ hata: 'Kural bulunamadı.' });
        res.json({ basarili: true, veri: kural });
    } catch (err) {
        res.status(500).json({ hata: 'Kural getirilemedi.', detay: err.message });
    }
};


// Örnek kullanım: GET /api/mevzuat/anahtar/egitim_temel_isg_az_tehlikeli
exports.anahtarIleGetir = async (req, res) => {
    try {
        const kural = await Mevzuat.findOne({ anahtar: req.params.anahtar, aktif: { $ne: false } }).lean();
        if (!kural) return res.status(404).json({ hata: 'Kural bulunamadı.' });
        res.json({ basarili: true, veri: kural });
    } catch (err) {
        res.status(500).json({ hata: 'Kural getirilemedi.', detay: err.message });
    }
};

// ─── Yeni kural ekle ─────────────────────────────────────────────────────
exports.kuralEkle = async (req, res) => {
    try {
        const yeniKural = {
            ...req.body,
            sonDegistiren: req.kullanici._id,
        };
        const kural = await Mevzuat.create(yeniKural);
        res.status(201).json({ basarili: true, mesaj: 'Kural eklendi.', veri: kural });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ hata: 'Bu anahtara sahip bir kural zaten var.' });
        }
        res.status(400).json({ hata: 'Kural eklenemedi.', detay: err.message });
    }
};

// ─── Kuralı güncelle (+ geçmiş kaydı oluştur) ────────────────────────────
exports.kuralGuncelle = async (req, res) => {
    try {
        const { deger, birim, degisiklikSebebi, yururlukTarihi, ...digerAlanlar } = req.body;

        // Önce eski hali çek (geçmiş kaydı için)
        const eski = await Mevzuat.findById(req.params.id);
        if (!eski) return res.status(404).json({ hata: 'Kural bulunamadı.' });

        // Değer veya birim gerçekten değişti mi?
        const degerDegisti = (deger !== undefined && Number(deger) !== eski.deger);
        const birimDegisti = (birim !== undefined && birim !== eski.birim);

        // Güncellenecek alanları hazırla
        const yenilemeler = {
            ...digerAlanlar,
            sonDegistiren: req.kullanici._id,
        };
        if (deger !== undefined) yenilemeler.deger = Number(deger);
        if (birim !== undefined) yenilemeler.birim = birim;

        const guncel = await Mevzuat.findByIdAndUpdate(
            req.params.id,
            yenilemeler,
            { new: true, runValidators: true }
        );

        // Sadece deger ya da birim değiştiyse geçmişe kaydet
        if (degerDegisti || birimDegisti) {
            await MevzuatGecmisi.create({
                mevzuat:             eski._id,
                kuralOzeti:          `${eski.kuralAdi} — ${eski.tehlikeSinifi}`,
                eskiDeger:           eski.deger,
                yeniDeger:           guncel.deger,
                eskiBirim:           eski.birim,
                yeniBirim:           guncel.birim,
                degisiklikSebebi:    degisiklikSebebi || '',
                yururlukTarihi:      yururlukTarihi ? new Date(yururlukTarihi) : new Date(),
                degistirenKullanici: req.kullanici._id,
                degistirenAd:        req.kullanici.adSoyad || req.kullanici.eposta || '',
            });
        }

        res.json({ basarili: true, mesaj: 'Kural güncellendi.', veri: guncel });
    } catch (err) {
        res.status(400).json({ hata: 'Kural güncellenemedi.', detay: err.message });
    }
};

// ─── Kuralı sil (+ bu kurala ait geçmiş kayıtları da sil) ────────────────
exports.kuralSil = async (req, res) => {
    try {
        const kural = await Mevzuat.findByIdAndDelete(req.params.id);
        if (!kural) return res.status(404).json({ hata: 'Kural bulunamadı.' });

        // İlgili geçmişi de temizle 
        await MevzuatGecmisi.deleteMany({ mevzuat: kural._id });

        res.json({ basarili: true, mesaj: 'Kural ve geçmişi silindi.' });
    } catch (err) {
        res.status(500).json({ hata: 'Kural silinemedi.', detay: err.message });
    }
};

// ─── Belirli bir kuralın geçmişini listele ───────────────────────────────
exports.kuralGecmisiGetir = async (req, res) => {
    try {
        const gecmis = await MevzuatGecmisi.find({ mevzuat: req.params.id })
            .sort({ olusturmaTarihi: -1 })
            .lean();
        res.json({ basarili: true, sayi: gecmis.length, veri: gecmis });
    } catch (err) {
        res.status(500).json({ hata: 'Geçmiş getirilemedi.', detay: err.message });
    }
};

// ─── Tüm değişiklik geçmişini listele (audit trail raporu) ───────────────
exports.tumGecmis = async (req, res) => {
    try {
        const sinir = Math.min(parseInt(req.query.limit) || 100, 500);
        const gecmis = await MevzuatGecmisi.find({})
            .sort({ olusturmaTarihi: -1 })
            .limit(sinir)
            .populate('degistirenKullanici', 'adSoyad eposta')
            .lean();
        res.json({ basarili: true, sayi: gecmis.length, veri: gecmis });
    } catch (err) {
        res.status(500).json({ hata: 'Geçmiş getirilemedi.', detay: err.message });
    }
};