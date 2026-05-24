// models/Personel.js
const mongoose = require('mongoose');
const { tcKimlikDogrula } = require('../utils/validator');

const EGITIM_SURESI = { 'Az Tehlikeli': 36, 'Tehlikeli': 24, 'Çok Tehlikeli': 12 };
const MUAYENE_SURESI = { 'Az Tehlikeli': 60, 'Tehlikeli': 36, 'Çok Tehlikeli': 12 };

const PersonelSema = new mongoose.Schema(
  {
    firma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Firma',
      required: [true, 'Firma zorunludur'],
    },
    adSoyad: { type: String, required: [true, 'Ad Soyad zorunludur'], trim: true },
    tcKimlik: {
        type: String,
        trim: true,
        default: '',
        validate: {
            validator: function (v) {
                if (!v) return true; // boş geçilebilir
                return tcKimlikDogrula(v).gecerli;
            },
            message: props => {
                const sonuc = tcKimlikDogrula(props.value);
                return sonuc.hata || 'Geçersiz TC Kimlik No';
            }
        }
    },
    gorev: { type: String, trim: true, default: '' },
    departman: { type: String, trim: true, default: '' },
    iseGirisTarihi: { type: Date, default: null },
    aktif: { type: Boolean, default: true },

    muayene: {
      sonMuayeneTarihi: { type: Date, default: null },
      gecerlilikBitis:  { type: Date, default: null },
    },
    egitim: {
      sonEgitimTarihi:  { type: Date, default: null },
      gecerlilikBitis:  { type: Date, default: null },
    },
    ilkyardim: {
      sertifikaTarihi:  { type: Date, default: null },
      gecerlilikBitis:  { type: Date, default: null },
      sertifikaNo:      { type: String, default: '' },
    },
    destekRolleri: {
      type: [String],
      enum: ['Koruma', 'Kurtarma', 'Söndürme', 'İlkyardım'],
      default: [],
    },
    notlar: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' } }
);

function ayEkle(tarih, ay) {
  const d = new Date(tarih);
  d.setMonth(d.getMonth() + ay);
  return d;
}

PersonelSema.pre('save', async function () {
    if (this.isModified('muayene.sonMuayeneTarihi') || this.isModified('egitim.sonEgitimTarihi')) {
        const Firma = mongoose.model('Firma');
        const firma = await Firma.findById(this.firma).select('tehlikeSinifi');

        if (firma) {
            const ts = firma.tehlikeSinifi || 'Az Tehlikeli';
            if (this.muayene?.sonMuayeneTarihi) {
                this.muayene.gecerlilikBitis = ayEkle(this.muayene.sonMuayeneTarihi, MUAYENE_SURESI[ts]);
            }
            if (this.egitim?.sonEgitimTarihi) {
                this.egitim.gecerlilikBitis = ayEkle(this.egitim.sonEgitimTarihi, EGITIM_SURESI[ts]);
            }
        }
    }

    if (this.isModified('ilkyardim.sertifikaTarihi') && this.ilkyardim?.sertifikaTarihi) {
        this.ilkyardim.gecerlilikBitis = ayEkle(this.ilkyardim.sertifikaTarihi, 36);
    }
});

module.exports = mongoose.model('Personel', PersonelSema);