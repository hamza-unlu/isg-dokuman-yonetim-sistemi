
const axios    = require('axios');
const cheerio  = require('cheerio');
const fs       = require('fs');
const path     = require('path');
const crypto   = require('crypto');
const https    = require('https');
const pdfParse = require('pdf-parse');

// mevzuat.gov.tr'de bilinen mevzuatTur değerleri (GeneratePdf endpoint için)
// Endpoint sayısal değil string isim bekliyor (ör: "Yonetmelik" mi "7" mi).
// En sık karşılaşılanlar başta — başarı olasılığı yüksek olanları öne aldık.
const BILINEN_TUR_ADLARI = [
    'Yonetmelik',
    'KurumVeKurulusYonetmeligi',
    'Teblig',
    'Tuzuk',
    'Kanun',
    'KHK',
    'CumhurbaskanligiKararnamesi',
    'CumhurbaskanligiKarari',
    'BakanlarKuruluKarari',
];

class MevzuatScraper {
    constructor(secenekler = {}) {
        this.indirmeKlasoru = secenekler.indirmeKlasoru
            || path.join(__dirname, '..', 'uploads', 'mevzuat');

        this.timeout = secenekler.timeout || 60000;

        this.istekAyarlari = {
            timeout: this.timeout,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/pdf,*/*',
                'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        };

        if (!fs.existsSync(this.indirmeKlasoru)) {
            fs.mkdirSync(this.indirmeKlasoru, { recursive: true });
        }
    }

    // ─── ANA METOT: Mevzuatı bul ve indir ──────────────────────────────────
    async indir(mevzuat) {
        const denenenler = [];
        const hatalar = [];

        // ─── KATMAN 1: Direkt PDF URL ──────────────────────────────────────
        if (mevzuat.pdfURL) {
            denenenler.push('katman-1-direkt-pdf');
            try {
                const sonuc = await this._pdfIndirVeIsle(mevzuat.pdfURL, mevzuat.anahtar);
                if (sonuc) {
                    return { ...sonuc, yontem: 'katman-1-direkt-pdf', denenenler };
                }
            } catch (err) {
                hatalar.push(`Katman 1: ${err.message}`);
            }
        }

        // ─── KATMAN 2: HTML sayfayı tara (2-a regex, 2-b cheerio) ─────────
        let htmlIcerik = null;
        if (mevzuat.htmlURL) {
            try {
                const response = await axios.get(mevzuat.htmlURL, this.istekAyarlari);
                htmlIcerik = response.data.toString();
            } catch (err) {
                hatalar.push(`Katman 2 HTML çekilemedi: ${err.message}`);
            }
        }

        if (htmlIcerik) {
            // ── KATMAN 2-a: Regex ile GeneratePdf linki ─────────────────
            denenenler.push('katman-2a-html-generatepdf');
            const generatePdfLink = this._regexIleGeneratePdfBul(htmlIcerik, mevzuat.htmlURL);
            if (generatePdfLink) {
                try {
                    const sonuc = await this._pdfIndirVeIsle(generatePdfLink, mevzuat.anahtar);
                    if (sonuc) {
                        return {
                            ...sonuc,
                            yontem: 'katman-2a-html-generatepdf',
                            kesfedilenPdfURL: generatePdfLink,
                            denenenler,
                        };
                    }
                } catch (err) {
                    hatalar.push(`Katman 2a: ${err.message}`);
                }
            }

            // ── KATMAN 2-b: Cheerio ile .pdf uzantılı link ──────────────
            denenenler.push('katman-2b-html-pdflink');
            const pdfLink = this._cheerioIlePdfLinkBul(htmlIcerik, mevzuat.htmlURL);
            if (pdfLink) {
                try {
                    const sonuc = await this._pdfIndirVeIsle(pdfLink, mevzuat.anahtar);
                    if (sonuc) {
                        return {
                            ...sonuc,
                            yontem: 'katman-2b-html-pdflink',
                            kesfedilenPdfURL: pdfLink,
                            denenenler,
                        };
                    }
                } catch (err) {
                    hatalar.push(`Katman 2b: ${err.message}`);
                }
            }
        }

        // ─── KATMAN 3: URL parametrelerinden GeneratePdf endpoint üret ────
        // htmlURL'de MevzuatNo=X&MevzuatTertip=Y varsa, tüm tür adlarını dene
        if (mevzuat.htmlURL) {
            const params = this._urlParametreCikar(mevzuat.htmlURL);
            if (params && params.mevzuatNo && params.mevzuatTertip) {
                denenenler.push('katman-3-url-generatepdf');
                for (const turAdi of BILINEN_TUR_ADLARI) {
                    const tahminURL = `https://www.mevzuat.gov.tr/File/GeneratePdf` +
                        `?mevzuatNo=${params.mevzuatNo}` +
                        `&mevzuatTur=${turAdi}` +
                        `&mevzuatTertip=${params.mevzuatTertip}`;
                    try {
                        const sonuc = await this._pdfIndirVeIsle(tahminURL, mevzuat.anahtar);
                        if (sonuc) {
                            return {
                                ...sonuc,
                                yontem: `katman-3-url-generatepdf (${turAdi})`,
                                kesfedilenPdfURL: tahminURL,
                                denenenler,
                            };
                        }
                    } catch (err) {
                        // Sessizce sonraki tür adını dene
                    }
                }
            }
        }

        // ─── KATMAN 4: Eski URL pattern fallback (legacy) ─────────────────
        if (mevzuat.mevzuatNo && mevzuat.tur && mevzuat.tertip) {
            denenenler.push('katman-4-pattern');
            const tahminURLler = this._urlPatternUret(mevzuat);

            for (const tahminURL of tahminURLler) {
                try {
                    const sonuc = await this._pdfIndirVeIsle(tahminURL, mevzuat.anahtar);
                    if (sonuc) {
                        return {
                            ...sonuc,
                            yontem: 'katman-4-pattern',
                            kesfedilenPdfURL: tahminURL,
                            denenenler,
                        };
                    }
                } catch (err) {
                    // Sıradakini dene
                }
            }
        }

        // Hiçbir katman başarılı olmadı — anlamlı hata mesajı
        const hataDetay = hatalar.length > 0
            ? `\n  → Detaylar: ${hatalar.join(' | ')}`
            : '';
        throw new Error(
            `PDF bulunamadı. Denenen katmanlar: ${denenenler.join(', ')}${hataDetay}`
        );
    }

    // ─── _pdfIndirVeIsle: indir + text extraction birleşik ────────────────
    // PDF değilse çöp dosyayı siler ve null döner. PDF ise tam bilgi döner.
    async _pdfIndirVeIsle(url, anahtar) {
        const ham = await this._pdfIndir(url, anahtar);
        if (!ham.gercektenPdf) {
            this._dosyaSil(ham.dosyaYolu);
            return null;
        }
        const metinBilgi = await this._pdfMetinCikar(ham.dosyaYolu);
        return { ...ham, ...metinBilgi };
    }

    // ─── PDF dosyasını indir (raw) ─────────────────────────────────────────
    async _pdfIndir(url, anahtar) {
        const baslangic = Date.now();

        const response = await axios.get(url, {
            ...this.istekAyarlari,
            responseType: 'arraybuffer',
        });

        const buffer = Buffer.from(response.data);
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');
        const indirmeSuresi = Date.now() - baslangic;

        // PDF magic byte kontrolü
        const ilkByte = buffer.slice(0, 4).toString();
        const gercektenPdf = ilkByte === '%PDF';

        const tarihDamga = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const dosyaAdi = `${anahtar}_${tarihDamga}.pdf`;
        const dosyaYolu = path.join(this.indirmeKlasoru, dosyaAdi);
        fs.writeFileSync(dosyaYolu, buffer);

        return {
            hash,
            boyutByte: buffer.length,
            dosyaYolu,
            indirmeSuresi,
            gercektenPdf,
            kaynakURL: url,
        };
    }

    async _pdfMetinCikar(dosyaYolu) {
        // Console'u geçici olarak filtrele
        const originalWarn = console.warn;
        const originalLog = console.log;
        const pdfWarningFilter = (...args) => {
            const msg = (args[0] && args[0].toString) ? args[0].toString() : '';
            // Sadece pdfjs'in font/encoding uyarılarını yut
            if (msg.startsWith('Warning:') && (
                msg.includes('TT:') ||
                msg.includes('undefined function') ||
                msg.includes('cmap') ||
                msg.includes('Indirect object')
            )) {
                return;
            }
            originalWarn.apply(console, args);
        };
        console.warn = pdfWarningFilter;
        console.log = pdfWarningFilter;

        try {
            const pdfBuffer = fs.readFileSync(dosyaYolu);
            const pdfData = await pdfParse(pdfBuffer);

            const metinIcerik = (pdfData.text || '')
                .replace(/\s+/g, ' ')
                .trim();

            const metinHash = crypto
                .createHash('sha256')
                .update(metinIcerik)
                .digest('hex');

            return {
                metinIcerik,
                metinHash,
                sayfaSayisi: pdfData.numpages || 0,
            };
        } catch (err) {
            // Gerçek hatayı orijinal console.warn ile logla (filtreden geçmesin)
            originalWarn(`⚠️ PDF text extraction başarısız (${path.basename(dosyaYolu)}):`, err.message);
            return {
                metinIcerik: '',
                metinHash: null,
                sayfaSayisi: 0,
            };
        } finally {
            // Her durumda console'u orijinaline döndür
            console.warn = originalWarn;
            console.log = originalLog;
        }
    }

    // ─── KATMAN 2-a yardımcısı: Regex ile File/GeneratePdf linki ──────────
    // HTML kaynağında "/File/GeneratePdf?..." paternini ara.
    // Bu link mevzuat.gov.tr'nin "PDF olarak indir" butonu için sayfaya
    // server-side embed edilmiş — JS rendering'e ihtiyaç yok.
    // Tüm mevzuat türleri (KurumVeKurulusYonetmeligi dahil) için çalışır.
    _regexIleGeneratePdfBul(htmlIcerik, baseURL) {
        // ?mevzuatNo=...&mevzuatTur=...&mevzuatTertip=... formatını yakala
        const regex = /\/File\/GeneratePdf\?[^"'\s<>]+/gi;
        const eslesmeler = htmlIcerik.match(regex);
        if (!eslesmeler || eslesmeler.length === 0) return null;

        // HTML entity decode (&amp; → &)
        const temizLink = eslesmeler[0].replace(/&amp;/g, '&');

        return temizLink.startsWith('http')
            ? temizLink
            : new URL(temizLink, baseURL).toString();
    }

    // ─── KATMAN 2-b yardımcısı: Cheerio ile .pdf linki ────────────────────
    _cheerioIlePdfLinkBul(htmlIcerik, baseURL) {
        const $ = cheerio.load(htmlIcerik);
        const pdfLinkleri = [];

        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.toLowerCase().includes('.pdf')) {
                const tamURL = href.startsWith('http')
                    ? href
                    : new URL(href, baseURL).toString();
                pdfLinkleri.push(tamURL);
            }
        });

        // MevzuatMetin içerenler genelde resmi PDF'e işaret ediyor
        const mevzuatMetin = pdfLinkleri.find(l => l.includes('MevzuatMetin'));
        if (mevzuatMetin) return mevzuatMetin;

        return pdfLinkleri[0] || null;
    }

    // ─── KATMAN 3 yardımcısı: URL'den parametre çıkar ─────────────────────
    // "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=17031&MevzuatTur=7&MevzuatTertip=5"
    //   → { mevzuatNo: '17031', mevzuatTur: '7', mevzuatTertip: '5' }
    _urlParametreCikar(htmlURL) {
        try {
            const u = new URL(htmlURL);
            // Case-insensitive parametre okuma (URL'de büyük/küçük harf farklı olabiliyor)
            const params = {};
            for (const [key, value] of u.searchParams.entries()) {
                params[key.toLowerCase()] = value;
            }
            return {
                mevzuatNo: params['mevzuatno'],
                mevzuatTur: params['mevzuattur'],
                mevzuatTertip: params['mevzuattertip'],
            };
        } catch (err) {
            return null;
        }
    }

    // ─── KATMAN 4 yardımcısı: Eski URL pattern üret (legacy) ──────────────
    _urlPatternUret(mevzuat) {
        const { tur, tertip, mevzuatNo } = mevzuat;
        const adaylar = [];

        adaylar.push(`https://www.mevzuat.gov.tr/MevzuatMetin/${tur}.${tertip}.${mevzuatNo}.pdf`);

        if (tur === '7') {
            adaylar.push(`https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/${tur}.${tertip}.${mevzuatNo}.pdf`);
            adaylar.push(`https://www.mevzuat.gov.tr/file/8/${tur}.${tertip}.${mevzuatNo}.pdf`);
        }

        return adaylar;
    }

    // ─── Yardımcı: Çöp dosyayı sil ─────────────────────────────────────────
    _dosyaSil(dosyaYolu) {
        try {
            if (dosyaYolu && fs.existsSync(dosyaYolu)) {
                fs.unlinkSync(dosyaYolu);
            }
        } catch (err) {
            // Sessizce yut
        }
    }

    // ─── Test/Debug için: sadece PDF link keşfi (indirme yapmaz) ──────────
    async pdfLinkKesfet(mevzuat) {
        if (!mevzuat.htmlURL) return null;
        try {
            const response = await axios.get(mevzuat.htmlURL, this.istekAyarlari);
            const htmlIcerik = response.data.toString();

            // Önce GeneratePdf regex (en güvenilir)
            const gen = this._regexIleGeneratePdfBul(htmlIcerik, mevzuat.htmlURL);
            if (gen) return gen;

            // Sonra cheerio fallback
            return this._cheerioIlePdfLinkBul(htmlIcerik, mevzuat.htmlURL);
        } catch (err) {
            return null;
        }
    }
}

module.exports = MevzuatScraper;