const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  [AI] GEMINI_API_KEY tanımlı değil. AI özelliği çalışmayacak.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

const modelSiniflandirma = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash-8b',
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
});

const modelSohbet = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 2500 },
});

const TUR_ETIKETLERI = {
    risk_degerlendirmesi: 'Risk Değerlendirmesi',
    acil_eylem_plani:     'Acil Durum Planı',
    tatbikat_raporu:      'Acil Durum Tatbikatı',
    isg_kurul_toplantisi: 'İSG Kurulu Toplantı Tutanağı',
    cevre_olcumu:         'Ortam Ölçümü / Ekipman Kontrolü',
    diger:                'Diğer',
    rv:                   'Risk Değerlendirmesi',
    adp:                  'Acil Durum Planı',
    egitim:               'İSG Eğitimi Belgeleri',
    muayene:              'Periyodik Sağlık Muayenesi Raporları',
    olcum:                'Ortam Ölçümü Raporları',
    denetim:              'DİF/DÖF Belgeleri',
    kkd:                  'KKD Belgeleri',
    temsilci:             'İSG Temsilci Belgeleri',
    destek:               'Destek Elemanı Belgeleri',
    kurul:                'İSG Kurulu Tutanakları',
    tatbikat:             'Acil Durum Tatbikatı',
};

const ISG_DOSYA_KATEGORILERI = {
    rv: 'Risk Değerlendirmesi', adp: 'Acil Durum Planı', tatbikat: 'Acil Durum Tatbikatı',
    egitim: 'İSG Eğitimi Belgeleri', ilkyardim: 'İlkyardım Sertifikaları',
    muayene: 'Periyodik Sağlık Muayenesi Raporları', olcum: 'Ortam Ölçümü Raporları',
    denetim: 'DİF/DÖF Belgeleri', kkd: 'KKD Belgeleri',
    temsilci: 'İSG Temsilci Belgeleri', destek: 'Destek Elemanı Belgeleri',
    kurul: 'İSG Kurulu Tutanakları',
};

function _tehlikeSinifiNormalize(deger) {
    if (!deger) return 'Belirtilmemiş';
    const d = String(deger).toLowerCase()
        .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i')
        .replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u')
        .replace(/[_\s-]/g,'');
    if (d.includes('coktehlikeli')) return 'Çok Tehlikeli';
    if (d.includes('aztehlikeli'))  return 'Az Tehlikeli';
    if (d.includes('tehlikeli'))    return 'Tehlikeli';
    return String(deger);
}

const ISG_KATEGORILERI = [
    'Risk Değerlendirmesi','Acil Durum Planı','Acil Durum Tatbikatı',
    'İSG Eğitimi','İlkyardım Eğitimi / Sertifikası','Periyodik Sağlık Muayenesi',
    'Ortam Ölçümü / Ekipman Kontrolü','DİF/DÖF (Düzeltici ve İyileştirici Faaliyet)',
    'KKD (Kişisel Koruyucu Donanım)','İSG Temsilci Belgesi','Destek Elemanı Belgesi',
    'İSG Kurulu Toplantı Tutanağı','Diğer / Sınıflandırılamadı',
];

const Firma        = require('../models/Firma');
const Personel     = require('../models/Personel');
const Dokuman      = require('../models/Dokuman');
const Egitim       = require('../models/Egitim');
const VeriDepo     = require('../models/VeriDepo');
const Kullanici    = require('../models/User');
const MevzuatParca = require('../models/MevzuatParca'); 

async function _firmaAdlariniAl(kullanici) {
    try {
        const filtre = { aktif: { $ne: false } };
        if (kullanici.rol === 'sistem_yoneticisi') {}
        else if (kullanici.rol === 'isg_uzmani' || kullanici.rol === 'isyeri_hekimi')
            filtre.ekleyenKullanici = kullanici._id;
        else if (kullanici.rol === 'isveren')
            filtre._id = kullanici.isverenFirma;
        else return [];
        const firmalar = await Firma.find(filtre, { firmaAdi: 1 }).lean();
        return firmalar.map(f => f.firmaAdi).filter(Boolean);
    } catch (err) {
        console.warn('[AI] Firma listesi alınamadı:', err.message);
        return [];
    }
}

function _promptOlustur(belgeMetni, firmaAdlari) {
    const firmaListesi = firmaAdlari.length > 0
        ? firmaAdlari.map(f => `   - ${f}`).join('\n')
        : '   (Sistemde kayıtlı firma bulunamadı)';
    return `Sen bir İş Sağlığı ve Güvenliği (İSG) doküman sınıflandırma asistanısın.
Aşağıdaki belgeyi analiz et ve JSON formatında cevap ver.

## BELGE METNİ:
"""
${belgeMetni.substring(0, 20000)}
"""
${belgeMetni.length > 20000 ? '(Belge uzun, ilk 20000 karakter gösterildi)' : ''}

## GÖREVİN:
1. Bu belgenin aşağıdaki İSG kategorilerinden hangisine ait olduğunu belirle:
${ISG_KATEGORILERI.map((k, i) => `   ${i + 1}. ${k}`).join('\n')}
2. Belge içeriğinde aşağıdaki firmalardan birinin adı geçiyor mu tespit et:
${firmaListesi}
3. Belgenin tarihi/düzenleme tarihi belli mi tespit et (YYYY-MM-DD formatında).

## CEVAP FORMATI (sadece JSON):
{
  "kategori": "yukarıdaki listeden bir kategori adı (tam olarak)",
  "firma": "yukarıdaki listeden bir firma adı (bulunursa) veya null",
  "tarih": "YYYY-MM-DD formatında (bulunursa) veya null",
  "guven": 0.0 ile 1.0 arası güven skoru,
  "aciklama": "Neden bu kategoriyi seçtiğini 1-2 cümle ile açıkla (Türkçe)"
}
## KURALLAR:
- Eğer emin değilsen "Diğer / Sınıflandırılamadı" kategorisini seç ve guven'i düşür (0.3-0.5).
- Firma adı listede yoksa firma: null yaz. Tarih belirsizse tarih: null yaz.
- Sadece JSON döndür, başka metin ekleme.`;
}

function _yanitiAyikla(rawText) {
    let temiz = rawText.trim()
        .replace(/^```json\s*/i, '').replace(/\s*```$/, '')
        .replace(/^```\s*/, '').replace(/\s*```$/, '');
    try { return JSON.parse(temiz); } catch (err) {
        const match = temiz.match(/\{[\s\S]*\}/);
        if (match) { try { return JSON.parse(match[0]); } catch (_) {} }
        throw new Error('AI yanıtı JSON olarak ayıklanamadı: ' + temiz.substring(0, 200));
    }
}

