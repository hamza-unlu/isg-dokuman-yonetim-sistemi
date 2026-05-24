// scripts/mevzuatTopluTest.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT TOPLU İNDİRME VE KARŞILAŞTIRMA TESTİ
// ───────────────────────────────────────────────────────────────────────────
// HİBRİT scraper kullanarak config/mevzuatListesi.js'teki tüm mevzuatları
// indirir, MongoDB ile karşılaştırır, değişiklikleri tespit eder.
//
// İlk çalıştırmada → Tüm mevzuatlar "yeni" olarak kaydedilir
// Sonraki çalıştırmalarda → Hash karşılaştırılır, değişenler "onay-bekliyor" olur
//
// Kullanım: node scripts/mevzuatTopluTest.js
// ═══════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

const mevzuatListesi = require('../config/mevzuatListesi');
const MevzuatScraper = require('../services/mevzuatScraper');
const MevzuatVersiyon = require('../models/MevzuatVersiyon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';

// ─── Tek bir mevzuatı işle ───────────────────────────────────────────────
async function mevzuatIsle(scraper, mevzuat, index, toplam) {
    console.log(`[${index}/${toplam}] ${mevzuat.ad.substring(0, 65)}${mevzuat.ad.length > 65 ? '...' : ''}`);
    console.log(`   🏷️  ${mevzuat.kategori} | Anahtar: ${mevzuat.anahtar}`);

    try {
        // 1. DB'de bu mevzuatın son versiyonunu bul
        const sonVersiyon = await MevzuatVersiyon
            .findOne({ anahtar: mevzuat.anahtar })
            .sort({ olusturmaTarihi: -1 });

        // 2. Hibrit scraper ile indir
        const sonuc = await scraper.indir(mevzuat);

        const yontemEmoji = {
            'katman-1-direkt-pdf':  '🟢',
            'katman-2-html-parse':  '🟡',
            'katman-3-pattern':     '🟠',
        };

        console.log(`   ${yontemEmoji[sonuc.yontem] || '⚪'} Yöntem: ${sonuc.yontem}`);
        if (sonuc.kesfedilenPdfURL) {
            console.log(`   🔗 Bulunan PDF: ${sonuc.kesfedilenPdfURL}`);
        }
        console.log(`   📦 Boyut: ${(sonuc.boyutByte / 1024).toFixed(2)} KB | ⏱️ ${sonuc.indirmeSuresi}ms`);

        // 3. Hash karşılaştır
        if (sonVersiyon && sonVersiyon.hash === sonuc.hash) {
            // Çöp dosyayı sil
            try { fs.unlinkSync(sonuc.dosyaYolu); } catch {}
            console.log(`   ✓ DEĞİŞİKLİK YOK (hash aynı)`);
            console.log('');
            return { durum: 'degisiklik-yok', mevzuat: mevzuat.ad };
        }

        // 4. Yeni veya değişmiş — DB'ye kaydet
        const yeniKayit = await MevzuatVersiyon.create({
            anahtar:        mevzuat.anahtar,
            ad:             mevzuat.ad,
            kategori:       mevzuat.kategori,
            hash:           sonuc.hash,
            boyutByte:      sonuc.boyutByte,
            dosyaYolu:      sonuc.dosyaYolu,
            kaynakURL:      sonuc.kaynakURL,
            birOncekiHash:  sonVersiyon ? sonVersiyon.hash : null,
            durum:          sonVersiyon ? 'onay-bekliyor' : 'yeni',
            indirmeSuresi:  sonuc.indirmeSuresi,
        });

        if (sonVersiyon) {
            console.log(`   🔔 DEĞİŞİKLİK TESPİT EDİLDİ → Durum: onay-bekliyor`);
            console.log(`      Eski hash: ${sonVersiyon.hash.substring(0, 20)}...`);
            console.log(`      Yeni hash: ${sonuc.hash.substring(0, 20)}...`);
        } else {
            console.log(`   ✅ İLK VERSİYON kaydedildi`);
            console.log(`      Hash: ${sonuc.hash.substring(0, 20)}...`);
        }
        console.log('');

        return {
            durum: sonVersiyon ? 'degisti' : 'yeni',
            mevzuat: mevzuat.ad,
            yontem: sonuc.yontem,
            kayit: yeniKayit
        };

    } catch (err) {
        console.log(`   ❌ HATA: ${err.message}`);
        console.log('');
        return { durum: 'hata', mevzuat: mevzuat.ad, hata: err.message };
    }
}

// ─── Ana akış ─────────────────────────────────────────────────────────────
async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 MEVZUAT TOPLU İNDİRME VE KARŞILAŞTIRMA');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📋 Listede ${mevzuatListesi.length} mevzuat var`);
    console.log('');

    // MongoDB
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB bağlantısı kuruldu');
        console.log('');
    } catch (err) {
        console.error('❌ MongoDB bağlanılamadı:', err.message);
        process.exit(1);
    }

    const scraper = new MevzuatScraper();
    const ozet = { yeni: 0, degisti: 0, degisiklikYok: 0, hata: 0 };
    const yontemSayilari = { 'katman-1-direkt-pdf': 0, 'katman-2-html-parse': 0, 'katman-3-pattern': 0 };
    const hatalar = [];

    for (let i = 0; i < mevzuatListesi.length; i++) {
        const sonuc = await mevzuatIsle(scraper, mevzuatListesi[i], i + 1, mevzuatListesi.length);

        switch (sonuc.durum) {
            case 'yeni':           ozet.yeni++; break;
            case 'degisti':        ozet.degisti++; break;
            case 'degisiklik-yok': ozet.degisiklikYok++; break;
            case 'hata':           ozet.hata++; hatalar.push(sonuc); break;
        }

        if (sonuc.yontem) yontemSayilari[sonuc.yontem]++;

        // Sunucuyu yormamak için bekle
        if (i < mevzuatListesi.length - 1) {
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // ─── ÖZET ─────────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 GENEL ÖZET');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Yeni kaydedilen:    ${ozet.yeni}`);
    console.log(`🔔 Değişiklik bulunan: ${ozet.degisti}`);
    console.log(`✓  Değişmemiş:         ${ozet.degisiklikYok}`);
    console.log(`❌ Hata alan:          ${ozet.hata}`);
    console.log('');

    console.log('🛠️  HİBRİT KATMAN PERFORMANSI');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`🟢 Katman 1 (direkt PDF):     ${yontemSayilari['katman-1-direkt-pdf']}`);
    console.log(`🟡 Katman 2 (HTML parsing):   ${yontemSayilari['katman-2-html-parse']}`);
    console.log(`🟠 Katman 3 (pattern tahmin): ${yontemSayilari['katman-3-pattern']}`);
    console.log('');

    if (hatalar.length > 0) {
        console.log('⚠️  HATA ALAN MEVZUATLAR');
        console.log('───────────────────────────────────────────────────────────');
        hatalar.forEach(h => {
            console.log(`  ❌ ${h.mevzuat}`);
            console.log(`     → ${h.hata}`);
        });
        console.log('');
        console.log('💡 İpucu: node scripts/urlKesfet.js çalıştırıp URL\'leri kontrol et');
        console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════');
    await mongoose.disconnect();
    console.log('👋 MongoDB bağlantısı kapatıldı');
}

main().catch(err => {
    console.error('💥 Beklenmedik hata:', err);
    process.exit(1);
});