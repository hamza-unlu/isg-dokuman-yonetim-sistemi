// scripts/mevzuat-yukle.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MevzuatParca = require('../models/MevzuatParca');

// ─── AYARLAR ─────────────────────────────────────
const TXT_YOLU  = path.join(__dirname, '..', 'mevzuat', '6331.txt');
const KANUN_ADI = '6331 Sayılı İş Sağlığı ve Güvenliği Kanunu';
const KANUN_NO  = '6331';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';


// ─── TXT'yi oku ──────────────────────────────────
function metniAl(yol) {
    console.log(`📄 TXT okunuyor: ${yol}`);
    const metin = fs.readFileSync(yol, 'utf-8');
    console.log(`✅ ${metin.length} karakter okundu.`);
    return metin;
}

// ─── Maddeleri parçala ───────────────────────────
function maddeleriParcala(tamMetin) {
    console.log('🔍 Maddeler ayıklanıyor...');

    const maddeRegex = /(?:^|\n)\s*((?:GEÇİCİ\s+|EK\s+)?MADDE\s+\d+(?:\/[A-ZÇŞĞÜÖİa-zçğışöü])?)\s*[–\-—\u2013\u2014]/gi;

    const eslesmeler = [];
    let match;
    while ((match = maddeRegex.exec(tamMetin)) !== null) {
        eslesmeler.push({
            maddeNo: match[1].trim().toUpperCase(),
            baslangic: match.index,
            metinBaslangic: match.index + match[0].length,
        });
    }

    const maddeler = [];
    for (let i = 0; i < eslesmeler.length; i++) {
        const baslangic = eslesmeler[i].metinBaslangic;
        const bitis = i + 1 < eslesmeler.length ? eslesmeler[i + 1].baslangic : tamMetin.length;

        let icerik = tamMetin.substring(baslangic, bitis).trim();
        icerik = icerik.replace(/\n\d+\s*\n/g, '\n');
        icerik = icerik.replace(/\s+/g, ' ').trim();

        if (icerik.length < 50) continue;

        maddeler.push({ maddeNo: eslesmeler[i].maddeNo, metin: icerik });
    }

    console.log(`✅ ${maddeler.length} madde ayıklandı.`);
    return maddeler;
}

// ─── MADDE 3'ü tanım tanım parçala ───────────────
// MADDE 3 "Tanımlar" maddesidir, 16+ alt tanım içerir.
// Her tanımın ayrı embedding alması için onu küçük parçalara böleriz.
// Böylece "meslek hastalığı nedir?" sorusu DOĞRUDAN o spesifik tanıma denk gelir.
function tanimlariParcala(maddeler) {
    const sonuc = [];

    for (const m of maddeler) {
        // Sadece MADDE 3'ü parçala (Tanımlar maddesi)
        if (m.maddeNo !== 'MADDE 3') {
            sonuc.push(m);
            continue;
        }

        // Tanım regex: "a) Bakanlık:", "b) Çalışan:", "ş) Diğer sağlık personeli:"
        // Türkçe karakter dahil tek harf, sonra ")", sonra başlık, sonra ":"
        const tanimRegex = /([a-zçğıöşüi])\)\s+([^:]+?):\s+/gi;

        const eslesmeler = [];
        let match;
        while ((match = tanimRegex.exec(m.metin)) !== null) {
            eslesmeler.push({
                harf: match[1],
                baslik: match[2].trim(),
                baslangic: match.index,
                metinBaslangic: match.index + match[0].length,
            });
        }

        if (eslesmeler.length === 0) {
            // Parçalama başarısız → orijinal maddeyi koru
            console.log(`  ⚠️  MADDE 3 parçalanamadı, orijinal halde tutuluyor.`);
            sonuc.push(m);
            continue;
        }

        // Her tanım için ayrı kayıt oluştur
        for (let i = 0; i < eslesmeler.length; i++) {
            const baslangic = eslesmeler[i].metinBaslangic;
            const bitis = i + 1 < eslesmeler.length
                ? eslesmeler[i + 1].baslangic
                : m.metin.length;

            let icerik = m.metin.substring(baslangic, bitis).trim();
            // Sonundaki "," veya ";" temizle
            icerik = icerik.replace(/[,;]\s*$/, '').trim();

            if (icerik.length < 20) continue;

            // Tanımı başlıkla birlikte kaydet (embedding daha doğru olsun diye)
            const tamMetin = `${eslesmeler[i].baslik}: ${icerik}`;

            sonuc.push({
                maddeNo: `MADDE 3 - ${eslesmeler[i].baslik}`,
                metin: tamMetin,
            });
        }

        console.log(`  ✂️  MADDE 3 → ${eslesmeler.length} tanıma bölündü`);
    }

    return sonuc;
}

// ─── Embedding üret (HuggingFace) ────────────────
async function embeddingUret(parca) {
    const girdi = `${parca.maddeNo} ${parca.metin}`.trim();
    const response = await fetch(
        'https://router.huggingface.co/hf-inference/models/sentence-transformers/paraphrase-multilingual-mpnet-base-v2/pipeline/feature-extraction',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: girdi })
        }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return Array.isArray(data[0]) ? data[0] : data;
}

function bekle(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── ANA AKIŞ ────────────────────────────────────
async function main() {
    try {
        console.log('🔌 MongoDB bağlantısı kuruluyor...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB bağlandı.');

        const eskiSayi = await MevzuatParca.countDocuments({ kanunNo: KANUN_NO });
        if (eskiSayi > 0) {
            console.log(`⚠️  ${eskiSayi} eski kayıt siliniyor...`);
            await MevzuatParca.deleteMany({ kanunNo: KANUN_NO });
            console.log('✅ Eski kayıtlar silindi.');
        }

        const tamMetin = metniAl(TXT_YOLU);
        const maddeler = maddeleriParcala(tamMetin);

        if (maddeler.length === 0) {
            console.error('❌ Hiç madde bulunamadı! TXT formatını kontrol et.');
            console.log('\nİlk 500 karakter:\n', tamMetin.substring(0, 500));
            process.exit(1);
        }

        // ⭐ YENİ: MADDE 3'ü tanımlara böl
        const finalMaddeler = tanimlariParcala(maddeler);
        console.log(`✅ Final: ${finalMaddeler.length} parça (MADDE 3 ayrılmış olarak)\n`);

        console.log('📝 İlk 5 parça önizleme:');
        finalMaddeler.slice(0, 5).forEach((m, i) => {
            console.log(`\n${i + 1}. ${m.maddeNo}`);
            console.log(`   ${m.metin.substring(0, 120)}...`);
        });

        console.log(`\n🧠 ${finalMaddeler.length} parça için embedding üretiliyor...`);
        let basarili = 0, hata = 0;

        for (let i = 0; i < finalMaddeler.length; i++) {
            const m = finalMaddeler[i];
            try {
                const embedding = await embeddingUret(m);
                await MevzuatParca.create({
                    kanunAdi: KANUN_ADI,
                    kanunNo:  KANUN_NO,
                    maddeNo:  m.maddeNo,
                    metin:    m.metin,
                    embedding,
                });
                basarili++;
                process.stdout.write(`\r  İlerleme: ${i + 1}/${finalMaddeler.length} (✅ ${basarili}, ❌ ${hata})`);
                await bekle(100);
            } catch (err) {
                hata++;
                console.error(`\n  ❌ ${m.maddeNo} hata: ${err.message}`);
            }
        }

        console.log(`\n\n🎉 Tamamlandı! ${basarili} parça başarılı, ${hata} hata.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('\n💥 Kritik hata:', err);
        process.exit(1);
    }
}

main();