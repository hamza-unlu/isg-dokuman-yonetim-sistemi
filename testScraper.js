// testScraper.js — SADECE TEST AMAÇLI
// mevzuat.gov.tr'den PDF indirebiliyor muyuz, hash hesaplayabiliyor muyuz görmek için

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 🎯 Test edeceğimiz mevzuat — 6331 Sayılı İSG Kanunu
const HEDEF = {
    ad: '6331 Sayılı İSG Kanunu',
    url: 'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6331.pdf'
};

// Test indirme klasörü (yoksa oluştur)
const TEST_KLASOR = path.join(__dirname, 'test-indirmeler');
if (!fs.existsSync(TEST_KLASOR)) {
    fs.mkdirSync(TEST_KLASOR, { recursive: true });
}

async function testIndir() {
    console.log('═══════════════════════════════════════════════');
    console.log('🚀 MEVZUAT İNDİRME TESTİ');
    console.log('═══════════════════════════════════════════════');
    console.log(`📄 Hedef: ${HEDEF.ad}`);
    console.log(`🌐 URL:   ${HEDEF.url}`);
    console.log('');
    console.log('⏳ İndirme başladı...');

    const baslangic = Date.now();

    try {
        const response = await axios.get(HEDEF.url, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
                'Accept': 'application/pdf,*/*'
            },
            // SSL sorunu olursa diye (mevzuat.gov.tr bazen sertifika sorunu yaşar)
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        const sure = ((Date.now() - baslangic) / 1000).toFixed(2);
        const buffer = Buffer.from(response.data);
        const boyutKB = (buffer.length / 1024).toFixed(2);
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');

        // Dosyayı kaydet
        const dosyaYolu = path.join(TEST_KLASOR, 'isg_kanunu_test.pdf');
        fs.writeFileSync(dosyaYolu, buffer);

        // PDF gerçekten PDF mi? (İlk 4 byte "%PDF" olmalı)
        const ilkByte = buffer.slice(0, 4).toString();
        const gercektenPdf = ilkByte === '%PDF';

        console.log('');
        console.log('✅ İNDİRME BAŞARILI!');
        console.log('───────────────────────────────────────────────');
        console.log(`⏱️  Süre:        ${sure} saniye`);
        console.log(`📦 Boyut:       ${boyutKB} KB (${buffer.length} byte)`);
        console.log(`🔐 SHA-256:     ${hash}`);
        console.log(`📂 Kaydedildi:  ${dosyaYolu}`);
        console.log(`📋 PDF formatı: ${gercektenPdf ? '✅ Geçerli PDF' : '❌ PDF DEĞİL (HTML/hata sayfası gelmiş olabilir)'}`);
        console.log('───────────────────────────────────────────────');

        if (!gercektenPdf) {
            console.log('');
            console.log('⚠️  DİKKAT: İndirilen dosya PDF değil!');
            console.log('   İlk 200 karakter (debug için):');
            console.log('   ' + buffer.slice(0, 200).toString());
        }

    } catch (err) {
        console.log('');
        console.log('❌ İNDİRME BAŞARISIZ!');
        console.log('───────────────────────────────────────────────');
        if (err.response) {
            console.log(`🔴 HTTP Durum: ${err.response.status} ${err.response.statusText}`);
        } else if (err.code === 'ECONNABORTED') {
            console.log('🔴 Zaman aşımı (timeout) — sunucu cevap vermedi');
        } else if (err.code === 'ENOTFOUND') {
            console.log('🔴 DNS hatası — internet bağlantını veya URL\'yi kontrol et');
        } else {
            console.log(`🔴 Hata: ${err.message}`);
        }
        console.log('───────────────────────────────────────────────');
    }
}

testIndir();