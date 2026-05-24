// seed.js — İlk sistem yöneticisini oluşturur
// Kullanım: node seed.js
require('dotenv').config();
const mongoose  = require('mongoose');
const readline  = require('readline');
const Kullanici = require('./models/User');

// ─────────────────────────────────────────
// BURAYI DÜZENLE — İlk sistem yöneticisinin bilgileri
// ─────────────────────────────────────────
const ILK_YONETICI = {
    adSoyad: 'Hamza Ünlü',
    eposta:  'hamza.unlu@unluosgb.com',
    sifre:   '123456',          
    rol:     'sistem_yoneticisi',
    aktif:   true
};

// İsteğe bağlı: örnek diğer kullanıcılar (demo için)
const EK_KULLANICILAR = [
    // Açmak istersen yorum satırını kaldır
    // {
    //     adSoyad: 'Ayşe Demir',
    //     eposta:  'ayse.demir@unluosgb.com',
    //     sifre:   'Uzman123!',
    //     rol:     'isg_uzmani',
    //     aktif:   true
    // }
];

// ─────────────────────────────────────────
// Evet/Hayır sorusu
// ─────────────────────────────────────────
const sor = (soru) => new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(soru, cevap => { rl.close(); resolve(cevap.trim().toLowerCase()); });
});

// ─────────────────────────────────────────
// Ana seed fonksiyonu
// ─────────────────────────────────────────
async function seed() {
    try {
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/isg_veritabani';
        await mongoose.connect(mongoURI);
        console.log('✅ Veritabanına bağlanıldı:', mongoURI.split('@').pop());

        const tumKullanicilar = [ILK_YONETICI, ...EK_KULLANICILAR];

        for (const veri of tumKullanicilar) {
            const mevcut = await Kullanici.findOne({ eposta: veri.eposta });

            if (mevcut) {
                // Kullanıcı zaten var — üzerine yazmayı sor
                console.log(`\n⚠️  Bu e-posta zaten kayıtlı: ${veri.eposta} (rol: ${mevcut.rol})`);
                const cevap = await sor('   Kullanıcı üzerine yazılsın mı? (e/h): ');

                if (cevap === 'e' || cevap === 'evet' || cevap === 'y' || cevap === 'yes') {
                    await Kullanici.findByIdAndDelete(mevcut._id);
                    await Kullanici.create(veri);
                    console.log(`   ✏️  Üzerine yazıldı → ${veri.eposta}`);
                } else {
                    console.log(`   ⏭️  Atlandı → ${veri.eposta}`);
                }
            } else {
                await Kullanici.create(veri);
                console.log(`\n✅ Oluşturuldu:`);
                console.log(`   Ad Soyad : ${veri.adSoyad}`);
                console.log(`   E-posta  : ${veri.eposta}`);
                console.log(`   Rol      : ${veri.rol}`);
                console.log(`   Şifre    : ${veri.sifre}   ← İLK GİRİŞ İÇİN BU ŞİFREYİ KULLAN`);
            }
        }

        console.log('\n🏁 Seed işlemi tamamlandı.');
        console.log('👉 Sunucuyu başlatmak için: node server.js\n');

    } catch (hata) {
        console.error('❌ Seed hatası:', hata.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();