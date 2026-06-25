
// MEVZUAT CACHE (Oturum İçi Önbellek)
// ───────────────────────────────────────────────────────────────────────────
// Sistem yöneticisinin veritabanında yönettiği mevzuat kurallarını
// frontend tarafında tutar. Böylece her hesaplamada API çağrısı yapılmaz.

// İlk kullanımda otomatik olarak backend'den veri çeker. Sonraki çağrılarda
// bellekten yanıt verir. Sayfa yenilendiğinde cache sıfırlanır → taze veri.
// ═══════════════════════════════════════════════════════════════════════════

const MevzuatCache = (function() {

    // ─── PRIVATE STATE ──────────────────────────────────────────────────
    let _kurallar = null;         // Backend'den çekilen kurallar (index'li)
    let _yukleniyor = null;       // Şu anda yükleniyor mu? (Promise)
    let _sonHata = null;          // Son yükleme hatası (debug için)

    // ─── KURALLARI BACKEND'DEN ÇEK (bir kereye mahsus) ──────────────────
    async function _backendenCek() {
        try {
            const res = await AUTH.apiFetch('/api/mevzuat');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const liste = data.veri || [];

            // Hızlı erişim için index yapısı oluştur
            // Anahtar: "Kural Adı|Tehlike Sınıfı"
            // Örnek:  "Temel İSG Eğitimi Periyodu|Az Tehlikeli" → {deger:3, birim:'yıl'}
            const index = {};
            liste.forEach(k => {
                const anahtar = `${k.kuralAdi}|${k.tehlikeSinifi}`;
                index[anahtar] = {
                    deger: k.deger,
                    birim: k.birim,
                    aciklama: k.aciklama,
                    _id: k._id,
                };
            });

            _kurallar = index;
            console.log(`✅ [MevzuatCache] ${liste.length} kural yüklendi`);
            return index;
        } catch (err) {
            _sonHata = err.message;
            console.warn(`⚠️  [MevzuatCache] Backend'den yüklenemedi: ${err.message}. Sabit değerlere düşülecek.`);
            _kurallar = {};  // Boş obje → hiçbir kural yok, caller sabit değerleri kullansın
            return {};
        } finally {
            _yukleniyor = null;
        }
    }

    // ─── CACHE'İ HAZIRLA (tekrar tekrar çağrılsa bile tek kere yükler) ──
    async function hazirla() {
        if (_kurallar !== null) return _kurallar;       // Zaten hazır
        if (_yukleniyor)        return _yukleniyor;     // Yükleme devam ediyor → aynı promise'ı paylaş

        _yukleniyor = _backendenCek();
        return _yukleniyor;
    }

    // ─── BELLEK İÇİ HIZLI OKUMA (senkron, dokumanlar.js fonksiyonları için) ──
    // Cache boşsa null döner → caller sabit değerlere geri döner.
    function kuralAl(kuralAdi, tehlikeSinifi) {
        if (!_kurallar) return null;   // Henüz yüklenmedi

        // Tehlike sınıfı normalize (küçük harf farkları vs.)
        const sinif = _normalizeSinif(tehlikeSinifi);
        const anahtar = `${kuralAdi}|${sinif}`;
        if (_kurallar[anahtar]) return _kurallar[anahtar];

        // "Tümü" olarak tanımlanmış kural var mı? (sınıftan bağımsız)
        const tumu = `${kuralAdi}|Tümü`;
        if (_kurallar[tumu]) return _kurallar[tumu];

        return null;
    }

    // ─── TEHLİKE SINIFI NORMALİZASYONU ──────────────────────────────────
    // Sistemde bazen 'çok tehlikeli', bazen 'Çok Tehlikeli' olarak geçiyor.
    // MongoDB'de kurallar "Az Tehlikeli" / "Tehlikeli" / "Çok Tehlikeli" /
    // "Tümü" olarak sabit şekilde duruyor — bu fonksiyon standartlaştırır.
    function _normalizeSinif(sinif) {
        if (!sinif) return '';
        const s = sinif.toString().toLowerCase().trim();
        if (s.includes('çok tehlikeli') || s.includes('cok tehlikeli')) return 'Çok Tehlikeli';
        if (s.includes('az tehlikeli')) return 'Az Tehlikeli';
        if (s.includes('tehlikeli')) return 'Tehlikeli';
        return sinif; // Eşleşme yoksa orijinal değeri döndür
    }

    // ─── CACHE'İ ELLE YENİLE (mevzuat sayfasından değişiklik sonrası) ──
    async function yenile() {
        _kurallar = null;
        _yukleniyor = null;
        return hazirla();
    }

    // ─── CACHE DURUMU (debug için) ─────────────────────────────────────
    function durum() {
        if (_yukleniyor) return 'yükleniyor';
        if (_kurallar === null) return 'hazır değil';
        if (Object.keys(_kurallar).length === 0) return `boş (hata: ${_sonHata || 'bilinmiyor'})`;
        return `hazır (${Object.keys(_kurallar).length} kural)`;
    }

    // ─── PUBLIC API ────────────────────────────────────────────────────
    return {
        hazirla,   // Sayfa açılışında bir kere çağrılır (async)
        kuralAl,   // Her fonksiyonda kullanılır (sync, hızlı)
        yenile,    // Değişiklik sonrası yenileme (async)
        durum,     // Konsolda cache durumunu görmek için
    };
})();

// ─── OTOMATİK BAŞLATMA ──────────────────────────────────────────────────
// Sayfa yüklendiğinde (DOMContentLoaded) arka planda cache'i doldurmaya başla
// Böylece kullanıcı ilk kuralı sorduğunda büyük ihtimalle hazır olur.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof AUTH !== 'undefined') MevzuatCache.hazirla();
    });
} else {
    if (typeof AUTH !== 'undefined') MevzuatCache.hazirla();
}

// Global scope'a aç
window.MevzuatCache = MevzuatCache;