// models/MevzuatGecmisi.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT DEĞİŞİKLİK GEÇMİŞİ (AUDIT TRAIL)
// ───────────────────────────────────────────────────────────────────────────
// Her mevzuat değişikliğinin "kim ne zaman neyi nasıl değiştirdi" bilgisini
// ayrı bir koleksiyonda saklar. Bu sayede:
//   • Denetim izi (audit trail) oluşur
//   • Mevzuat geçmişi bir tarih şeridi gibi gözlemlenebilir
//   • "Bu kural eskiden kaçtı?" sorusu cevaplanabilir
//
// Eski değer → yeni değer şeklinde çalışır.
// ═══════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const MevzuatGecmisiSema = new mongoose.Schema(
    {
        // Hangi kural değişti?
        mevzuat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mevzuat',
            required: true,
            index: true,   // geçmiş listelenirken hızlı olsun
        },

        // Kuralı insan tarafından okunabilir şekilde anlatan snapshot
        // (asıl mevzuat silinse bile geçmişte ne olduğu anlaşılsın diye)
        kuralOzeti: {
            type: String,
            required: true,
            // Örnek: "Temel İSG Eğitimi Periyodu — Az Tehlikeli"
        },

        // Değişim
        eskiDeger: {
            type: Number,
            required: true,
        },
        yeniDeger: {
            type: Number,
            required: true,
        },
        eskiBirim: {
            type: String,
            enum: ['yıl', 'ay', 'saat', 'oran'],
            required: true,
        },
        yeniBirim: {
            type: String,
            enum: ['yıl', 'ay', 'saat', 'oran'],
            required: true,
        },

        // Kullanıcının yazdığı değişiklik sebebi
        degisiklikSebebi: {
            type: String,
            default: '',
            trim: true,
            // Örnek: "6331 sayılı kanunun 17. maddesinde yapılan değişiklik
            //         doğrultusunda güncellendi. R.G. 15.03.2026"
        },

        // Yürürlük tarihi (değişikliğin geçerli olacağı tarih)
        yururlukTarihi: {
            type: Date,
            default: Date.now,
        },

        // Kim yaptı?
        degistirenKullanici: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kullanici',
            default: null,
        },
        degistirenAd: {
            type: String,
            default: '',
            // Kullanıcı silinse bile "kim yaptı" bilgisi kaybolmasın diye
            // ad soyad denormalize olarak da saklanır
        },
    },
    {
        timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
    }
);

// Belirli bir kuralın geçmişini tarih sırasına göre hızlı getirebilmek için
MevzuatGecmisiSema.index({ mevzuat: 1, olusturmaTarihi: -1 });

module.exports = mongoose.model('MevzuatGecmisi', MevzuatGecmisiSema);