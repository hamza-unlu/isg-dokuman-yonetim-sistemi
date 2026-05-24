// services/mevzuatTakipServisi.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT TAKİP SERVİSİ (Text-hash tabanlı mükerrer koruması)
// ───────────────────────────────────────────────────────────────────────────
// Hem cron job (otomatik), hem de admin "Şimdi Tara" butonu (manuel) için
// kullanılan ana servis. Mevzuat listesini MongoDB'deki TakipliMevzuat
// koleksiyonundan okur.
//
// ⭐ Mükerrer önleme stratejisi:
//   Binary hash (PDF dosyasının ham hash'i) PDF metadata değişikliklerinden
//   etkilenir. Bu sebeple aynı içerik, farklı binary hash verebilir.
//   Bu sorunu çözmek için TEXT-HASH kullanılır — PDF'ten çıkarılan saf
//   text'in hash'i.
//
//   Kontroller:
//   1) Yeni text-hash herhangi bir kayıtla eşleşiyor mu?
//      - "onay-bekliyor" ile eşleşti → mükerrer-onlenmis (kayıt açma)
//      - "reddedildi" ile eşleşti     → reddedilmis-versiyon (atla)
//      - "onaylandi/yeni" ile eşleşti → degisiklik-yok
//   2) Eşleşmiyorsa GERÇEKTEN YENİ → yeni kayıt oluştur
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');

const TakipliMevzuat  = require('../models/TakipliMevzuat');
const MevzuatVersiyon = require('../models/MevzuatVersiyon');
const MevzuatScraper  = require('./mevzuatScraper');

class MevzuatTakipServisi {
    constructor(secenekler = {}) {
        this.scraper = new MevzuatScraper();
        this.bekleSuresi = secenekler.bekleSuresi || 2000;
        this.islemDevamEdiyor = false;
        this.log = secenekler.log || console.log;
    }

