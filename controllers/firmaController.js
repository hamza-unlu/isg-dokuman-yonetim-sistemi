// controllers/firmaController.js
const Firma    = require('../models/Firma');
const Personel = require('../models/Personel');
const Dokuman  = require('../models/Dokuman');
const Kullanici = require('../models/User'); // OTOMATİK KULLANICI OLUŞTURMAK İÇİN EKLENDİ

// ─── Tüm firmaları listele ───────────────────────────────────
exports.tumFirmalar = async (req, res) => {
  try {
    const { aktif, arama } = req.query;
    const filtre = {};
    const rol = req.kullanici.rol;
    const kullaniciId = req.kullanici._id;

    if (rol === 'sistem_yoneticisi') {
      // Yönetici her şeyi görür
    } 
    else if (rol === 'isg_uzmani' || rol === 'isyeri_hekimi') {
      filtre.ekleyenKullanici = kullaniciId;
    } 
    else if (rol === 'isveren') {
      filtre._id = req.kullanici.isverenFirma;
    }

    // SOFT DELETE FİLTRESİ
    if (aktif !== undefined) {
        filtre.aktif = aktif === 'true';
    } else {
        filtre.aktif = { $ne: false }; 
    }

    if (arama) filtre.firmaAdi = { $regex: arama, $options: 'i' };

    const firmalar = await Firma.find(filtre)
      .populate('isgUzmani', 'adSoyad eposta')
      .populate('ekleyenKullanici', 'adSoyad')
      .sort({ firmaAdi: 1 });

    res.json({ basari: true, sayi: firmalar.length, veri: firmalar });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};

// ─── Tek firma getir ─────────────────────────────────────────
exports.firmaGetir = async (req, res) => {
  try {
    const firma = await Firma.findById(req.params.id)
        .populate('isgUzmani', 'adSoyad eposta')
        .populate('ekleyenKullanici', 'adSoyad');
        
    if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı.' });

    const rol = req.kullanici.rol;
    const kullaniciId = req.kullanici._id.toString();

    // ROL BAZLI ERİŞİM KONTROLÜ (Okuma)
    if (rol === 'isveren' && String(req.kullanici.isverenFirma) !== String(firma._id)) {
      return res.status(403).json({ basari: false, mesaj: 'Bu firmaya erişim yetkiniz yok.' });
    }
    
    if ((rol === 'isg_uzmani' || rol === 'isyeri_hekimi') && String(firma.ekleyenKullanici._id) !== kullaniciId) {
       return res.status(403).json({ basari: false, mesaj: 'Sadece kendi eklediğiniz firmaları görüntüleyebilirsiniz.' });
    }

    res.json({ basari: true, veri: firma });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};

// ─── Yeni firma ekle (VE OTOMATİK KULLANICI OLUŞTUR) ─────────
exports.firmaEkle = async (req, res) => {
  try {
    if (req.kullanici.rol === 'isveren') {
        return res.status(403).json({ basari: false, mesaj: 'Firma ekleme yetkiniz yok.' });
    }

    const { sgkSicilDogrula, detsisNoDogrula, vergiNoDogrula, telefonDogrula, epostaDogrula } = require('../utils/validator');
    const formatKontrolu = (kontrol) => {
        if (!kontrol.gecerli) return res.status(400).json({ basari: false, mesaj: kontrol.hata });
    };

    // Tehlike sınıfı büyük/küçük harf düzeltmesi
    if (req.body.tehlikeSinifi) {
        const ts = req.body.tehlikeSinifi.toLowerCase();
        if (ts.includes('çok') || ts.includes('cok')) req.body.tehlikeSinifi = 'Çok Tehlikeli';
        else if (ts.includes('az')) req.body.tehlikeSinifi = 'Az Tehlikeli';
        else req.body.tehlikeSinifi = 'Tehlikeli';
    }

    req.body.ekleyenKullanici = req.kullanici._id;

    // 1. Firmayı Veritabanına Kaydet
    const firma = await Firma.create(req.body);

    // 2. OTOMATİK İŞVEREN HESABI OLUŞTURMA MANTIĞI
    if (req.body.eposta) {
        const epostaTemiz = req.body.eposta.toLowerCase().trim();
        
        // Bu e-posta ile kayıtlı biri var mı kontrol et
        const mevcutKullanici = await Kullanici.findOne({ eposta: epostaTemiz });
        
        // Eğer kayıtlı biri yoksa, yeni işveren hesabını oluştur
        if (!mevcutKullanici) {
            await Kullanici.create({
                adSoyad: req.body.yetkiliKisi || firma.firmaAdi,
                eposta: epostaTemiz,
                sifre: 'Isveren123!', // Varsayılan Şifre 
                rol: 'isveren',
                isverenFirma: firma._id, 
                aktif: true
            });
            console.log(`🎉 BAŞARILI: ${epostaTemiz} adresine otomatik işveren hesabı açıldı! Şifre: Isveren123!`);
        } else {
            console.log(`⚠️ UYARI: ${epostaTemiz} adresi zaten sistemde var. Yeni hesap açılmadı.`);
        
        }
    }

    res.status(201).json({ basari: true, mesaj: 'Firma ve işveren hesabı başarıyla oluşturuldu.', veri: firma });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const mesajlar = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ basari: false, mesaj: mesajlar.join(', ') });
    }
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};

