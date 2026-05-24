// models/Nace.js
const mongoose = require('mongoose');

const NaceSema = new mongoose.Schema(
  {
    kod: {
      type: String,
      required: [true, 'NACE kodu zorunludur'],
      trim: true,
      unique: true,           // aynı kod iki kere eklenemez
    },
    tanim: {
      type: String,
      required: [true, 'Tanım zorunludur'],
      trim: true,
    },
    sinif: {
      type: String,
      required: [true, 'Tehlike sınıfı zorunludur'],
      trim: true,
      // "Az Tehlikeli" / "Tehlikeli" / "Çok Tehlikeli"
      // Enum kullanmıyoruz — ileride yeni sınıf eklenmesi gerekirse esnek olsun
    },
    aktif: {
      type: Boolean,
      default: true,
    },
    ekleyenKullanici: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kullanici',
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
  }
);

// Arama performansı için index
NaceSema.index({ tanim: 'text' });

module.exports = mongoose.model('Nace', NaceSema);