exports.dokumaniSiniflandir = async (req, res) => {
    const baslangic = Date.now();
    try {
        const { metin } = req.body;
        if (!metin || typeof metin !== 'string')
            return res.status(400).json({ basarili: false, hata: 'Belge metni eksik veya geçersiz.' });
        if (metin.trim().length < 50)
            return res.status(400).json({ basarili: false, hata: 'Belge metni çok kısa (< 50 karakter).' });
        if (!process.env.GEMINI_API_KEY)
            return res.status(500).json({ basarili: false, hata: 'Yapay zeka servisi yapılandırılmamış.' });

        const firmaAdlari = await _firmaAdlariniAl(req.kullanici);
        const sonuc  = await modelSiniflandirma.generateContent(_promptOlustur(metin, firmaAdlari));
        const ayiklanmis = _yanitiAyikla(sonuc.response.text());

        if (!ISG_KATEGORILERI.includes(ayiklanmis.kategori)) {
            ayiklanmis.kategori = 'Diğer / Sınıflandırılamadı';
            ayiklanmis.guven = Math.min(ayiklanmis.guven || 0.3, 0.5);
        }
        if (ayiklanmis.firma && !firmaAdlari.includes(ayiklanmis.firma)) ayiklanmis.firma = null;

        const sure = Date.now() - baslangic;
        console.log(`✅ [AI] ${sure}ms | Kategori: ${ayiklanmis.kategori} | Güven: ${ayiklanmis.guven}`);
        res.json({ basarili: true, ...ayiklanmis, sureMs: sure });
    } catch (err) {
        console.error('[AI] Hata:', err.message);
        res.status(500).json({ basarili: false, hata: 'Yapay zeka analizi sırasında hata oluştu.', detay: err.message });
    }
};

exports.saglikKontrol = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY)
            return res.json({ saglik: 'hatali', mesaj: 'GEMINI_API_KEY tanımlı değil' });
        const sonuc = await modelSiniflandirma.generateContent('Sadece "OK" yaz.');
        res.json({ saglik: 'iyi', mesaj: 'Gemini API erişilebilir', testYaniti: sonuc.response.text().trim().substring(0, 50), model: 'gemini-2.5-flash-lite', kategoriSayisi: ISG_KATEGORILERI.length });
    } catch (err) {
        res.status(500).json({ saglik: 'hatali', mesaj: 'Gemini API erişilemedi', detay: err.message });
    }
};

exports.mobilSiniflandir = async (req, res) => {
    const baslangic = Date.now();
    try {
        const { dataUrl } = req.body;
        if (!dataUrl || typeof dataUrl !== 'string')
            return res.status(400).json({ basarili: false, hata: 'PDF verisi eksik.' });
        if (!dataUrl.startsWith('data:application/pdf;base64,'))
            return res.status(400).json({ basarili: false, hata: 'Geçersiz format. Sadece PDF.' });

        const pdfBuffer = Buffer.from(dataUrl.split(',')[1], 'base64');
        if (pdfBuffer.length > 20 * 1024 * 1024)
            return res.status(400).json({ basarili: false, hata: 'PDF çok büyük (maks. 20 MB).' });

        const pdfParse = require('pdf-parse');
        let metin = '';
        try { metin = ((await pdfParse(pdfBuffer)).text || '').trim(); }
        catch (err) { return res.status(400).json({ basarili: false, hata: 'PDF metni okunamadı.', detay: err.message }); }

        if (!metin || metin.length < 50)
            return res.status(400).json({ basarili: false, hata: 'PDF\'ten yeterli metin çıkarılamadı.' });
        if (!process.env.GEMINI_API_KEY)
            return res.status(500).json({ basarili: false, hata: 'Yapay zeka servisi yapılandırılmamış.' });

        const firmaAdlari = await _firmaAdlariniAl(req.kullanici);
        const sonuc = await modelSiniflandirma.generateContent(_promptOlustur(metin, firmaAdlari));
        const ayiklanmis = _yanitiAyikla(sonuc.response.text());

        if (!ISG_KATEGORILERI.includes(ayiklanmis.kategori)) {
            ayiklanmis.kategori = 'Diğer / Sınıflandırılamadı';
            ayiklanmis.guven = Math.min(ayiklanmis.guven || 0.3, 0.5);
        }
        if (ayiklanmis.firma && !firmaAdlari.includes(ayiklanmis.firma)) ayiklanmis.firma = null;

        const sure = Date.now() - baslangic;
        console.log(`✅ [AI Mobil] ${sure}ms | ${ayiklanmis.kategori} | ${ayiklanmis.firma || '—'}`);
        res.json({ basarili: true, ...ayiklanmis, firmalar: firmaAdlari, kategoriler: ISG_KATEGORILERI.filter(k => k !== 'Diğer / Sınıflandırılamadı'), sureMs: sure });
    } catch (err) {
        console.error('[AI Mobil] Hata:', err.message);
        res.status(500).json({ basarili: false, hata: 'Yapay zeka analizi sırasında hata oluştu.', detay: err.message });
    }
};

// ═══════════════════════════════════════════════════════════════════════
// AI SOHBET ASİSTANI
// ═══════════════════════════════════════════════════════════════════════

async function _firmaVeriDepoOku(firmaAdi) {
    const sonek = '_' + firmaAdi;
    const kayitlar = await VeriDepo.find({ anahtar: { $regex: sonek + '$', $options: 'i' } }).lean();
    const sozluk = {};
    kayitlar.forEach(k => {
        sozluk[k.anahtar.substring(0, k.anahtar.length - sonek.length)] = k.deger;
    });
    return sozluk;
}

function _personelTarihOzet(veriObje, simdi, otuzGun, tarihAlani) {
    let gecerli = 0, yaklasan = 0, suresiDolmus = 0, yok = 0;
    const detaylar = [];
    if (!veriObje || typeof veriObje !== 'object')
        return { gecerli, yaklasan, suresiDolmus, yok, detaylar };
    Object.entries(veriObje).forEach(([anahtar, kayit]) => {
        if (!kayit || typeof kayit !== 'object') return;
        const tarihStr = kayit[tarihAlani] || kayit.gecerliTarih || kayit.bitisTarih;
        if (!tarihStr) { yok++; return; }
        const tarih = new Date(tarihStr);
        if (isNaN(tarih.getTime())) { yok++; return; }
        const personelAd = anahtar.replace(/_[^_]+$/, '').replace(/_/g, ' ');
        let durum;
        if (tarih < simdi)         { suresiDolmus++; durum = 'süresi dolmuş'; }
        else if (tarih <= otuzGun) { yaklasan++;     durum = 'yaklaşıyor'; }
        else                       { gecerli++;      durum = 'geçerli'; }
        detaylar.push({ personel: personelAd, tarih: tarihStr, durum });
    });
    return { gecerli, yaklasan, suresiDolmus, yok, detaylar };
}

function _isgDosyaOzet(veriObje) {
    if (!veriObje || typeof veriObje !== 'object') return [];
    const ozet = [];
    Object.entries(veriObje).forEach(([kategoriKod, dosyalar]) => {
        if (!Array.isArray(dosyalar) || dosyalar.length === 0) return;
        ozet.push({
            kategori: ISG_DOSYA_KATEGORILERI[kategoriKod] || kategoriKod,
            sayi: dosyalar.length,
            ornekler: dosyalar.map(d => d?.ad || 'İsimsiz belge').slice(0, 5),
        });
    });
    return ozet;
}

