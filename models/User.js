// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');

const KullaniciSema = new mongoose.Schema(
  {
    adSoyad: {
      type: String,
      required: [true, 'Ad Soyad zorunludur'],
      trim: true,
    },
    eposta: {
      type: String,
      required: [true, 'E-posta zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Geçerli bir e-posta giriniz'],
    },
    sifre: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
      select: false,
    },
    rol: {
      type: String,
      enum: ['sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi', 'isveren', 'izleyici'],
      default: 'izleyici',
    },
    isverenFirma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Firma',
      default: null,
    },
    aktif: {
      type: Boolean,
      default: true,
    },
    sonGiris: {
      type: Date,
      default: null,
    },
    // ─────────────────────────────────────────
    // ⭐ YENİ EKLENEN: PROFİL FOTOĞRAFI
    // Sunucudaki dosya yolu tutulur (örn: "/uploads/profil/user_64abc.jpg")
    // Fotoğraf yoksa null kalır, arayüzde baş harfleri gösterilir
    // ─────────────────────────────────────────
    profilFoto: {
      type: String,
      default: null,
    },
    // ─────────────────────────────────────────
    // ŞİFRE SIFIRLAMA ALANLARI
    // ─────────────────────────────────────────
    sifreSifirlamaToken: {
      type: String,
      select: false,
    },
    sifreSifirlamaSuresi: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: { createdAt: 'olusturmaTarihi', updatedAt: 'guncellemeTarihi' },
  }
);

// Şifreyi kaydetmeden önce hashle (sadece değiştirildiyse)
KullaniciSema.pre('save', async function () {
  if (!this.isModified('sifre')) return;
  this.sifre = await bcrypt.hash(this.sifre, 12);
});

// Şifre karşılaştırma metodu
KullaniciSema.methods.sifreKontrol = async function (girilen) {
  return bcrypt.compare(girilen, this.sifre);
};

// Şifre sıfırlama token'ı üret
KullaniciSema.methods.sifreSifirlamaTokenUret = function () {
  const hamToken = crypto.randomBytes(32).toString('hex');
  this.sifreSifirlamaToken = crypto
    .createHash('sha256')
    .update(hamToken)
    .digest('hex');
  this.sifreSifirlamaSuresi = Date.now() + 15 * 60 * 1000;
  return hamToken;
};

// JSON çıktısında hassas alanları gizle
KullaniciSema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.sifre;
  delete obj.sifreSifirlamaToken;
  delete obj.sifreSifirlamaSuresi;
  return obj;
};

module.exports = mongoose.model('Kullanici', KullaniciSema);