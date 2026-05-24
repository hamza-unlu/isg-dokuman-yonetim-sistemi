// services/mevzuatScheduler.js
// ═══════════════════════════════════════════════════════════════════════════
// MEVZUAT CRON SCHEDULER (Dinamik versiyon)
// ───────────────────────────────────────────────────────────────────────────
// Cron periyodu artık MongoDB'deki SistemAyari koleksiyonundan okunur.
// Admin frontend'den değiştirdiğinde sistem RESTART gerektirmeden anlık
// olarak yeni periyota geçer (hot-reload).
//
// Akış:
//   1. Sistem başlar → Default cron ile başla (anında)
//   2. Arka planda DB'den ayarı oku → varsa yenile
//   3. Admin frontend'den değiştirirse → yenidenBaslat() çağrılır
// ═══════════════════════════════════════════════════════════════════════════

const cron = require('node-cron');
const takipServisi = require('./mevzuatTakipServisi');

// Lazy require — circular dependency'leri önlemek için
let SistemAyari = null;
function _modelAl() {
    if (!SistemAyari) SistemAyari = require('../models/SistemAyari');
    return SistemAyari;
}

class MevzuatScheduler {
    constructor() {
        this.aktifGorev = null;
        // Default cron — DB'de ayar yoksa kullanılır
        this.varsayilanCron     = '0 3 * * 1';
        this.varsayilanAciklama = 'Her Pazartesi sabah 03:00';

        this.cronIfadesi  = process.env.MEVZUAT_CRON || this.varsayilanCron;
        this.cronAciklama = this._cronAciklama(this.cronIfadesi);
        this.zamanDilimi  = process.env.TZ || 'Europe/Istanbul';

        this.calistirilmaTarihi = null;
        this.sonSonuc = null;
    }

    // ─── Sistem başlangıcında çağrılır ─────────────────────────────────────
    baslat() {
        // 1. Default veya .env değeriyle hemen başla (non-blocking)
        this._cronKur();

        // 2. Arka planda DB'den oku, varsa yeni değerle yenile
        // setTimeout ile MongoDB connection'ın hazır olmasını bekle (1.5 sn)
        setTimeout(() => {
            this._dbDenAyariOkuVeYenile().catch(err => {
                console.warn('⚠️ Scheduler ayarı DB\'den okunamadı:', err.message);
            });
        }, 1500);

        return true;
    }

    // ─── DB'den ayar oku, gerekirse yenile ─────────────────────────────────
    async _dbDenAyariOkuVeYenile() {
        const Model = _modelAl();
        const ayar = await Model.findOne({ anahtar: 'mevzuat_cron' }).lean();

        if (!ayar || !ayar.deger || !ayar.deger.cronIfadesi) {
            console.log('ℹ️  Scheduler: DB\'de özel ayar yok, default kullanılıyor.');
            return;
        }

        const yeniCron      = ayar.deger.cronIfadesi;
        const yeniAciklama  = ayar.deger.okunabilir || this._cronAciklama(yeniCron);

        if (yeniCron !== this.cronIfadesi) {
            this.cronIfadesi  = yeniCron;
            this.cronAciklama = yeniAciklama;
            this._cronKur();
            console.log(`🔄 Scheduler ayarı DB'den yüklendi: ${yeniAciklama}`);
        }
    }

    // ─── Cron görevini kur (veya yeniden kur) ──────────────────────────────
    _cronKur() {
        if (!cron.validate(this.cronIfadesi)) {
            console.error(`❌ Geçersiz cron ifadesi: ${this.cronIfadesi}`);
            // Default'a fallback
            this.cronIfadesi  = this.varsayilanCron;
            this.cronAciklama = this.varsayilanAciklama;
        }

        // Önceki görev varsa durdur (hot-reload için)
        if (this.aktifGorev) {
            this.aktifGorev.stop();
        }

        this.aktifGorev = cron.schedule(
            this.cronIfadesi,
            () => this._otomatikTara(),
            { scheduled: true, timezone: this.zamanDilimi }
        );

        console.log('═══════════════════════════════════════════════');
        console.log('📅 Mevzuat Scheduler aktif');
        console.log(`   ⏰ Plan:        ${this.cronIfadesi}`);
        console.log(`   🌍 Zaman dilimi: ${this.zamanDilimi}`);
        console.log(`   ℹ️  Açıklama:    ${this.cronAciklama}`);
        console.log('═══════════════════════════════════════════════');

        return true;
    }