function _olcumOzet(veriObje, simdi, otuzGun) {
    const detaylar = [];
    let gecerli = 0, yaklasan = 0, suresiDolmus = 0;
    if (!veriObje || typeof veriObje !== 'object')
        return { gecerli, yaklasan, suresiDolmus, detaylar };
    const kayitlar = Array.isArray(veriObje) ? veriObje : Object.values(veriObje);
    kayitlar.forEach(kayit => {
        if (!kayit || typeof kayit !== 'object') return;
        const ekipman = kayit.ekipmanAdi || kayit.ad || 'Bilinmeyen Ekipman';
        const kontrolFirma = kayit.kontrolFirma || kayit.firma || '—';
        const tarihStr = kayit.gecerlilikTarihi || kayit.gecerliTarih || kayit.bitisTarihi || null;
        let durum = 'tarih yok';
        if (tarihStr) {
            const tarih = new Date(tarihStr);
            if (!isNaN(tarih.getTime())) {
                if (tarih < simdi)         { suresiDolmus++; durum = 'süresi dolmuş'; }
                else if (tarih <= otuzGun) { yaklasan++;     durum = 'yaklaşıyor'; }
                else                       { gecerli++;      durum = 'geçerli'; }
            }
        }
        detaylar.push({ ekipman, kontrolFirma, gecerlilikTarihi: tarihStr || '—', durum });
    });
    return { gecerli, yaklasan, suresiDolmus, detaylar };
}

function _temsilciOzet(veriObje) {
    if (!veriObje || typeof veriObje !== 'object') return [];
    const sonuc = [];
    Object.entries(veriObje).forEach(([anahtar, deger]) => {
        if (!deger || typeof deger !== 'object') return;
        if (typeof Object.values(deger)[0] === 'object') {
            Object.values(deger).forEach(kayit => {
                if (!kayit || typeof kayit !== 'object') return;
                sonuc.push({
                    personel: kayit.personelAd || '—',
                    atamaTarihi: kayit.atamaTarih || kayit.atamaTarihi || '—',
                    ekip: anahtar,
                });
            });
        } else {
            sonuc.push({
                personel: deger.personelAd || '—',
                atamaTarihi: deger.atamaTarih || deger.atamaTarihi || '—',
                ekip: null,
            });
        }
    });
    return sonuc;
}

function _digerVeriDepoOzet(veriler) {
    const bilinenAnahtarlar = new Set([
        'muayene_verileri', 'egitim_verileri', 'ilkyardim_verileri',
        'isg_dosyalar', 'olcum_verileri', 'olcum_ekipman_verileri',
        'destek_verileri', 'temsilci_verileri',
    ]);
    const diger = {};
    Object.entries(veriler).forEach(([anahtar, deger]) => {
        if (!bilinenAnahtarlar.has(anahtar)) diger[anahtar] = deger;
    });
    return diger;
}

async function _kullaniciListesiniHazirla(kullanici) {
    try {
        if (kullanici.rol === 'izleyici') return null;
        const projeksiyon = { adSoyad: 1, eposta: 1, rol: 1, olusturmaTarihi: 1 };
        if (kullanici.rol === 'sistem_yoneticisi') {
            const kullanicilar = await Kullanici.find({ aktif: { $ne: false } }, projeksiyon).lean();
            return {
                kapsam: 'tum_sistem',
                kullanicilar: kullanicilar.map(k => ({ adSoyad: k.adSoyad || '—', eposta: k.eposta || '—', rol: k.rol || '—' })),
            };
        }
        if (kullanici.rol === 'isg_uzmani' || kullanici.rol === 'isyeri_hekimi') {
            const firmalar = await Firma.find({ ekleyenKullanici: kullanici._id, aktif: { $ne: false } }, { _id: 1 }).lean();
            const firmaIds = firmalar.map(f => f._id);
            const isverenler = await Kullanici.find({ aktif: { $ne: false }, rol: 'isveren', isverenFirma: { $in: firmaIds } }, projeksiyon).lean();
            return {
                kapsam: 'kendi_firmalari',
                kullanicilar: isverenler.map(k => ({ adSoyad: k.adSoyad || '—', eposta: k.eposta || '—', rol: k.rol || '—' })),
            };
        }
        if (kullanici.rol === 'isveren') {
            return {
                kapsam: 'sadece_kendi',
                kullanicilar: [{ adSoyad: kullanici.adSoyad || '—', eposta: kullanici.eposta || '—', rol: kullanici.rol || '—' }],
            };
        }
        return null;
    } catch (err) {
        console.warn('[AI] Kullanıcı listesi alınamadı:', err.message);
        return null;
    }
}


