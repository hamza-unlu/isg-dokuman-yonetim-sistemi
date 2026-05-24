// controllers/authController.js
const crypto     = require('crypto');
const fs         = require('fs');
const path       = require('path');
const Kullanici  = require('../models/User');
const jwt        = require('jsonwebtoken');
const { emailGonder, sifreSifirlamaSablonu } = require('../utils/emailGonder');

const tokenOlustur = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '8h'
    });
};

// ─────────────────────────────────────────
// ⭐ AÇIK KAYIT (yeni kullanıcı kendi hesabını oluşturur)
// Sadece isg_uzmani ve isyeri_hekimi rolüyle kayıt olunabilir.
// sistem_yoneticisi ve isveren rolleri kayıtla ALINMAZ — atanır.
// ─────────────────────────────────────────
exports.kayitOl = async (req, res) => {
    try {
        let { adSoyad, eposta, sifre, sifreTekrar, rol } = req.body;

        // ─── Doğrulama ───
        if (!adSoyad || !eposta || !sifre) {
            return res.status(400).json({ hata: 'Ad Soyad, e-posta ve şifre zorunludur.' });
        }
        if (sifre.length < 6) {
            return res.status(400).json({ hata: 'Şifre en az 6 karakter olmalıdır.' });
        }
        if (sifreTekrar !== undefined && sifre !== sifreTekrar) {
            return res.status(400).json({ hata: 'Şifreler birbiriyle eşleşmiyor.' });
        }

        // ─── Rol güvenlik kısıtlaması (KRİTİK) ───
        const IZIN_VERILEN_ROLLER = ['isg_uzmani', 'isyeri_hekimi'];
        if (!rol || !IZIN_VERILEN_ROLLER.includes(rol)) {
            // Geçersiz/boş/yasaklı rol gelirse varsayılan olarak isg_uzmani ata
            // (sistem_yoneticisi veya isveren ASLA kayıtla verilemez)
            rol = 'isg_uzmani';
        }

        eposta = eposta.toLowerCase().trim();

        // ─── E-posta zaten var mı? ───
        const epostaVarMi = await Kullanici.findOne({ eposta });
        if (epostaVarMi) {
            return res.status(400).json({ hata: 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.' });
        }

        // ─── Kullanıcıyı oluştur (şifre pre-save hook ile hashlenecek) ───
        const yeniKullanici = await Kullanici.create({
            adSoyad: adSoyad.trim(),
            eposta,
            sifre,
            rol,
            isverenFirma: null,
            aktif: true,
        });

        // ─── Otomatik giriş için token üret ───
        const token = tokenOlustur(yeniKullanici._id);

        res.status(201).json({
            basarili: true,
            mesaj: 'Hesabınız başarıyla oluşturuldu.',
            token,
            kullanici: {
                _id:          yeniKullanici._id,
                adSoyad:      yeniKullanici.adSoyad,
                eposta:       yeniKullanici.eposta,
                rol:          yeniKullanici.rol,
                isverenFirma: yeniKullanici.isverenFirma,
                profilFoto:   yeniKullanici.profilFoto,
            },
        });

    } catch (error) {
        // Mongoose unique hatası (yarış durumu)
        if (error.code === 11000) {
            return res.status(400).json({ hata: 'Bu e-posta adresi zaten kayıtlı.' });
        }
        res.status(500).json({ hata: 'Kayıt sırasında sunucu hatası oluştu.', detay: error.message });
    }
};
// ─────────────────────────────────────────
// GİRİŞ YAP
// ─────────────────────────────────────────
exports.girisYap = async (req, res) => {
    try {
        let { eposta, sifre } = req.body;

        if (!eposta || !sifre) {
            return res.status(400).json({ hata: 'Lütfen e-posta ve şifre giriniz.' });
        }

        eposta = eposta.toLowerCase().trim();
        const kullanici = await Kullanici.findOne({ eposta }).select('+sifre');

        if (!kullanici) {
            return res.status(401).json({ hata: 'Kullanıcı bulunamadı. E-posta adresiniz sistemde yok.' });
        }

        const sifreDogruMu = await kullanici.sifreKontrol(sifre);
        if (!sifreDogruMu) {
            return res.status(401).json({ hata: 'Şifreniz hatalı. Lütfen tekrar deneyin.' });
        }

        if (!kullanici.aktif) {
            return res.status(401).json({ hata: 'Hesabınız pasif durumdadır. Yöneticinizle iletişime geçin.' });
        }

        kullanici.sonGiris = new Date();
        await kullanici.save({ validateBeforeSave: false });

        const token = tokenOlustur(kullanici._id);

        res.status(200).json({
            basarili: true,
            token,
            kullanici: {
                _id: kullanici._id,
                adSoyad: kullanici.adSoyad,
                eposta: kullanici.eposta,
                rol: kullanici.rol,
                isverenFirma: kullanici.isverenFirma,
                profilFoto: kullanici.profilFoto // ⭐ EKLENDİ
            }
        });

    } catch (error) {
        res.status(500).json({ hata: 'Giriş işlemi sırasında sunucu hatası oluştu.', detay: error.message });
    }
};

// ─────────────────────────────────────────
// MEVCUT KULLANICI BİLGİSİ
// ─────────────────────────────────────────
exports.mevcutKullanici = async (req, res) => {
    try {
        res.status(200).json({
            basarili: true,
            kullanici: req.kullanici
        });
    } catch (error) {
        res.status(500).json({ hata: 'Kullanıcı bilgileri alınamadı.' });
    }
};

// ═════════════════════════════════════════
// ⭐ YENİ: PROFİL FOTOĞRAFI YÜKLE
// POST /api/auth/profil-foto
// ═════════════════════════════════════════
exports.profilFotoYukle = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ hata: 'Lütfen bir fotoğraf seçiniz.' });
        }

        const kullanici = await Kullanici.findById(req.kullanici._id);
        if (!kullanici) {
            return res.status(404).json({ hata: 'Kullanıcı bulunamadı.' });
        }

        // Eski fotoğrafı sil (varsa)
        if (kullanici.profilFoto) {
            const eskiDosyaYolu = path.join(__dirname, '..', 'public', kullanici.profilFoto);
            if (fs.existsSync(eskiDosyaYolu)) {
                try {
                    fs.unlinkSync(eskiDosyaYolu);
                } catch (silmeHatasi) {
                    console.warn('Eski profil fotoğrafı silinemedi:', silmeHatasi.message);
                }
            }
        }

        // Yeni fotoğraf yolunu kaydet (public'e göreceli)
        const fotoYolu = `/uploads/profil/${req.file.filename}`;
        kullanici.profilFoto = fotoYolu;
        await kullanici.save({ validateBeforeSave: false });

        res.status(200).json({
            basarili: true,
            mesaj: 'Profil fotoğrafınız başarıyla güncellendi.',
            profilFoto: fotoYolu
        });

    } catch (error) {
        // Hata durumunda yüklenen dosyayı temizle
        if (req.file && req.file.path) {
            try { fs.unlinkSync(req.file.path); } catch {}
        }
        res.status(500).json({ hata: 'Fotoğraf yüklenirken bir hata oluştu.', detay: error.message });
    }
};

