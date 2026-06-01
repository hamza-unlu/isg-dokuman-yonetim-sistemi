const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'dummy-key';
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

async function geminiCagir(prompt, jsonMod = false) {
    const apiKey = process.env.GEMINI_API_KEY || 'dummy-key';
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: jsonMod ? 0.2 : 0.4,
            maxOutputTokens: 2500,
        },
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    return data.candidates[0].content.parts[0].text;
}

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
        const rawText = await geminiCagir(_promptOlustur(metin, firmaAdlari), true);
        const ayiklanmis = _yanitiAyikla(rawText);

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
        const testYaniti = await geminiCagir('Sadece "OK" yaz.');
        res.json({ saglik: 'iyi', mesaj: 'Gemini API erişilebilir', testYaniti: testYaniti.trim().substring(0, 50), model: 'gemini-1.5-flash', kategoriSayisi: ISG_KATEGORILERI.length });
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
        const rawText = await geminiCagir(_promptOlustur(metin, firmaAdlari), true);
        const ayiklanmis = _yanitiAyikla(rawText);

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

        let arananMaddeNo = null;
        const ileriMatch = soruKucuk.match(/madde\w*\s+(\d+(?:\/[a-zçşğüöı])?)/i);
        if (ileriMatch) arananMaddeNo = ileriMatch[1].toUpperCase();

        if (!arananMaddeNo) {
            const geriMatch = soruKucuk.match(/(\d+(?:\/[a-zçşğüöı])?)\s*(?:\.|['']?(?:inci|nci|üncü|uncu|ıncı|incı))\s*madde/i);
            if (geriMatch) arananMaddeNo = geriMatch[1].toUpperCase();
        }

        if (arananMaddeNo) {
            const dogrudanMadde = await MevzuatParca.findOne({ maddeNo: `MADDE ${arananMaddeNo}` }).lean();
            if (dogrudanMadde) zorunluMaddeler.push({ ...dogrudanMadde, skor: 1.0 });
        }

        const anahtarMaddeler = {
            'işverenin yükümlülük': '4', 'işveren sorumluluk': '4',
            'korunma ilkeleri': '5', 'risklerden korunma': '5',
            'kaynağında mücadele': '5', 'tehlikeli olanı': '5',
            'isg hizmetleri': '6', 'iş sağlığı hizmeti': '6',
            'isg destek': '7', 'iş sağlığı ve güvenliği hizmetleri destek': '7',
            'iş güvenliği uzmanı': '8', 'isg uzmanı': '8',
            'işyeri hekimi': '8', 'ortak sağlık': '8', 'destek elemanı': '8',
            'risk değerlendirme': '10', 'risk analizi': '10', 'ölçüm': '10',
            'acil durum': '11', 'acil eylem': '11',
            'yangınla mücadele': '11', 'ilk yardım': '11',
            'tahliye': '11', 'yangın': '11', 'ilkyardım': '11',
            'çalışmaktan kaçınma': '13', 'kaçınma hakkı': '13',
            'ciddi ve yakın tehlike': '13', 'işyerini terk': '13',
            'tehlikeli bölge': '13',
            'iş kazası': '14', 'meslek hastalığı': '14',
            'kayıt ve bildirim': '14', 'sgk bildirim': '14',
            'sağlık gözetimi': '15', 'periyodik muayene': '15',
            'sağlık muayenesi': '15', 'işe giriş muayene': '15',
            'bilgilendirme': '16', 'çalışanları bilgilendir': '16',
            'eğitim': '17', 'isg eğitimi': '17', 'temel eğitim': '17',
            'görüş alma': '18', 'görüşlerinin alınması': '18',
            'çalışan görüşü': '18', 'katılım': '18',
            'çalışan yükümlülük': '19', 'çalışanın sorumluluğu': '19',
            'kişisel koruyucu': '19', 'kkd': '19', 'kişisel koruyucu donanım': '19',
            'çalışan temsilcisi': '20', 'isg temsilcisi': '20',
            'temsilci seçimi': '20',
            'kurul': '22', 'kurullar': '22', 'isg kurulu': '22',
            'iş sağlığı ve güvenliği kurulu': '22',
            'koordinasyon': '23', 'aynı işyeri': '23',
            'denetim': '24', 'isg denetimi': '24',
            'işin durdurulması': '25', 'durdurma': '25',
            'para cezası': '26', 'idari ceza': '26', 'ceza': '26',
            'muafiyet': '27', 'hüküm bulunmayan': '27',
            'damga vergisi': '27', 'harç': '27',
            'alkol': '28', 'uyuşturucu': '28', 'bağımlılık': '28', 'sarhoş': '28',
            'tehlikeye düşüren davranış': '29', 'tehlikeli davranış': '29',
            'yürürlük': '30', 'geçici hükümler': '30', 'geçici madde': '30',
            'belgelendirme': '31', 'ihtar': '31', 'askı': '31', 'iptal': '31',
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

        const maddeler = await MevzuatParca.find(
            { kanunNo: '6331' },
            { maddeNo: 1, metin: 1, embedding: 1 }
        ).lean();

        if (maddeler.length === 0) return [];

        const skorlar = maddeler.map(m => {
            if (!m.embedding || m.embedding.length === 0) return { ...m, skor: 0 };
            const dot   = m.embedding.reduce((acc, val, i) => acc + val * (soruEmbedding[i] || 0), 0);
            const normA = Math.sqrt(m.embedding.reduce((acc, val) => acc + val * val, 0));
            const normB = Math.sqrt(soruEmbedding.reduce((acc, val) => acc + val * val, 0));
            const skor  = normA && normB ? dot / (normA * normB) : 0;
            return { maddeNo: m.maddeNo, metin: m.metin, skor };
        });

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

function _sohbetPromptOlustur(soru, firmaVerileri, gecmisMesajlar, kullaniciKapsami, ilgiliMaddeler = [], takipliMevzuatlar = null) {
    const bugun = new Date().toLocaleDateString('tr-TR');

    const veriOzeti = firmaVerileri.length === 0
        ? '(Henüz kayıtlı firma bulunmuyor)'
        : firmaVerileri.map(f => {
            const muayeneDetay = f.personel.muayene.detaylar.length === 0
                ? '    (kayıt yok)'
                : f.personel.muayene.detaylar.filter(d => d.durum !== 'geçerli').slice(0, 25)
                    .map(d => `    • ${d.personel}: ${d.tarih} → ${d.durum}`).join('\n');
            const egitimDetay = f.personel.egitim.detaylar.length === 0
                ? '    (kayıt yok)'
                : f.personel.egitim.detaylar.filter(d => d.durum !== 'geçerli').slice(0, 25)
                    .map(d => `    • ${d.personel}: ${d.tarih} → ${d.durum}`).join('\n');
            const ilkyardimDetay = f.personel.ilkyardim.detaylar.length === 0
                ? '    (kayıt yok)'
                : f.personel.ilkyardim.detaylar.filter(d => d.durum !== 'geçerli').slice(0, 25)
                    .map(d => `    • ${d.personel}: ${d.tarih} → ${d.durum}`).join('\n');
            const olcumKisim = f.olcumler.detaylar.length === 0
                ? '  (Kayıtlı ortam ölçümü bulunmuyor)'
                : f.olcumler.detaylar.map(o => `  • ${o.ekipman} (${o.kontrolFirma}): ${o.gecerlilikTarihi} → ${o.durum}`).join('\n');
            const temsilciKisim = f.temsilciler.length === 0
                ? '  (Kayıtlı çalışan temsilcisi yok)'
                : f.temsilciler.map(t => `  • ${t.personel} (atama: ${t.atamaTarihi})`).join('\n');
            const destekKisim = f.destekElemanlari.length === 0
                ? '  (Kayıtlı destek elemanı yok)'
                : f.destekElemanlari.map(t => `  • ${t.personel}${t.ekip ? ' [' + t.ekip + ' ekibi]' : ''} (atama: ${t.atamaTarihi})`).join('\n');
            const planEgitimKisim = f.planlananEgitimler.length === 0
                ? '  (Hiç eğitim planlanmamış)'
                : f.planlananEgitimler.map(e => `  • ${e.konu}: ${e.bitisTarihi} → ${e.durum}`).join('\n');
            const isgDosyaKisim = f.isgDosyalar.length === 0
                ? '  (Henüz İSG belgesi yüklenmemiş)'
                : f.isgDosyalar.map(d => `  • ${d.kategori}: ${d.sayi} belge${d.ornekler.length ? ' (' + d.ornekler.join(', ') + ')' : ''}`).join('\n');
            const dokumanKisim = f.dokumanlar.length === 0
                ? '  (Kayıtlı doküman yok)'
                : f.dokumanlar.map(d => `  • ${d.kategori}: ${d.toplam} belge (geçerli: ${d.gecerli}, yaklaşan: ${d.yaklasan}, süresi dolmuş: ${d.suresiDolmus})`).join('\n');
            const digerVeriKisim = Object.keys(f.digerVeriler).length === 0 ? '' :
                '\nDİĞER VERİLER:\n' + Object.entries(f.digerVeriler)
                    .map(([a, d]) => `  • ${a}: ${typeof d === 'object' ? Object.keys(d).length + ' kayıt' : String(d).substring(0, 100)}`).join('\n');

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
            kullaniciKapsami.kullanicilar.map(k => `  • ${k.adSoyad} (${k.eposta}) — Rol: ${k.rol}`).join('\n');
    }

    const mevzuatKismi = ilgiliMaddeler.length > 0
        ? '\n## İLGİLİ MEVZUAT (6331 Sayılı İSG Kanunu):\n' +
          ilgiliMaddeler.map(m => `### ${m.maddeNo}\n${m.metin.substring(0, 1500)}`).join('\n\n')
        : '';

    let takipliMevzuatKismi = '';
    if (takipliMevzuatlar && takipliMevzuatlar.istatistik.toplam > 0) {
        const ist = takipliMevzuatlar.istatistik;
        const katSatiri = Object.entries(ist.kategoriDagilimi).map(([k, v]) => `${k}: ${v}`).join(', ');
        const mevzuatListesi = takipliMevzuatlar.liste
            .map(m => `  • ${m.ad} [${m.kategori}${m.mevzuatNo !== '—' ? ', No: ' + m.mevzuatNo : ''}] — ${m.aciklama !== '—' ? m.aciklama + ' • ' : ''}son tarama: ${m.sonTaramaTarihi}`)
            .join('\n');
        takipliMevzuatKismi = `
## OTOMATİK MEVZUAT TAKİP SİSTEMİ:
- Toplam: ${ist.toplam} | Aktif: ${ist.aktif} | Hatalı: ${ist.hatali} | Onay bekleyen: ${ist.onayBekleyenDegisiklik}
- Kategoriler: ${katSatiri}
${mevzuatListesi}`;
    }

    const gecmis = gecmisMesajlar && gecmisMesajlar.length > 0
        ? '\n## ÖNCEKİ SOHBETLER:\n' + gecmisMesajlar.slice(-6)
            .map(m => `${m.rol === 'kullanici' ? 'Kullanıcı' : 'Asistan'}: ${m.metin}`).join('\n')
        : '';

    return `Sen bir İş Sağlığı ve Güvenliği (İSG) Doküman Yönetim Sistemi'nin yapay zeka asistanısın.
## BUGÜNÜN TARİHİ: ${bugun}
## SİSTEMDEKİ VERİLER:
${veriOzeti}
${mevzuatKismi}
${takipliMevzuatKismi}
## SİSTEM KULLANICILARI:
${kullaniciOzeti}
## TANIMLAR:
- "Geçerli" = 30 günden fazla süre var | "Yaklaşan" = 30 gün içinde dolacak | "Süresi Dolmuş" = geçmiş | "Kaydı Yok" = sisteme girilmemiş
## TEHLİKE SINIFI vs EĞİTİM: Az Tehlikeli: 36ay | Tehlikeli: 24ay | Çok Tehlikeli: 12ay
## TEHLİKE SINIFI vs MUAYENE: Az Tehlikeli: 60ay | Tehlikeli: 36ay | Çok Tehlikeli: 12ay
${gecmis}
## KULLANICININ SORUSU: ${soru}
## KURALLAR: Sadece sistem verilerine dayan. Türkçe yanıt ver. Kritik durumları ⚠️ ile vurgula. 400 kelimeyi geçme ama yarıda bırakma.`;
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

        const [firmaVerileri, kullaniciKapsami, ilgiliMaddeler, takipliMevzuatlar] = await Promise.all([
            _firmaVerileriniHazirla(req.kullanici),
            _kullaniciListesiniHazirla(req.kullanici),
            _mevzuatAra(soru),
            _takipliMevzuatlariHazirla(),
        ]);

        const prompt = _sohbetPromptOlustur(soru, firmaVerileri, gecmisMesajlar, kullaniciKapsami, ilgiliMaddeler, takipliMevzuatlar);
        const yanit = await geminiCagir(prompt, false);

        const sure = Date.now() - baslangic;
        console.log(`💬 [AI Sohbet] ${sure}ms | Mevzuat: ${ilgiliMaddeler.length} madde | Soru: "${soru.substring(0, 50)}..."`);
        res.json({ basarili: true, yanit: yanit.trim(), sureMs: sure });
    } catch (err) {
        console.error('[AI Sohbet] Hata:', err.message);
        res.status(500).json({ basarili: false, hata: 'Yapay zeka yanıt verirken hata oluştu.', detay: err.message });
    }
};