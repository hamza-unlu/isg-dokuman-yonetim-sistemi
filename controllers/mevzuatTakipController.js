// controllers/mevzuatTakipController.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT TAKİP CONTROLLER
// ───────────────────────────────────────────────────────────────────────────
// Mevzuat otomatik takip sisteminin REST API endpoint'leri.
//
// Bölümler:
//   1. DURUM VE LİSTELEME
//   2. CRUD (TakipliMevzuat)
//   3. İŞLEMLER (tarama, test)
//   4. ONAY YÖNETİMİ (basit)
//   5. CRON AYAR YÖNETİMİ
//   6. KURAL GÜNCELLEME & AUDIT
//   7. ⭐ DİFF GÖRÜNTÜLEME (Adım 7.B)
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const diff = require('diff');   // ⭐ YENİ — jsdiff kütüphanesi

const TakipliMevzuat  = require('../models/TakipliMevzuat');
const MevzuatVersiyon = require('../models/MevzuatVersiyon');
const SistemAyari     = require('../models/SistemAyari');
const Mevzuat         = require('../models/Mevzuat');
const MevzuatGecmisi  = require('../models/MevzuatGecmisi');
const takipServisi    = require('../services/mevzuatTakipServisi');
const scheduler       = require('../services/mevzuatScheduler');
const MevzuatScraper  = require('../services/mevzuatScraper');

// ═══════════════════════════════════════════════════════════════════════════
// 📊 DURUM VE LİSTELEME
// ═══════════════════════════════════════════════════════════════════════════

exports.durum = async (req, res) => {
    try {
        const ozet = await takipServisi.durumOzeti();
        const schedulerDurum = scheduler.durum();
        res.json({ basarili: true, scheduler: schedulerDurum, ozet });
    } catch (err) {
        res.status(500).json({ hata: 'Durum bilgisi alınamadı.', detay: err.message });
    }
};

exports.liste = async (req, res) => {
    try {
        const filtre = {};
        if (req.query.durum) {
            if (req.query.durum === 'pasif') filtre.aktif = false;
            else filtre.takipDurumu = req.query.durum;
        }
        if (req.query.kategori) filtre.kategori = req.query.kategori;

        const liste = await TakipliMevzuat.find(filtre)
            .sort({ kategori: 1, ad: 1 })
            .lean({ virtuals: true });

        res.json({ basarili: true, sayi: liste.length, veri: liste });
    } catch (err) {
        res.status(500).json({ hata: 'Liste alınamadı.', detay: err.message });
    }
};