// ═════════════════════════════════════════
// ⭐ YENİ: PROFİL FOTOĞRAFINI SİL
// DELETE /api/auth/profil-foto
// ═════════════════════════════════════════
exports.profilFotoSil = async (req, res) => {
    try {
        const kullanici = await Kullanici.findById(req.kullanici._id);
        if (!kullanici) {
            return res.status(404).json({ hata: 'Kullanıcı bulunamadı.' });
        }

        if (kullanici.profilFoto) {
            const dosyaYolu = path.join(__dirname, '..', 'public', kullanici.profilFoto);
            if (fs.existsSync(dosyaYolu)) {
                try { fs.unlinkSync(dosyaYolu); } catch {}
            }
            kullanici.profilFoto = null;
            await kullanici.save({ validateBeforeSave: false });
        }

        res.status(200).json({
            basarili: true,
            mesaj: 'Profil fotoğrafı kaldırıldı.'
        });

    } catch (error) {
        res.status(500).json({ hata: 'İşlem sırasında hata oluştu.', detay: error.message });
    }
};

// ═════════════════════════════════════════
// ⭐ YENİ: ŞİFRE DEĞİŞTİR (giriş yapmış kullanıcı için)
// POST /api/auth/sifre-degistir
// ═════════════════════════════════════════
exports.sifreDegistir = async (req, res) => {
    try {
        const { mevcutSifre, yeniSifre, yeniSifreTekrar } = req.body;

        if (!mevcutSifre || !yeniSifre || !yeniSifreTekrar) {
            return res.status(400).json({ hata: 'Tüm alanları doldurunuz.' });
        }

        if (yeniSifre !== yeniSifreTekrar) {
            return res.status(400).json({ hata: 'Yeni şifreler birbirini tutmuyor.' });
        }

        if (yeniSifre.length < 6) {
            return res.status(400).json({ hata: 'Yeni şifre en az 6 karakter olmalıdır.' });
        }

        if (mevcutSifre === yeniSifre) {
            return res.status(400).json({ hata: 'Yeni şifre mevcut şifre ile aynı olamaz.' });
        }

        // Kullanıcıyı şifresi ile birlikte çek
        const kullanici = await Kullanici.findById(req.kullanici._id).select('+sifre');
        if (!kullanici) {
            return res.status(404).json({ hata: 'Kullanıcı bulunamadı.' });
        }

        // Mevcut şifreyi doğrula
        const dogruMu = await kullanici.sifreKontrol(mevcutSifre);
        if (!dogruMu) {
            return res.status(401).json({ hata: 'Mevcut şifreniz hatalı.' });
        }

        // Yeni şifreyi ata (pre('save') hook bcrypt ile hash'leyecek)
        kullanici.sifre = yeniSifre;
        await kullanici.save();

        res.status(200).json({
            basarili: true,
            mesaj: 'Şifreniz başarıyla değiştirildi.'
        });

    } catch (error) {
        res.status(500).json({ hata: 'Şifre değiştirme sırasında hata oluştu.', detay: error.message });
    }
};