// ─── Firma güncelle ──────────────────────────────────────────
exports.firmaGuncelle = async (req, res) => {
  try {
    const firmaId = req.params.id;
    if (!firmaId || firmaId === 'undefined' || firmaId === 'null') {
        return res.status(400).json({ basari: false, mesaj: 'Geçersiz firma kimliği.' });
    }

    const { sgkSicilDogrula, detsisNoDogrula, vergiNoDogrula, telefonDogrula, epostaDogrula } = require('../utils/validator');
    const formatKontrolu = (kontrol) => {
        if (!kontrol.gecerli) return res.status(400).json({ basari: false, mesaj: kontrol.hata });
    };

    const firma = await Firma.findById(firmaId);
    if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı.' });

    const rol = req.kullanici.rol;
    const kullaniciId = req.kullanici._id.toString();

    if (rol === 'isveren') {
        return res.status(403).json({ basari: false, mesaj: 'Firmayı düzenleme yetkiniz yok.' });
    }
    if ((rol === 'isg_uzmani' || rol === 'isyeri_hekimi') && String(firma.ekleyenKullanici) !== kullaniciId) {
        return res.status(403).json({ basari: false, mesaj: 'Sadece kendi eklediğiniz firmaları düzenleyebilirsiniz.' });
    }

    if (req.body.tehlikeSinifi) {
        const ts = req.body.tehlikeSinifi.toLowerCase();
        if (ts.includes('çok') || ts.includes('cok')) req.body.tehlikeSinifi = 'Çok Tehlikeli';
        else if (ts.includes('az')) req.body.tehlikeSinifi = 'Az Tehlikeli';
        else req.body.tehlikeSinifi = 'Tehlikeli';
    }

    // ✅ SADECE BU KISIM DEĞİŞTİ — isg alanını $set ile güncelle
    let updateQuery;
    if (req.body.isg) {
        // isg alt alanlarını tek tek $set yap — diğer isg alanlarını silme
        const setFields = {};
        Object.keys(req.body.isg).forEach(key => {
            setFields[`isg.${key}`] = req.body.isg[key];
        });
        // isg dışındaki body alanlarını da ekle (firmaAdi, telefon vs.)
        const { isg, ...digerAlanlar } = req.body;
        Object.keys(digerAlanlar).forEach(key => {
            setFields[key] = digerAlanlar[key];
        });
        updateQuery = { $set: setFields };
    } else {
        // isg yoksa eski davranış
        updateQuery = req.body;
    }

    const guncellenenFirma = await Firma.findByIdAndUpdate(firmaId, updateQuery, {
        new: true,
        runValidators: false,
    });

    res.json({ basari: true, mesaj: 'Firma başarıyla güncellendi.', veri: guncellenenFirma });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};
// ─── Firma sil (soft delete) ─────────────────────────────────
exports.firmaSil = async (req, res) => {
  try {
    const firmaId = req.params.id;
    
    if (!firmaId || firmaId === 'undefined' || firmaId === 'null') {
        return res.status(400).json({ basari: false, mesaj: 'Geçersiz firma kimliği. Tarayıcınızı yenileyin.' });
    }

    const firma = await Firma.findByIdAndUpdate(
      firmaId,
      { aktif: false },
      { new: true }
    );
    
    if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı veya zaten silinmiş.' });
    res.json({ basari: true, mesaj: 'Firma başarıyla pasif duruma getirildi.' });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};

// ─── Firma istatistikleri ────────────────────────────────────
exports.firmaIstatistik = async (req, res) => {
  try {
    const firmaId = req.params.id;
    const [personelSayisi, dokumanSayisi, aktifPersonel] = await Promise.all([
      Personel.countDocuments({ firma: firmaId }),
      Dokuman.countDocuments({ firma: firmaId }),
      Personel.countDocuments({ firma: firmaId, aktif: true }),
    ]);

    const kritikDokumanlar = await Dokuman.countDocuments({
      firma: firmaId,
      durum: { $in: ['suresi_dolmus', 'yaklasan'] },
    });

    res.json({
      basari: true,
      veri: { personelSayisi, dokumanSayisi, aktifPersonel, kritikDokumanlar },
    });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};