    // ─── Tek bir mevzuatı tara ─────────────────────────────────────────────
    async mevzuatTara(takipliMevzuat) {
        try {
            // 1. DB'de bu mevzuatın TÜM versiyonlarını al (mükerrer kontrolü için)
            const tumVersiyonlar = await MevzuatVersiyon
                .find({ anahtar: takipliMevzuat.anahtar })
                .sort({ olusturmaTarihi: -1 });

            // En son versiyon (durum ne olursa olsun)
            const sonVersiyon = tumVersiyonlar.length > 0 ? tumVersiyonlar[0] : null;

            // 2. Hibrit scraper ile indir (text de çıkarılır)
            const scraperGirdisi = {
                anahtar:    takipliMevzuat.anahtar,
                pdfURL:     takipliMevzuat.pdfURL,
                htmlURL:    takipliMevzuat.htmlURL,
                mevzuatNo:  takipliMevzuat.mevzuatNo,
                tur:        takipliMevzuat.tur,
                tertip:     takipliMevzuat.tertip,
            };
            const sonuc = await this.scraper.indir(scraperGirdisi);

            // 3. Sayaçları güncelle
            takipliMevzuat.toplamTaramaSayisi += 1;
            takipliMevzuat.basariliTaramaSayisi += 1;
            takipliMevzuat.takipDurumu = 'aktif';
            takipliMevzuat.sonTaramaTarihi = new Date();
            takipliMevzuat.sonHash = sonuc.hash;
            takipliMevzuat.sonHataMesaji = '';

            // ⭐ 4. MÜKERRER KONTROLÜ — TEXT-HASH bazlı
            // PDF'in saf text içeriğinin hash'i ile karşılaştırılır
            // Bu, PDF metadata değişikliklerinden etkilenmez
               const yeniMetinHash = sonuc.metinHash;

                    if (yeniMetinHash) {
                        const ayniMetinliVersiyon = tumVersiyonlar.find(v =>
                        v.metinHash && v.metinHash === yeniMetinHash
                    );
                
                if (ayniMetinliVersiyon) {
                    // İçerik aslında değişmemiş — yeni kayıt açma
                    try { fs.unlinkSync(sonuc.dosyaYolu); } catch {}
                    await takipliMevzuat.save();

                    // Eşleşen kayıt onay bekliyor mu?
                    if (ayniMetinliVersiyon.durum === 'onay-bekliyor') {
                        return {
                            durum: 'mukerrer-onlenmis',
                            anahtar: takipliMevzuat.anahtar,
                            ad: takipliMevzuat.ad,
                            metinHash: yeniMetinHash,
                            mesaj: 'Aynı içerik zaten onay bekliyor',
                        };
                    }

                    // Reddedilmiş mi?
                    if (ayniMetinliVersiyon.durum === 'reddedildi') {
                        return {
                            durum: 'reddedilmis-versiyon',
                            anahtar: takipliMevzuat.anahtar,
                            ad: takipliMevzuat.ad,
                            metinHash: yeniMetinHash,
                            mesaj: 'Bu içerik daha önce reddedildi',
                        };
                    }

                    // Onaylı veya yeni — değişiklik yok demektir
                    return {
                        durum: 'degisiklik-yok',
                        anahtar: takipliMevzuat.anahtar,
                        ad: takipliMevzuat.ad,
                        metinHash: yeniMetinHash,
                    };
                }
            } else {
                // metinHash hesaplanamadıysa (PDF text çıkarma başarısız)
                // → eski yöntem: binary hash karşılaştır
                if (sonVersiyon && sonVersiyon.hash === sonuc.hash) {
                    try { fs.unlinkSync(sonuc.dosyaYolu); } catch {}
                    await takipliMevzuat.save();
                    return {
                        durum: 'degisiklik-yok',
                        anahtar: takipliMevzuat.anahtar,
                        ad: takipliMevzuat.ad,
                        hash: sonuc.hash,
                    };
                }
            }

            // 5. GERÇEKTEN YENİ — versiyon kaydı oluştur
            const yeniKayit = await MevzuatVersiyon.create({
                anahtar:        takipliMevzuat.anahtar,
                ad:             takipliMevzuat.ad,
                kategori:       takipliMevzuat.kategori,
                hash:           sonuc.hash,
                metinHash:      sonuc.metinHash || null,
                metinIcerik:    sonuc.metinIcerik || '',
                boyutByte:      sonuc.boyutByte,
                dosyaYolu:      sonuc.dosyaYolu,
                kaynakURL:      sonuc.kaynakURL,
                birOncekiHash:  sonVersiyon ? sonVersiyon.hash : null,
                durum:          sonVersiyon ? 'onay-bekliyor' : 'yeni',
                indirmeSuresi:  sonuc.indirmeSuresi,
            });

            await takipliMevzuat.save();

            return {
                durum: sonVersiyon ? 'degisti' : 'yeni',
                anahtar: takipliMevzuat.anahtar,
                ad: takipliMevzuat.ad,
                yontem: sonuc.yontem,
                hash: sonuc.hash,
                metinHash: sonuc.metinHash,
                eskiHash: sonVersiyon ? sonVersiyon.hash : null,
                kayit: yeniKayit,
            };

        } catch (err) {
            takipliMevzuat.toplamTaramaSayisi += 1;
            takipliMevzuat.takipDurumu = 'url-hatasi';
            takipliMevzuat.sonHataMesaji = err.message.substring(0, 500);
            takipliMevzuat.sonTaramaTarihi = new Date();
            try { await takipliMevzuat.save(); } catch {}

            return {
                durum: 'hata',
                anahtar: takipliMevzuat.anahtar,
                ad: takipliMevzuat.ad,
                hata: err.message,
            };
        }
    }

