// scripts/configGuncelle.js
// ═══════════════════════════════════════════════════════════════════════════
// CONFIG OTOMATİK GÜNCELLEME ARACI
// ───────────────────────────────────────────────────────────────────────────
// MongoDB'deki en güncel başarılı indirme kayıtlarından (MevzuatVersiyon)
// gerçek PDF URL'lerini alıp config/mevzuatListesi.js'in pdfURL alanlarına
// kalıcı olarak yazar.
//
// Sonuç: Sonraki çalıştırmalarda Katman 1 (direkt PDF) tüm yönetmelikler için
// kullanılır → çok daha hızlı + sağlam.
//
// Kullanım: node scripts/configGuncelle.js
// ═══════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MevzuatVersiyon = require('../models/MevzuatVersiyon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';
const CONFIG_YOLU = path.join(__dirname, '..', 'config', 'mevzuatListesi.js');

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔧 CONFIG OTOMATİK GÜNCELLEME');
    console.log('═══════════════════════════════════════════════════════════');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlandı\n');

    // 1. Her mevzuatın en son başarılı kaydını çek
    const sonKayitlar = await MevzuatVersiyon.aggregate([
        { $sort: { olusturmaTarihi: -1 } },
        {
            $group: {
                _id: '$anahtar',
                kaynakURL: { $first: '$kaynakURL' },
                hash: { $first: '$hash' },
                ad: { $first: '$ad' },
            }
        }
    ]);

    console.log(`📊 MongoDB'de ${sonKayitlar.length} farklı mevzuatın URL bilgisi bulundu\n`);

    // 2. Config dosyasını oku
    let configIcerik = fs.readFileSync(CONFIG_YOLU, 'utf-8');
    let guncellenenSayisi = 0;

    // 3. Her kayıt için config'i güncelle
    for (const kayit of sonKayitlar) {
        const anahtar = kayit._id;
        const yeniPdfURL = kayit.kaynakURL;

        if (!yeniPdfURL) {
            console.log(`⚠️ ${anahtar}: URL bilgisi yok, atlandı`);
            continue;
        }

        // Regex ile bu mevzuatın bloğunu bul ve pdfURL alanını güncelle
        // Pattern: anahtar: 'XYZ' içeren bloktaki pdfURL satırını yakalar
        const blokRegex = new RegExp(
            `(anahtar:\\s*'${anahtar}'[\\s\\S]*?pdfURL:\\s*)(null|'[^']*')`,
            'g'
        );

        if (blokRegex.test(configIcerik)) {
            configIcerik = configIcerik.replace(
                blokRegex,
                `$1'${yeniPdfURL}'`
            );
            console.log(`✅ ${anahtar.padEnd(40)} → ${yeniPdfURL.substring(0, 60)}...`);
            guncellenenSayisi++;
        } else {
            console.log(`⚠️ ${anahtar}: config'te bulunamadı`);
        }
    }

    // 4. Güncellenmiş config'i yaz (önce yedek al)
    const yedekYolu = CONFIG_YOLU + '.yedek-' + Date.now();
    fs.copyFileSync(CONFIG_YOLU, yedekYolu);
    fs.writeFileSync(CONFIG_YOLU, configIcerik, 'utf-8');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ ${guncellenenSayisi} mevzuatın pdfURL'si config'e yazıldı`);
    console.log(`💾 Yedek dosya: ${yedekYolu}`);
    console.log('═══════════════════════════════════════════════════════════');

    await mongoose.disconnect();
    console.log('');
    console.log('💡 Sonraki adım: node scripts/mevzuatTopluTest.js');
    console.log('   (Artık çoğu Katman 1\'den hızlıca indirilecek)');
}

main().catch(err => {
    console.error('💥 Hata:', err);
    process.exit(1);
});