async function _mevzuatAra(soru) {
    try {
        if (!process.env.HUGGINGFACE_API_KEY) return [];

        
        const soruKucuk = soru.toLowerCase();
        const zorunluMaddeler = [];

        // Madde numarasını her iki yazım biçiminde de yakala
let arananMaddeNo = null;

// İleri pattern: "madde 13", "maddesi 13", "Madde 25/A"
const ileriMatch = soruKucuk.match(/madde\w*\s+(\d+(?:\/[a-zçşğüöı])?)/i);
if (ileriMatch) {
    arananMaddeNo = ileriMatch[1].toUpperCase();
}

// Geri pattern: "13. madde", "13. maddesi", "13. maddesini",
// "13'üncü madde", "25/A. maddesinde" gibi Türkçe doğal yazımlar
if (!arananMaddeNo) {
    const geriMatch = soruKucuk.match(/(\d+(?:\/[a-zçşğüöı])?)\s*(?:\.|['’]?(?:inci|nci|üncü|uncu|ıncı|incı))\s*madde/i);
    if (geriMatch) {
        arananMaddeNo = geriMatch[1].toUpperCase();
    }
}

if (arananMaddeNo) {
    const dogrudanMadde = await MevzuatParca.findOne({ maddeNo: `MADDE ${arananMaddeNo}` }).lean();
    if (dogrudanMadde) {
        zorunluMaddeler.push({ ...dogrudanMadde, skor: 1.0 });
    }
}

        // Anahtar kelime → madde eşleştirmesi
        const anahtarMaddeler = {
            // MADDE 4 - İşverenin genel yükümlülüğü
    'işverenin yükümlülük': '4', 'işveren sorumluluk': '4',
    
    // MADDE 5 - Risklerden korunma ilkeleri
    'korunma ilkeleri': '5', 'risklerden korunma': '5',
    'kaynağında mücadele': '5', 'tehlikeli olanı': '5',
    'kaynağında mücadele': '5',
            'tehlikeli olanı': '5', 
    
    // MADDE 6 - İSG hizmetleri
    'isg hizmetleri': '6', 'iş sağlığı hizmeti': '6',

    // MADDE 7 - iş SAĞLIĞI VE GÜVENLİĞİ HİZM. DESTEKLENMESİ
    'isg destek': '7', 'iş sağlığı ve güvenliği hizmetleri destek': '7',
    
    // MADDE 8 - İşyeri hekimi ve iş güvenliği uzmanı
    'iş güvenliği uzmanı': '8', 'isg uzmanı': '8', 
    'işyeri hekimi': '8', 'ortak sağlık': '8', 'destek elemanı': '8',
    
    // MADDE 10 - Risk değerlendirmesi
    'risk değerlendirme': '10', 'risk analizi': '10', 'ölçüm': '10',
    
    // MADDE 11 - Acil durum planları
    'acil durum': '11', 'acil eylem': '11', 
    'yangınla mücadele': '11', 'ilk yardım': '11',
    'tahliye': '11', 'yangın': '11', 'ilkyardım': '11',
    
    // MADDE 12 - Tahliye
    'tahliye': '12',
    
    // MADDE 13 - Çalışmaktan kaçınma hakkı ✅
    'çalışmaktan kaçınma': '13', 'kaçınma hakkı': '13',
    'ciddi ve yakın tehlike': '13', 'işyerini terk': '13',
    'tehlikeli bölge': '13', 
    
    // MADDE 14 - İş kazası ve meslek hastalığı bildirimi
    'iş kazası': '14', 'meslek hastalığı': '14', 
    'kayıt ve bildirim': '14', 'sgk bildirim': '14',
    
    // MADDE 15 - Sağlık gözetimi
    'sağlık gözetimi': '15', 'periyodik muayene': '15',
    'sağlık muayenesi': '15', 'işe giriş muayene': '15',
    
    // MADDE 16 - Çalışanların bilgilendirilmesi
    'bilgilendirme': '16', 'çalışanları bilgilendir': '16',
    
    // MADDE 17 - Çalışanların eğitimi
    'eğitim': '17', 'isg eğitimi': '17', 'temel eğitim': '17',
    
    // MADDE 18 - Görüş alma ve katılım ✅ YENİ
    'görüş alma': '18', 'görüşlerinin alınması': '18',
    'çalışan görüşü': '18', 'katılım': '18', 
    'katılımının sağlanması': '18', 'görüş': '18',
    
    // MADDE 19 - Çalışanların yükümlülükleri
    'çalışan yükümlülük': '19', 'çalışanın sorumluluğu': '19',
     'kişisel koruyucu': '19', 'kkd': '19', 'kişisel koruyucu donanım': '19',
    
    // MADDE 20 - Çalışan temsilcisi
    'çalışan temsilcisi': '20', 'isg temsilcisi': '20',
    'temsilci seçimi': '20',
    
    // MADDE 22 - İSG kurulu
    'kurul': '22', 'kurullar': '22', 'isg kurulu': '22',
    'iş sağlığı ve güvenliği kurulu': '22',
    
    // MADDE 23 - Koordinasyon
    'koordinasyon': '23', 'aynı işyeri': '23',

    //MADDE 24 - Denetim
    'denetim': '24', 'isg denetimi': '24', 'iş sağlığı ve güvenliği denetimi': '24',
    
    // MADDE 25 - İşin durdurulması
    'işin durdurulması': '25', 'durdurma': '25',
    
    // MADDE 26 - İdari para cezaları
    'para cezası': '26', 'idari ceza': '26', 'ceza': '26',
    
    // MADDE 27 - Hüküm bulunmayan haller, muafiyet
    'muafiyet': '27', 'hüküm bulunmayan': '27',
    'damga vergisi': '27', 'harç': '27', 
'alkol': '28', 'uyuşturucu': '28', 'bağımlılık': '28', 'sarhoş': '28',

    // MADDE 29 - Çalışanların sağlık ve güvenliğini tehlikeye düşüren davranışlar
    'tehlikeye düşüren davranış': '29', 'tehlikeli davranış': '29',
    'sağlık ve güvenlik tehlikesi': '29', 'tehlikeye düşürme': '29',

    // MADDE 30 - Yürürlük ve geçici hükümler
    'yürürlük': '30', 'geçici hükümler': '30', 'geçici madde': '30',    

    //  MADDE 31 - Belgelendirme, ihtar, askı ve iptaller
    'belgelendirme': '31', 'ihtar': '31', 'askı': '31', 'iptal': '31',
    
    //MADDE 37 - Sağlık raporları
    'sağlık raporu': '37', 'rapor': '37', 'işe giriş raporu': '37',
   
        };



        for (const [kelime, maddeNo] of Object.entries(anahtarMaddeler)) {
            if (soruKucuk.includes(kelime)) {
                const madde = await MevzuatParca.findOne({ 
                maddeNo: { $regex: `^MADDE ${maddeNo}$`, $options: 'i' } 
                 }).lean();
                if (madde) zorunluMaddeler.push({ ...madde, skor: 1.0 });
            }
        }

        const zenginlestirilmisSoru = soru + ' iş sağlığı güvenliği kanun madde yükümlülük';

        // Soruyu embedding'e çevir
        const response = await fetch(
            'https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-mpnet-base-v2/pipeline/feature-extraction',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: zenginlestirilmisSoru }),
            }
        );

        const soruEmbedding = await response.json();
        if (!Array.isArray(soruEmbedding) || soruEmbedding.length === 0) return [];

        // MongoDB'den tüm maddeleri al
        const maddeler = await MevzuatParca.find(
            { kanunNo: '6331' },
            { maddeNo: 1, metin: 1, embedding: 1 }
        ).lean();

        if (maddeler.length === 0) return [];

        // Kosinüs benzerliği hesapla
        const skorlar = maddeler.map(m => {
            if (!m.embedding || m.embedding.length === 0) return { ...m, skor: 0 };
            const dot   = m.embedding.reduce((acc, val, i) => acc + val * (soruEmbedding[i] || 0), 0);
            const normA = Math.sqrt(m.embedding.reduce((acc, val) => acc + val * val, 0));
            const normB = Math.sqrt(soruEmbedding.reduce((acc, val) => acc + val * val, 0));
            const skor  = normA && normB ? dot / (normA * normB) : 0;
            return { maddeNo: m.maddeNo, metin: m.metin, skor };
        });

        // En benzer 5 maddeyi döndür (min benzerlik: 0.10)
         const embedingMaddeler = skorlar
            .sort((a, b) => b.skor - a.skor)
            .slice(0, 5)
            .filter(m => m.skor > 0.10);

        const tumMaddeler = [...zorunluMaddeler];
        embedingMaddeler.forEach(m => {
            if (!tumMaddeler.find(z => z.maddeNo === m.maddeNo)) tumMaddeler.push(m);
        });
        return tumMaddeler.slice(0, 5);

    } catch (err) {
        console.warn('[AI] Mevzuat arama hatası:', err.message);
        return [];
    }
}


