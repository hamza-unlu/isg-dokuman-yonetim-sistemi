// server.js — Ortamı yükler, DB'ye bağlanır, sunucuyu DİNLER, scheduler'ı başlatır
require('dotenv').config();

const mongoose = require('mongoose');
const app      = require('./app');                       // tarifi içeri al
const { baglantiTest } = require('./utils/emailGonder');

// ── MONGODB BAĞLANTISI ──
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB bağlantısı kuruldu → isg_veritabani');
    baglantiTest();                                       // SMTP testi (sadece canlıda)
  })
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  });

  

// ── BAŞLATMA ──
const PORT = process.env.PORT || 5500;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`📄 Swagger UI  → http://localhost:${PORT}/api-docs`);
});

// ── Mevzuat Otomatik Takip Sistemi ──
const mevzuatScheduler = require('./services/mevzuatScheduler');
mevzuatScheduler.baslat();