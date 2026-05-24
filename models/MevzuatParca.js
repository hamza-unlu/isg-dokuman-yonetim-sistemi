// models/MevzuatParca.js
const mongoose = require('mongoose');

const MevzuatParcaSema = new mongoose.Schema({
    // Kanun bilgisi
    kanunAdi:    { type: String, required: true },        // "6331 Sayılı İSG Kanunu"
    kanunNo:     { type: String, required: true },        // "6331"
    
    // Madde bilgisi
    maddeNo:     { type: String, required: true },        // "MADDE 5", "GEÇİCİ MADDE 1"
    bolum:       { type: String, default: '' },           // "BİRİNCİ BÖLÜM"
    bolumBaslik: { type: String, default: '' },           // "Amaç, Kapsam ve Tanımlar"
    maddeBaslik: { type: String, default: '' },           // "Risklerden korunma ilkeleri"
    
    // Asıl içerik
    metin:       { type: String, required: true },        // Maddenin tam metni
    
    // Embedding vektörü (768 boyutlu sayı dizisi)
    embedding:   { type: [Number], default: [] },
    
    // Meta
    olusturmaTarihi: { type: Date, default: Date.now },
}, {
    collection: 'mevzuat_parcalari',
});

// Performans için index
MevzuatParcaSema.index({ kanunNo: 1, maddeNo: 1 });

module.exports = mongoose.model('MevzuatParca', MevzuatParcaSema);