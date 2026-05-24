// scripts/urlKesfetPuppeteer.js
// ═══════════════════════════════════════════════════════════════════════════
// PUPPETEER İLE URL KEŞFETME (SPA-aware scraping)
// ───────────────────────────────────────────────────────────────────────────
// mevzuat.gov.tr JavaScript ile içerik render ettiği için axios+cheerio
// PDF linklerini göremiyor. Bu script gerçek Chromium kullanarak sayfayı
// tam yükler, JS'yi çalıştırır, sonra PDF linklerini çıkarır.
//
// Bu BİR KEZ çalıştırılır → URL'ler config'e eklenir → sonra axios yeter.
//
// Kullanım: node scripts/urlKesfetPuppeteer.js
// ═══════════════════════════════════════════════════════════════════════════

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const mevzuatListesi = require('../config/mevzuatListesi');

async function tekMevzuatKesfet(browser, mevzuat, index, toplam) {
    console.log(`[${index}/${toplam}] ${mevzuat.ad.substring(0, 60)}${mevzuat.ad.length > 60 ? '...' : ''}`);
    console.log(`   🌐 ${mevzuat.htmlURL}`);

    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    );

    try {
        // Sayfaya git, network sakinleşene kadar bekle (JS render dahil)
        await page.goto(mevzuat.htmlURL, {
            waitUntil: 'networkidle2',
            timeout: 45000
        });

        // JS'in tam render etmesi için ek 2 saniye bekle
        await new Promise(r => setTimeout(r, 2000));

        // Render edilmiş DOM'dan tüm PDF linklerini çek
        const tumLinkler = await page.evaluate(() => {
            const linkler = Array.from(document.querySelectorAll('a'));
            return linkler
                .map(a => a.href)
                .filter(href => href && href.toLowerCase().includes('.pdf'));
        });

        // En uygun olanı seç: MevzuatMetin içeren > diğerleri
        const enIyiLink = tumLinkler.find(l => l.includes('MevzuatMetin'))
                       || tumLinkler.find(l => l.includes('mevzuat.gov.tr'))
                       || tumLinkler[0];

        if (enIyiLink) {
            console.log(`   ✅ Bulundu: ${enIyiLink}`);
            return { anahtar: mevzuat.anahtar, ad: mevzuat.ad, pdfURL: enIyiLink, basarili: true };
        } else {
            // Hala yok ise, sayfada iframe veya embed olabilir
            const iframeSrcs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('iframe, embed'))
                    .map(el => el.src || el.getAttribute('src'))
                    .filter(s => s && s.includes('.pdf'));
            });

            if (iframeSrcs.length > 0) {
                console.log(`   ✅ Bulundu (iframe): ${iframeSrcs[0]}`);
                return { anahtar: mevzuat.anahtar, ad: mevzuat.ad, pdfURL: iframeSrcs[0], basarili: true };
            }

            console.log(`   ⚠️  Hiçbir PDF linki bulunamadı`);
            console.log(`   💡 Sayfa belki erişim gerektiriyor veya PDF butonu farklı yapılmış`);
            return { anahtar: mevzuat.anahtar, ad: mevzuat.ad, pdfURL: null, basarili: false };
        }
    } catch (err) {
        console.log(`   ❌ Hata: ${err.message.substring(0, 100)}`);
        return { anahtar: mevzuat.anahtar, ad: mevzuat.ad, pdfURL: null, basarili: false, hata: err.message };
    } finally {
        await page.close();
    }
}

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 PUPPETEER İLE URL KEŞFETME');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📋 ${mevzuatListesi.length} mevzuat için Chromium ile tarama yapılacak`);
    console.log('⏳ Chromium başlatılıyor (ilk seferde 30 saniye sürebilir)...');
    console.log('');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--ignore-certificate-errors',
        ]
    });

    console.log('✅ Chromium hazır, taramalar başlıyor...\n');

    const sonuclar = [];

    for (let i = 0; i < mevzuatListesi.length; i++) {
        const sonuc = await tekMevzuatKesfet(browser, mevzuatListesi[i], i + 1, mevzuatListesi.length);
        sonuclar.push(sonuc);
        console.log('');

        // Sunucuyu yormamak için bekle
        if (i < mevzuatListesi.length - 1) {
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    await browser.close();

    // ─── ÖZET ─────────────────────────────────────────────────────────────
    const basarili = sonuclar.filter(s => s.basarili);
    const basarisiz = sonuclar.filter(s => !s.basarili);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 KEŞİF SONUÇLARI');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Bulunan:   ${basarili.length}/${sonuclar.length}`);
    console.log(`⚠️  Eksik:    ${basarisiz.length}/${sonuclar.length}`);
    console.log('');

    // JSON dosyasına kaydet
    const ciktiYolu = path.join(__dirname, '..', 'config', 'kesfedilen-urller.json');
    fs.writeFileSync(
        ciktiYolu,
        JSON.stringify(
            sonuclar.map(s => ({ anahtar: s.anahtar, ad: s.ad, pdfURL: s.pdfURL })),
            null,
            2
        ),
        'utf-8'
    );
    console.log(`💾 Tüm sonuçlar kaydedildi: ${ciktiYolu}`);
    console.log('');

    // ─── COPY-PASTE FORMAT ─────────────────────────────────────────────────
    if (basarili.length > 0) {
        console.log('📋 config/mevzuatListesi.js\'e yapıştırılacak pdfURL\'ler:');
        console.log('───────────────────────────────────────────────────────────');
        basarili.forEach(s => {
            console.log(`  ${s.anahtar}:`);
            console.log(`    pdfURL: '${s.pdfURL}',`);
        });
        console.log('');
    }

    if (basarisiz.length > 0) {
        console.log('⚠️  Bulunamayanlar (manuel olarak tarayıcıdan kontrol et):');
        console.log('───────────────────────────────────────────────────────────');
        basarisiz.forEach(s => {
            console.log(`  • ${s.anahtar}`);
        });
        console.log('');
    }

    console.log('💡 Sonraki adım: config/mevzuatListesi.js\'i güncelle, sonra:');
    console.log('   node scripts/mevzuatTopluTest.js');
}

main().catch(err => {
    console.error('💥 Beklenmedik hata:', err);
    process.exit(1);
});