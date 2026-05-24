// ─────────────────────────────────────────────────────────────────────────────
// YARDIMCI: Kullanıcı bu eğitime erişim/değişiklik yapabilir mi?
// tumEgitimler ile tutarlı: kendi eklediği firmaya ait eğitimleri yönetebilir
// ─────────────────────────────────────────────────────────────────────────────
async function _yetkiKontrolu(egitim, kullanici) {
    const rol = kullanici.rol;

    if (rol === 'sistem_yoneticisi') return { izin: true };
    if (rol === 'isveren')           return { izin: false, sebep: 'İşveren değişiklik yapamaz.' };

    if (rol === 'isg_uzmani' || rol === 'isyeri_hekimi') {
        const firma = await Firma.findById(egitim.firma).select('ekleyenKullanici').lean();
        if (!firma) return { izin: false, sebep: 'Eğitime ait firma bulunamadı.' };

        if (String(firma.ekleyenKullanici) !== String(kullanici._id)) {
            return { izin: false, sebep: 'Sadece kendi firmalarınızın eğitimlerini yönetebilirsiniz.' };
        }
        return { izin: true };
    }

    return { izin: false, sebep: 'Bu işlem için yetkiniz yok.' };
}


// controllers/egitimController.js
const Egitim = require('../models/Egitim');
const Firma  = require('../models/Firma');
const { emailGonder } = require('../utils/emailGonder'); 

