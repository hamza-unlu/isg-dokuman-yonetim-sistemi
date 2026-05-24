// scripts/textExtractMigration.js
// ═══════════════════════════════════════════════════════════════════════════
// MİGRATION: Eski Versiyonlar için Text İçeriği Geriye Dönük Doldurma
// ───────────────────────────────────────────────────────────────────────────
// Bu script, text-extraction özelliği eklenmeden ÖNCE indirilmiş PDF
// versiyonlarının text içeriğini yeniden hesaplayıp veritabanına yazar.
//
// Yapılan iş:
//   1. mevzuatversiyons koleksiyonundaki metinIcerik boş kayıtları bul
//   2. Her birinin PDF dosyasını disk'ten oku
//   3. pdf-parse ile text çıkar, normalize et
//   4. SHA-256 metin hash'i hesapla
//   5. DB'yi güncelle: metinIcerik + metinHash + sayfaSayisi
//
// Kullanım:
//   node scripts/textExtractMigration.js
//   node scripts/textExtractMigration.js --kuru   (sadece simülasyon)
// ═══════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const mongoose  = require('mongoose');
const fs        = require('fs');
const path      = require('path');
const crypto    = require('crypto');
const pdfParse  = require('pdf-parse');

const MevzuatVersiyon = require('../models/MevzuatVersiyon');

const KURU_CALISTIRMA = process.argv.includes('--kuru');

async function migration() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  📜 MEVZUAT VERSİYON — TEXT İÇERİĞİ MİGRATION');
    console.log('═══════════════════════════════════════════════════════════════');

    if (KURU_CALISTIRMA) {
        console.log('  ⚠️  KURU ÇALIŞTIRMA MODU — DB güncellenmeyecek');
    }
    console.log('');

    // ─── 1. MongoDB bağlantısı ──────────────────────────────────────────
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB bağlantısı: ${mongoUri}`);

    // ─── 2. Eksik kayıtları bul ─────────────────────────────────────────
    const eksikKayitlar = await MevzuatVersiyon.find({
        $or: [
            { metinIcerik: '' },
            { metinIcerik: { $exists: false } },
            { metinHash: null },
            { metinHash: { $exists: false } },
        ]
    });

    console.log(`\n📋 Toplam ${eksikKayitlar.length} eksik kayıt bulundu\n`);

    if (eksikKayitlar.length === 0) {
        console.log('✅ Tüm kayıtlar zaten güncel, migration gerekmiyor.');
        await mongoose.disconnect();
        return;
    }

    // ─── 3. Her kayıt için text çıkar ───────────────────────────────────
    const istatistik = {
        toplam: eksikKayitlar.length,
        basarili: 0,
        atlandi: 0,
        hata: 0,
        dosyaYok: 0,
    };

    for (let i = 0; i < eksikKayitlar.length; i++) {
        const kayit = eksikKayitlar[i];
        const ilerleme = `[${i + 1}/${eksikKayitlar.length}]`;
        const adKisa = kayit.ad.length > 40 ? kayit.ad.substring(0, 40) + '...' : kayit.ad;

        try {
            // PDF dosyası mevcut mu?
            if (!kayit.dosyaYolu || !fs.existsSync(kayit.dosyaYolu)) {
                console.log(`  ⚠️  ${ilerleme} Dosya yok: ${adKisa} (${kayit.dosyaYolu})`);
                istatistik.dosyaYok++;
                continue;
            }

            // PDF'i oku
            const pdfBuffer = fs.readFileSync(kayit.dosyaYolu);
            const pdfData = await pdfParse(pdfBuffer);

            // Text'i normalize et
            const metinIcerik = (pdfData.text || '')
                .replace(/\s+/g, ' ')
                .trim();

            if (!metinIcerik) {
                console.log(`  ⚠️  ${ilerleme} Text boş: ${adKisa}`);
                istatistik.atlandi++;
                continue;
            }

            // Hash hesapla
            const metinHash = crypto
                .createHash('sha256')
                .update(metinIcerik)
                .digest('hex');

            // DB'yi güncelle
            if (!KURU_CALISTIRMA) {
                kayit.metinIcerik = metinIcerik;
                kayit.metinHash = metinHash;
                await kayit.save();
            }

            const metinUzunlugu = (metinIcerik.length / 1024).toFixed(1);
            console.log(`  ✅ ${ilerleme} ${adKisa} (${metinUzunlugu} KB text, ${pdfData.numpages} sayfa)`);
            istatistik.basarili++;

        } catch (err) {
            console.log(`  ❌ ${ilerleme} HATA: ${adKisa} → ${err.message.substring(0, 60)}`);
            istatistik.hata++;
        }
    }

    // ─── 4. Özet ────────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  📊 MİGRATION ÖZETİ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  Toplam kayıt:       ${istatistik.toplam}`);
    console.log(`  ✅ Başarılı:        ${istatistik.basarili}`);
    console.log(`  ⚠️  Atlandı (boş):   ${istatistik.atlandi}`);
    console.log(`  ⚠️  Dosya yok:      ${istatistik.dosyaYok}`);
    console.log(`  ❌ Hata:            ${istatistik.hata}`);
    console.log('═══════════════════════════════════════════════════════════════');

    if (KURU_CALISTIRMA) {
        console.log('  ℹ️  KURU MODDA çalıştı — DB güncellenmedi');
        console.log('  → Gerçek migration için: node scripts/textExtractMigration.js');
    } else {
        console.log('  ✅ Migration tamamlandı, DB güncellendi');
        console.log('  → Şimdi modal\'da "İçerik Farklılıkları" çalışmalı');
    }
    console.log('');

    await mongoose.disconnect();
}

migration().catch(err => {
    console.error('💥 Migration hatası:', err);
    process.exit(1);
});