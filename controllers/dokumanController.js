// controllers/dokumanController.js
const Dokuman = require('../models/Dokuman');
const User     = require('../models/User');
const Firma            = require('../models/Firma');
const { emailGonder }  = require('../utils/emailGonder');

// ─── Tüm dokümanları listele ──────────────────────────────────────────────────
exports.tumDokumanlar = async (req, res) => {
  try {
    const { firmaId, tur, durum, arama, kategori } = req.query;
    const filtre = {};

    if (firmaId) filtre.firma = firmaId;

    // isveren yalnızca kendi firmasını görebilir
    if (req.kullanici.rol === 'isveren') {
      filtre.firma = req.kullanici.isverenFirma;
    }

    if (tur)      filtre.tur      = tur;
    if (kategori) filtre.kategori = kategori;
    if (arama)    filtre.baslik   = { $regex: arama, $options: 'i' };

    let dokumanlar = await Dokuman.find(filtre)
      .populate('firma',    'firmaAdi')
      .populate('kaydeden', 'adSoyad email')   // User modelinden ad ve e-posta
      .sort({ belgeTarihi: -1 });

    // durum sanal özellik olduğu için JS tarafında filtrele
    if (durum) {
      dokumanlar = dokumanlar.filter(d => d.durum === durum);
    }

    res.json({ basari: true, sayi: dokumanlar.length, veri: dokumanlar });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};

// ─── Tek doküman getir ────────────────────────────────────────────────────────
exports.dokumanGetir = async (req, res) => {
  try {
    const dokuman = await Dokuman.findById(req.params.id)
      .populate('firma',    'firmaAdi tehlikeSinifi')
      .populate('kaydeden', 'adSoyad email');

    if (!dokuman) {
      return res.status(404).json({ basari: false, mesaj: 'Doküman bulunamadı.' });
    }
    res.json({ basari: true, veri: dokuman });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};

// ─── Doküman ekle ─────────────────────────────────────────────────────────────
exports.dokumanEkle = async (req, res) => {
  try {
    const kullanici = req.kullanici;

    const veri = {
      ...req.body,
      kaydeden:  kullanici._id,
      // Ekleyen kişinin adını denormalize olarak da sakla
      // → populate olmadan bile "kim ekledi" bilgisine hızlı erişilir
      ekleyenAd: kullanici.adSoyad || kullanici.email || '',
    };

    const dokuman = await Dokuman.create(veri);

    // Yanıta firma adını ekle
    await dokuman.populate('firma',    'firmaAdi');
    await dokuman.populate('kaydeden', 'adSoyad email');

    res.status(201).json({ basari: true, mesaj: 'Doküman eklendi.', veri: dokuman });
  } catch (err) {
    res.status(400).json({ basari: false, mesaj: err.message });
  }
};

// ─── Doküman güncelle ─────────────────────────────────────────────────────────
exports.dokumanGuncelle = async (req, res) => {
  try {
    const dokuman = await Dokuman.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('firma',    'firmaAdi')
      .populate('kaydeden', 'adSoyad email');

    if (!dokuman) {
      return res.status(404).json({ basari: false, mesaj: 'Doküman bulunamadı.' });
    }
    res.json({ basari: true, mesaj: 'Doküman güncellendi.', veri: dokuman });
  } catch (err) {
    res.status(400).json({ basari: false, mesaj: err.message });
  }
};

// ─── Doküman sil ──────────────────────────────────────────────────────────────
exports.dokumanSil = async (req, res) => {
  try {
    const dokuman = await Dokuman.findByIdAndDelete(req.params.id);
    if (!dokuman) {
      return res.status(404).json({ basari: false, mesaj: 'Doküman bulunamadı.' });
    }
    res.json({ basari: true, mesaj: 'Doküman başarıyla silindi.' });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};

// ─── Kritik dokümanlar (süresi dolmuş + yaklaşan) ─────────────────────────────
exports.kritikDokumanlar = async (req, res) => {
  try {
    const filtre = { gecerlilikBitis: { $ne: null } };

    if (req.kullanici.rol === 'isveren') {
      filtre.firma = req.kullanici.isverenFirma;
    }

    let dokumanlar = await Dokuman.find(filtre)
      .populate('firma',    'firmaAdi')
      .populate('kaydeden', 'adSoyad email')
      .sort({ gecerlilikBitis: 1 });

    // Sanal `durum` üzerinden filtrele
    const kritik = dokumanlar
      .filter(d => d.durum === 'suresi_dolmus' || d.durum === 'yaklasan')
      .slice(0, 20);   // performans için en kritik 20 kayıt

    res.json({ basari: true, sayi: kritik.length, veri: kritik });
  } catch (err) {
    res.status(500).json({ basari: false, mesaj: err.message });
  }
};
// ─── Yardımcı: base64 dataUrl → Nodemailer attachment ─────────────────────────
function _dataUrlToAttachment(dataUrl, filename) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null;
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    return {
        filename:    filename || 'belge',
        content:     match[2],
        encoding:    'base64',
        contentType: match[1],
    };
}

function _trTarih(iso) {
    if (!iso) return '';
    const [y, m, d] = String(iso).split('-');
    if (!y || !m || !d) return iso;
    return `${d}.${m}.${y}`;
}

function _difDofMailSablonu({ firmaAdi, hazirlanmaTarihi, sonGecerlilikTarihi, belgeSayisi }) {
    const ekSatiri = belgeSayisi > 0
        ? `<p style="color:#334155;line-height:1.6;">📎 İlgili belge${belgeSayisi > 1 ? 'ler' : ''} bu e-postanın ek${belgeSayisi > 1 ? 'lerinde' : 'inde'} yer almaktadır.</p>`
        : '';

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
        <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #3b82f6;">
            <h2 style="color: #1e40af; margin: 0;">🛡️ ÜNLÜ İSG</h2>
            <p style="color: #64748b; margin: 4px 0 0;">İSG Doküman Yönetim Sistemi</p>
        </div>
        <div style="padding: 24px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">📄 DİF / DÖF Belgesi Bildirimi</h3>
            <p style="color: #334155; line-height: 1.6;">
                Sayın İlgili,<br><br>
                <strong>${firmaAdi}</strong> firmasına ait DİF/DÖF belgesi sisteme yüklenmiştir.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden;">
                ${hazirlanmaTarihi ? `
                <tr>
                    <td style="padding: 12px 16px; ${sonGecerlilikTarihi ? 'border-bottom: 1px solid #e2e8f0;' : ''} font-weight: 600; color: #475569; width: 45%;">Hazırlanma Tarihi</td>
                    <td style="padding: 12px 16px; ${sonGecerlilikTarihi ? 'border-bottom: 1px solid #e2e8f0;' : ''}">${_trTarih(hazirlanmaTarihi)}</td>
                </tr>` : ''}
                ${sonGecerlilikTarihi ? `
                <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Son Geçerlilik Tarihi</td>
                    <td style="padding: 12px 16px;">${_trTarih(sonGecerlilikTarihi)}</td>
                </tr>` : ''}
            </table>
            ${ekSatiri}
            <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin-top: 24px;">
                Bilgilerinize sunarız.
            </p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
            Bu e-posta <strong>ÜNLÜ İSG Doküman Yönetim Sistemi</strong> tarafından otomatik olarak gönderilmiştir.
        </div>
    </div>`;
}

// ─── Doküman bildirimi gönder (DİF/DÖF ve benzeri) ────────────────────────────


exports.mobilAnasayfaVerileri = async (req, res) => {
    try {
        const Firma     = require('../models/Firma');
        const VeriDepo  = require('../models/VeriDepo');
        const Egitim    = require('../models/Egitim');
        const rol         = req.kullanici.rol;
        const kullaniciId = req.kullanici._id;

        // 1) Kullanıcının yetkili olduğu firmaları bul (yetki mantığı web ile aynı)
        const firmaFiltre = { aktif: { $ne: false } };
        if (rol === 'sistem_yoneticisi') {
            // Yönetici tüm firmaları görür
        } else if (rol === 'isg_uzmani' || rol === 'isyeri_hekimi') {
            firmaFiltre.ekleyenKullanici = kullaniciId;
        } else if (rol === 'isveren') {
            firmaFiltre._id = req.kullanici.isverenFirma;
        } else {
            return res.json({ basari: true, kritik: [], uyari: [], egitimler: [] });
        }

        const firmalar = await Firma.find(firmaFiltre).lean();

        // 2) Tarih hesaplama yardımcısı
        const farkGun = (tarihStr) => {
            if (!tarihStr) return 999;
            const bitis = new Date(tarihStr).setHours(0, 0, 0, 0);
            const bugun = new Date().setHours(0, 0, 0, 0);
            return Math.ceil((bitis - bugun) / 86400000);
        };

        // 3) Sonuç array'leri
        const kritik = [];   // 10 gün veya altı
        const uyari  = [];   // 11-30 gün arası

        const ekle = (entry) => {
            entry.gun <= 10 ? kritik.push(entry) : uyari.push(entry);
        };

        // 4) Her firma için verilerini paralel çek
        await Promise.all(firmalar.map(async (firma) => {
            const firmaAdi = firma.firmaAdi || firma.adi;

            // VeriDepo'dan tüm anahtarları paralel çek (lean = hızlı)
            const [muayeneDoc, egitimDoc, ilkyardimDoc, ekipmanDoc] = await Promise.all([
                VeriDepo.findOne({ anahtar: 'muayene_verileri_' + firmaAdi }).lean(),
                VeriDepo.findOne({ anahtar: 'egitim_verileri_' + firmaAdi }).lean(),
                VeriDepo.findOne({ anahtar: 'ilkyardim_verileri_' + firmaAdi }).lean(),
                VeriDepo.findOne({ anahtar: 'olcum_ekipman_verileri_' + firmaAdi }).lean(),
            ]);

            // ─── Muayene tarihleri
            const muayeneData = muayeneDoc?.deger || {};
            Object.keys(muayeneData).forEach(key => {
                const tarih = muayeneData[key]?.gecerliTarih || muayeneData[key]?.sonrakiTarih;
                if (!tarih) return;
                const gun = farkGun(tarih);
                if (gun > 30) return;
                ekle({
                    ad: 'Muayene: ' + key.replace(/_\d{11}$/, '').replace(/_/g, ' '),
                    firma: firmaAdi,
                    tarih,
                    tur: 'MUAYENE',
                    kategori: 'Sağlık Muayenesi',
                    gun,
                });
            });

            // ─── Eğitim tarihleri
            const egitimData = egitimDoc?.deger || {};
            Object.keys(egitimData).forEach(key => {
                const tarih = egitimData[key]?.gecerliTarih;
                if (!tarih) return;
                const gun = farkGun(tarih);
                if (gun > 30) return;
                ekle({
                    ad: 'Eğitim: ' + key.replace(/_\d{11}$/, '').replace(/_/g, ' '),
                    firma: firmaAdi,
                    tarih,
                    tur: 'EGITIM',
                    kategori: 'İSG Eğitimi',
                    gun,
                });
            });

            // ─── İlkyardım tarihleri
            const ilkyardimData = ilkyardimDoc?.deger || {};
            Object.keys(ilkyardimData).forEach(key => {
                const kayit = ilkyardimData[key];
                const tarih = kayit?.gecerliTarih;
                if (!tarih) return;
                const gun = farkGun(tarih);
                if (gun > 30) return;
                ekle({
                    ad: 'İlkyardım: ' + (kayit.personelAd || key.replace(/_/g, ' ')),
                    firma: firmaAdi,
                    tarih,
                    tur: 'ILKYARDIM',
                    kategori: 'İlkyardım',
                    gun,
                });
            });

            // ─── Ekipman ölçümleri
            const ekipmanlar = ekipmanDoc?.deger || [];
            if (Array.isArray(ekipmanlar)) {
                ekipmanlar.forEach(ekipman => {
                    const tarih = ekipman.gecerlilikTarihi;
                    if (!tarih) return;
                    const gun = farkGun(tarih);
                    if (gun > 30) return;
                    ekle({
                        ad: 'Ortam Ölçümü: ' + (ekipman.ekipmanAdi || 'Ekipman'),
                        firma: firmaAdi,
                        tarih,
                        tur: 'OLCUM',
                        kategori: 'Ortam Ölçümü',
                        gun,
                    });
                });
            }

            // ─── ISG alanları (kurul, RV, ADP, tatbikat, denetim, KKD)
            const isgAlanlari = [
                { key: 'kurulToplanti',     ad: 'İSG Kurul Toplantısı',           tur: 'KURUL',    kat: 'İSG Kurulu'         },
                { key: 'rvRevizyon',        ad: 'Risk Değerlendirmesi — Revizyon', tur: 'RV',       kat: 'Risk Değerlendirme' },
                { key: 'adpRevizyon',       ad: 'Acil Durum Planı — Revizyon',     tur: 'ADP',      kat: 'Acil Durum Planı'   },
                { key: 'tatbikatSonraki',   ad: 'Acil Durum Tatbikatı',            tur: 'TATBIKAT', kat: 'Tatbikat'           },
                { key: 'denetimGecerlilik', ad: 'DİF/DÖF Takibi',                 tur: 'DOF',      kat: 'DİF/DÖF Takibi'    },
                { key: 'kkdGecerlilik',     ad: 'KKD Takibi — Son Geçerlilik',     tur: 'KKD',      kat: 'KKD'                },
            ];
            isgAlanlari.forEach(({ key, ad, tur, kat }) => {
                const tarih = firma.isg?.[key];
                if (!tarih) return;
                const gun = farkGun(tarih);
                if (gun > 30) return;
                ekle({ ad, firma: firmaAdi, tarih, tur, kategori: kat, gun });
            });
        }));

        // 5) Yaklaşan eğitimleri çek
        const egitimFiltre = {};
        if (rol === 'sistem_yoneticisi') {
            // Tüm eğitimler
        } else {
            const firmaIdleri = firmalar.map(f => f._id);
            egitimFiltre.firma = { $in: firmaIdleri };
        }

        const egitimler = await Egitim.find(egitimFiltre)
            .populate('firma', 'firmaAdi')
            .lean();

        const yaklaşanEgitimler = [];
        egitimler.forEach(e => {
            const durum = (e.durum || '').toLowerCase();
            if (durum === 'tamamlandi' || durum === 'iptal') return;

            const tarih = e.planlananTarih || e.tarih;
            if (!tarih) return;
            const gun = farkGun(tarih);
            if (gun > 30) return;

            yaklaşanEgitimler.push({
                ad: e.konu || e.ad || 'İsimsiz Eğitim',
                firma: e.firma?.firmaAdi || 'Firma',
                tarih,
                gun,
            });
        });

        // 6) Sırala
        kritik.sort((a, b) => a.gun - b.gun);
        uyari.sort((a, b) => a.gun - b.gun);
        yaklaşanEgitimler.sort((a, b) => a.gun - b.gun);

        // 7) Mobil için döndür
        res.json({
            basari: true,
            kritik,
            uyari,
            egitimler: yaklaşanEgitimler,
            ozet: {
                kritikSayisi: kritik.length,
                uyariSayisi:  uyari.length,
                egitimSayisi: yaklaşanEgitimler.length,
                firmaSayisi:  firmalar.length,
            },
        });
    } catch (err) {
        console.error('[mobilAnasayfa] Hata:', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};


// MOBİL: FİRMA DETAY — Bir firmanın 13 kategorisindeki belge sayıları
exports.mobilFirmaDetay = async (req, res) => {
    try {
        const Firma    = require('../models/Firma');
        const Dokuman  = require('../models/Dokuman');
        const VeriDepo = require('../models/VeriDepo');
        const { firmaId } = req.params;

        // Yetki kontrolü
        const rol         = req.kullanici.rol;
        const kullaniciId = req.kullanici._id;

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) {
            return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı' });
        }

        // Kullanıcı bu firmayı görmeye yetkili mi?
        const yetkili =
            rol === 'sistem_yoneticisi' ||
            (['isg_uzmani', 'isyeri_hekimi'].includes(rol) &&
                String(firma.ekleyenKullanici) === String(kullaniciId)) ||
            (rol === 'isveren' && String(firma._id) === String(req.kullanici.isverenFirma));

        if (!yetkili) {
            return res.status(403).json({ basari: false, mesaj: 'Bu firmaya erişim yetkiniz yok' });
        }

        const firmaAdi = firma.firmaAdi || firma.adi;

        // 13 kategori için belge sayılarını topla (paralel)
        const [
            dokumanSayilari,
            muayeneDoc,
            egitimDoc,
            ilkyardimDoc,
            ekipmanDoc,
        ] = await Promise.all([
            // İSG dosyaları (rv, adp, tatbikat, denetim, kkd vs.)
            VeriDepo.findOne({ anahtar: 'isg_dosyalar_' + firmaAdi }).lean(),
            VeriDepo.findOne({ anahtar: 'muayene_verileri_' + firmaAdi }).lean(),
            VeriDepo.findOne({ anahtar: 'egitim_verileri_' + firmaAdi }).lean(),
            VeriDepo.findOne({ anahtar: 'ilkyardim_verileri_' + firmaAdi }).lean(),
            VeriDepo.findOne({ anahtar: 'olcum_ekipman_verileri_' + firmaAdi }).lean(),
        ]);

        // İSG dosyalarındaki kategorilere göre say
        const isgDosyalar = dokumanSayilari?.deger || {};
        const sayCategoy = (kat) => (isgDosyalar[kat] || []).length;

        // Personel kayıtlarındaki sayıları çıkar
        const muayeneCount    = Object.keys(muayeneDoc?.deger || {}).length;
        const egitimCount     = Object.keys(egitimDoc?.deger || {}).length;
        const ilkyardimCount  = Object.keys(ilkyardimDoc?.deger || {}).length;
        const ekipmanlar      = ekipmanDoc?.deger || [];
        const olcumCount      = Array.isArray(ekipmanlar) ? ekipmanlar.length : 0;

        // 13 kategori bilgisi
        const kategoriler = [
            // BASİT KARTLAR (mobile yükleme yapılabilir)
            { kod: 'rv',        ad: 'Risk Değerlendirmesi',  ikon: '🛡️',  sayi: sayCategoy('rv'),       basit: true },
            { kod: 'adp',       ad: 'Acil Durum Planı',      ikon: '🚨',  sayi: sayCategoy('adp'),      basit: true },
            { kod: 'tatbikat',  ad: 'Acil Durum Tatbikatı',  ikon: '🔥',  sayi: sayCategoy('tatbikat'), basit: true },
            { kod: 'denetim',   ad: 'DİF/DÖF Takibi',        ikon: '📋',  sayi: sayCategoy('denetim'),  basit: true },
            { kod: 'kkd',       ad: 'KKD Takibi',            ikon: '⛑️',  sayi: sayCategoy('kkd'),      basit: true },
            { kod: 'kurul',     ad: 'İSG Kurulu',            ikon: '👥',  sayi: sayCategoy('kurul'),    basit: true },

            // KARMAŞIK KARTLAR (sadece görüntüleme — AI ile yükleme önerilen)
            { kod: 'egitim',    ad: 'İSG Eğitimi',           ikon: '🎓',  sayi: egitimCount,            basit: false },
            { kod: 'muayene',   ad: 'Sağlık Muayenesi',      ikon: '🩺',  sayi: muayeneCount,           basit: false },
            { kod: 'ilkyardim', ad: 'İlkyardım',             ikon: '⚕️',  sayi: ilkyardimCount,         basit: false },
            { kod: 'olcum',     ad: 'Ortam Ölçümü',          ikon: '📊',  sayi: olcumCount,             basit: false },
            { kod: 'temsilci',  ad: 'Çalışan Temsilcisi',    ikon: '🤝',  sayi: sayCategoy('temsilci'), basit: false },
            { kod: 'destek',    ad: 'Destek Elemanı',        ikon: '👤',  sayi: sayCategoy('destek'),   basit: false },
            { kod: 'uzman',     ad: 'Uzman/Hekim/DSP',       ikon: '👨‍⚕️', sayi: sayCategoy('uzman'),    basit: false },
        ];

        const toplamBelge = kategoriler.reduce((t, k) => t + k.sayi, 0);

        res.json({
            basari: true,
            firma: {
                _id:         firma._id,
                firmaAdi:    firmaAdi,
                tehlikeSinifi: firma.isg?.tehlikeSinifi || firma.tehlikeSinifi,
                isg:          firma.isg || {}, 
                adres:       firma.adres,
                telefon:     firma.telefon,
                eposta:      firma.eposta,
            },
            kategoriler,
            toplamBelge,
        });

    } catch (err) {
        console.error('[mobilFirmaDetay]', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════
// MOBİL: KATEGORİ BELGELERİ — Bir firmanın belirli kategorisindeki tüm belgeler
// ═══════════════════════════════════════════════════════════════════════
exports.mobilKategoriBelgeleri = async (req, res) => {
    try {
        const Firma    = require('../models/Firma');
        const VeriDepo = require('../models/VeriDepo');
        const { firmaId, kategori } = req.params;

        // Yetki kontrolü
        const rol         = req.kullanici.rol;
        const kullaniciId = req.kullanici._id;

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) {
            return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı' });
        }

        const yetkili =
            rol === 'sistem_yoneticisi' ||
            (['isg_uzmani', 'isyeri_hekimi'].includes(rol) &&
                String(firma.ekleyenKullanici) === String(kullaniciId)) ||
            (rol === 'isveren' && String(firma._id) === String(req.kullanici.isverenFirma));

        if (!yetkili) {
            return res.status(403).json({ basari: false, mesaj: 'Yetkisiz' });
        }

        const firmaAdi = firma.firmaAdi || firma.adi;
        const belgeler = [];

        // 1) İSG dosyaları (rv, adp, tatbikat, denetim, kkd, kurul, temsilci, destek, uzman)
        if (['rv', 'adp', 'tatbikat', 'denetim', 'kkd', 'kurul', 'temsilci', 'destek', 'uzman'].includes(kategori)) {
            const isgDoc = await VeriDepo.findOne({ anahtar: 'isg_dosyalar_' + firmaAdi }).lean();
            const isgDosyalar = isgDoc?.deger || {};
            const dosyalar = isgDosyalar[kategori] || [];

            dosyalar.forEach(d => {
                belgeler.push({
                    ad:           d.ad || 'İsimsiz Belge',
                    tarih:        d.tarih || null,
                    belgeTarihi:  d.belgeTarihi || null,
                    boyut:        d.boyut || 0,
                    tur:          d.tur || 'PDF',
                    kayitTarihi:  d.kayitTarihi || null,
                    _id:          d._id || null,
                    arsivlendi:   !!d.arsivlendi,
                });
            });
        }

        // 2) Muayene kayıtları
        if (kategori === 'muayene') {
            const muayeneDoc = await VeriDepo.findOne({ anahtar: 'muayene_verileri_' + firmaAdi }).lean();
            const muayene = muayeneDoc?.deger || {};
            Object.keys(muayene).forEach(key => {
                const k = muayene[key];
                if (!k) return;
                belgeler.push({
                    ad:          'Muayene: ' + key.replace(/_\d{11}$/, '').replace(/_/g, ' '),
                    tarih:       k.gecerliTarih || k.sonrakiTarih || null,
                    yapilmaTarihi: k.yapilmaTarihi || null,
                    boyut:       0,
                    tur:         'KAYIT',
                });
            });
        }

        // 3) Eğitim kayıtları
        if (kategori === 'egitim') {
            const egitimDoc = await VeriDepo.findOne({ anahtar: 'egitim_verileri_' + firmaAdi }).lean();
            const egitim = egitimDoc?.deger || {};
            Object.keys(egitim).forEach(key => {
                const k = egitim[key];
                if (!k) return;
                belgeler.push({
                    ad:          'Eğitim: ' + key.replace(/_\d{11}$/, '').replace(/_/g, ' '),
                    tarih:       k.gecerliTarih || null,
                    yapilmaTarihi: k.yapilmaTarihi || null,
                    boyut:       0,
                    tur:         'KAYIT',
                });
            });
        }

        // 4) İlkyardım kayıtları
        if (kategori === 'ilkyardim') {
            const ilkyardimDoc = await VeriDepo.findOne({ anahtar: 'ilkyardim_verileri_' + firmaAdi }).lean();
            const ilkyardim = ilkyardimDoc?.deger || {};
            Object.keys(ilkyardim).forEach(key => {
                const k = ilkyardim[key];
                if (!k) return;
                belgeler.push({
                    ad:          'İlkyardım: ' + (k.personelAd || key.replace(/_/g, ' ')),
                    tarih:       k.gecerliTarih || null,
                    yapilmaTarihi: k.yapilmaTarihi || null,
                    boyut:       0,
                    tur:         'KAYIT',
                });
            });
        }

        // 5) Ortam Ölçümleri
        if (kategori === 'olcum') {
            const ekipmanDoc = await VeriDepo.findOne({ anahtar: 'olcum_ekipman_verileri_' + firmaAdi }).lean();
            const ekipmanlar = ekipmanDoc?.deger || [];
            if (Array.isArray(ekipmanlar)) {
                ekipmanlar.forEach(e => {
                    belgeler.push({
                        ad:          (e.ekipmanAdi || 'Ekipman') + (e.seriNo ? ` (${e.seriNo})` : ''),
                        tarih:       e.gecerlilikTarihi || null,
                        yapilmaTarihi: e.olcumTarihi || null,
                        boyut:       0,
                        tur:         'KAYIT',
                        ekstra:      e.kontroleYapanFirma || '',
                    });
                });
            }
        }

        // Tarihe göre sırala
        belgeler.sort((a, b) => {
            const ta = new Date(a.tarih || a.kayitTarihi || 0).getTime();
            const tb = new Date(b.tarih || b.kayitTarihi || 0).getTime();
            return tb - ta;
        });

        res.json({
            basari: true,
            firmaAdi,
            kategori,
            belgeler,
            sayi: belgeler.length,
        });

    } catch (err) {
        console.error('[mobilKategoriBelgeleri]', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};
// ═══════════════════════════════════════════════════════════════════
// MOBİL BELGE SİL
// DELETE /api/dokumanlar/mobil-belge-sil
// Body: { firmaId, kategori, belgeId }
// ═══════════════════════════════════════════════════════════════════
exports.mobilBelgeSil = async (req, res) => {
    try {
        const Firma    = require('../models/Firma');
        const VeriDepo = require('../models/VeriDepo');
        const { firmaId, kategori, belgeId } = req.body;

        if (!firmaId || !kategori || !belgeId) {
            return res.status(400).json({ basari: false, mesaj: 'Eksik veri.' });
        }

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) {
            return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı.' });
        }

        // Yetki
        const rol = req.kullanici.rol;
        const yetkili = rol === 'sistem_yoneticisi' ||
            (['isg_uzmani', 'isyeri_hekimi'].includes(rol) &&
             String(firma.ekleyenKullanici) === String(req.kullanici._id));
        if (!yetkili) {
            return res.status(403).json({ basari: false, mesaj: 'Yetkisiz.' });
        }

        const firmaAdi = firma.firmaAdi || firma.adi;
        const anahtar  = 'isg_dosyalar_' + firmaAdi;

        const veriDepo = await VeriDepo.findOne({ anahtar });
        if (!veriDepo) {
            return res.status(404).json({ basari: false, mesaj: 'Kayıt bulunamadı.' });
        }

        const deger = veriDepo.deger || {};
        const liste = Array.isArray(deger[kategori]) ? deger[kategori] : [];
        const yeniListe = liste.filter(d => String(d._id) !== String(belgeId));

        if (yeniListe.length === liste.length) {
            return res.status(404).json({ basari: false, mesaj: 'Belge bulunamadı.' });
        }

        deger[kategori] = yeniListe;
        veriDepo.deger = deger;
        veriDepo.markModified('deger');
        await veriDepo.save();

        res.json({ basari: true, mesaj: 'Belge silindi.' });
    } catch (err) {
        console.error('[mobilBelgeSil] HATA:', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════
// MOBİL BELGE TARİH GÜNCELLE
// PUT /api/dokumanlar/mobil-belge-guncelle
// Body: { firmaId, kategori, belgeId, belgeTarihi, gecerlilikTarihi }
// ═══════════════════════════════════════════════════════════════════
exports.mobilBelgeGuncelle = async (req, res) => {
    try {
        const Firma    = require('../models/Firma');
        const VeriDepo = require('../models/VeriDepo');
        const { firmaId, kategori, belgeId, belgeTarihi, gecerlilikTarihi } = req.body;

        if (!firmaId || !kategori || !belgeId) {
            return res.status(400).json({ basari: false, mesaj: 'Eksik veri.' });
        }

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı.' });

        const rol = req.kullanici.rol;
        const yetkili = rol === 'sistem_yoneticisi' ||
            (['isg_uzmani', 'isyeri_hekimi'].includes(rol) &&
             String(firma.ekleyenKullanici) === String(req.kullanici._id));
        if (!yetkili) return res.status(403).json({ basari: false, mesaj: 'Yetkisiz.' });

        const firmaAdi = firma.firmaAdi || firma.adi;
        const anahtar  = 'isg_dosyalar_' + firmaAdi;

        const veriDepo = await VeriDepo.findOne({ anahtar });
        if (!veriDepo) return res.status(404).json({ basari: false, mesaj: 'Kayıt yok.' });

        const deger = veriDepo.deger || {};
        const liste = Array.isArray(deger[kategori]) ? deger[kategori] : [];
        const idx   = liste.findIndex(d => String(d._id) === String(belgeId));

        if (idx === -1) return res.status(404).json({ basari: false, mesaj: 'Belge bulunamadı.' });

        if (belgeTarihi      !== undefined) liste[idx].belgeTarihi      = belgeTarihi;
        if (gecerlilikTarihi !== undefined) liste[idx].tarih            = gecerlilikTarihi;
        liste[idx].guncellemeTarihi = new Date().toISOString();

        deger[kategori] = liste;
        veriDepo.deger = deger;
        veriDepo.markModified('deger');
        await veriDepo.save();

        res.json({ basari: true, mesaj: 'Belge tarihleri güncellendi.', veri: liste[idx] });
    } catch (err) {
        console.error('[mobilBelgeGuncelle] HATA:', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════
// MOBİL BELGE YENİ SÜRÜM YÜKLE (eski sürümü arşivler)
// POST /api/dokumanlar/mobil-belge-yeni-surum
// Body: { firmaId, kategori, eskiBelgeId, dosyaAdi, dosyaBoyut, dosyaTur, belgeTarihi, gecerlilikTarihi, dataUrl }
// ═══════════════════════════════════════════════════════════════════
exports.mobilBelgeYeniSurum = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const Firma    = require('../models/Firma');
        const VeriDepo = require('../models/VeriDepo');
        const { firmaId, kategori, eskiBelgeId, dosyaAdi, dosyaBoyut, dosyaTur,
                belgeTarihi, gecerlilikTarihi, dataUrl } = req.body;

        if (!firmaId || !kategori || !eskiBelgeId || !dosyaAdi || !dataUrl) {
            return res.status(400).json({ basari: false, mesaj: 'Eksik veri.' });
        }

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı.' });

        const rol = req.kullanici.rol;
        const yetkili = rol === 'sistem_yoneticisi' ||
            (['isg_uzmani', 'isyeri_hekimi'].includes(rol) &&
             String(firma.ekleyenKullanici) === String(req.kullanici._id));
        if (!yetkili) return res.status(403).json({ basari: false, mesaj: 'Yetkisiz.' });

        const firmaAdi = firma.firmaAdi || firma.adi;
        const anahtar  = 'isg_dosyalar_' + firmaAdi;

        let veriDepo = await VeriDepo.findOne({ anahtar });
        if (!veriDepo) {
            veriDepo = new VeriDepo({ anahtar, deger: {} });
        }
        const deger = veriDepo.deger || {};
        const liste = Array.isArray(deger[kategori]) ? deger[kategori] : [];

        // Eski belgeyi "arsivlendi: true" olarak işaretle
        const eskiIdx = liste.findIndex(d => String(d._id) === String(eskiBelgeId));
        if (eskiIdx !== -1) {
            liste[eskiIdx].arsivlendi      = true;
            liste[eskiIdx].arsivTarihi     = new Date().toISOString();
        }

        // Yeni sürümü ekle
        const yeniDosya = {
    _id:         new mongoose.Types.ObjectId().toString(),
    ad:          dosyaAdi,
    tarih:       req.body.gecerlilikTarihi || belgeTarihi || new Date().toISOString().split('T')[0],
    belgeTarihi: belgeTarihi || '',
    boyut:       dosyaBoyut || 0,
    tur:         dosyaTur || 'PDF',
    kayitTarihi: new Date().toISOString(),
    dataUrl:     dataUrl,
    ekleyenAd:   req.kullanici.adSoyad || req.kullanici.email || '',
    arsivlendi:  false,
};
        liste.push(yeniDosya);

        deger[kategori] = liste;
        veriDepo.deger = deger;
        veriDepo.markModified('deger');
        await veriDepo.save();

        res.json({ basari: true, mesaj: 'Yeni sürüm yüklendi, eski sürüm arşivlendi.', veri: yeniDosya });
    } catch (err) {
        console.error('[mobilBelgeYeniSurum] HATA:', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};
// ═══════════════════════════════════════════════════════════════════
// MOBİL: BELGE İÇERİĞİ — Tek bir belgenin dataUrl'sini döndürür
// ═══════════════════════════════════════════════════════════════════
exports.mobilBelgeIcerik = async (req, res) => {
    try {
        const Firma    = require('../models/Firma');
        const VeriDepo = require('../models/VeriDepo');
        const { firmaId, kategori, belgeAdi } = req.params;

        const rol         = req.kullanici.rol;
        const kullaniciId = req.kullanici._id;

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı' });

        const yetkili =
            rol === 'sistem_yoneticisi' ||
            (['isg_uzmani', 'isyeri_hekimi'].includes(rol) &&
                String(firma.ekleyenKullanici) === String(kullaniciId)) ||
            (rol === 'isveren' && String(firma._id) === String(req.kullanici.isverenFirma));

        if (!yetkili) return res.status(403).json({ basari: false, mesaj: 'Yetkisiz' });

        const firmaAdi = firma.firmaAdi || firma.adi;

        if (['rv', 'adp', 'tatbikat', 'denetim', 'kkd', 'kurul', 'temsilci', 'destek', 'uzman'].includes(kategori)) {
            const isgDoc = await VeriDepo.findOne({ anahtar: 'isg_dosyalar_' + firmaAdi }).lean();
            const isgDosyalar = isgDoc?.deger || {};
            const dosyalar = isgDosyalar[kategori] || [];

            const belge = dosyalar.find(d => d.ad === belgeAdi);
            if (!belge) return res.status(404).json({ basari: false, mesaj: 'Belge bulunamadı' });

            return res.json({
                basari: true,
                ad: belge.ad,
                tur: belge.tur || 'PDF',
                dataUrl: belge.dataUrl,
            });
        }

        return res.status(400).json({
            basari: false,
            mesaj: 'Bu kategori için belge görüntüleme henüz desteklenmiyor'
        });

    } catch (err) {
        console.error('[mobilBelgeIcerik]', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════
// MOBİL BELGE EKLE — VeriDepo'ya yazar (web ile aynı yere)
// ═══════════════════════════════════════════════════════════════════
exports.mobilBelgeEkle = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const Firma    = require('../models/Firma');
        const VeriDepo = require('../models/VeriDepo');

        const { firmaId, kategori, dosyaAdi, dosyaBoyut, dosyaTur, belgeTarihi, gecerlilikTarihi, dataUrl } = req.body;

        if (!firmaId || !kategori || !dosyaAdi || !dataUrl) {
            return res.status(400).json({
                basari: false,
                mesaj: 'Eksik veri: firmaId, kategori, dosyaAdi ve dataUrl zorunludur.'
            });
        }

        const gecerliKategoriler = ['rv', 'adp', 'tatbikat', 'denetim', 'kkd', 'kurul', 'temsilci', 'destek', 'uzman'];
        if (!gecerliKategoriler.includes(kategori)) {
            return res.status(400).json({ basari: false, mesaj: 'Geçersiz kategori: ' + kategori });
        }

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı' });

        const rol = req.kullanici.rol;
        const yetkili = rol === 'sistem_yoneticisi' ||
            (['isg_uzmani', 'isyeri_hekimi'].includes(rol) &&
                String(firma.ekleyenKullanici) === String(req.kullanici._id));

        if (!yetkili) {
            return res.status(403).json({ basari: false, mesaj: 'Bu firmaya belge ekleme yetkiniz yok.' });
        }

        const firmaAdi = firma.firmaAdi || firma.adi;
        const anahtar  = 'isg_dosyalar_' + firmaAdi;

        let veriDepo = await VeriDepo.findOne({ anahtar });
        if (!veriDepo) {
            veriDepo = new VeriDepo({ anahtar, deger: {} });
        }

        const deger = veriDepo.deger || {};
        if (!Array.isArray(deger[kategori])) {
            deger[kategori] = [];
        }

       const yeniDosya = {
    _id:         new mongoose.Types.ObjectId().toString(),
    ad:          dosyaAdi,
    tarih:       gecerlilikTarihi || belgeTarihi || new Date().toISOString().split('T')[0],
    belgeTarihi: belgeTarihi || '',
    boyut:       dosyaBoyut || 0,
    tur:         dosyaTur || 'PDF',
    kayitTarihi: new Date().toISOString(),
    dataUrl:     dataUrl,
    ekleyenAd:   req.kullanici.adSoyad || req.kullanici.email || '',
    arsivlendi:  false,
};

        deger[kategori].push(yeniDosya);
        veriDepo.deger = deger;
        veriDepo.markModified('deger');
        await veriDepo.save();

        res.json({
            basari: true,
            mesaj:  'Belge başarıyla yüklendi.',
            veri: { _id: yeniDosya._id, ad: yeniDosya.ad, kategori }
        });

    } catch (err) {
        console.error('[mobilBelgeEkle] HATA:', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════
// UZMAN GETİR
// ═══════════════════════════════════════════════════════════════════
exports.uzmanGetir = async (req, res) => {
    try {
        const firmaAdi = decodeURIComponent(req.params.firmaId);
        const firma = await Firma.findOne({ firmaAdi: firmaAdi }).select('uzmanVerileri');
        res.json(firma?.uzmanVerileri || {});
    } catch (e) {
        res.status(500).json({ hata: e.message });
    }
};

// ═══════════════════════════════════════════════════════════════════
// UZMAN KAYDET
// ═══════════════════════════════════════════════════════════════════
exports.uzmanKaydet = async (req, res) => {
    try {
        const firmaAdi = decodeURIComponent(req.params.firmaId);
        const { igu, hekim, dsp } = req.body;

        await Firma.findOneAndUpdate(
            { firmaAdi: firmaAdi },
            { $set: { uzmanVerileri: { igu, hekim, dsp } } },
            { new: true }
        );
        res.json({ basarili: true });
    } catch (e) {
        res.status(500).json({ hata: e.message });
    }
};

// ═══════════════════════════════════════════════════════════════════
// DOKÜMAN MAİL GÖNDER (DİF/DÖF bildirim)
// ═══════════════════════════════════════════════════════════════════
exports.dokumanMailGonder = async (req, res) => {
    try {
        const { firmaId, dokumanIdleri, hazirlanmaTarihi, sonGecerlilikTarihi } = req.body;

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı' });

        const eposta = firma.eposta || firma.email;
        if (!eposta) {
            return res.status(400).json({ basari: false, mesaj: 'Firma için kayıtlı e-posta yok.' });
        }

        const attachments = [];
        if (Array.isArray(dokumanIdleri) && dokumanIdleri.length > 0) {
            const dokumanlar = await Dokuman.find({ _id: { $in: dokumanIdleri } }).lean();
            dokumanlar.forEach(d => {
                const att = _dataUrlToAttachment(d.dosyaIcerik, d.dosyaAdi || d.baslik);
                if (att) attachments.push(att);
            });
        }

        const html = _difDofMailSablonu({
            firmaAdi: firma.firmaAdi || firma.adi,
            hazirlanmaTarihi,
            sonGecerlilikTarihi,
            belgeSayisi: attachments.length,
        });

        await emailGonder({
            kime:    eposta,
            konu:    `📄 DİF/DÖF Belgesi — ${firma.firmaAdi || firma.adi}`,
            html,
            attachments,
        });

        res.json({ basari: true, mesaj: 'Mail gönderildi.', eposta });
    } catch (err) {
        console.error('[dokumanMailGonder] HATA:', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════
// İSG KURUL TOPLANTI BİLDİRİM MAILI
// POST /api/dokumanlar/kurul-mail-gonder
// ═══════════════════════════════════════════════════════════════════
exports.kurulMailGonder = async (req, res) => {
    try {
        const { firmaId, toplantıTarih } = req.body;

        const firma = await Firma.findById(firmaId).lean();
        if (!firma) return res.status(404).json({ basari: false, mesaj: 'Firma bulunamadı' });

        const eposta = firma.eposta || firma.email;
        if (!eposta) return res.status(400).json({ basari: false, mesaj: 'Firma için kayıtlı e-posta yok.' });

        const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
            <div style="text-align:center;padding-bottom:16px;border-bottom:2px solid #3b82f6;">
                <h2 style="color:#1e40af;margin:0;">🛡️ ÜNLÜ İSG</h2>
                <p style="color:#64748b;margin:4px 0 0;">İSG Doküman Yönetim Sistemi</p>
            </div>
            <div style="padding:24px 0;">
                <h3 style="color:#1e293b;margin-top:0;">📅 İSG Kurul Toplantısı Planlandı</h3>
                <p style="color:#334155;line-height:1.6;">
                    Sayın İlgili,<br><br>
                    <strong>${firma.firmaAdi || firma.adi}</strong> firması için İSG Kurul Toplantısı planlanmıştır.
                </p>
                <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f8fafc;border-radius:8px;overflow:hidden;">
                    <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#475569;width:40%;">Firma</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;">${firma.firmaAdi || firma.adi}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px 16px;font-weight:600;color:#475569;">Planlanan Toplantı Tarihi</td>
                        <td style="padding:12px 16px;">${_trTarih(toplantıTarih) || '-'}</td>
                    </tr>
                </table>
                <p style="color:#64748b;font-size:13px;line-height:1.6;margin-top:24px;">
                    Toplantı ile ilgili soru veya talebiniz için lütfen bizimle iletişime geçin.
                </p>
            </div>
            <div style="border-top:1px solid #e2e8f0;padding-top:16px;text-align:center;color:#94a3b8;font-size:12px;">
                Bu e-posta <strong>ÜNLÜ İSG Doküman Yönetim Sistemi</strong> tarafından otomatik olarak gönderilmiştir.
            </div>
        </div>`;

        await emailGonder({
            kime: eposta,
            konu: `📅 İSG Kurul Toplantısı Bildirimi — ${firma.firmaAdi || firma.adi}`,
            html,
        });

        res.json({ basari: true, mesaj: 'Mail gönderildi.', eposta });
    } catch (err) {
        console.error('[kurulMailGonder] HATA:', err);
        res.status(500).json({ basari: false, mesaj: err.message });
    }
};