    // ─── ADMIN FRONTEND'DEN ÇAĞRILIR ───────────────────────────────────────
    // Yeni cron ifadesiyle scheduler'ı anlık olarak yeniden başlatır
    async yenidenBaslat(cronIfadesi, okunabilir, kullaniciId = null) {
        if (!cron.validate(cronIfadesi)) {
            return {
                basarili: false,
                hata: `Geçersiz cron ifadesi: ${cronIfadesi}`
            };
        }

        const oncekiAyar = {
            cronIfadesi:  this.cronIfadesi,
            cronAciklama: this.cronAciklama,
        };

        // Hafızadaki değerleri güncelle
        this.cronIfadesi  = cronIfadesi;
        this.cronAciklama = okunabilir || this._cronAciklama(cronIfadesi);

        // Cron görevini yenile
        this._cronKur();

        // DB'ye kaydet (kalıcı olsun)
        try {
            const Model = _modelAl();
            await Model.ayarKaydet('mevzuat_cron', {
                tip: 'cron',
                cronIfadesi,
                okunabilir: this.cronAciklama,
            }, {
                aciklama: 'Mevzuat otomatik tarama periyodu',
                kategori: 'mevzuat',
                kullaniciId,
            });
        } catch (err) {
            console.warn('⚠️ Scheduler ayarı DB\'ye yazılamadı:', err.message);
        }

        return {
            basarili: true,
            mesaj: 'Scheduler yeniden başlatıldı, yeni periyot aktif.',
            oncekiAyar,
            yeniAyar: {
                cronIfadesi: this.cronIfadesi,
                cronAciklama: this.cronAciklama,
            },
        };
    }

    // ─── Zamanlanmış tarama tetikleyicisi ─────────────────────────────────
    async _otomatikTara() {
        console.log(`\n⏰ [Otomatik Tarama] Cron tetiklendi: ${new Date().toLocaleString('tr-TR')}`);
        try {
            this.calistirilmaTarihi = new Date();
            this.sonSonuc = await takipServisi.tumMevzuatlariTara();

            if (this.sonSonuc.ozet.degisti > 0) {
                console.log(`🔔 ${this.sonSonuc.ozet.degisti} mevzuatta değişiklik tespit edildi! Admin onayı bekleniyor.`);
            }
        } catch (err) {
            console.error('❌ Otomatik tarama hatası:', err.message);
        }
    }

    // ─── Manuel tetikleme (admin "Şimdi Tara" butonu için) ────────────────
    async manuelTara() {
        console.log(`\n🖱️ [Manuel Tarama] Admin tarafından tetiklendi: ${new Date().toLocaleString('tr-TR')}`);
        this.calistirilmaTarihi = new Date();
        this.sonSonuc = await takipServisi.tumMevzuatlariTara();
        return this.sonSonuc;
    }

    // ─── Scheduler'ı durdur ────────────────────────────────────────────────
    durdur() {
        if (this.aktifGorev) {
            this.aktifGorev.stop();
            this.aktifGorev = null;
            console.log('🛑 Mevzuat Scheduler durduruldu');
        }
    }

    // ─── Anlık durum (admin UI için) ───────────────────────────────────────
    durum() {
        return {
            aktif: !!this.aktifGorev,
            cronIfadesi: this.cronIfadesi,
            cronAciklama: this.cronAciklama,
            zamanDilimi: this.zamanDilimi,
            sonCalismaTarihi: this.calistirilmaTarihi,
            sonSonuc: this.sonSonuc ? this.sonSonuc.ozet : null,
        };
    }

    // ─── Yardımcı: Cron ifadesini insan diline çevir ──────────────────────
    _cronAciklama(ifade) {
        const aciklamalar = {
            '0 3 * * 1':   'Her Pazartesi sabah 03:00',
            '0 3 * * *':   'Her gün sabah 03:00',
            '0 0 * * 0':   'Her Pazar gece yarısı',
            '*/5 * * * *': 'Her 5 dakikada bir (TEST)',
            '*/2 * * * *': 'Her 2 dakikada bir (TEST)',
            '0 */6 * * *': 'Her 6 saatte bir',
            '0 0 1 * *':   'Her ayın 1\'i gece yarısı',
        };
        return aciklamalar[ifade] || `Özel: ${ifade}`;
    }
}

module.exports = new MevzuatScheduler();