    // ─── Tüm aktif mevzuatları sırayla tara ───────────────────────────────
    async tumMevzuatlariTara(opts = {}) {
        if (this.islemDevamEdiyor) {
            return {
                basarili: false,
                mesaj: 'Önceki tarama hala devam ediyor, lütfen bekleyin.'
            };
        }

        this.islemDevamEdiyor = true;
        const baslangic = Date.now();

        const takipliMevzuatlar = await TakipliMevzuat.find({
            aktif: true,
            $or: [
                { pdfURL: { $nin: [null, ''] } },
                { htmlURL: { $nin: [null, ''] } },
            ],
        });

        this.log('═══════════════════════════════════════════════');
        this.log(`🚀 Mevzuat taraması başladı (${new Date().toLocaleString('tr-TR')})`);
        this.log(`📋 ${takipliMevzuatlar.length} aktif mevzuat kontrol edilecek`);
        this.log('═══════════════════════════════════════════════');

        const sonuclar = [];
        const ozet = {
            toplam: takipliMevzuatlar.length,
            yeni: 0,
            degisti: 0,
            degisiklikYok: 0,
            mukerrerOnlenmis: 0,
            hata: 0,
            degisikliklerListesi: [],
            hatalarListesi: [],
        };

        for (let i = 0; i < takipliMevzuatlar.length; i++) {
            const mevzuat = takipliMevzuatlar[i];
            const sonuc = await this.mevzuatTara(mevzuat);
            sonuclar.push(sonuc);

            switch (sonuc.durum) {
                case 'yeni':
                    ozet.yeni++;
                    this.log(`  ✅ [${i+1}/${takipliMevzuatlar.length}] YENİ: ${mevzuat.ad.substring(0, 50)}...`);
                    break;
                case 'degisti':
                    ozet.degisti++;
                    ozet.degisikliklerListesi.push(sonuc);
                    this.log(`  🔔 [${i+1}/${takipliMevzuatlar.length}] DEĞİŞTİ: ${mevzuat.ad.substring(0, 50)}...`);
                    break;
                case 'degisiklik-yok':
                    ozet.degisiklikYok++;
                    this.log(`  ✓  [${i+1}/${takipliMevzuatlar.length}] Değişmemiş: ${mevzuat.ad.substring(0, 50)}...`);
                    break;
                case 'mukerrer-onlenmis':
                    ozet.mukerrerOnlenmis++;
                    this.log(`  ⏭️  [${i+1}/${takipliMevzuatlar.length}] Mükerrer önlendi: ${mevzuat.ad.substring(0, 50)}... (aynı içerik zaten bekliyor)`);
                    break;
                case 'reddedilmis-versiyon':
                    ozet.mukerrerOnlenmis++;
                    this.log(`  ⏭️  [${i+1}/${takipliMevzuatlar.length}] Reddedilmiş içerik: ${mevzuat.ad.substring(0, 50)}...`);
                    break;
                case 'hata':
                    ozet.hata++;
                    ozet.hatalarListesi.push(sonuc);
                    this.log(`  ❌ [${i+1}/${takipliMevzuatlar.length}] HATA: ${mevzuat.ad.substring(0, 50)}... → ${sonuc.hata}`);
                    break;
            }

            if (i < takipliMevzuatlar.length - 1) {
                await new Promise(r => setTimeout(r, this.bekleSuresi));
            }
        }

        const sureMs = Date.now() - baslangic;

        this.log('═══════════════════════════════════════════════');
        this.log(`✅ Tarama tamamlandı (${(sureMs / 1000).toFixed(1)} saniye)`);
        this.log(`   Yeni: ${ozet.yeni} | Değişti: ${ozet.degisti} | Değişmemiş: ${ozet.degisiklikYok} | Mükerrer önlenen: ${ozet.mukerrerOnlenmis} | Hata: ${ozet.hata}`);
        this.log('═══════════════════════════════════════════════');

        this.islemDevamEdiyor = false;

        return {
            basarili: true,
            baslangicTarihi: new Date(baslangic),
            bitisTarihi: new Date(),
            sureMs,
            ozet,
            sonuclar,
        };
    }

    // ─── Tek bir mevzuatı manuel tara ─────────────────────────────────────
    async tekMevzuatTara(anahtar) {
        const mevzuat = await TakipliMevzuat.findOne({ anahtar });
        if (!mevzuat) {
            return { basarili: false, hata: 'Mevzuat bulunamadı' };
        }
        if (!mevzuat.aktif) {
            return { basarili: false, hata: 'Mevzuat pasif durumda, önce aktifleştirin' };
        }
        const sonuc = await this.mevzuatTara(mevzuat);
        return { basarili: sonuc.durum !== 'hata', sonuc };
    }

    // ─── Anlık durum (UI için) ─────────────────────────────────────────────
    async durumOzeti() {
        const toplamTakipli = await TakipliMevzuat.countDocuments({});
        const aktifSayi     = await TakipliMevzuat.countDocuments({ takipDurumu: 'aktif' });
        const hataliSayi    = await TakipliMevzuat.countDocuments({ takipDurumu: 'url-hatasi' });
        const hazirSayi     = await TakipliMevzuat.countDocuments({ takipDurumu: 'hazır' });
        const pasifSayi     = await TakipliMevzuat.countDocuments({ aktif: false });

        const toplamVersiyon = await MevzuatVersiyon.countDocuments({});
        const onayBekleyen   = await MevzuatVersiyon.countDocuments({ durum: 'onay-bekliyor' });

        const sonTarama = await MevzuatVersiyon.findOne({}).sort({ olusturmaTarihi: -1 });

        return {
            takipEdilenMevzuat: toplamTakipli,
            aktifSayi,
            hataliSayi,
            hazirSayi,
            pasifSayi,
            kayitliVersiyon: toplamVersiyon,
            onayBekleyenDegisiklik: onayBekleyen,
            sonTaramaTarihi: sonTarama ? sonTarama.olusturmaTarihi : null,
            islemDevamEdiyor: this.islemDevamEdiyor,
        };
    }
}

module.exports = new MevzuatTakipServisi();