// models/EgitimTuru.js
const mongoose = require('mongoose');

const EgitimTuruSchema = new mongoose.Schema({
    ad: {
        type: String,
        required: [true, 'Eğitim adı zorunludur'],
        trim: true,
        unique: true
    },
    sureSaat:  { type: Number, default: 0, min: 0 },     // örn: 16 saat
    aciklama:  { type: String, default: '', trim: true },
    tehlikeSinifi: {
        type: String,
        enum: ['Az Tehlikeli', 'Tehlikeli', 'Çok Tehlikeli', 'Genel'],
        default: 'Genel'
    },
    gecerlilikSuresiAy: { type: Number, default: 12 },
    aktif: { type: Boolean, default: true },
    ekleyenKullanici: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kullanici',
        default: null
    }
}, { timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' } });

module.exports = mongoose.model('EgitimTuru', EgitimTuruSchema);