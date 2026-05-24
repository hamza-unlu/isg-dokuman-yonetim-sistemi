// scripts/takipliMevzuatSeed.js
// ═══════════════════════════════════════════════════════════════════════════
// TAKİPLİ MEVZUAT SEED SCRIPTI
// ───────────────────────────────────────────────────────────────────────────
// config/mevzuatListesi.js'teki sabit verileri MongoDB'ye aktarır.
//
// ÖNEMLİ:
// • Mevcut kayıtlar varsa onları SİLMEZ, sadece eksikleri ekler (upsert).
// • Mevcut MevzuatVersiyon kayıtları varsa, eşleşen mevzuatın takipDurumu'nu
//   "aktif" yapar — yani şu an çalışan 7 mevzuat hemen "aktif" olarak görünür.
// • Hata almış 7 yönetmelik "url-hatasi" durumunda eklenir (silinmez!) →
//   sen frontend'den URL düzeltmesi yapabilirsin.
//
// Kullanım:
//   node scripts/takipliMevzuatSeed.js
//   node scripts/takipliMevzuatSeed.js --force   (her şeyi sil + baştan ekle)
// ═══════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const mongoose = require('mongoose');

const mevzuatListesi  = require('../config/mevzuatListesi');
const TakipliMevzuat  = require('../models/TakipliMevzuat');
const MevzuatVersiyon = require('../models/MevzuatVersiyon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';

async function main() {
    const force = process.argv.includes('--force');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌱 TAKİPLİ MEVZUAT SEED');
    console.log('═══════════════════════════════════════════════════════════');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlandı\n');

    if (force) {
        const eskiSayi = await TakipliMevzuat.countDocuments();
        if (eskiSayi > 0) {
            await TakipliMevzuat.deleteMany({});
            console.log(`🗑️  --force: ${eskiSayi} eski kayıt silindi\n`);
        }
    }

    let eklenen = 0;
    let guncellenen = 0;
    let atlanan = 0;

    for (const mevzuat of mevzuatListesi) {
        // Mevcut kayıt var mı?
        const mevcut = await TakipliMevzuat.findOne({ anahtar: mevzuat.anahtar });

        // En son MevzuatVersiyon'a bakarak takipDurumu belirle
        const sonVersiyon = await MevzuatVersiyon
            .findOne({ anahtar: mevzuat.anahtar })
            .sort({ olusturmaTarihi: -1 });

        let takipDurumu, sonHash, sonTaramaTarihi, sonHataMesaji;

        if (sonVersiyon) {
            // Daha önce başarıyla taranmış → aktif
            takipDurumu = 'aktif';
            sonHash = sonVersiyon.hash;
            sonTaramaTarihi = sonVersiyon.olusturmaTarihi;
            sonHataMesaji = '';
        } else if (mevzuat.pdfURL) {
            // pdfURL var ama henüz taranmamış → hazır
            takipDurumu = 'hazır';
            sonHataMesaji = '';
        } else {
            // pdfURL null → URL hatalı veya manuel düzeltme gerekli
            takipDurumu = 'url-hatasi';
            sonHataMesaji = 'PDF URL bulunamadı, manuel düzeltme gerekli';
        }

        const payload = {
            anahtar:     mevzuat.anahtar,
            ad:          mevzuat.ad,
            kategori:    mevzuat.kategori,
            aciklama:    mevzuat.aciklama || '',
            pdfURL:      mevzuat.pdfURL || null,
            htmlURL:     mevzuat.htmlURL || null,
            mevzuatNo:   mevzuat.mevzuatNo || '',
            tur:         mevzuat.tur || '',
            tertip:      mevzuat.tertip || '5',
            aktif:       true,
            takipDurumu,
            sonHash:     sonHash || null,
            sonTaramaTarihi: sonTaramaTarihi || null,
            sonHataMesaji,
        };

        if (mevcut) {
            // Güncelle ama sayaçları koru
            await TakipliMevzuat.updateOne(
                { anahtar: mevzuat.anahtar },
                { $set: payload }
            );
            guncellenen++;
            console.log(`  🔄 Güncellendi: ${mevzuat.ad.substring(0, 55)}... [${takipDurumu}]`);
        } else {
            // Yeni kayıt
            await TakipliMevzuat.create(payload);
            eklenen++;
            const durumEmoji = {
                'aktif': '✅',
                'hazır': '🆕',
                'url-hatasi': '⚠️',
            }[takipDurumu] || '➕';
            console.log(`  ${durumEmoji} Eklendi:     ${mevzuat.ad.substring(0, 55)}... [${takipDurumu}]`);
        }
    }

    // ─── Özet ─────────────────────────────────────────────────────────────
    const toplam = await TakipliMevzuat.countDocuments();
    const aktifSayi = await TakipliMevzuat.countDocuments({ takipDurumu: 'aktif' });
    const hatali = await TakipliMevzuat.countDocuments({ takipDurumu: 'url-hatasi' });
    const hazir = await TakipliMevzuat.countDocuments({ takipDurumu: 'hazır' });

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 SEED ÖZETİ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✅ Yeni eklenen:    ${eklenen}`);
    console.log(`  🔄 Güncellenen:     ${guncellenen}`);
    console.log(`  ⏭️  Atlanan:         ${atlanan}`);
    console.log('  ─────────────────────────────');
    console.log(`  📋 DB'deki toplam:  ${toplam}`);
    console.log(`     ├─ Aktif:        ${aktifSayi}`);
    console.log(`     ├─ Hazır:        ${hazir}`);
    console.log(`     └─ URL hatalı:   ${hatali}`);
    console.log('═══════════════════════════════════════════════════════════');

    await mongoose.disconnect();
    console.log('\n👋 MongoDB bağlantısı kapatıldı');
    console.log('\n💡 Sonraki adım: services/mevzuatTakipServisi.js güncellenecek');
}

main().catch(err => {
    console.error('💥 Hata:', err);
    process.exit(1);
});