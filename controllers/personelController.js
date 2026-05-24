// controllers/personelController.js
const Personel  = require('../models/Personel');
const Firma     = require('../models/Firma');
const mongoose  = require('mongoose');
const { tcKimlikDogrula } = require('../utils/validator'); // ⭐ YENİ

const tarihCevir = (tarihStr) => {
    if (!tarihStr) return null;
    if (typeof tarihStr === 'string' && tarihStr.includes('.')) {
        const p = tarihStr.split('.');
        return new Date(`${p[2]}-${p[1]}-${p[0]}T12:00:00Z`);
    }
    return new Date(tarihStr);
};

const firmaIdCoz = async (firmaRaw) => {
    if (!firmaRaw) return null;
    const firmaStr = String(firmaRaw).trim();
    if (mongoose.Types.ObjectId.isValid(firmaStr) && firmaStr.match(/^[0-9a-fA-F]{24}$/)) {
        return new mongoose.Types.ObjectId(firmaStr);
    }
    const bulunanFirma = await Firma.findOne({ firmaAdi: new RegExp(`^${firmaStr}$`, 'i') });
    if (!bulunanFirma) return null;
    return bulunanFirma._id;
};

exports.tumPersonel = async (req, res) => {
    try {
        const { firmaId, aktif, arama, destekRol } = req.query;
        const rol         = req.kullanici.rol;
        const kullaniciId = req.kullanici._id;
        const filtre      = {};

        if (rol === 'isg_uzmani' || rol === 'isyeri_hekimi') {
            const benimFirmalar = await Firma.find(
                { ekleyenKullanici: kullaniciId, aktif: { $ne: false } },
                '_id'
            );
            filtre.firma = { $in: benimFirmalar.map(f => f._id) };
        }
        else if (rol === 'isveren') {
            filtre.firma = req.kullanici.isverenFirma;
        }

        if (firmaId && rol === 'sistem_yoneticisi') filtre.firma = firmaId;
        if (aktif !== undefined) filtre.aktif = aktif === 'true';
        else filtre.aktif = { $ne: false };
        if (arama) filtre.adSoyad = { $regex: arama, $options: 'i' };
        if (destekRol) filtre.destekRolleri = destekRol;

        const personeller = await Personel.find(filtre)
            .populate('firma', 'firmaAdi tehlikeSinifi')
            .sort({ adSoyad: 1 });

        res.json({ basari: true, sayi: personeller.length, veri: personeller });
    } catch (err) {
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

exports.personelGetir = async (req, res) => {
    try {
        const personel = await Personel.findById(req.params.id).populate('firma', 'firmaAdi tehlikeSinifi');
        if (!personel) return res.status(404).json({ basari: false, mesaj: 'Personel bulunamadı.' });
        res.json({ basari: true, veri: personel });
    } catch (err) {
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

exports.personelEkle = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body[0] : req.body;
        if (!data) return res.status(400).json({ basari: false, mesaj: "Veri gönderilmedi." });

        if (!data.firma) return res.status(400).json({ basari: false, mesaj: 'Firma seçimi zorunludur.' });

        // ⭐ TC KİMLİK FORMAT KONTROLÜ
        const tcDeger = data.tcKimlik || data.tc;
        if (tcDeger) {
            const tcKontrol = tcKimlikDogrula(tcDeger);
            if (!tcKontrol.gecerli) {
                return res.status(400).json({ basari: false, mesaj: tcKontrol.hata });
            }
            // Mükerrer TC kontrolü (aynı TC ile birden fazla aktif personel olmamalı)
            const mevcut = await Personel.findOne({
                tcKimlik: tcDeger,
                aktif: { $ne: false }
            });
            if (mevcut) {
                return res.status(400).json({
                    basari: false,
                    mesaj: `Bu TC Kimlik No zaten kayıtlı: ${mevcut.adSoyad}`
                });
            }
        }

        const firmaId = await firmaIdCoz(data.firma);
        if (!firmaId) return res.status(400).json({ basari: false, mesaj: 'Firma veritabanında bulunamadı.' });

        const firma = await Firma.findById(firmaId);
        if (!firma) return res.status(404).json({ basari: false, mesaj: 'Belirtilen firma bulunamadı.' });

        const eklenecekVeri = {
            firma:          firmaId,
            adSoyad:        data.adSoyad || data.ad,
            tcKimlik:       tcDeger || '',
            gorev:          data.gorev || data.pozisyon || '',
            iseGirisTarihi: tarihCevir(data.iseGirisTarihi || data.tarih),
        };

        const personel = await Personel.create(eklenecekVeri);
        await personel.populate('firma', 'firmaAdi tehlikeSinifi');

        res.status(201).json({ basari: true, mesaj: 'Personel başarıyla eklendi.', veri: personel });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const mesajlar = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ basari: false, mesaj: mesajlar.join(', ') });
        }
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

exports.personelGuncelle = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body[0] : req.body;

        const personel = await Personel.findById(req.params.id);
        if (!personel) return res.status(404).json({ basari: false, mesaj: 'Personel bulunamadı.' });

        // ⭐ TC KİMLİK FORMAT KONTROLÜ (değişiyorsa)
        const yeniTc = data.tcKimlik || data.tc;
        if (yeniTc && yeniTc !== personel.tcKimlik) {
            const tcKontrol = tcKimlikDogrula(yeniTc);
            if (!tcKontrol.gecerli) {
                return res.status(400).json({ basari: false, mesaj: tcKontrol.hata });
            }
            // Mükerrer kontrolü (kendisi hariç)
            const mevcut = await Personel.findOne({
                tcKimlik: yeniTc,
                _id: { $ne: personel._id },
                aktif: { $ne: false }
            });
            if (mevcut) {
                return res.status(400).json({
                    basari: false,
                    mesaj: `Bu TC Kimlik No başka bir personele kayıtlı: ${mevcut.adSoyad}`
                });
            }
        }

        if (data.adSoyad || data.ad)            personel.adSoyad        = data.adSoyad || data.ad;
        if (yeniTc)                              personel.tcKimlik       = yeniTc;
        if (data.gorev || data.pozisyon)        personel.gorev          = data.gorev || data.pozisyon;
        if (data.iseGirisTarihi || data.tarih)  personel.iseGirisTarihi = tarihCevir(data.iseGirisTarihi || data.tarih);

        if (data.firma) {
            const firmaId = await firmaIdCoz(data.firma);
            if (!firmaId) return res.status(400).json({ basari: false, mesaj: 'Firma veritabanında bulunamadı.' });
            personel.firma = firmaId;
        }

        await personel.save();
        await personel.populate('firma', 'firmaAdi tehlikeSinifi');

        res.json({ basari: true, mesaj: 'Personel güncellendi.', veri: personel });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const mesajlar = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ basari: false, mesaj: mesajlar.join(', ') });
        }
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