exports.detay = async (req, res) => {
    try {
        const mevzuat = await TakipliMevzuat.findById(req.params.id).lean({ virtuals: true });
        if (!mevzuat) return res.status(404).json({ hata: 'Mevzuat bulunamadı.' });

        const versiyonlar = await MevzuatVersiyon
            .find({ anahtar: mevzuat.anahtar })
            .sort({ olusturmaTarihi: -1 })
            .lean();

        res.json({ basarili: true, mevzuat, versiyonlar, versiyonSayisi: versiyonlar.length });
    } catch (err) {
        res.status(500).json({ hata: 'Detay alınamadı.', detay: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ✏️ CRUD
// ═══════════════════════════════════════════════════════════════════════════

exports.ekle = async (req, res) => {
    try {
        const { anahtar, ad, kategori, aciklama, pdfURL, htmlURL, mevzuatNo, tur, tertip } = req.body;

        if (!anahtar || !ad) return res.status(400).json({ hata: 'Anahtar ve ad zorunludur.' });
        if (!pdfURL && !htmlURL) return res.status(400).json({ hata: 'PDF URL veya HTML URL\'den en az biri girilmelidir.' });

        const mevcut = await TakipliMevzuat.findOne({ anahtar });
        if (mevcut) return res.status(400).json({ hata: 'Bu anahtarla bir mevzuat zaten kayıtlı.' });

        const yeniMevzuat = await TakipliMevzuat.create({
            anahtar: anahtar.trim(), ad: ad.trim(),
            kategori: kategori || 'Yönetmelik', aciklama: aciklama || '',
            pdfURL: pdfURL || null, htmlURL: htmlURL || null,
            mevzuatNo: mevzuatNo || '', tur: tur || '', tertip: tertip || '5',
            takipDurumu: 'hazır',
            ekleyenKullanici: req.kullanici ? req.kullanici._id : null,
        });

        res.status(201).json({
            basarili: true,
            mesaj: 'Mevzuat eklendi. Sonraki taramada otomatik olarak kontrol edilecek.',
            veri: yeniMevzuat,
        });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ hata: 'Bu anahtarla kayıt zaten var.' });
        res.status(400).json({ hata: 'Mevzuat eklenemedi.', detay: err.message });
    }
};

exports.guncelle = async (req, res) => {
    try {
        const guncellenebilirAlanlar = ['ad', 'kategori', 'aciklama', 'pdfURL', 'htmlURL', 'mevzuatNo', 'tur', 'tertip'];
        const yenilemeler = {};
        guncellenebilirAlanlar.forEach(alan => {
            if (req.body[alan] !== undefined) yenilemeler[alan] = req.body[alan];
        });

        // ⭐ htmlURL değiştiyse pdfURL'yi temizle
        if (yenilemeler.htmlURL !== undefined && yenilemeler.pdfURL === undefined) {
            yenilemeler.pdfURL = null;
        }

        if (yenilemeler.pdfURL !== undefined || yenilemeler.htmlURL !== undefined) {
            yenilemeler.takipDurumu = 'hazır';
            yenilemeler.sonHataMesaji = '';
        }

        const guncel = await TakipliMevzuat.findByIdAndUpdate(req.params.id, yenilemeler, { new: true, runValidators: true });
        if (!guncel) return res.status(404).json({ hata: 'Mevzuat bulunamadı.' });

        res.json({ basarili: true, mesaj: 'Mevzuat güncellendi.', veri: guncel });
    } catch (err) {
        res.status(400).json({ hata: 'Güncelleme başarısız.', detay: err.message });
    }
};

exports.sil = async (req, res) => {
    try {
        const mevzuat = await TakipliMevzuat.findByIdAndDelete(req.params.id);
        if (!mevzuat) return res.status(404).json({ hata: 'Mevzuat bulunamadı.' });

        res.json({
            basarili: true,
            mesaj: 'Mevzuat takip listesinden kaldırıldı. Versiyon geçmişi korundu.',
            silinen: mevzuat.ad,
        });
    } catch (err) {
        res.status(500).json({ hata: 'Silme başarısız.', detay: err.message });
    }
};

exports.aktifPasifYap = async (req, res) => {
    try {
        const mevzuat = await TakipliMevzuat.findById(req.params.id);
        if (!mevzuat) return res.status(404).json({ hata: 'Mevzuat bulunamadı.' });

        mevzuat.aktif = !mevzuat.aktif;
        if (!mevzuat.aktif) mevzuat.takipDurumu = 'pasif';
        else if (mevzuat.takipDurumu === 'pasif') mevzuat.takipDurumu = 'hazır';

        await mevzuat.save();

        res.json({
            basarili: true,
            mesaj: mevzuat.aktif ? 'Mevzuat aktifleştirildi.' : 'Mevzuat pasifleştirildi.',
            veri: mevzuat,
        });
    } catch (err) {
        res.status(500).json({ hata: 'Durum değiştirme başarısız.', detay: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 İŞLEMLER
// ═══════════════════════════════════════════════════════════════════════════

exports.urlTestEt = async (req, res) => {
    try {
        const { pdfURL, htmlURL, mevzuatNo, tur, tertip } = req.body;
        if (!pdfURL && !htmlURL) return res.status(400).json({ hata: 'En az bir URL girilmelidir.' });

        const scraper = new MevzuatScraper();
        const sonuc = await scraper.indir({
            anahtar: 'test_' + Date.now(),
            pdfURL, htmlURL,
            mevzuatNo: mevzuatNo || '', tur: tur || '', tertip: tertip || '5',
        });

        try { fs.unlinkSync(sonuc.dosyaYolu); } catch {}

        res.json({
            basarili: true,
            mesaj: 'URL geçerli, PDF başarıyla indirildi.',
            detay: {
                yontem: sonuc.yontem,
                boyutKB: (sonuc.boyutByte / 1024).toFixed(2),
                indirmeSuresiMs: sonuc.indirmeSuresi,
                kesfedilenPdfURL: sonuc.kesfedilenPdfURL || sonuc.kaynakURL,
            },
        });
    } catch (err) {
        res.status(400).json({ basarili: false, hata: 'URL test edilemedi.', detay: err.message });
    }
};

exports.simdiTara = async (req, res) => {
    try {
        if (takipServisi.islemDevamEdiyor) {
            return res.status(409).json({ basarili: false, hata: 'Zaten bir tarama devam ediyor, lütfen bekleyin.' });
        }
        scheduler.manuelTara().catch(err => console.error('❌ Manuel tarama hatası:', err.message));
        res.status(202).json({ basarili: true, mesaj: 'Tarama başlatıldı. Arka planda devam ediyor.' });
    } catch (err) {
        res.status(500).json({ hata: 'Tarama başlatılamadı.', detay: err.message });
    }
};

exports.tekrarDene = async (req, res) => {
    try {
        const mevzuat = await TakipliMevzuat.findById(req.params.id);
        if (!mevzuat) return res.status(404).json({ hata: 'Mevzuat bulunamadı.' });

        const sonuc = await takipServisi.tekMevzuatTara(mevzuat.anahtar);
        res.json({ basarili: sonuc.basarili, sonuc: sonuc.sonuc || null, hata: sonuc.hata || null });
    } catch (err) {
        res.status(500).json({ hata: 'Tekrar deneme başarısız.', detay: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔔 ONAY YÖNETİMİ
// ═══════════════════════════════════════════════════════════════════════════

exports.bekleyenler = async (req, res) => {
    try {
        const bekleyenler = await MevzuatVersiyon
            .find({ durum: 'onay-bekliyor' })
            .sort({ olusturmaTarihi: -1 })
            .lean();

        const detaylar = await Promise.all(
            bekleyenler.map(async (b) => {
                const onceki = await MevzuatVersiyon
                    .findOne({
                        anahtar: b.anahtar,
                        durum: { $in: ['onaylandi', 'yeni'] },
                        olusturmaTarihi: { $lt: b.olusturmaTarihi }
                    })
                    .sort({ olusturmaTarihi: -1 })
                    .lean();

                return {
                    ...b,
                    onceki: onceki ? {
                        _id: onceki._id, hash: onceki.hash,
                        olusturmaTarihi: onceki.olusturmaTarihi,
                        boyutByte: onceki.boyutByte,
                    } : null,
                };
            })
        );

        res.json({ basarili: true, sayi: detaylar.length, veri: detaylar });
    } catch (err) {
        res.status(500).json({ hata: 'Bekleyen değişiklikler alınamadı.', detay: err.message });
    }
};

exports.versiyonlar = async (req, res) => {
    try {
        const { anahtar } = req.params;
        const versiyonlar = await MevzuatVersiyon
            .find({ anahtar })
            .sort({ olusturmaTarihi: -1 })
            .populate('onaylayan', 'adSoyad eposta')
            .lean();

        const mevzuatBilgi = await TakipliMevzuat.findOne({ anahtar }).lean();

        res.json({
            basarili: true,
            mevzuat: mevzuatBilgi || { anahtar, ad: 'Bilinmeyen' },
            sayi: versiyonlar.length, veri: versiyonlar,
        });
    } catch (err) {
        res.status(500).json({ hata: 'Versiyon geçmişi alınamadı.', detay: err.message });
    }
};

exports.onayla = async (req, res) => {
    try {
        const versiyon = await MevzuatVersiyon.findById(req.params.id);
        if (!versiyon) return res.status(404).json({ hata: 'Versiyon bulunamadı.' });
        if (versiyon.durum !== 'onay-bekliyor') {
            return res.status(400).json({ hata: `Versiyon ${versiyon.durum} durumunda, onaylanamaz.` });
        }

        versiyon.durum = 'onaylandi';
        versiyon.onaylayan = req.kullanici ? req.kullanici._id : null;
        versiyon.onayTarihi = new Date();
        await versiyon.save();

        res.json({ basarili: true, mesaj: 'Versiyon onaylandı (kural güncellemesi yapılmadı).', veri: versiyon });
    } catch (err) {
        res.status(500).json({ hata: 'Onaylama başarısız.', detay: err.message });
    }
};

exports.reddet = async (req, res) => {
    try {
        const versiyon = await MevzuatVersiyon.findById(req.params.id);
        if (!versiyon) return res.status(404).json({ hata: 'Versiyon bulunamadı.' });
        if (versiyon.durum !== 'onay-bekliyor') {
            return res.status(400).json({ hata: `Versiyon ${versiyon.durum} durumunda, reddedilemez.` });
        }

        versiyon.durum = 'reddedildi';
        versiyon.onaylayan = req.kullanici ? req.kullanici._id : null;
        versiyon.onayTarihi = new Date();
        await versiyon.save();

        try {
            if (versiyon.dosyaYolu && fs.existsSync(versiyon.dosyaYolu)) fs.unlinkSync(versiyon.dosyaYolu);
        } catch {}

        res.json({ basarili: true, mesaj: 'Versiyon reddedildi.', veri: versiyon });
    } catch (err) {
        res.status(500).json({ hata: 'Reddetme başarısız.', detay: err.message });
    }
};

exports.pdfIndir = async (req, res) => {
    try {
        const versiyon = await MevzuatVersiyon.findById(req.params.id);
        if (!versiyon) return res.status(404).json({ hata: 'Versiyon bulunamadı.' });
        if (!versiyon.dosyaYolu || !fs.existsSync(versiyon.dosyaYolu)) {
            return res.status(404).json({ hata: 'PDF dosyası bulunamadı.' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${versiyon.anahtar}.pdf"`);
        fs.createReadStream(versiyon.dosyaYolu).pipe(res);
    } catch (err) {
        res.status(500).json({ hata: 'PDF indirilemedi.', detay: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ⭐ CRON AYAR YÖNETİMİ
// ═══════════════════════════════════════════════════════════════════════════

exports.cronAyariGetir = async (req, res) => {
    try {
        const aktifDurum = scheduler.durum();
        const dbAyari = await SistemAyari.findOne({ anahtar: 'mevzuat_cron' }).lean();

        const hazirSablonlar = [
            { etiket: 'Her gün sabah 03:00',       cron: '0 3 * * *',   tip: 'sablon' },
            { etiket: 'Her Pazartesi 03:00',       cron: '0 3 * * 1',   tip: 'sablon' },
            { etiket: 'Her Pazar gece yarısı',     cron: '0 0 * * 0',   tip: 'sablon' },
            { etiket: 'Her ayın 1\'i gece yarısı', cron: '0 0 1 * *',   tip: 'sablon' },
            { etiket: 'Her 6 saatte bir',          cron: '0 */6 * * *', tip: 'sablon' },
            { etiket: 'Her 2 dakikada bir (test)', cron: '*/2 * * * *', tip: 'sablon' },
        ];

        const gunler = [
            { deger: 0, etiket: 'Pazar' }, { deger: 1, etiket: 'Pazartesi' },
            { deger: 2, etiket: 'Salı' }, { deger: 3, etiket: 'Çarşamba' },
            { deger: 4, etiket: 'Perşembe' }, { deger: 5, etiket: 'Cuma' },
            { deger: 6, etiket: 'Cumartesi' },
        ];

        res.json({
            basarili: true,
            aktif: {
                cronIfadesi: aktifDurum.cronIfadesi,
                cronAciklama: aktifDurum.cronAciklama,
                zamanDilimi: aktifDurum.zamanDilimi,
                sonCalismaTarihi: aktifDurum.sonCalismaTarihi,
            },
            kayitliAyar: dbAyari ? dbAyari.deger : null,
            hazirSablonlar, gunler,
        });
    } catch (err) {
        res.status(500).json({ hata: 'Cron ayarı alınamadı.', detay: err.message });
    }
};

exports.cronAyariKaydet = async (req, res) => {
    try {
        const { tip, cronIfadesi, okunabilir, gun, saat, dakika } = req.body;
        let finalCron = cronIfadesi;
        let finalOkunabilir = okunabilir;

        if (tip === 'ozel') {
            if (gun === undefined || saat === undefined) {
                return res.status(400).json({ hata: 'Özel mod için gün ve saat zorunludur.' });
            }
            const dk = dakika !== undefined ? dakika : 0;
            const saatInt = parseInt(saat);
            const dakikaInt = parseInt(dk);

            if (saatInt < 0 || saatInt > 23 || dakikaInt < 0 || dakikaInt > 59) {
                return res.status(400).json({ hata: 'Saat 0-23, dakika 0-59 arasında olmalı.' });
            }

            if (gun === 'her_gun') {
                finalCron = `${dakikaInt} ${saatInt} * * *`;
                finalOkunabilir = `Her gün saat ${_iki(saatInt)}:${_iki(dakikaInt)}`;
            } else {
                const gunNo = Number(gun);
                if (gunNo < 0 || gunNo > 6 || isNaN(gunNo)) {
                    return res.status(400).json({ hata: 'Gün 0-6 arasında olmalı.' });
                }
                const gunAdlari = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
                finalCron = `${dakikaInt} ${saatInt} * * ${gunNo}`;
                finalOkunabilir = `Her ${gunAdlari[gunNo]} saat ${_iki(saatInt)}:${_iki(dakikaInt)}`;
            }
        }

        if (!finalCron) return res.status(400).json({ hata: 'Cron ifadesi belirlenemedi.' });

        const kullaniciId = req.kullanici ? req.kullanici._id : null;
        const sonuc = await scheduler.yenidenBaslat(finalCron, finalOkunabilir, kullaniciId);

        if (!sonuc.basarili) return res.status(400).json(sonuc);

        res.json({
            basarili: true,
            mesaj: '✅ Tarama periyodu güncellendi. Yeni periyot anlık olarak etkin.',
            aktifAyar: sonuc.yeniAyar,
            oncekiAyar: sonuc.oncekiAyar,
        });
    } catch (err) {
        res.status(500).json({ hata: 'Ayar kaydedilemedi.', detay: err.message });
    }
};

function _iki(n) { return String(n).padStart(2, '0'); }

// ═══════════════════════════════════════════════════════════════════════════
// ⭐ KURAL GÜNCELLEME & AUDIT
// ═══════════════════════════════════════════════════════════════════════════

exports.mevzuatKurallariniGetir = async (req, res) => {
    try {
        const kurallar = await Mevzuat.find({ aktif: true })
            .select('anahtar grup kuralAdi tehlikeSinifi deger birim aciklama')
            .sort({ grup: 1, kuralAdi: 1, tehlikeSinifi: 1 })
            .lean();

        const grupliKurallar = {};
        kurallar.forEach(k => {
            if (!grupliKurallar[k.grup]) grupliKurallar[k.grup] = [];
            grupliKurallar[k.grup].push({
                _id: k._id, anahtar: k.anahtar, kuralAdi: k.kuralAdi,
                tehlikeSinifi: k.tehlikeSinifi, deger: k.deger, birim: k.birim,
                aciklama: k.aciklama || '',
                gosterim: `${k.kuralAdi} — ${k.tehlikeSinifi} (${k.deger} ${k.birim})`,
            });
        });

        res.json({ basarili: true, sayi: kurallar.length, gruplar: grupliKurallar, duzListe: kurallar });
    } catch (err) {
        res.status(500).json({ hata: 'Kurallar alınamadı.', detay: err.message });
    }
};

exports.bekleyenDetay = async (req, res) => {
    try {
        const versiyon = await MevzuatVersiyon.findById(req.params.id).lean();
        if (!versiyon) return res.status(404).json({ hata: 'Versiyon bulunamadı.' });

        const onceki = await MevzuatVersiyon
            .findOne({
                anahtar: versiyon.anahtar,
                durum: { $in: ['onaylandi', 'yeni'] },
                olusturmaTarihi: { $lt: versiyon.olusturmaTarihi }
            })
            .sort({ olusturmaTarihi: -1 })
            .lean();

        const takipliMevzuat = await TakipliMevzuat.findOne({ anahtar: versiyon.anahtar }).lean();

        const tumKurallar = await Mevzuat.find({ aktif: true })
            .select('_id anahtar grup kuralAdi tehlikeSinifi deger birim')
            .sort({ grup: 1, kuralAdi: 1, tehlikeSinifi: 1 })
            .lean();

        res.json({ basarili: true, versiyon, onceki, takipliMevzuat, kurallar: tumKurallar });
    } catch (err) {
        res.status(500).json({ hata: 'Detay alınamadı.', detay: err.message });
    }
};

exports.onaylaVeUygula = async (req, res) => {
    try {
        const versiyon = await MevzuatVersiyon.findById(req.params.id);
        if (!versiyon) return res.status(404).json({ hata: 'Versiyon bulunamadı.' });
        if (versiyon.durum !== 'onay-bekliyor') {
            return res.status(400).json({ hata: `Bu versiyon ${versiyon.durum} durumunda, onaylanamaz.` });
        }

        const { etkilenenKurallar = [], genelNot = '' } = req.body;

        const kullaniciId = req.kullanici ? req.kullanici._id : null;
        const kullaniciAd = req.kullanici
            ? (req.kullanici.adSoyad || req.kullanici.eposta || 'Sistem Yöneticisi')
            : 'Sistem Yöneticisi';

        versiyon.durum = 'onaylandi';
        versiyon.onaylayan = kullaniciId;
        versiyon.onayTarihi = new Date();
        if (genelNot) versiyon.farkOzeti = genelNot;
        await versiyon.save();

        const guncellenenKurallar = [];
        const olusturulanAuditKayitlari = [];

        for (const yenileme of etkilenenKurallar) {
            const { mevzuatId, yeniDeger, yeniBirim, degisiklikSebebi } = yenileme;

            if (!mevzuatId || yeniDeger === undefined || yeniDeger === null) continue;

            const mevcutKural = await Mevzuat.findById(mevzuatId);
            if (!mevcutKural) {
                console.warn(`⚠️ Mevzuat bulunamadı: ${mevzuatId}`);
                continue;
            }

            const eskiDeger = mevcutKural.deger;
            const eskiBirim = mevcutKural.birim;

            const degerDegisti = eskiDeger !== Number(yeniDeger);
            const birimDegisti = yeniBirim && eskiBirim !== yeniBirim;

            if (!degerDegisti && !birimDegisti) continue;

            mevcutKural.deger = Number(yeniDeger);
            if (yeniBirim) mevcutKural.birim = yeniBirim;
            mevcutKural.sonDegistiren = kullaniciId;
            await mevcutKural.save();

            const gecmis = await MevzuatGecmisi.create({
                mevzuat: mevcutKural._id,
                kuralOzeti: `${mevcutKural.kuralAdi} — ${mevcutKural.tehlikeSinifi}`,
                eskiDeger, yeniDeger: Number(yeniDeger),
                eskiBirim, yeniBirim: yeniBirim || eskiBirim,
                degisiklikSebebi: degisiklikSebebi ||
                    `Otomatik mevzuat takip sistemi tarafından tespit edildi. PDF: ${versiyon.ad}`,
                degistirenKullanici: kullaniciId,
                degistirenAd: kullaniciAd,
            });

            guncellenenKurallar.push({
                _id: mevcutKural._id,
                kuralAdi: mevcutKural.kuralAdi,
                tehlikeSinifi: mevcutKural.tehlikeSinifi,
                eski: `${eskiDeger} ${eskiBirim}`,
                yeni: `${yeniDeger} ${yeniBirim || eskiBirim}`,
            });
            olusturulanAuditKayitlari.push(gecmis._id);
        }

        res.json({
            basarili: true,
            mesaj: guncellenenKurallar.length > 0
                ? `✅ Versiyon onaylandı ve ${guncellenenKurallar.length} kural güncellendi.`
                : '✅ Versiyon onaylandı (kural güncellemesi yapılmadı).',
            versiyon: { _id: versiyon._id, durum: versiyon.durum, onayTarihi: versiyon.onayTarihi },
            guncellenenKurallar,
            auditKayitSayisi: olusturulanAuditKayitlari.length,
        });

    } catch (err) {
        console.error('💥 onaylaVeUygula hatası:', err);
        res.status(500).json({ hata: 'Onaylama ve güncelleme başarısız.', detay: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ⭐ DİFF GÖRÜNTÜLEME (Adım 7.B)
// ═══════════════════════════════════════════════════════════════════════════

// ─── GET /api/mevzuat-takip/fark/:id ──────────────────────────────────────
// Bir versiyonun text içeriği ile bir önceki onaylı versiyon arasındaki
// farkı satır bazında döner. UI'da renkli diff görüntülemek için kullanılır.
//
// Yanıt formatı:
// {
//   basarili: true,
//   yeniVersiyon: { _id, ad, olusturmaTarihi, sayfaSayisi },
//   eskiVersiyon: { _id, ad, olusturmaTarihi, sayfaSayisi },
//   istatistik: { eklenen: N, silinen: N, degismeyen: N },
//   farklar: [
//     { tip: 'esit', metin: '...' },
//     { tip: 'eklendi', metin: '...' },
//     { tip: 'silindi', metin: '...' },
//   ]
// }
exports.farkGoster = async (req, res) => {
    try {
        const versiyon = await MevzuatVersiyon.findById(req.params.id).lean();
        if (!versiyon) {
            return res.status(404).json({ hata: 'Versiyon bulunamadı.' });
        }

        if (!versiyon.metinIcerik) {
            return res.status(400).json({
                hata: 'Bu versiyonun text içeriği yok. PDF text extraction başarısız olmuş olabilir.',
                ipucu: 'Yeniden tarama yapılırsa text otomatik çıkarılır.'
            });
        }

        // Bir önceki onaylı versiyonu bul
        const eskiVersiyon = await MevzuatVersiyon
            .findOne({
                anahtar: versiyon.anahtar,
                durum: { $in: ['onaylandi', 'yeni'] },
                olusturmaTarihi: { $lt: versiyon.olusturmaTarihi }
            })
            .sort({ olusturmaTarihi: -1 })
            .lean();

        if (!eskiVersiyon) {
            return res.json({
                basarili: true,
                mesaj: 'Karşılaştırılacak önceki versiyon yok (bu ilk versiyon).',
                yeniVersiyon: {
                    _id: versiyon._id, ad: versiyon.ad,
                    olusturmaTarihi: versiyon.olusturmaTarihi,
                },
                eskiVersiyon: null,
                farklar: [],
                istatistik: { eklenen: 0, silinen: 0, degismeyen: 0 },
            });
        }

        if (!eskiVersiyon.metinIcerik) {
            return res.json({
                basarili: true,
                mesaj: 'Önceki versiyonun text içeriği yok. Eski versiyonlar metin extraction\'dan önce indirilmiş olabilir.',
                yeniVersiyon: {
                    _id: versiyon._id, ad: versiyon.ad,
                    olusturmaTarihi: versiyon.olusturmaTarihi,
                },
                eskiVersiyon: {
                    _id: eskiVersiyon._id, ad: eskiVersiyon.ad,
                    olusturmaTarihi: eskiVersiyon.olusturmaTarihi,
                },
                farklar: [],
                istatistik: { eklenen: 0, silinen: 0, degismeyen: 0 },
            });
        }

        // ⭐ jsdiff ile sentence-level diff
        // diffSentences çok daha okunabilir sonuç verir (kelime kelime'den farkı:
        // cümle bazlı karşılaştırır, gereksiz değişiklikleri grupla gösterir)
        const farkParcalari = diff.diffSentences(
            eskiVersiyon.metinIcerik,
            versiyon.metinIcerik
        );

        const farklar = farkParcalari.map(parca => ({
            tip: parca.added ? 'eklendi' : (parca.removed ? 'silindi' : 'esit'),
            metin: parca.value,
        }));

        // İstatistik
        const istatistik = {
            eklenen: farklar.filter(f => f.tip === 'eklendi').length,
            silinen: farklar.filter(f => f.tip === 'silindi').length,
            degismeyen: farklar.filter(f => f.tip === 'esit').length,
        };

        res.json({
            basarili: true,
            yeniVersiyon: {
                _id: versiyon._id, ad: versiyon.ad,
                olusturmaTarihi: versiyon.olusturmaTarihi,
                boyutByte: versiyon.boyutByte,
            },
            eskiVersiyon: {
                _id: eskiVersiyon._id, ad: eskiVersiyon.ad,
                olusturmaTarihi: eskiVersiyon.olusturmaTarihi,
                boyutByte: eskiVersiyon.boyutByte,
            },
            istatistik,
            farklar,
        });

    } catch (err) {
        console.error('💥 farkGoster hatası:', err);
        res.status(500).json({ hata: 'Fark hesaplanamadı.', detay: err.message });
    }
};