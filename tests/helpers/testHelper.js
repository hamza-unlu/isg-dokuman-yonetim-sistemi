// tests/helpers/testHelper.js
// -----------------------------------------------------------------------------
// Tüm entegrasyon/sistem testlerinin ortak yardımcısı.
// ÖNEMLİ: Bu dosya, app.js (ve dolayısıyla authMiddleware) import edilmeden ÖNCE
// çalışır; çünkü her test dosyasının EN ÜST satırında require ediliyor.
// Böylece JWT_SECRET ve diğer ortam değişkenleri middleware yüklenmeden hazır olur.
// -----------------------------------------------------------------------------

// 1) JWT secret — authMiddleware ile AYNI değer olmalı.
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.NODE_ENV   = 'test';

// 2) Bazı servisler (AI, mail) import anında anahtar arayabilir; testin import
//    aşamasında patlamaması için zararsız sahte değerler veriyoruz.
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-openai-key';
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-gemini-key';
process.env.EMAIL_USER     = process.env.EMAIL_USER     || 'test@example.com';
process.env.EMAIL_PASS     = process.env.EMAIL_PASS     || 'test-pass';
process.env.SMTP_HOST      = process.env.SMTP_HOST      || 'smtp.example.com';

const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User     = require('../../models/User'); // gerçek User modeli

let mongo;

// Bellek-içi MongoDB başlatır ve mongoose'u ona bağlar.
async function connect() {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
}

// Bağlantıyı kapatır ve geçici DB'yi siler.
async function disconnect() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  if (mongo) await mongo.stop();
}

// Belirtilen rolde AKTİF bir kullanıcı oluşturur ve onun için geçerli token üretir.
// Not: User.collection.insertOne kullanıyoruz -> Mongoose şema doğrulamasına takılmadan,
// olası tüm alan adlarını (rol/role/yetki, aktif/durum/isActive) tek seferde yazar.
async function createToken(rol = 'sistem_yoneticisi') {
  const _id = new mongoose.Types.ObjectId();
  await User.collection.insertOne({
    _id,
    adSoyad: 'Test Kullanıcı', isim: 'Test', ad: 'Test',
    email: `test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
    // rol hangi alan adıyla tutuluyorsa otomatik uyum:
    rol, role: rol, yetki: rol,
    // aktiflik bayrağı hangi adla tutuluyorsa otomatik uyum:
    aktif: true, durum: 'aktif', isActive: true, aktifMi: true, silindi: false,
    sifre: 'test-hash', password: 'test-hash',
    createdAt: new Date(),
  });

  const token = jwt.sign(
    { id: _id.toString(), _id: _id.toString(), userId: _id.toString(), rol, role: rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  return { token, _id };
}

// Süresi geçmiş (expired) token — kullanıcı oluşturmadan üretir.
function expiredToken() {
  return jwt.sign(
    { id: new mongoose.Types.ObjectId().toString(), rol: 'sistem_yoneticisi' },
    process.env.JWT_SECRET,
    { expiresIn: -10 } // 10 sn önce dolmuş
  );
}

module.exports = { connect, disconnect, createToken, expiredToken };