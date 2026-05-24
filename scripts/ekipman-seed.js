
// İş ekipmanları için 5 adet standart periyot kuralını MongoDB'ye ekler.
// Mevcut diğer kurallara DOKUNMAZ — sadece 5 yeni kural ekler.


require('dotenv').config();

const mongoose = require('mongoose');
const Mevzuat  = require('../models/Mevzuat');

// ─── EKLENECEK KURALLAR ──────────────────────────────────────────────────
const YENI_KURALLAR = [
    {
        anahtar:       'ekipman_periyodik_kontrol_6ay',
        grup:          'Diğer',
        kuralAdi:      'Ekipman Periyodik Kontrol (6 Aylık)',
        tehlikeSinifi: 'Tümü',
        deger:         6,
        birim:         'ay',
        aciklama:      'Bazı iş ekipmanları (basınçlı kaplar, kaldırma araçları vb.) 6 ayda bir periyodik kontrole tabidir.',
        mevzuatKaynak: 'İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği, Ek-III',
    },
    {
        anahtar:       'ekipman_periyodik_kontrol_1yil',
        grup:          'Diğer',
        kuralAdi:      'Ekipman Periyodik Kontrol (Yıllık)',
        tehlikeSinifi: 'Tümü',
        deger:         1,
        birim:         'yıl',
        aciklama:      'Çoğu iş ekipmanı (yangın söndürücü, vinç, forklift, asansör vb.) yılda bir periyodik kontrole tabidir.',
        mevzuatKaynak: 'İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği, Ek-III',
    },
    {
        anahtar:       'ekipman_periyodik_kontrol_3yil',
        grup:          'Diğer',
        kuralAdi:      'Ekipman Periyodik Kontrol (3 Yıllık)',
        tehlikeSinifi: 'Tümü',
        deger:         3,
        birim:         'yıl',
        aciklama:      'Bazı iş ekipmanları 3 yılda bir periyodik kontrole tabidir.',
        mevzuatKaynak: 'İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği, Ek-III',
    },
    {
        anahtar:       'ekipman_periyodik_kontrol_5yil',
        grup:          'Diğer',
        kuralAdi:      'Ekipman Periyodik Kontrol (5 Yıllık)',
        tehlikeSinifi: 'Tümü',
        deger:         5,
        birim:         'yıl',
        aciklama:      'Topraklama tesisatı ve bazı özel ekipmanlar 5 yılda bir periyodik kontrole tabidir.',
        mevzuatKaynak: 'Elektrik Tesislerinde Topraklamalar Yönetmeliği',
    },
    {
        anahtar:       'ekipman_periyodik_kontrol_10yil',
        grup:          'Diğer',
        kuralAdi:      'Ekipman Periyodik Kontrol (10 Yıllık)',
        tehlikeSinifi: 'Tümü',
        deger:         10,
        birim:         'yıl',
        aciklama:      'Paratoner ve bazı yapısal ekipmanlar 10 yılda bir periyodik kontrole tabidir.',
        mevzuatKaynak: 'İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği, Ek-III',
    },
];

// ─── ANA FONKSİYON ───────────────────────────────────────────────────────
async function main() {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB bağlantısı kuruldu\n');

        const oncekiSayi = await Mevzuat.countDocuments();
        console.log(`📊 Mevcut kural sayısı: ${oncekiSayi}`);
        console.log(`➕ Eklenecek kural sayısı: ${YENI_KURALLAR.length}\n`);

        let eklenen  = 0;
        let atlanan  = 0;

        for (const kural of YENI_KURALLAR) {
            try {
                // insertOne kullanıyoruz — eğer anahtar zaten varsa hata alır, atlarız
                await Mevzuat.create(kural);
                console.log(`   ✅ Eklendi: ${kural.kuralAdi} (${kural.deger} ${kural.birim})`);
                eklenen++;
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`   ⏭️  Atlandı: ${kural.kuralAdi} (zaten kayıtlı)`);
                    atlanan++;
                } else {
                    throw err;
                }
            }
        }

        const sonSayi = await Mevzuat.countDocuments();
        console.log(`\n📈 Özet:`);
        console.log(`   • Yeni eklenen : ${eklenen}`);
        console.log(`   • Atlanan      : ${atlanan}`);
        console.log(`   • Toplam kural : ${sonSayi} (önce: ${oncekiSayi})`);

        await mongoose.connection.close();
        console.log('\n🏁 Seed işlemi tamamlandı.');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Hata:', err.message);
        await mongoose.connection.close().catch(() => {});
        process.exit(1);
    }
}

main();