// ─────────────────────────────────────────
// KULLANICI EKLE (sadece sistem_yoneticisi)
// ─────────────────────────────────────────
exports.kullaniciEkle = async (req, res) => {
    try {
        let { adSoyad, eposta, sifre, rol, isverenFirma } = req.body;

        if (!adSoyad || !eposta || !sifre) {
            return res.status(400).json({ hata: 'Ad Soyad, E-posta ve Şifre zorunludur.' });
        }

        eposta = eposta.toLowerCase().trim();

        const epostaVarMi = await Kullanici.findOne({ eposta });
        if (epostaVarMi) {
            return res.status(400).json({ hata: 'Bu e-posta adresi zaten sistemde kayıtlı.' });
        }

        if (!rol) rol = 'isg_uzmani';

        const yeniKullanici = await Kullanici.create({
            adSoyad, eposta, sifre, rol,
            isverenFirma: isverenFirma || null
        });

        res.status(201).json({ basarili: true, mesaj: 'Kullanıcı başarıyla eklendi.', kullanici: yeniKullanici });
    } catch (error) {
        res.status(500).json({ hata: 'Kullanıcı eklenirken bir hata oluştu.', detay: error.message });
    }
};

// ─────────────────────────────────────────
// KULLANICILARI LİSTELE
// ─────────────────────────────────────────
exports.kullanicilariListele = async (req, res) => {
    try {
        const liste = await Kullanici.find({}, '-sifre').sort({ olusturmaTarihi: -1 });
        res.json(liste);
    } catch (e) {
        res.status(500).json({ hata: e.message });
    }
};

// ─────────────────────────────────────────
// ROL GÜNCELLE
// ─────────────────────────────────────────
exports.rolGuncelle = async (req, res) => {
    try {
        const { rol } = req.body;
        const gecerliRoller = ['sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi', 'isveren', 'izleyici'];

        if (!gecerliRoller.includes(rol)) {
            return res.status(400).json({ hata: 'Geçersiz rol değeri.' });
        }

        if (String(req.params.id) === String(req.kullanici._id)) {
            return res.status(400).json({ hata: 'Kendi rolünüzü değiştiremezsiniz.' });
        }

        await Kullanici.findByIdAndUpdate(req.params.id, { rol });
        res.json({ basarili: true, mesaj: 'Rol güncellendi.' });
    } catch (e) {
        res.status(500).json({ hata: e.message });
    }
};

