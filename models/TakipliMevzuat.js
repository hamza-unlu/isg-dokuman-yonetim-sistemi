// models/TakipliMevzuat.js
// ═══════════════════════════════════════════════════════════════════════════
// TAKİPLİ MEVZUAT MODELİ
// ───────────────────────────────────────────────────────────────────────────
// Sistemin otomatik takip edeceği mevzuatların listesini tutar.
// Daha önce config/mevzuatListesi.js dosyasında kod içinde sabit duran
// bilgiler, artık MongoDB'de yönetiliyor. Bu sayede:
//
//   ✅ Admin frontend'den yeni mevzuat ekleyebiliyor
//   ✅ URL hatası varsa admin paneli üzerinden düzeltebiliyor
//   ✅ Yeni mevzuat eklemek için kod değişikliği gerekmiyor
//   ✅ Pasifleştirme/aktifleştirme tek tıkla
//
// Her bir kayıt = sistemin haftalık olarak kontrol ettiği bir mevzuat.
// ═══════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const TakipliMevzuatSema = new mongoose.Schema(
    {
        // ─── Kimlik bilgileri ───────────────────────────────────────────────
        anahtar: {
            type: String,
            required: [true, 'Sistem içi anahtar zorunludur'],
            unique: true,
            trim: true,
            // Sistem içi unique identifier. Örnek: "isg_kanunu_6331"
            // Kullanıcıya gösterilmez, kod tarafında referans olarak kullanılır.
        },
        ad: {
            type: String,
            required: [true, 'Mevzuat adı zorunludur'],
            trim: true,
            // Kullanıcıya gösterilen tam isim
            // Örnek: "6331 Sayılı İş Sağlığı ve Güvenliği Kanunu"
        },
        kategori: {
            type: String,
            required: true,
            enum: ['Kanun', 'Yönetmelik', 'Tebliğ', 'Genelge', 'Yönerge', 'Diğer'],
            default: 'Yönetmelik',
        },
        aciklama: {
            type: String,
            default: '',
            trim: true,
            // Bu mevzuatın hangi kurala dayanak olduğunu açıklayan kısa metin
        },

        // ─── 3 KATMANLI URL STRATEJİSİ ─────────────────────────────────────
        // (services/mevzuatScraper.js'in beklediği yapı)
        pdfURL: {
            type: String,
            default: null,
            trim: true,
            // Katman 1: Direkt PDF linki (varsa)
            // Örnek: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6331.pdf'
        },
        htmlURL: {
            type: String,
            default: null,
            trim: true,
            // Katman 2: HTML sayfası (PDF link içinden bulunacak)
            // Örnek: 'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6331&...'
        },
        mevzuatNo: {
            type: String,
            default: '',
            trim: true,
            // Katman 3: URL pattern tahmini için MevzuatNo
        },
        tur: {
            type: String,
            default: '',
            // Katman 3: 1=Kanun, 7=Yönetmelik
        },
        tertip: {
            type: String,
            default: '5',
        },

        // ─── Takip durumu ───────────────────────────────────────────────────
        aktif: {
            type: Boolean,
            default: true,
            // Aktif değilse cron taraması bu mevzuatı atlar
        },
        takipDurumu: {
            type: String,
            enum: [
                'hazır',          // İlk eklendi, henüz taranmadı
                'aktif',          // Düzenli takip ediliyor, son tarama başarılı
                'url-hatasi',     // URL geçersiz, manuel düzeltme gerekli
                'pasif',          // Admin pasifleştirdi
                'erisilemez',     // Site cevap vermiyor (geçici)
            ],
            default: 'hazır',
        },

        // ─── Son tarama bilgileri (cache, hızlı görüntü için) ──────────────
        sonTaramaTarihi: {
            type: Date,
            default: null,
        },
        sonHash: {
            type: String,
            default: null,
        },
        sonHataMesaji: {
            type: String,
            default: '',
            // url-hatasi durumunda hangi hatayı aldığını gösterir
        },
        toplamTaramaSayisi: {
            type: Number,
            default: 0,
        },
        basariliTaramaSayisi: {
            type: Number,
            default: 0,
        },

        // ─── Audit ─────────────────────────────────────────────────────────
        ekleyenKullanici: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kullanici',
            default: null,
            // Frontend'den ekleyen admin (null = seed ile eklenmiş)
        },
    },
    {
        timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
        collection: 'takipli_mevzuatlar',
    }
);

// Performans indeksleri
TakipliMevzuatSema.index({ aktif: 1, takipDurumu: 1 });

// ─── Virtual: Başarı oranı (UI'de gösterilecek) ──────────────────────────
TakipliMevzuatSema.virtual('basariOrani').get(function () {
    if (this.toplamTaramaSayisi === 0) return null;
    return Math.round((this.basariliTaramaSayisi / this.toplamTaramaSayisi) * 100);
});

// Virtual'ları JSON'a dahil et
TakipliMevzuatSema.set('toJSON', { virtuals: true });
TakipliMevzuatSema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TakipliMevzuat', TakipliMevzuatSema);