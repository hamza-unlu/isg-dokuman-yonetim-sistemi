// models/Egitim.js
const mongoose = require('mongoose');

const EgitimSchema = new mongoose.Schema({
    firma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firma',
        required: [true, 'Eğitimin hangi firmaya ait olduğu zorunludur']
    },
    konu:    { type: String, required: true, trim: true },
    egitmen: { type: String, default: '', trim: true },
    planlananTarih:    { type: Date, required: true },
    tamamlanmaTarihi:  { type: Date, default: null },
    gecerlilikSuresiAy:{ type: Number, default: 12 },

    // ⭐ YENİ: Frontend'den gelen tahmini katılımcı sayısı
    // (egitimler.js payload'da 'katilimci' adıyla gönderiyor)
    katilimci: { type: Number, default: 0, min: 0 },

    // İleride Personel modülüyle entegrasyon için kalsın
    katilimcilar: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personel'
    }],
    durum: {
        type: String,
        enum: ['planlandi', 'tamamlandi', 'iptal'],
        default: 'planlandi'
    },
    notlar: { type: String, default: '' },
    ekleyenKullanici: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Kullanici',   // ⚠️ Önceki 'User' yanlıştı — User.js'de model 'Kullanici' adıyla export
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Egitim', EgitimSchema);