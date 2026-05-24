// scripts/nace-seed.js
// ─────────────────────────────────────────────────────────────────────────────
// NACE kodlarını public/nace-kodlari.js dosyasından okuyup
// MongoDB'deki "naces" koleksiyonuna aktaran tek seferlik script.
//
// Kullanım:
//    node scripts/nace-seed.js
//
// Notlar:
// - Zaten veri varsa onay ister (yanlışlıkla üstüne yazılmasın diye)
// - "--force" argümanı ile mevcut verileri silip yeniden ekler:
//      node scripts/nace-seed.js --force
// ─────────────────────────────────────────────────────────────────────────────
require('dotenv').config();

const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

const Nace = require('../models/Nace');

// ─── Yardımcı: Onay sor ───────────────────────────────────────────────────────
function soruSor(soru) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
        rl.question(soru, cevap => { rl.close(); resolve(cevap.trim().toLowerCase()); });
    });
}

// ─── Ana Fonksiyon ────────────────────────────────────────────────────────────
async function main() {
    const force = process.argv.includes('--force');

    try {
        // 1. MongoDB bağlantısı
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB bağlantısı kuruldu\n');

        // 2. NACE kodları dosyasını oku
        const dosyaYolu = path.join(__dirname, '..', 'public', 'nace-kodlari.js');
        if (!fs.existsSync(dosyaYolu)) {
            throw new Error(`Dosya bulunamadı: ${dosyaYolu}`);
        }

        const icerik = fs.readFileSync(dosyaYolu, 'utf8');
        console.log(`📄 Dosya okundu: public/nace-kodlari.js (${(icerik.length / 1024).toFixed(1)} KB)`);

        // 3. JavaScript içindeki diziyi çıkar
        // "const naceListesi = [...]" formatındaki veriyi bir fonksiyon gövdesi gibi
        // çalıştırıp değişkenin değerini döndürüyoruz
        let kodlar;
        try {
            kodlar = new Function(icerik + '; return naceListesi;')();
        } catch (e) {
            throw new Error('naceListesi dizisi okunamadı: ' + e.message);
        }

        if (!Array.isArray(kodlar) || kodlar.length === 0) {
            throw new Error('naceListesi dizisi boş veya dizi formatında değil');
        }
        console.log(`📊 ${kodlar.length} NACE kodu bulundu\n`);

        // 4. Veri doğrulaması (ilk kaydı göster)
        console.log('🔍 Örnek kayıt:');
        console.log('   ', JSON.stringify(kodlar[0], null, 2).replace(/\n/g, '\n    '));
        console.log();

        // 5. Mevcut kayıtları kontrol et
        const mevcut = await Nace.countDocuments();
        if (mevcut > 0) {
            console.log(`⚠️  Koleksiyonda zaten ${mevcut} kayıt var.`);

            if (!force) {
                const cevap = await soruSor('   Mevcut kayıtları silip yeniden eklemek ister misiniz? (evet/hayır): ');
                if (cevap !== 'evet' && cevap !== 'e' && cevap !== 'yes' && cevap !== 'y') {
                    console.log('❌ İşlem iptal edildi.');
                    await mongoose.connection.close();
                    process.exit(0);
                }
            }

            await Nace.deleteMany({});
            console.log(`🗑️  ${mevcut} eski kayıt silindi.\n`);
        }

        // 6. Toplu ekleme
        console.log('⏳ Veriler MongoDB\'ye aktarılıyor...');
        const sonuc = await Nace.insertMany(kodlar, {
            ordered: false,      // bir kayıtta hata olsa bile diğerlerini eklemeye devam et
            rawResult: false,
        });

        console.log(`\n✅ Başarılı: ${sonuc.length} NACE kodu MongoDB'ye eklendi`);

        // 7. Özet istatistikler
        const [azTehlikeli, tehlikeli, cokTehlikeli] = await Promise.all([
            Nace.countDocuments({ sinif: 'Az Tehlikeli' }),
            Nace.countDocuments({ sinif: 'Tehlikeli' }),
            Nace.countDocuments({ sinif: 'Çok Tehlikeli' }),
        ]);

        console.log('\n📈 Dağılım:');
        console.log(`   • Az Tehlikeli  : ${azTehlikeli}`);
        console.log(`   • Tehlikeli     : ${tehlikeli}`);
        console.log(`   • Çok Tehlikeli : ${cokTehlikeli}`);
        console.log(`   • TOPLAM        : ${sonuc.length}`);

        await mongoose.connection.close();
        console.log('\n🏁 Seed işlemi tamamlandı.');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Hata:', err.message);
        if (err.writeErrors) {
            console.error(`   ${err.writeErrors.length} kayıt eklenemedi (muhtemelen duplicate).`);
        }
        await mongoose.connection.close().catch(() => {});
        process.exit(1);
    }
}

main();