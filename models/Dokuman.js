// models/Dokuman.js
const mongoose = require('mongoose');

const DokumanSema = new mongoose.Schema(
  {
    firma: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Firma', 
      required: [true, 'Firma zorunludur'] 
    },
    tur: {
      type: String,
      required: [true, 'Belge türü zorunludur'],
       default: 'diger',
    },
    baslik:          { type: String, required: [true, 'Başlık zorunludur'], trim: true },
    belgeTarihi:     { type: Date,   required: [true, 'Belge tarihi zorunludur'] },
    gecerlilikBitis: { type: Date,   default: null },
    periyodik:       { type: Boolean, default: false },
    periyotAy:       { type: Number,  default: null },
    sonrakiTarih:    { type: Date,    default: null },
    dosyaAdi:        { type: String,  default: '' },
    dosyaBoyut:      { type: Number,  default: null },
    dosyaTur:        { type: String,  default: '' },
    dosyaIcerik:     { type: String,  default: '' },   // ✅ YENİ: base64 dataUrl
    aciklama:        { type: String,  default: '' },
    kategori:        { type: String,  default: '' },
    kaydeden: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Kullanici',
      default: null 
    },
    ekleyenAd: { type: String, default: '' },
  },
  { 
    timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
    toJSON:   { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Sanal Özellik: Durumu gerçek zamanlı hesapla
DokumanSema.virtual('durum').get(function () {
  if (!this.gecerlilikBitis) return 'gecerli';
  const simdi = new Date();
  const otuzGun = new Date();
  otuzGun.setDate(simdi.getDate() + 30);
  if (this.gecerlilikBitis < simdi)    return 'suresi_dolmus';
  if (this.gecerlilikBitis <= otuzGun) return 'yaklasan';
  return 'gecerli';
});

module.exports = mongoose.model('Dokuman', DokumanSema);