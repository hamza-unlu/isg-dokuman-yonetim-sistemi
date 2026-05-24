// models/SistemAyari.js
// ═══════════════════════════════════════════════════════════════════════════
// SİSTEM AYARLARI MODELİ
// ───────────────────────────────────────────────────────────────────────────
// Sistemin yapılandırılabilir tüm ayarlarını anahtar-değer çiftleri olarak
// tutar. Frontend'den ayar değişikliği yapıldığında bu modele yazılır,
// kullanan servisler de buradan okur.
//
// Örnek anahtarlar:
//   • mevzuat_cron       → Cron tarama periyodu
//   • mail_aktif         → Mail bildirimleri açık mı
//   • ai_destekli_diff   → Embedding bazlı fark analizi (Adım 7)
//
// Avantajları:
//   ✅ Restart gerekmiyor — anlık olarak değişiklik etkili
//   ✅ Frontend'den admin değiştirebilir
//   ✅ .env dosyasını değiştirme zorunluluğu yok
//   ✅ Audit trail için kim değiştirdi kaydı var
// ═══════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const SistemAyariSema = new mongoose.Schema(
    {
        anahtar: {
            type: String,
            required: [true, 'Ayar anahtarı zorunludur'],
            unique: true,
            trim: true,
            // Örnek: "mevzuat_cron", "mail_aktif", "ai_destekli_diff"
        },
        deger: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            // İçerik anahtara göre değişir. Örnek mevzuat_cron için:
            // {
            //   tip: 'sablon' | 'ozel' | 'cron',
            //   cronIfadesi: '0 3 * * 1',
            //   okunabilir: 'Her Pazartesi 03:00',
            //   gun: 'pazartesi',       (tip=ozel ise)
            //   saat: 3,                (tip=ozel ise)
            //   dakika: 0,              (tip=ozel ise)
            // }
        },
        aciklama: {
            type: String,
            default: '',
            trim: true,
        },
        kategori: {
            type: String,
            enum: ['mevzuat', 'mail', 'ai', 'genel', 'guvenlik'],
            default: 'genel',
        },
        guncelleyenKullanici: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kullanici',
            default: null,
        },
    },
    {
        timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
        collection: 'sistem_ayarlari',
    }
);

// Hızlı erişim için statik yardımcı metodlar
SistemAyariSema.statics.ayarAl = async function (anahtar, varsayilan = null) {
    const kayit = await this.findOne({ anahtar }).lean();
    return kayit ? kayit.deger : varsayilan;
};

SistemAyariSema.statics.ayarKaydet = async function (anahtar, deger, secenekler = {}) {
    return this.findOneAndUpdate(
        { anahtar },
        {
            anahtar,
            deger,
            aciklama: secenekler.aciklama,
            kategori: secenekler.kategori,
            guncelleyenKullanici: secenekler.kullaniciId,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

module.exports = mongoose.model('SistemAyari', SistemAyariSema);