async function _takipliMevzuatlariHazirla() {
    try {
        const TakipliMevzuat  = require('../models/TakipliMevzuat');
        const MevzuatVersiyon = require('../models/MevzuatVersiyon');

        const mevzuatlar = await TakipliMevzuat.find(
            { aktif: { $ne: false } },
            {
                ad: 1, kategori: 1, aciklama: 1, mevzuatNo: 1,
                takipDurumu: 1, sonTaramaTarihi: 1,
                toplamTaramaSayisi: 1, basariliTaramaSayisi: 1,
            }
        ).lean();

        // İstatistikler
        const istatistik = {
            toplam: mevzuatlar.length,
            aktif: mevzuatlar.filter(m => m.takipDurumu === 'aktif').length,
            hatali: mevzuatlar.filter(m => m.takipDurumu === 'url-hatasi').length,
            kategoriDagilimi: {},
        };
        mevzuatlar.forEach(m => {
            const kat = m.kategori || 'Diğer';
            istatistik.kategoriDagilimi[kat] = (istatistik.kategoriDagilimi[kat] || 0) + 1;
        });

        // Onay bekleyen değişiklik sayısı
        istatistik.onayBekleyenDegisiklik = await MevzuatVersiyon.countDocuments({
            durum: 'onay-bekliyor',
        });

        return {
            istatistik,
            liste: mevzuatlar.map(m => ({
                ad: m.ad,
                kategori: m.kategori || 'Diğer',
                mevzuatNo: m.mevzuatNo || '—',
                aciklama: m.aciklama || '—',
                durum: m.takipDurumu || '—',
                sonTaramaTarihi: m.sonTaramaTarihi
                    ? new Date(m.sonTaramaTarihi).toLocaleDateString('tr-TR')
                    : 'Henüz taranmadı',
            })),
        };
    } catch (err) {
        console.warn('[AI] Takipli mevzuat listesi alınamadı:', err.message);
        return null;
    }
}

async function _firmaVerileriniHazirla(kullanici) {
    const filtre = { aktif: { $ne: false } };
    if (kullanici.rol === 'sistem_yoneticisi') {}
    else if (kullanici.rol === 'isg_uzmani' || kullanici.rol === 'isyeri_hekimi')
        filtre.ekleyenKullanici = kullanici._id;
    else if (kullanici.rol === 'isveren')
        filtre._id = kullanici.isverenFirma;
    else return [];

    const firmalar = await Firma.find(filtre).lean();
    const simdi = new Date();
    const otuzGun = new Date();
    otuzGun.setDate(simdi.getDate() + 30);

    return await Promise.all(firmalar.map(async (f) => {
        const personeller = await Personel.find({ firma: f._id, aktif: { $ne: false } }).lean();
        const veriler      = await _firmaVeriDepoOku(f.firmaAdi);

        const muayeneOzet      = _personelTarihOzet(veriler.muayene_verileri,   simdi, otuzGun, 'gecerliTarih');
        const egitimOzet       = _personelTarihOzet(veriler.egitim_verileri,    simdi, otuzGun, 'gecerliTarih');
        const ilkyardimOzet    = _personelTarihOzet(veriler.ilkyardim_verileri, simdi, otuzGun, 'gecerliTarih');
        const isgDosyaOzeti    = _isgDosyaOzet(veriler.isg_dosyalar);
        const olcumOzeti       = _olcumOzet(veriler.olcum_ekipman_verileri, simdi, otuzGun);
        const temsilciler      = _temsilciOzet(veriler.temsilci_verileri);
        const destekElemanlari = _temsilciOzet(veriler.destek_verileri);
        const digerVeriler     = _digerVeriDepoOzet(veriler);

        const egitimler = await Egitim.find({ firma: f._id }).lean();
        let egitimDolmus = 0, egitimYaklasanDocs = 0, egitimGecerliDocs = 0;
        const egitimDetaylari = egitimler.map(e => {
            let bitisTarihi;
            if (e.tamamlanmaTarihi) {
                bitisTarihi = new Date(e.tamamlanmaTarihi);
                bitisTarihi.setMonth(bitisTarihi.getMonth() + (e.gecerlilikSuresiAy || 12));
            } else {
                bitisTarihi = new Date(e.planlananTarih);
            }
            let durumStr;
            if (e.durum === 'iptal') { durumStr = 'iptal'; }
            else if (!e.tamamlanmaTarihi && bitisTarihi < simdi) { durumStr = 'süresi dolmuş (henüz yapılmamış)'; egitimDolmus++; }
            else if (bitisTarihi < simdi)    { durumStr = 'süresi dolmuş'; egitimDolmus++; }
            else if (bitisTarihi <= otuzGun) { durumStr = 'yaklaşıyor';   egitimYaklasanDocs++; }
            else                             { durumStr = 'geçerli';      egitimGecerliDocs++; }
            return { konu: e.konu, bitisTarihi: bitisTarihi.toISOString().split('T')[0], durum: durumStr };
        });

        const dokumanlar = await Dokuman.find({ firma: f._id }).lean();
        const turBazinda = {};
        dokumanlar.forEach(d => {
            const tur = (d.tur === 'diger' && d.kategori) ? d.kategori : (d.tur || 'diger');
            if (!turBazinda[tur]) turBazinda[tur] = [];
            turBazinda[tur].push(d);
        });

        const dokumanOzeti = Object.entries(turBazinda).map(([tur, dlist]) => {
            let gecerli = 0, yaklasan = 0, suresiDolmus = 0, enYakinBitisTarihi = null;
            dlist.forEach(d => {
                if (!d.gecerlilikBitis) { gecerli++; return; }
                const tarih = new Date(d.gecerlilikBitis);
                if (tarih < simdi) suresiDolmus++;
                else if (tarih <= otuzGun) yaklasan++;
                else gecerli++;
                if (!enYakinBitisTarihi || tarih < enYakinBitisTarihi) enYakinBitisTarihi = tarih;
            });
            return {
                kategori: TUR_ETIKETLERI[tur] || tur,
                toplam: dlist.length,
                gecerli, yaklasan, suresiDolmus,
                enYakinBitis: enYakinBitisTarihi ? enYakinBitisTarihi.toISOString().split('T')[0] : null,
            };
        });

        return {
            firmaAdi: f.firmaAdi, sektor: f.sektor || '—',
            tehlikeSinifi: _tehlikeSinifiNormalize(f.tehlikeSinifi),
            calisanSayisi: f.calisanSayisi || personeller.length,
            yetkiliKisi: f.yetkiliKisi || '—',
            personel: { toplam: personeller.length, muayene: muayeneOzet, egitim: egitimOzet, ilkyardim: ilkyardimOzet },
            olcumler: olcumOzeti,
            temsilciler,
            destekElemanlari,
            digerVeriler,
            isgDosyalar: isgDosyaOzeti,
            dokumanlar: dokumanOzeti,
            dokumanToplam: dokumanlar.length,
            planlananEgitimler: egitimDetaylari,
            egitimOzeti: { toplam: egitimler.length, gecerli: egitimGecerliDocs, yaklasan: egitimYaklasanDocs, suresiDolmus: egitimDolmus },
        };
    }));
}

