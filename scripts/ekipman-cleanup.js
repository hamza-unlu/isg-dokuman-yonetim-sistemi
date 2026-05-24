// scripts/ekipman-cleanup.js
// ═══════════════════════════════════════════════════════════════════════════
// EKİPMAN PERİYOT KURALLARINI SİLME SCRIPTI
// ───────────────────────────────────────────────────────────────────────────
// ekipman-seed.js ile eklediğimiz 5 kuralı MongoDB'den siler.
//
// Mantık: Dropdown sabit seçenekler içerdiği için, mevzuat yönetimi üzerinden
// yönetilmelerine gerek kalmamıştır. Veri temizliği yapılır.
//
// Silinen kuralların geçmiş kayıtları (eğer varsa) da temizlenir.
//
// Kullanım:
//    node scripts/ekipman-cleanup.js           (onaylayarak çalışır)
//    node scripts/ekipman-cleanup.js --force   (onaysız siler)
// ═══════════════════════════════════════════════════════════════════════════

require('dotenv').config();

const mongoose       = require('mongoose');
const readline       = require('readline');
const Mevzuat        = require('../models/Mevzuat');
const MevzuatGecmisi = require('../models/MevzuatGecmisi');

const SILINECEK_ANAHTARLAR = [
    'ekipman_periyodik_kontrol_6ay',
    'ekipman_periyodik_kontrol_1yil',
    'ekipman_periyodik_kontrol_3yil',
    'ekipman_periyodik_kontrol_5yil',
    'ekipman_periyodik_kontrol_10yil',
];

function soruSor(soru) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
        rl.question(soru, cevap => { rl.close(); resolve(cevap.trim().toLowerCase()); });
    });
}

async function main() {
    const force = process.argv.includes('--force');

    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB bağlantısı kuruldu\n');

        // Önce var olan kuralları bul (silmeden önce kullanıcıya göster)
        const bulunanKurallar = await Mevzuat.find({
            anahtar: { $in: SILINECEK_ANAHTARLAR },
        }).lean();

        if (bulunanKurallar.length === 0) {
            console.log('ℹ️  Silinecek ekipman kuralı bulunamadı. Muhtemelen zaten silinmişler.');
            await mongoose.connection.close();
            process.exit(0);
        }

        console.log(`📋 Silinecek kurallar (${bulunanKurallar.length} adet):`);
        bulunanKurallar.forEach(k => {
            console.log(`   • ${k.kuralAdi.padEnd(40)} (${k.deger} ${k.birim})`);
        });

        // İlişkili geçmiş kayıt sayısı
        const kuralIdleri = bulunanKurallar.map(k => k._id);
        const gecmisSayi  = await MevzuatGecmisi.countDocuments({ mevzuat: { $in: kuralIdleri } });
        console.log(`\n📜 İlişkili geçmiş kayıt sayısı: ${gecmisSayi}\n`);

        if (!force) {
            const cevap = await soruSor('Bu kuralları (ve geçmiş kayıtlarını) silmek istediğinize emin misiniz? (evet/hayır): ');
            if (!['evet', 'e', 'yes', 'y'].includes(cevap)) {
                console.log('❌ İşlem iptal edildi.');
                await mongoose.connection.close();
                process.exit(0);
            }
        }

        // Geçmişi sil
        const gecmisSonuc = await MevzuatGecmisi.deleteMany({ mevzuat: { $in: kuralIdleri } });
        console.log(`🗑️  ${gecmisSonuc.deletedCount} geçmiş kayıt silindi`);

        // Kuralları sil
        const kuralSonuc = await Mevzuat.deleteMany({ anahtar: { $in: SILINECEK_ANAHTARLAR } });
        console.log(`🗑️  ${kuralSonuc.deletedCount} mevzuat kuralı silindi`);

        const kalan = await Mevzuat.countDocuments();
        console.log(`\n📊 Kalan toplam kural sayısı: ${kalan}`);

        await mongoose.connection.close();
        console.log('\n🏁 Temizlik tamamlandı.');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Hata:', err.message);
        await mongoose.connection.close().catch(() => {});
        process.exit(1);
    }
}

main();