exports.personelSil = async (req, res) => {
    try {
        const personel = await Personel.findByIdAndUpdate(req.params.id, { aktif: false }, { new: true });
        if (!personel) return res.status(404).json({ basari: false, mesaj: 'Personel bulunamadı.' });
        res.json({ basari: true, mesaj: 'Personel pasif duruma getirildi.' });
    } catch (err) {
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

exports.personelUyarilari = async (req, res) => {
    try {
        const { firmaId } = req.query;
        const filtre = { aktif: true };
        if (firmaId) filtre.firma = firmaId;
        if (req.kullanici.rol === 'isveren') filtre.firma = req.kullanici.isverenFirma;

        const simdi   = new Date();
        const otuzGun = new Date();
        otuzGun.setDate(simdi.getDate() + 30);

        const personeller = await Personel.find(filtre).populate('firma', 'firmaAdi tehlikeSinifi').lean();

        const uyarilar = [];
        personeller.forEach(p => {
            const kontrolEt = (tarih, tur) => {
                if (!tarih) return;
                const bitis = new Date(tarih);
                if (bitis < simdi)         uyarilar.push({ tur, durum: 'suresi_dolmus', personel: p.adSoyad, firma: p.firma?.firmaAdi, tarih: bitis });
                else if (bitis <= otuzGun) uyarilar.push({ tur, durum: 'yaklasan',      personel: p.adSoyad, firma: p.firma?.firmaAdi, tarih: bitis });
            };
            kontrolEt(p.muayene?.gecerlilikBitis,   'muayene');
            kontrolEt(p.egitim?.gecerlilikBitis,    'egitim');
            kontrolEt(p.ilkyardim?.gecerlilikBitis, 'ilkyardim');
        });

        res.json({ basari: true, sayi: uyarilar.length, veri: uyarilar });
    } catch (err) {
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};