// ✅ GÜNCELLENDİ: ilgiliMaddeler parametresi eklendi
function _sohbetPromptOlustur(soru, firmaVerileri, gecmisMesajlar, kullaniciKapsami, ilgiliMaddeler = [], takipliMevzuatlar = null) {
    const bugun = new Date().toLocaleDateString('tr-TR');

    const veriOzeti = firmaVerileri.length === 0
        ? '(Henüz kayıtlı firma bulunmuyor)'
        : firmaVerileri.map(f => {

            const muayeneDetay = f.personel.muayene.detaylar.length === 0
                ? '    (kayıt yok)'
                : f.personel.muayene.detaylar.filter(d => d.durum !== 'geçerli')   // sadece yaklaşan + dolmuş
.slice(0, 25)
                    .map(d => `    • ${d.personel}: ${d.tarih} → ${d.durum}`).join('\n');

            const egitimDetay = f.personel.egitim.detaylar.length === 0
                ? '    (kayıt yok)'
                : f.personel.egitim.detaylar.filter(d => d.durum !== 'geçerli')   // sadece yaklaşan + dolmuş
.slice(0, 25)
                    .map(d => `    • ${d.personel}: ${d.tarih} → ${d.durum}`).join('\n');

            const ilkyardimDetay = f.personel.ilkyardim.detaylar.length === 0
                ? '    (kayıt yok)'
                : f.personel.ilkyardim.detaylar.filter(d => d.durum !== 'geçerli')   // sadece yaklaşan + dolmuş
.slice(0, 25)
                    .map(d => `    • ${d.personel}: ${d.tarih} → ${d.durum}`).join('\n');

            const olcumKisim = f.olcumler.detaylar.length === 0
                ? '  (Kayıtlı ortam ölçümü bulunmuyor)'
                : f.olcumler.detaylar
                    .map(o => `  • ${o.ekipman} (${o.kontrolFirma}): ${o.gecerlilikTarihi} → ${o.durum}`).join('\n');

            const temsilciKisim = f.temsilciler.length === 0
                ? '  (Kayıtlı çalışan temsilcisi yok)'
                : f.temsilciler.map(t => `  • ${t.personel} (atama: ${t.atamaTarihi})`).join('\n');

            const destekKisim = f.destekElemanlari.length === 0
                ? '  (Kayıtlı destek elemanı yok)'
                : f.destekElemanlari
                    .map(t => `  • ${t.personel}${t.ekip ? ' [' + t.ekip + ' ekibi]' : ''} (atama: ${t.atamaTarihi})`)
                    .join('\n');

            const planEgitimKisim = f.planlananEgitimler.length === 0
                ? '  (Hiç eğitim planlanmamış)'
                : f.planlananEgitimler
                    .map(e => `  • ${e.konu}: ${e.bitisTarihi} → ${e.durum}`).join('\n');

            const isgDosyaKisim = f.isgDosyalar.length === 0
                ? '  (Henüz İSG belgesi yüklenmemiş)'
                : f.isgDosyalar
                    .map(d => `  • ${d.kategori}: ${d.sayi} belge${d.ornekler.length ? ' (' + d.ornekler.join(', ') + ')' : ''}`).join('\n');

            const dokumanKisim = f.dokumanlar.length === 0
                ? '  (Kayıtlı doküman yok)'
                : f.dokumanlar
                    .map(d => `  • ${d.kategori}: ${d.toplam} belge (geçerli: ${d.gecerli}, yaklaşan: ${d.yaklasan}, süresi dolmuş: ${d.suresiDolmus})`).join('\n');

            const digerVeriKisim = Object.keys(f.digerVeriler).length === 0 ? '' :
                '\nDİĞER VERİLER:\n' + Object.entries(f.digerVeriler)
                    .map(([a, d]) => `  • ${a}: ${typeof d === 'object' ? Object.keys(d).length + ' kayıt' : String(d).substring(0, 100)}`)
                    .join('\n');

            return `
─── ${f.firmaAdi} ───
- Sektör: ${f.sektor}
- Tehlike Sınıfı: ${f.tehlikeSinifi}
- Toplam Çalışan Sayısı (firma kaydında): ${f.calisanSayisi}
- Sistemde Detaylı Personel Sayısı: ${f.personel.toplam}
- Yetkili: ${f.yetkiliKisi}

PERSONEL MUAYENELERİ:
  Özet: ${f.personel.muayene.gecerli} geçerli, ${f.personel.muayene.yaklasan} yaklaşan, ${f.personel.muayene.suresiDolmus} süresi dolmuş, ${f.personel.muayene.yok} kayıt yok
  Detaylar:
${muayeneDetay}

PERSONEL EĞİTİMLERİ (kişi başına):
  Özet: ${f.personel.egitim.gecerli} geçerli, ${f.personel.egitim.yaklasan} yaklaşan, ${f.personel.egitim.suresiDolmus} süresi dolmuş, ${f.personel.egitim.yok} kayıt yok
  Detaylar:
${egitimDetay}

İLKYARDIMCI SERTİFİKALARI:
  Özet: ${f.personel.ilkyardim.gecerli} geçerli, ${f.personel.ilkyardim.yaklasan} yaklaşan, ${f.personel.ilkyardim.suresiDolmus} süresi dolmuş
  Detaylar:
${ilkyardimDetay}

ORTAM ÖLÇÜMLERİ / EKİPMAN KONTROLLERİ:
  Özet: ${f.olcumler.gecerli} geçerli, ${f.olcumler.yaklasan} yaklaşan, ${f.olcumler.suresiDolmus} süresi dolmuş
${olcumKisim}

ÇALIŞAN TEMSİLCİLERİ:
${temsilciKisim}

DESTEK ELEMANLARI:
${destekKisim}

PLANLANMIŞ EĞİTİMLER (firma seviyesinde, toplam ${f.egitimOzeti.toplam}):
  Özet: ${f.egitimOzeti.gecerli} geçerli, ${f.egitimOzeti.yaklasan} yaklaşan, ${f.egitimOzeti.suresiDolmus} süresi dolmuş
${planEgitimKisim}

YÜKLENMİŞ İSG BELGELERİ (VeriDepo - kategori bazında):
${isgDosyaKisim}

DOKÜMANLAR (Doküman koleksiyonu - kategori bazında):
${dokumanKisim}
${digerVeriKisim}`;
        }).join('\n');

    // ─── KULLANICI LİSTESİ BÖLÜMÜ ───────────────────────────────────────
    let kullaniciOzeti;
    if (kullaniciKapsami === null) {
        kullaniciOzeti = '(Kullanıcı listesini görme yetkiniz yok.)';
    } else if (!kullaniciKapsami.kullanicilar || kullaniciKapsami.kullanicilar.length === 0) {
        kullaniciOzeti = '(Yetki kapsamınızda kayıtlı kullanıcı bulunmuyor.)';
    } else {
        const kapsamMetni = {
            'tum_sistem':      'Tüm sistemdeki kullanıcılar (Sistem Yöneticisi yetkisi)',
            'kendi_firmalari': 'Sizin yönettiğiniz firmaların yetkilileri (işverenler)',
            'sadece_kendi':    'Sadece kendi hesabınız',
        }[kullaniciKapsami.kapsam] || 'Yetkiniz dahilindeki kullanıcılar';

        kullaniciOzeti = `Görüntüleme kapsamı: ${kapsamMetni}\nToplam ${kullaniciKapsami.kullanicilar.length} kullanıcı:\n` +
            kullaniciKapsami.kullanicilar
                .map(k => `  • ${k.adSoyad} (${k.eposta}) — Rol: ${k.rol}`)
                .join('\n');
    }

    // ✅ YENİ: İlgili mevzuat maddeleri bölümü
    const mevzuatKismi = ilgiliMaddeler.length > 0
        ? '\n## İLGİLİ MEVZUAT (6331 Sayılı İSG Kanunu):\n' +
          ilgiliMaddeler.map(m => `### ${m.maddeNo}\n${m.metin.substring(0, 1500)}`).join('\n\n')
        : '';

    // ✅ YENİ: Takipli mevzuat listesi bölümü
    let takipliMevzuatKismi;
    if (!takipliMevzuatlar || takipliMevzuatlar.istatistik.toplam === 0) {
        takipliMevzuatKismi = '';  // Boş — gerekirse "yok" yazmak yerine hiç gösterme
    } else {
        const ist = takipliMevzuatlar.istatistik;
        const katSatiri = Object.entries(ist.kategoriDagilimi)
            .map(([k, v]) => `${k}: ${v}`).join(', ');

        const mevzuatListesi = takipliMevzuatlar.liste
            .map(m => `  • ${m.ad} [${m.kategori}${m.mevzuatNo !== '—' ? ', No: ' + m.mevzuatNo : ''}] — ${m.aciklama !== '—' ? m.aciklama + ' • ' : ''}son tarama: ${m.sonTaramaTarihi}`)
            .join('\n');

        takipliMevzuatKismi = `
## OTOMATİK MEVZUAT TAKİP SİSTEMİ (mevzuat.gov.tr Takibi sekmesi):
Bu sistem, mevzuat.gov.tr'deki resmi yönetmelik ve kanunları otomatik takip eder, değişiklikleri yöneticinin onayına sunar.

İstatistikler:
- Toplam takipli mevzuat: ${ist.toplam}
- Aktif takipte: ${ist.aktif}
- URL hatalı: ${ist.hatali}
- Onay bekleyen değişiklik: ${ist.onayBekleyenDegisiklik}
- Kategori dağılımı: ${katSatiri}

Takipli mevzuatların listesi:
${mevzuatListesi}`;
    }

    const gecmis = gecmisMesajlar && gecmisMesajlar.length > 0
        ? '\n## ÖNCEKİ SOHBETLER:\n' + gecmisMesajlar.slice(-6)
            .map(m => `${m.rol === 'kullanici' ? 'Kullanıcı' : 'Asistan'}: ${m.metin}`).join('\n')
        : '';

    return `Sen bir İş Sağlığı ve Güvenliği (İSG) Doküman Yönetim Sistemi'nin yapay zeka asistanısın.
Görevin: kullanıcının doğal dilde sorduğu soruları, AŞAĞIDAKİ GERÇEK SİSTEM VERİLERİNE dayanarak yanıtlamak.

## BUGÜNÜN TARİHİ: ${bugun}

## SİSTEMDEKİ VERİLER:
${veriOzeti}
${mevzuatKismi}
${takipliMevzuatKismi}


## SİSTEM KULLANICILARI (yetki kapsamınız dahilinde):
${kullaniciOzeti}

## TANIMLAR:
- "Geçerli" = Tarihi 30 günden daha geç sürecek (sorun yok)
- "Yaklaşan" = 30 gün içinde sürecek (UYARI gerekli)
- "Süresi Dolmuş" = Süresi geçmiş (KRİTİK)
- "Kaydı Yok" = Sisteme henüz kaydedilmemiş

## VERİ KAYNAKLARI:
- "YÜKLENMİŞ İSG BELGELERİ" = VeriDepo'daki belgeler
- "DOKÜMANLAR" = Doküman koleksiyonundaki belgeler
- Bir firmada belge sorulduğunda HER İKİ kaynağa da bak!

## TEHLİKE SINIFI vs EĞİTİM SÜRESİ:
- Az Tehlikeli: 36 ay (3 yıl) | Tehlikeli: 24 ay (2 yıl) | Çok Tehlikeli: 12 ay (1 yıl)

## TEHLİKE SINIFI vs MUAYENE SÜRESİ:
- Az Tehlikeli: 60 ay (5 yıl) | Tehlikeli: 36 ay (3 yıl) | Çok Tehlikeli: 12 ay (1 yıl)

${gecmis}

## KULLANICININ SORUSU:
${soru}

## CEVAP KURALLARI:
1. SADECE yukarıdaki "SİSTEMDEKİ VERİLER" bölümüne bakarak cevap ver. ASLA tahmin yürütme, varsayım yapma, bilgi uydurma.
2. Belge sorularında hem "YÜKLENMİŞ İSG BELGELERİ" hem de "DOKÜMANLAR" bölümüne bak. ÖNEMLİ: Sistem bu iki kaynakta aynı belgeyi tutar (mimari nedeniyle) — sayıları TOPLAMA. 
Aynı kategoride iki kaynakta da kayıt varsa, daha yüksek olan sayıyı kullan ve TEK CEVAP ver. Örnek: "VeriDepo'da 3, Doküman'da 3" görüyorsan kullanıcıya "3 belge var" de, "6 belge" deme. Çift kayıt detayını kullanıcıya açıklama.
3. Tehlike sınıfını yukarıdaki değerden okuyup AYNEN aktarın.
4. Çalışan sayısı için "Toplam Çalışan Sayısı" ve "Sistemde Detaylı Personel Sayısı"ndan uygun olanı kullan.
5. Personel muayene/eğitim detaylarını isim isim listele.
6. Ortam ölçümü sorularında "ORTAM ÖLÇÜMLERİ" bölümündeki verileri kullan.
7. Çalışan temsilcisi sorularında "ÇALIŞAN TEMSİLCİLERİ" bölümündeki verileri kullan.
8. Destek elemanı sorularında "DESTEK ELEMANLARI" bölümündeki verileri kullan.
9. Türkçe, samimi ve profesyonel bir dille konuş.
10. Acil/kritik durumları ⚠️ emojisiyle vurgula.
11. FORMAT KURALLARI: Her firma için ayrı paragraf. Personel listelerini "Ad: tarih (durum)" formatında yaz. Kritik olanları en üste al. Gereksiz tekrar etme.
12. Cevap 400 kelimeyi geçmesin ama ASLA yarıda bırakma. Veri çoksa en kritikleri özetle.
13. Eğer kullanıcı bir firma adı söyledi ama listede yoksa: "Bu isimle bir firma sistemde kayıtlı değil" de.
14. SORGULAMA ODAKLI YANITLA: Belirli bir konuyla ilgili soru geldiğinde SADECE o konuda kaydı olan firmaları yaz. ASLA kaydı olmayan firmaların adını yazma. Sadece "Diğer firmalarda bu konuda kayıt bulunmamaktadır." yaz ve bitir.
15. "Süresi yaklaşan" sorularında süresi dolmuşları da listele — ⚠️ KRİTİK olarak vurgula.
16. Personel muayene/eğitim verileri için "PERSONEL MUAYENELERİ" bölümündeki detaylara bak.
17. EŞANLAMLI TERİMLERE DİKKAT: Kullanıcı aynı belgeyi farklı isimlerle sorabilir. Aşağıdaki ifadeleri AYNI şey olarak kabul et:
    - "acil durum planı" = "acil eylem planı" = "acil durum eylem planı" = "ADP"
    - "risk değerlendirmesi" = "risk analizi" = "risk raporu" = "RV"
    - "periyodik sağlık muayenesi" = "muayene" = "sağlık kontrolü" = "periyodik kontrol"
    - "İSG eğitimi" = "iş sağlığı eğitimi" = "güvenlik eğitimi" = "temel İSG eğitimi"
    - "ortam ölçümü" = "çevre ölçümü" = "ekipman kontrolü" = "ölçüm raporu"
    - "tatbikat" = "acil durum tatbikatı" = "yangın tatbikatı"
    - "DİF" = "DÖF" = "düzeltici faaliyet" = "iyileştirici faaliyet"
    - "KKD" = "kişisel koruyucu donanım" = "iş güvenliği ekipmanı"
    - "İSG temsilcisi" = "çalışan temsilcisi" = "güvenlik temsilcisi"
    - "destek elemanı" = "ekip üyesi" = "koruma/kurtarma/söndürme/ilkyardım ekibi"
    - "ilkyardım sertifikası" = "ilkyardımcı belgesi" = "ilkyardım eğitimi"
        - "tehlike sınıfı" = "tehlike grubu" = "risk sınıfı"
    -"İSG kurulu"= "iş güvenliği kurulu" = "iş sağlığı ve güvenliği kurulu"
    Tipo (yazım hatası) varsa da en yakın anlama göre yorumla. Örnek: "muyene" → "muayene".
18. KULLANICI vs YETKİLİ KARIŞIKLIĞI:
    - "Sistemdeki kullanıcılar", "kayıtlı kullanıcılar", "kim sisteme giriş yapabilir" gibi sorular için "SİSTEM KULLANICILARI" bölümüne bak.
    - "Firmaların yetkilileri", "ABC İnşaat'ın yetkilisi kim" gibi sorular için her firmanın "Yetkili" alanına bak.
    - Bu ikisi FARKLI şeylerdir, asla karıştırma.
19. KULLANICI LİSTESİ GİZLİLİĞİ (KVKK): "SİSTEM KULLANICILARI" bölümündeki "Görüntüleme kapsamı"na göre yanıt ver.
    - "Tüm sistemdeki kullanıcılar" → tüm listeyi ver
    - "Sizin yönettiğiniz firmaların yetkilileri" → "Sizin yönettiğiniz firmaların yetkili kullanıcıları" diye giriş yap
    - "Sadece kendi hesabınız" → "Görüntüleyebileceğiniz tek kullanıcı kendi hesabınızdır" de
    - Kullanıcı yetkisi yoksa: "Bu bilgiyi görme yetkiniz yok. Sistem yöneticinize başvurabilirsiniz" de.
    - ASLA yetki kapsamı dışındaki kullanıcı bilgisini sızdırma.
20. MEVZUAT SORULARI: "İLGİLİ MEVZUAT" bölümünde madde varsa, kullanıcı sistem verisi sormasa bile bu maddeleri kullanarak yanıt ver. Madde numarasını belirt. ANCAK kullanıcı açıkça bir firma veya sistemdeki durum hakkında sormadıysa, firma verilerini ve "sistemdeki firmaların durumu" bilgisini ASLA ekleme. Sadece mevzuat bilgisini ver ve bitir.
21. OTOMATİK MEVZUAT TAKİP SORULARI: Kullanıcı "mevzuat.gov.tr takibi", "takipli mevzuat", "kaç yönetmelik takip ediliyor", "kayıtlı yönetmelik", "hangi kanunlar var", "sistemde hangi mevzuat var" gibi sorduğunda "OTOMATİK MEVZUAT TAKİP SİSTEMİ" bölümündeki verileri kullan. Sayı sorulduysa istatistikleri ver (toplam, aktif, kategori dağılımı). Liste istendiyse adları kategori ile sırala. "Onay bekleyen değişiklik var mı" sorulduğunda istatistikten cevapla. Bu sistem 6331 Kanunu'nun MADDE içeriği ile KARIŞTIRILMAMALIDIR — "OTOMATİK MEVZUAT TAKİP" bütün mevzuatların PDF takibidir, "İLGİLİ MEVZUAT" sadece 6331 kanununun madde içeriklerinden alınır.
Şimdi yanıt ver:`;
}