// ─────────────────────────────────────────
// KULLANICI SİL
// ─────────────────────────────────────────
exports.kullaniciSil = async (req, res) => {
    try {
        if (String(req.params.id) === String(req.kullanici._id)) {
            return res.status(400).json({ hata: 'Kendi hesabınızı silemezsiniz.' });
        }

        const silinen = await Kullanici.findByIdAndDelete(req.params.id);
        if (!silinen) {
            return res.status(404).json({ hata: 'Kullanıcı bulunamadı.' });
        }

        res.json({ basarili: true, mesaj: 'Kullanıcı silindi.' });
    } catch (e) {
        res.status(500).json({ hata: e.message });
    }
};

// ═════════════════════════════════════════
// ŞİFREMİ UNUTTUM
// ═════════════════════════════════════════
exports.sifreUnuttum = async (req, res) => {
    try {
        let { eposta } = req.body;

        if (!eposta) {
            return res.status(400).json({ hata: 'E-posta adresi zorunludur.' });
        }

        eposta = eposta.toLowerCase().trim();
        const kullanici = await Kullanici.findOne({ eposta });

        if (!kullanici) {
            return res.status(200).json({
                basarili: true,
                mesaj: 'Eğer bu e-posta sistemde kayıtlıysa, sıfırlama bağlantısı gönderildi.'
            });
        }

        if (!kullanici.aktif) {
            return res.status(200).json({
                basarili: true,
                mesaj: 'Eğer bu e-posta sistemde kayıtlıysa, sıfırlama bağlantısı gönderildi.'
            });
        }

        const hamToken = kullanici.sifreSifirlamaTokenUret();
        await kullanici.save({ validateBeforeSave: false });

        const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
        const resetUrl = `${baseUrl}/sifre-sifirla/${hamToken}`;

        try {
            await emailGonder({
                kime: kullanici.eposta,
                konu: 'ÜNLÜ İSG — Şifre Sıfırlama Talebi',
                html: sifreSifirlamaSablonu(kullanici.adSoyad, resetUrl)
            });

            return res.status(200).json({
                basarili: true,
                mesaj: 'Eğer bu e-posta sistemde kayıtlıysa, sıfırlama bağlantısı gönderildi.'
            });
        } catch (emailHata) {
            kullanici.sifreSifirlamaToken  = undefined;
            kullanici.sifreSifirlamaSuresi = undefined;
            await kullanici.save({ validateBeforeSave: false });

            console.error('E-posta gönderim hatası:', emailHata.message);
            return res.status(500).json({
                hata: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.'
            });
        }
    } catch (error) {
        res.status(500).json({ hata: 'İşlem sırasında sunucu hatası oluştu.', detay: error.message });
    }
};

// ═════════════════════════════════════════
// ŞİFREYİ SIFIRLA (token ile — oturumsuz)
// ═════════════════════════════════════════
exports.sifreSifirla = async (req, res) => {
    try {
        const { token }    = req.params;
        const { yeniSifre } = req.body;

        if (!yeniSifre || yeniSifre.length < 6) {
            return res.status(400).json({ hata: 'Şifre en az 6 karakter olmalıdır.' });
        }

        const hashliToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const kullanici = await Kullanici.findOne({
            sifreSifirlamaToken:  hashliToken,
            sifreSifirlamaSuresi: { $gt: Date.now() }
        }).select('+sifreSifirlamaToken +sifreSifirlamaSuresi');

        if (!kullanici) {
            return res.status(400).json({
                hata: 'Bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir sıfırlama talebi oluşturun.'
            });
        }

        kullanici.sifre = yeniSifre;
        kullanici.sifreSifirlamaToken  = undefined;
        kullanici.sifreSifirlamaSuresi = undefined;
        await kullanici.save();

        res.status(200).json({
            basarili: true,
            mesaj: 'Şifreniz başarıyla güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.'
        });
    } catch (error) {
        res.status(500).json({ hata: 'Şifre sıfırlama sırasında hata oluştu.', detay: error.message });
    }
};