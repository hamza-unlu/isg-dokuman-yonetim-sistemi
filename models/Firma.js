// models/Firma.js
const mongoose = require('mongoose');

const FirmaSema = new mongoose.Schema(
  {
    firmaAdi: {
      type: String,
      required: [true, 'Firma adı zorunludur'],
      trim: true,
    },
    vergiNo: {
      type: String,
      trim: true,
      default: '',
    },
    sektor: {
      type: String,
      trim: true,
      default: '',
    },
    tehlikeSinifi: {
      type: String,
      default: 'Tehlikeli' // Katı enum kısıtlamasını esnettik
    },
    adres: {
      type: String,
      trim: true,
      default: '',
    },
    telefon: {
      type: String,
      trim: true,
      default: '',
    },
    eposta: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    yetkiliKisi: {
      type: String,
      trim: true,
      default: '',
    },
    calisanSayisi: {
      type: Number,
      default: 0,
      min: 0,
    },
    sgkNo: {
      type: String,
      trim: true,
      default: '',
    },
    detsisNo: {
    type: String,
    trim: true,
    default: '',
    },
    aktif: {
      type: Boolean,
      default: true,
    },
    isgUzmani: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kullanici',
      default: null,
    },
    notlar: {
      type: String,
      default: '',
    },
    ekleyenKullanici: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kullanici',
      default: null, // Hata çıkarmaması için esnetildi
    },
    // İleride dokümanlar sayfasında verilerin (Risk analizi, kurul vs.) 
    // sorunsuz kaydedilmesi için bu alan şarttır:
    uzmanVerileri: {
    igu:   { ad: String, atamaTarihi: String },
    hekim: { ad: String, atamaTarihi: String },
    dsp:   { ad: String, atamaTarihi: String },
},
  },
  {
    timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
    strict: false // ÇOK ÖNEMLİ: Arayüzden gelen ekstra verilerin (NACE vb.) sunucuyu çökertmesini engeller!
  }
);

module.exports = mongoose.model('Firma', FirmaSema);