exports.sohbet = async (req, res) => {
    const baslangic = Date.now();
    try {
        const { soru, gecmisMesajlar } = req.body;
        if (!soru || typeof soru !== 'string' || soru.trim().length < 2)
            return res.status(400).json({ basarili: false, hata: 'Soru eksik veya çok kısa.' });
        if (soru.length > 1000)
            return res.status(400).json({ basarili: false, hata: 'Soru çok uzun (max 1000 karakter).' });
        if (!process.env.GEMINI_API_KEY)
            return res.status(500).json({ basarili: false, hata: 'Yapay zeka servisi yapılandırılmamış.' });

        // ✅ GÜNCELLENDİ: Paralel olarak firma verileri, kullanıcı listesi ve mevzuat araması
        const [firmaVerileri, kullaniciKapsami, ilgiliMaddeler, takipliMevzuatlar] = await Promise.all([
            _firmaVerileriniHazirla(req.kullanici),
            _kullaniciListesiniHazirla(req.kullanici),
            _mevzuatAra(soru),
            _takipliMevzuatlariHazirla(),
        ]);

        const prompt = _sohbetPromptOlustur(soru, firmaVerileri, gecmisMesajlar, kullaniciKapsami, ilgiliMaddeler, takipliMevzuatlar);
        const sonuc  = await modelSohbet.generateContent(prompt);
        const yanit  = sonuc.response.text().trim();

        const sure = Date.now() - baslangic;
        console.log(`💬 [AI Sohbet] ${sure}ms | Mevzuat: ${ilgiliMaddeler.length} madde | Takip: ${takipliMevzuatlar?.istatistik?.toplam || 0} | Soru: "${soru.substring(0, 50)}..."`);
        res.json({ basarili: true, yanit, sureMs: sure });
    } catch (err) {
        console.error('[AI Sohbet] Hata:', err.message);
        res.status(500).json({ basarili: false, hata: 'Yapay zeka yanıt verirken hata oluştu.', detay: err.message });
    }
};