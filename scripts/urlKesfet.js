// scripts/urlKesfet.js
// ═══════════════════════════════════════════════════════════════════════════
// URL KEŞFETME YARDIMCISI
// ───────────────────────────────────────────────────────────────────────────
// Her mevzuatın HTML sayfasına gidip içindeki gerçek PDF link'ini bulur.
// Konsola yazdırır, böylece config/mevzuatListesi.js'i güncelleyebilirsin.
//
// Kullanım: node scripts/urlKesfet.js
//
// Çıktı örneği:
//   ✅ isg_kanunu_6331
//      HTML:  https://...mevzuat?MevzuatNo=6331&...
//      PDF:   https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6331.pdf
//      Durum: pdfURL config'te var, doğrulandı
//
//   🔍 egitim_yonetmeligi
//      HTML:  https://...mevzuat?MevzuatNo=15710&...
//      PDF:   https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.15710.pdf
//      Durum: pdfURL config'te yok, KEŞFEDİLDİ — config'e ekle
// ═══════════════════════════════════════════════════════════════════════════

const mevzuatListesi = require('../config/mevzuatListesi');
const MevzuatScraper = require('../services/mevzuatScraper');

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔍 MEVZUAT URL KEŞFETME ARACI');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📋 ${mevzuatListesi.length} mevzuat için PDF URL'leri aranıyor...`);
    console.log('');

    const scraper = new MevzuatScraper();
    const sonuclar = [];

    for (let i = 0; i < mevzuatListesi.length; i++) {
        const mevzuat = mevzuatListesi[i];
        console.log(`[${i + 1}/${mevzuatListesi.length}] ${mevzuat.ad.substring(0, 60)}${mevzuat.ad.length > 60 ? '...' : ''}`);

        try {
            // HTML sayfayı tarayıp PDF linki bul
            const kesfedilenPdfURL = await scraper.pdfLinkKesfet(mevzuat);

            if (kesfedilenPdfURL) {
                const durum = mevzuat.pdfURL
                    ? (mevzuat.pdfURL === kesfedilenPdfURL ? '✓ Mevcut URL doğru' : '⚠️ Mevcut URL ile keşfedilen FARKLI')
                    : '🔍 Keşfedildi, config\'e ekle';

                console.log(`   ✅ ${kesfedilenPdfURL}`);
                console.log(`   📌 ${durum}`);
                sonuclar.push({ anahtar: mevzuat.anahtar, kesfedilenPdfURL, durum, basarili: true });
            } else {
                console.log(`   ⚠️ HTML sayfada PDF linki bulunamadı`);
                console.log(`   💡 Pattern tahmini denenecek (Katman 3)`);
                sonuclar.push({ anahtar: mevzuat.anahtar, kesfedilenPdfURL: null, basarili: false });
            }
        } catch (err) {
            console.log(`   ❌ Hata: ${err.message}`);
            sonuclar.push({ anahtar: mevzuat.anahtar, kesfedilenPdfURL: null, hata: err.message, basarili: false });
        }

        console.log('');

        // Sunucuya yük bindirmemek için 1.5 saniye bekle
        if (i < mevzuatListesi.length - 1) {
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    // ─── ÖZET ──────────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 KEŞİF ÖZETİ');
    console.log('═══════════════════════════════════════════════════════════');
    const basarili = sonuclar.filter(s => s.basarili).length;
    const basarisiz = sonuclar.length - basarili;
    console.log(`✅ PDF linki bulunan:  ${basarili}/${sonuclar.length}`);
    console.log(`⚠️ Bulunamayan:       ${basarisiz}/${sonuclar.length}`);
    console.log('');

    if (basarili > 0) {
        console.log('💾 config/mevzuatListesi.js güncelleme önerisi:');
        console.log('───────────────────────────────────────────────────────────');
        sonuclar.filter(s => s.basarili && s.kesfedilenPdfURL).forEach(s => {
            console.log(`  ${s.anahtar.padEnd(40)} → pdfURL: '${s.kesfedilenPdfURL}'`);
        });
        console.log('');
    }

    if (basarisiz > 0) {
        console.log('⚠️ Şu mevzuatların URL\'leri bulunamadı (Katman 3 deneyecek):');
        sonuclar.filter(s => !s.basarili).forEach(s => {
            console.log(`  • ${s.anahtar}${s.hata ? ` (${s.hata})` : ''}`);
        });
        console.log('');
    }

    console.log('💡 Sonraki adım: node scripts/mevzuatTopluTest.js');
}

main().catch(err => {
    console.error('💥 Beklenmedik hata:', err);
    process.exit(1);
});