// ─────────────────────────────────────────────────────────────────────────────
// YARDIMCI: Tarihi gg.aa.yyyy formatına çevir
// ─────────────────────────────────────────────────────────────────────────────
function _tarihFormatla(date) {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// YARDIMCI: Durum kodunu kullanıcı dostu metne çevir
// ─────────────────────────────────────────────────────────────────────────────
function _durumMetni(durum) {
    const m = { planlandi: 'Planlandı', tamamlandi: 'Tamamlandı', iptal: 'İptal Edildi' };
    return m[durum] || 'Planlandı';
}

// ─────────────────────────────────────────────────────────────────────────────
// YARDIMCI: E-posta HTML şablonu (ÜNLÜ İSG temasıyla)
// ─────────────────────────────────────────────────────────────────────────────
function _egitimMailSablonu({ firmaAdi, konu, egitmen, tarih, katilimci, durum, notlar, islemTipi }) {
    const baslik = islemTipi === 'guncelleme'
        ? '📝 Eğitim Bilgisi Güncellendi'
        : '📅 Yeni Eğitim Planlandı';

    const ustMetin = islemTipi === 'guncelleme'
        ? `<strong>${firmaAdi}</strong> firmasına ait bir eğitim bilgisi güncellenmiştir.`
        : `<strong>${firmaAdi}</strong> firmasına yönelik yeni bir eğitim planlanmıştır.`;

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
        <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #3b82f6;">
            <h2 style="color: #1e40af; margin: 0;">🛡️ ÜNLÜ İSG</h2>
            <p style="color: #64748b; margin: 4px 0 0;">İSG Doküman Yönetim Sistemi</p>
        </div>

        <div style="padding: 24px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">${baslik}</h3>
            <p style="color: #334155; line-height: 1.6;">
                Sayın İlgili,<br><br>
                ${ustMetin}
            </p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569; width: 40%;">Eğitim Adı</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${konu || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Eğitmen</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${egitmen || '-'}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Planlanan Tarih</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${tarih || '-'}</td>
                </tr>
                ${katilimci ? `
                <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Katılımcı Sayısı</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">${katilimci} kişi</td>
                </tr>` : ''}
                <tr>
                    <td style="padding: 12px 16px; ${notlar ? 'border-bottom: 1px solid #e2e8f0;' : ''} font-weight: 600; color: #475569;">Durum</td>
                    <td style="padding: 12px 16px; ${notlar ? 'border-bottom: 1px solid #e2e8f0;' : ''}">
                        <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">
                            ${_durumMetni(durum)}
                        </span>
                    </td>
                </tr>
                ${notlar ? `
                <tr>
                    <td style="padding: 12px 16px; font-weight: 600; color: #475569; vertical-align: top;">Notlar</td>
                    <td style="padding: 12px 16px; color: #334155; line-height: 1.5;">${notlar.replace(/\n/g, '<br>')}</td>
                </tr>` : ''}
            </table>

            <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin-top: 24px;">
                Eğitim ile ilgili soru veya talebiniz için lütfen bizimle iletişime geçin.<br>
                Bilgilerinize sunarız.
            </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
            Bu e-posta <strong>ÜNLÜ İSG Doküman Yönetim Sistemi</strong> tarafından otomatik olarak gönderilmiştir.
        </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// YARDIMCI: Firmanın e-posta adresine bildirim gönderir (hata fırlatmaz)
// ─────────────────────────────────────────────────────────────────────────────
async function _firmayaBildirimGonder(firmaId, egitimDetay, islemTipi) {
    try {
        const firma = await Firma.findById(firmaId).lean();
        if (!firma) {
            console.warn(`[Mail] Firma bulunamadı: ${firmaId}`);
            return { gonderildi: false, sebep: 'Firma bulunamadı' };
        }
        if (!firma.eposta || !firma.eposta.trim()) {
            console.warn(`[Mail] Firma e-posta adresi kayıtlı değil: ${firma.firmaAdi}`);
            return { gonderildi: false, sebep: 'Firma e-posta adresi kayıtlı değil' };
        }

        const konu = `Eğitim Bildirimi — ${egitimDetay.konu} — ${firma.firmaAdi}`;
        const html = _egitimMailSablonu({
            firmaAdi:  firma.firmaAdi,
            konu:      egitimDetay.konu,
            egitmen:   egitimDetay.egitmen,
            tarih:     _tarihFormatla(egitimDetay.planlananTarih),
            katilimci: egitimDetay.katilimci,
            durum:     egitimDetay.durum,
            notlar:    egitimDetay.notlar,
            islemTipi,
        });

        await emailGonder({ kime: firma.eposta, konu, html });
        return { gonderildi: true, eposta: firma.eposta };
    } catch (mailHata) {
        console.error('[Mail] Eğitim bildirimi gönderilemedi:', mailHata.message);
        return { gonderildi: false, sebep: mailHata.message };
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// CONTROLLERS
// ═════════════════════════════════════════════════════════════════════════════

exports.tumEgitimler = async (req, res) => {
    try {
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

        const egitimler = await Egitim.find(filtre)
            .populate('firma', 'firmaAdi tehlikeSinifi')
            .sort({ planlananTarih: 1 })
            .lean();

        res.json({ basarili: true, veri: egitimler });
    } catch (error) {
        res.status(500).json({ hata: 'Eğitimler getirilirken hata oluştu.', detay: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/egitimler — Yeni eğitim oluştur (+ opsiyonel mail)
// ─────────────────────────────────────────────────────────────────────────────
exports.egitimEkle = async (req, res) => {
    try {
        // Mail flag'ini payload'dan ayır — DB'ye kaydedilmemeli
        const { mailGonder: mailGonderFlag, ...egitimVerisi } = req.body;

        const yeniEgitim = {
            ...egitimVerisi,
            ekleyenKullanici: req.kullanici._id,
        };
        const egitim = await Egitim.create(yeniEgitim);

        // Mail gönderimi — async ama await ediyoruz ki sonucu response'a ekleyebilelim
        let mailSonuc = null;
        if (mailGonderFlag) {
            mailSonuc = await _firmayaBildirimGonder(
                egitim.firma,
                {
                    konu:           egitim.konu,
                    egitmen:        egitim.egitmen,
                    planlananTarih: egitim.planlananTarih,
                    katilimci:      egitimVerisi.katilimci, // frontend gönderirse
                    durum:          egitim.durum,
                    notlar:         egitim.notlar,
                },
                'planlama'
            );
        }

        res.status(201).json({
            basarili: true,
            mesaj:    'Eğitim başarıyla eklendi.',
            veri:     egitim,
            mail:     mailSonuc, // { gonderildi: true/false, ... } veya null
        });
    } catch (error) {
        res.status(400).json({ hata: 'Eğitim eklenemedi.', detay: error.message });
    }
};


exports.egitimGuncelle = async (req, res) => {
    try {
        // Önce mevcut kaydı bul ki yetki kontrolü yapabilelim
        const mevcut = await Egitim.findById(req.params.id);
        if (!mevcut) return res.status(404).json({ hata: 'Eğitim bulunamadı.' });

        // ⭐ YETKİ KONTROLÜ
        const yetki = await _yetkiKontrolu(mevcut, req.kullanici);
        if (!yetki.izin) return res.status(403).json({ hata: yetki.sebep });

        // mailGonder flag'ini ayır — DB'ye kaydedilmemeli
        const { mailGonder: mailGonderFlag, ...guncelleme } = req.body;

        const egitim = await Egitim.findByIdAndUpdate(req.params.id, guncelleme, {
            new: true,
            runValidators: true
        });

        let mailSonuc = null;
        if (mailGonderFlag) {
            mailSonuc = await _firmayaBildirimGonder(
                egitim.firma,
                {
                    konu:           egitim.konu,
                    egitmen:        egitim.egitmen,
                    planlananTarih: egitim.planlananTarih,
                    katilimci:      egitim.katilimci,
                    durum:          egitim.durum,
                    notlar:         egitim.notlar,
                },
                'guncelleme'
            );
        }

        res.json({
            basarili: true,
            mesaj:    'Eğitim güncellendi.',
            veri:     egitim,
            mail:     mailSonuc,
        });
    } catch (error) {
        res.status(400).json({ hata: 'Eğitim güncellenemedi.', detay: error.message });
    }
};

exports.egitimSil = async (req, res) => {
    try {
        const egitim = await Egitim.findById(req.params.id);
        if (!egitim) return res.status(404).json({ hata: 'Eğitim bulunamadı.' });

        // ⭐ YETKİ KONTROLÜ
        const yetki = await _yetkiKontrolu(egitim, req.kullanici);
        if (!yetki.izin) return res.status(403).json({ hata: yetki.sebep });

        await Egitim.findByIdAndDelete(req.params.id);
        res.json({ basarili: true, mesaj: 'Eğitim başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ hata: 'Eğitim silinemedi.', detay: error.message });
    }
};