// scripts/mevzuat-seed.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT KURALLARI SEED SCRIPTI
// ───────────────────────────────────────────────────────────────────────────
// dokumanlar.js içinde sabit kodlanmış olan İSG mevzuat kurallarını
// MongoDB'deki "mevzuats" koleksiyonuna aktarır.
//
// Kullanım:
//    node scripts/mevzuat-seed.js           (onaylayarak çalışır)
//    node scripts/mevzuat-seed.js --force   (onaysız üzerine yazar)
// ═══════════════════════════════════════════════════════════════════════════

require('dotenv').config();

const mongoose = require('mongoose');
const readline = require('readline');
const Mevzuat  = require('../models/Mevzuat');

// ─── Birim enumu için "saat" ekleyeceğiz ──────────────────────────────────
// NOT: models/Mevzuat.js dosyasındaki `birim` alanının enum listesine
//      'saat' eklenmiş olmalıdır. Bu script 'saat' birimini kullanır.

// ─── MEVCUT KURALLAR (dokumanlar.js'ten çıkarıldı) ────────────────────────
const KURALLAR = [
    // ════════════════════════════════════════════════════════════════════
    // EĞİTİM — PERİYOT
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'egitim_temel_isg_periyot_az_tehlikeli',
        grup:          'Eğitim',
        kuralAdi:      'Temel İSG Eğitimi Periyodu',
        tehlikeSinifi: 'Az Tehlikeli',
        deger:         3,
        birim:         'yıl',
        aciklama:      'Az tehlikeli işyerlerinde çalışanlara 3 yılda en az 1 kez temel İSG eğitimi verilir.',
        mevzuatKaynak: 'Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik',
    },
    {
        anahtar:       'egitim_temel_isg_periyot_tehlikeli',
        grup:          'Eğitim',
        kuralAdi:      'Temel İSG Eğitimi Periyodu',
        tehlikeSinifi: 'Tehlikeli',
        deger:         2,
        birim:         'yıl',
        aciklama:      'Tehlikeli işyerlerinde çalışanlara 2 yılda en az 1 kez temel İSG eğitimi verilir.',
        mevzuatKaynak: 'Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik',
    },
    {
        anahtar:       'egitim_temel_isg_periyot_cok_tehlikeli',
        grup:          'Eğitim',
        kuralAdi:      'Temel İSG Eğitimi Periyodu',
        tehlikeSinifi: 'Çok Tehlikeli',
        deger:         1,
        birim:         'yıl',
        aciklama:      'Çok tehlikeli işyerlerinde çalışanlara yılda en az 1 kez temel İSG eğitimi verilir.',
        mevzuatKaynak: 'Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik',
    },

    // ════════════════════════════════════════════════════════════════════
    // EĞİTİM — SÜRE (saat cinsinden)
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'egitim_temel_isg_sure_az_tehlikeli',
        grup:          'Eğitim',
        kuralAdi:      'Temel İSG Eğitimi Süresi',
        tehlikeSinifi: 'Az Tehlikeli',
        deger:         8,
        birim:         'saat',
        aciklama:      'Az tehlikeli işyerlerinde verilecek temel İSG eğitimi en az 8 saattir.',
        mevzuatKaynak: 'Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik, Ek-1',
    },
    {
        anahtar:       'egitim_temel_isg_sure_tehlikeli',
        grup:          'Eğitim',
        kuralAdi:      'Temel İSG Eğitimi Süresi',
        tehlikeSinifi: 'Tehlikeli',
        deger:         12,
        birim:         'saat',
        aciklama:      'Tehlikeli işyerlerinde verilecek temel İSG eğitimi en az 12 saattir.',
        mevzuatKaynak: 'Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik, Ek-1',
    },
    {
        anahtar:       'egitim_temel_isg_sure_cok_tehlikeli',
        grup:          'Eğitim',
        kuralAdi:      'Temel İSG Eğitimi Süresi',
        tehlikeSinifi: 'Çok Tehlikeli',
        deger:         16,
        birim:         'saat',
        aciklama:      'Çok tehlikeli işyerlerinde verilecek temel İSG eğitimi en az 16 saattir.',
        mevzuatKaynak: 'Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik, Ek-1',
    },

    // ════════════════════════════════════════════════════════════════════
    // EĞİTİM — İLKYARDIMCI
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'egitim_ilkyardim_yenileme',
        grup:          'Eğitim',
        kuralAdi:      'İlkyardımcı Eğitimi Yenileme',
        tehlikeSinifi: 'Tümü',
        deger:         3,
        birim:         'yıl',
        aciklama:      'İlkyardımcı sertifikası 3 yılda bir güncelleme eğitimi ile yenilenir.',
        mevzuatKaynak: 'İlkyardım Yönetmeliği',
    },

    // ════════════════════════════════════════════════════════════════════
    // SAĞLIK
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'muayene_periyodik_az_tehlikeli',
        grup:          'Sağlık',
        kuralAdi:      'Periyodik Sağlık Muayenesi',
        tehlikeSinifi: 'Az Tehlikeli',
        deger:         5,
        birim:         'yıl',
        aciklama:      'Az tehlikeli işlerde çalışanlar 5 yılda en az 1 kez sağlık muayenesinden geçirilir.',
        mevzuatKaynak: 'İşyeri Hekimi ve Diğer Sağlık Personelinin Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmelik',
    },
    {
        anahtar:       'muayene_periyodik_tehlikeli',
        grup:          'Sağlık',
        kuralAdi:      'Periyodik Sağlık Muayenesi',
        tehlikeSinifi: 'Tehlikeli',
        deger:         3,
        birim:         'yıl',
        aciklama:      'Tehlikeli işlerde çalışanlar 3 yılda en az 1 kez sağlık muayenesinden geçirilir.',
        mevzuatKaynak: 'İşyeri Hekimi ve Diğer Sağlık Personelinin Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmelik',
    },
    {
        anahtar:       'muayene_periyodik_cok_tehlikeli',
        grup:          'Sağlık',
        kuralAdi:      'Periyodik Sağlık Muayenesi',
        tehlikeSinifi: 'Çok Tehlikeli',
        deger:         1,
        birim:         'yıl',
        aciklama:      'Çok tehlikeli işlerde çalışanlar yılda en az 1 kez sağlık muayenesinden geçirilir.',
        mevzuatKaynak: 'İşyeri Hekimi ve Diğer Sağlık Personelinin Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmelik',
    },

    // ════════════════════════════════════════════════════════════════════
    // RİSK — RİSK DEĞERLENDİRMESİ
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'risk_rv_revizyon_az_tehlikeli',
        grup:          'Risk',
        kuralAdi:      'Risk Değerlendirmesi Revizyon',
        tehlikeSinifi: 'Az Tehlikeli',
        deger:         6,
        birim:         'yıl',
        aciklama:      'Az tehlikeli işyerlerinde risk değerlendirmesi 6 yılda bir yenilenir.',
        mevzuatKaynak: 'İş Sağlığı ve Güvenliği Risk Değerlendirmesi Yönetmeliği',
    },
    {
        anahtar:       'risk_rv_revizyon_tehlikeli',
        grup:          'Risk',
        kuralAdi:      'Risk Değerlendirmesi Revizyon',
        tehlikeSinifi: 'Tehlikeli',
        deger:         4,
        birim:         'yıl',
        aciklama:      'Tehlikeli işyerlerinde risk değerlendirmesi 4 yılda bir yenilenir.',
        mevzuatKaynak: 'İş Sağlığı ve Güvenliği Risk Değerlendirmesi Yönetmeliği',
    },
    {
        anahtar:       'risk_rv_revizyon_cok_tehlikeli',
        grup:          'Risk',
        kuralAdi:      'Risk Değerlendirmesi Revizyon',
        tehlikeSinifi: 'Çok Tehlikeli',
        deger:         2,
        birim:         'yıl',
        aciklama:      'Çok tehlikeli işyerlerinde risk değerlendirmesi 2 yılda bir yenilenir.',
        mevzuatKaynak: 'İş Sağlığı ve Güvenliği Risk Değerlendirmesi Yönetmeliği',
    },

    // ════════════════════════════════════════════════════════════════════
    // RİSK — ACİL DURUM PLANI
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'risk_adp_revizyon_az_tehlikeli',
        grup:          'Risk',
        kuralAdi:      'Acil Durum Planı Revizyon',
        tehlikeSinifi: 'Az Tehlikeli',
        deger:         6,
        birim:         'yıl',
        aciklama:      'Az tehlikeli işyerlerinde acil durum planı 6 yılda bir yenilenir.',
        mevzuatKaynak: 'İşyerlerinde Acil Durumlar Hakkında Yönetmelik',
    },
    {
        anahtar:       'risk_adp_revizyon_tehlikeli',
        grup:          'Risk',
        kuralAdi:      'Acil Durum Planı Revizyon',
        tehlikeSinifi: 'Tehlikeli',
        deger:         4,
        birim:         'yıl',
        aciklama:      'Tehlikeli işyerlerinde acil durum planı 4 yılda bir yenilenir.',
        mevzuatKaynak: 'İşyerlerinde Acil Durumlar Hakkında Yönetmelik',
    },
    {
        anahtar:       'risk_adp_revizyon_cok_tehlikeli',
        grup:          'Risk',
        kuralAdi:      'Acil Durum Planı Revizyon',
        tehlikeSinifi: 'Çok Tehlikeli',
        deger:         2,
        birim:         'yıl',
        aciklama:      'Çok tehlikeli işyerlerinde acil durum planı 2 yılda bir yenilenir.',
        mevzuatKaynak: 'İşyerlerinde Acil Durumlar Hakkında Yönetmelik',
    },

    // ════════════════════════════════════════════════════════════════════
    // RİSK — ORTAM ÖLÇÜMÜ
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'risk_ortam_olcumu_gecerlilik',
        grup:          'Risk',
        kuralAdi:      'Ortam Ölçümü Geçerlilik',
        tehlikeSinifi: 'Tümü',
        deger:         1,
        birim:         'yıl',
        aciklama:      'Ortam ölçüm raporları 1 yıl süreyle geçerlidir.',
        mevzuatKaynak: 'İş Hijyeni Ölçüm, Test ve Analizi Yapan Laboratuvarlar Hakkında Yönetmelik',
    },

    // ════════════════════════════════════════════════════════════════════
    // TATBİKAT
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'tatbikat_acil_durum',
        grup:          'Tatbikat',
        kuralAdi:      'Acil Durum Tatbikatı',
        tehlikeSinifi: 'Tümü',
        deger:         1,
        birim:         'yıl',
        aciklama:      'Acil durum planında yer alan bilgiler doğrultusunda yılda en az 1 kez tatbikat yapılır.',
        mevzuatKaynak: 'İşyerlerinde Acil Durumlar Hakkında Yönetmelik, madde 13',
    },

    // ════════════════════════════════════════════════════════════════════
    // DİĞER — İLKYARDIMCI ORANLARI
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'diger_ilkyardimci_orani_az_tehlikeli',
        grup:          'Diğer',
        kuralAdi:      'İlkyardımcı Oranı',
        tehlikeSinifi: 'Az Tehlikeli',
        deger:         20,
        birim:         'oran',
        aciklama:      'Az tehlikeli işyerlerinde her 20 çalışana 1 ilkyardımcı bulundurulur.',
        mevzuatKaynak: 'İlkyardım Yönetmeliği, madde 19',
    },
    {
        anahtar:       'diger_ilkyardimci_orani_tehlikeli',
        grup:          'Diğer',
        kuralAdi:      'İlkyardımcı Oranı',
        tehlikeSinifi: 'Tehlikeli',
        deger:         15,
        birim:         'oran',
        aciklama:      'Tehlikeli işyerlerinde her 15 çalışana 1 ilkyardımcı bulundurulur.',
        mevzuatKaynak: 'İlkyardım Yönetmeliği, madde 19',
    },
    {
        anahtar:       'diger_ilkyardimci_orani_cok_tehlikeli',
        grup:          'Diğer',
        kuralAdi:      'İlkyardımcı Oranı',
        tehlikeSinifi: 'Çok Tehlikeli',
        deger:         10,
        birim:         'oran',
        aciklama:      'Çok tehlikeli işyerlerinde her 10 çalışana 1 ilkyardımcı bulundurulur.',
        mevzuatKaynak: 'İlkyardım Yönetmeliği, madde 19',
    },

    // ════════════════════════════════════════════════════════════════════
    // DİĞER — KURUL TOPLANTI SIKLIĞI
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:       'diger_kurul_toplanti_az_tehlikeli',
        grup:          'Diğer',
        kuralAdi:      'İSG Kurulu Toplantı Sıklığı',
        tehlikeSinifi: 'Az Tehlikeli',
        deger:         3,
        birim:         'ay',
        aciklama:      'Az tehlikeli işyerlerindeki İSG kurulu 3 ayda en az 1 kez toplanır.',
        mevzuatKaynak: 'İş Sağlığı ve Güvenliği Kurulları Hakkında Yönetmelik',
    },
    {
        anahtar:       'diger_kurul_toplanti_tehlikeli',
        grup:          'Diğer',
        kuralAdi:      'İSG Kurulu Toplantı Sıklığı',
        tehlikeSinifi: 'Tehlikeli',
        deger:         2,
        birim:         'ay',
        aciklama:      'Tehlikeli işyerlerindeki İSG kurulu 2 ayda en az 1 kez toplanır.',
        mevzuatKaynak: 'İş Sağlığı ve Güvenliği Kurulları Hakkında Yönetmelik',
    },
    {
        anahtar:       'diger_kurul_toplanti_cok_tehlikeli',
        grup:          'Diğer',
        kuralAdi:      'İSG Kurulu Toplantı Sıklığı',
        tehlikeSinifi: 'Çok Tehlikeli',
        deger:         1,
        birim:         'ay',
        aciklama:      'Çok tehlikeli işyerlerindeki İSG kurulu her ay en az 1 kez toplanır.',
        mevzuatKaynak: 'İş Sağlığı ve Güvenliği Kurulları Hakkında Yönetmelik',
    },
];

