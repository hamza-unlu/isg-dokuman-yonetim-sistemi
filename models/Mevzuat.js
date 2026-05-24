// models/Mevzuat.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT KURAL MODELİ
// ───────────────────────────────────────────────────────────────────────────
// İSG mevzuatından gelen periyot, süre ve oran kurallarını tutar.
// Örnek kayıtlar:
//   • "Temel İSG Eğitimi Periyodu" / "Az Tehlikeli"  → deger: 3,  birim: "yıl"
//   • "Temel İSG Eğitimi Süresi"   / "Az Tehlikeli"  → deger: 8,  birim: "saat"
//   • "İSG Kurulu Toplantısı"      / "Az Tehlikeli"  → deger: 3,  birim: "ay"
//   • "İlkyardımcı Oranı"          / "Tehlikeli"     → deger: 15, birim: "oran"
//                                                      (15 kişide 1 ilkyardımcı)
// ═══════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const MevzuatSema = new mongoose.Schema(
    {
        // ─── Kural kimliği ──────────────────────────────────────────────────
        anahtar: {
            type: String,
            required: [true, 'Kural anahtarı zorunludur'],
            unique: true,
            trim: true,
            // Program içinde kuralı benzersiz şekilde bulmak için kullanılır.
            // Örnek: "egitim_temel_isg_periyot_az_tehlikeli"
            // Kullanıcı bu alanı görmez, sistem içi bir tanımlayıcıdır.
        },

        // ─── Sınıflandırma ─────────────────────────────────────────────────
        grup: {
            type: String,
            required: true,
            enum: ['Eğitim', 'Sağlık', 'Risk', 'Tatbikat', 'Diğer'],
            // Arayüzde kuralların hangi başlık altında görüneceği
        },
        kuralAdi: {
            type: String,
            required: [true, 'Kural adı zorunludur'],
            trim: true,
            // Kullanıcıya gösterilen isim: "Temel İSG Eğitimi Periyodu",
            // "Temel İSG Eğitimi Süresi", "Periyodik Sağlık Muayenesi" vb.
        },
        tehlikeSinifi: {
            type: String,
            required: true,
            enum: ['Az Tehlikeli', 'Tehlikeli', 'Çok Tehlikeli', 'Tümü'],
            // "Tümü" → bu kural sınıftan bağımsız çalışır
            //          (örn. ilkyardımcı eğitim süresi her sınıfta 3 yıl,
            //           tatbikat her sınıfta 1 yıl)
        },

        // ─── Asıl değer ────────────────────────────────────────────────────
        deger: {
            type: Number,
            required: [true, 'Değer zorunludur'],
            min: [0, 'Değer negatif olamaz'],
            // Sayısal değer: 1, 2, 3, 8, 12, 15, 16 vb.
        },
        birim: {
            type: String,
            required: true,
            enum: ['yıl', 'ay', 'saat', 'oran'],
            // yıl  → eğitim/muayene/revizyon periyotları
            // ay   → kurul toplantı sıklığı
            // saat → eğitim süresi (8, 12, 16 saat gibi)
            // oran → "X kişide 1 ilkyardımcı" gibi oransal kurallar
        },

        // ─── Metadata ──────────────────────────────────────────────────────
        aciklama: {
            type: String,
            default: '',
            trim: true,
            // Hocalarca/denetçiler için açıklayıcı metin:
            // "6331 sayılı kanun, madde 17"
        },
        mevzuatKaynak: {
            type: String,
            default: '',
            trim: true,
            // Kuralın dayandığı resmi mevzuat adı / bağlantısı
        },
        aktif: {
            type: Boolean,
            default: true,
        },

        // ─── Son değiştiren ────────────────────────────────────────────────
        sonDegistiren: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kullanici',
            default: null,
        },
    },
    {
        timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
    }
);

// Arama ve listeleme performansı için indeksler
MevzuatSema.index({ grup: 1, kuralAdi: 1, tehlikeSinifi: 1 });

module.exports = mongoose.model('Mevzuat', MevzuatSema);