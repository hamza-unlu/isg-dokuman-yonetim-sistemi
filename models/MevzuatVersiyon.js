// models/MevzuatVersiyon.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT DOSYA VERSİYON TAKİBİ
// ───────────────────────────────────────────────────────────────────────────
// Her başarılı indirme bu modele bir satır ekler.
// "Bu mevzuat şimdiye kadar şu hash'lerle indirildi" şeklinde tarih
// şeridi oluşturur. Aynı hash gelirse değişiklik yok demektir.
//
// ⭐ YENİ — Metin tabanlı karşılaştırma:
//   PDF dosyalarındaki gizli metadata (oluşturma zamanı, üretici)
//   her indirildiğinde değişebilir. Bu durum binary hash'i değiştirir
//   ama içerik aslında aynıdır. Bu sorunu çözmek için PDF'ten text
//   çıkarılır ve text'in hash'i ayrıca saklanır. Mükerrer kontrolü
//   bu metinHash üzerinden yapılır.
// ═══════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

const MevzuatVersiyonSema = new mongoose.Schema(
    {
        // ─── Hangi mevzuat? ─────────────────────────────────────────────────
        anahtar: {
            type: String,
            required: true,
            index: true,
            // config/mevzuatListesi.js'teki anahtar ile eşleşir
            // Örnek: "isg_kanunu_6331"
        },
        ad: {
            type: String,
            required: true,
            // İnsan okuyabilir ad: "6331 Sayılı İSG Kanunu"
        },
        kategori: {
            type: String,
            enum: ['Kanun', 'Yönetmelik', 'Tebliğ', 'Genelge', 'Diğer'],
            default: 'Diğer',
        },

        // ─── Dosyanın parmak izi (binary) ───────────────────────────────────
        hash: {
            type: String,
            required: true,
            // SHA-256 hash: dosyanın tek bir byte'ı değişse bile hash değişir
            // ⚠️ Dinamik PDF metadata sebebiyle aynı içerikte farklı olabilir
        },
        boyutByte: {
            type: Number,
            required: true,
        },

        // ─── ⭐ Metin parmak izi (anlamsal) ─────────────────────────────────
        metinHash: {
            type: String,
            default: null,
            index: true,
            // PDF'ten çıkarılan text içeriğinin SHA-256 hash'i
            // Mükerrer kontrolü için BUNU kullanırız (binary hash değil)
            // null olabilir — eski kayıtlar için backward-compat
        },
        metinIcerik: {
            type: String,
            default: '',
            // PDF'in text içeriği (diff görüntülemek için saklanır)
            // Büyük PDF'lerde MongoDB document limit'i (16MB) için dikkat
        },

        // ─── Dosya konumu ───────────────────────────────────────────────────
        dosyaYolu: {
            type: String,
            required: true,
            // Yereldeki PDF dosyasının tam yolu
        },
        kaynakURL: {
            type: String,
            required: true,
            // mevzuat.gov.tr'deki orijinal URL
        },

        // ─── Onay süreci ───────────────────────────────────────────────────
        durum: {
            type: String,
            enum: ['yeni', 'onay-bekliyor', 'onaylandi', 'reddedildi'],
            default: 'yeni',
            // yeni           = ilk indirme, otomatik onaylı
            // onay-bekliyor  = mevcut versiyon var ama değişiklik tespit edildi
            // onaylandi      = admin değişikliği kabul etti
            // reddedildi     = admin "bu değişiklik yanlış" dedi
        },
        onaylayan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kullanici',
            default: null,
        },
        onayTarihi: {
            type: Date,
            default: null,
        },

        // ─── Değişiklik özeti ───────────────────────────────────────────────
        birOncekiHash: {
            type: String,
            default: null,
            // Bu kayıttan önceki versiyonun hash'i (varsa)
        },
        farkOzeti: {
            type: String,
            default: '',
            // İleride: "MADDE 5 ve MADDE 7 değişti, MADDE 12 eklendi" gibi
        },

        // ─── İndirme metadatası ─────────────────────────────────────────────
        indirmeSuresi: {
            type: Number,
            default: 0,
            // Milisaniye cinsinden — performans takibi için
        },
    },
    {
        timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
    }
);

// Aynı mevzuatın versiyonlarını tarih sırasına göre hızlı listeleyebilmek için
MevzuatVersiyonSema.index({ anahtar: 1, olusturmaTarihi: -1 });

// ⭐ Metin tabanlı mükerrer kontrolü için
MevzuatVersiyonSema.index({ anahtar: 1, metinHash: 1 });

module.exports = mongoose.model('MevzuatVersiyon', MevzuatVersiyonSema);