// ─── Onay sor ────────────────────────────────────────────────────────────
function soruSor(soru) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
        rl.question(soru, cevap => { rl.close(); resolve(cevap.trim().toLowerCase()); });
    });
}

// ─── Ana fonksiyon ────────────────────────────────────────────────────────
async function main() {
    const force = process.argv.includes('--force');

    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB bağlantısı kuruldu\n');

        console.log(`📊 Aktarılacak kural sayısı: ${KURALLAR.length}\n`);

        // Gruba göre özet yazdır
        const grupSayilari = {};
        KURALLAR.forEach(k => { grupSayilari[k.grup] = (grupSayilari[k.grup] || 0) + 1; });
        console.log('📂 Dağılım:');
        Object.entries(grupSayilari).forEach(([g, s]) => console.log(`   • ${g.padEnd(10)} : ${s} kural`));
        console.log();

        // Mevcut kayıtları kontrol et
        const mevcut = await Mevzuat.countDocuments();
        if (mevcut > 0) {
            console.log(`⚠️  Koleksiyonda zaten ${mevcut} kayıt var.`);
            if (!force) {
                const cevap = await soruSor('   Mevcut kayıtları silip yeniden eklemek ister misiniz? (evet/hayır): ');
                if (!['evet', 'e', 'yes', 'y'].includes(cevap)) {
                    console.log('❌ İşlem iptal edildi.');
                    await mongoose.connection.close();
                    process.exit(0);
                }
            }
            await Mevzuat.deleteMany({});
            console.log(`🗑️  ${mevcut} eski kayıt silindi.\n`);
        }

        // Toplu ekleme
        console.log('⏳ Kurallar MongoDB\'ye aktarılıyor...');
        const sonuc = await Mevzuat.insertMany(KURALLAR, { ordered: false });
        console.log(`\n✅ Başarılı: ${sonuc.length} kural MongoDB'ye eklendi\n`);

        // Detaylı özet
        console.log('📋 Oluşturulan kurallar:');
        const gruplar = {};
        sonuc.forEach(k => {
            if (!gruplar[k.grup]) gruplar[k.grup] = [];
            gruplar[k.grup].push(k);
        });
        Object.entries(gruplar).forEach(([grup, kurallar]) => {
            console.log(`\n   [${grup.toUpperCase()}]`);
            kurallar.forEach(k => {
                console.log(`     • ${k.kuralAdi.padEnd(34)} | ${k.tehlikeSinifi.padEnd(14)} | ${k.deger} ${k.birim}`);
            });
        });

        await mongoose.connection.close();
        console.log('\n🏁 Seed işlemi tamamlandı.');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ Hata:', err.message);
        if (err.errors) {
            Object.values(err.errors).forEach(e => console.error(`   • ${e.message}`));
        }
        await mongoose.connection.close().catch(() => {});
        process.exit(1);
    }
}

main();