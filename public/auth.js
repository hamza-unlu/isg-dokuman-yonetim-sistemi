// public/js/auth.js
// Her sayfada ilk yüklenen script — token kontrolü, header doldurma, rol yönetimi

const AUTH = (() => {
    const ROL_ETIKETLERI = {
        sistem_yoneticisi: 'Sistem Yöneticisi',
        isg_uzmani:        'İş Güvenliği Uzmanı',
        isyeri_hekimi:     'İşyeri Hekimi',
        isveren:           'İşveren / Firma Yöneticisi',
    };

    const YAZMA_ROLLERI = ['sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi'];

    function tokenAl()     { return localStorage.getItem('isg_token'); }
    function kullaniciAl() {
        try { return JSON.parse(localStorage.getItem('isg_kullanici')) || null; }
        catch { return null; }
    }
    function rol()       { return kullaniciAl()?.rol || ''; }
    function isverenMi() { return rol() === 'isveren'; }
    function yetkiliMi() { return YAZMA_ROLLERI.includes(rol()); }

    function girisKaydet(token, kullanici) {
        localStorage.setItem('isg_token',     token);
        localStorage.setItem('isg_kullanici', JSON.stringify(kullanici));
    }

    function cikisYap() {
        // localStorage temizliği (token, kullanıcı bilgisi, vb.)
        localStorage.removeItem('isg_token');
        localStorage.removeItem('isg_kullanici');

        // localStorage'daki olası AI/cache kalıntıları
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('isg_ai_') || key.startsWith('ai_') || key.startsWith('isg_cache_')) {
                localStorage.removeItem(key);
            }
        });

        // sessionStorage temizliği — KVKK kritik
        // AI sohbet geçmişi sessionStorage'da, bunu mutlaka silmeli
        try {
            sessionStorage.clear(); // tüm session verisini temizle
        } catch (e) { /* bazı tarayıcılarda sınırlı */ }

        window.location.href = '/';
    }

    // Authorization header ve CACHE İPTALİ ile fetch yapar
    function apiFetch(url, secenekler = {}) {
        const token = tokenAl();
        return fetch(url, {
            ...secenekler,
            cache: 'no-store', // TARAYICI ÖNBELLEĞİNİ KESİNLİKLE İPTAL EDER
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                ...(secenekler.headers || {}),
                ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
            },
        });
    }

    // Header + hoşgeldin alanlarını doldurur
    function headerDoldur() {
        const k = kullaniciAl();
        if (!k) return;

        const isimEl       = document.getElementById('header-isim');
        const rolEl        = document.getElementById('header-rol');
        const avatarEl     = document.getElementById('header-avatar');
        const hosgeldinEl  = document.getElementById('hosgeldin-isim'); 

        const rolEtiketi = ROL_ETIKETLERI[k.rol] || k.rol || '';

        if (isimEl)      isimEl.textContent  = k.adSoyad || '';
        if (rolEl)       rolEl.textContent   = rolEtiketi;
        if (hosgeldinEl) hosgeldinEl.textContent = (k.adSoyad || '').split(' ')[0];

        if (avatarEl) {
            const parcalar = (k.adSoyad || '').split(' ').filter(Boolean);
            avatarEl.textContent = parcalar.map(p => p[0]).join('').substring(0, 2).toUpperCase();
        }
    }

    function isverenKisitlamalariUygula() {
        if (!isverenMi()) return;

        const gizlenecekIdler = [
            'yetkili-butonlar', 'islemler-baslik', 'ekle-butonu', 'kaydet-butonu',
            'firma-ekle-btn', 'personel-ekle-btn', 'egitim-ekle-btn', 'dokuman-ekle-btn',
        ];
        gizlenecekIdler.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        document.querySelectorAll(
            '.btn-ekle, .btn-sil, .btn-duzenle, .btn-kaydet-islem, ' +
            '[data-yetki="yazma"], .islem-buton-grubu'
        ).forEach(el => { el.style.display = 'none'; });

        // İŞVEREN İÇİN INPUT/SELECT/TEXTAREA DİSABLE
        // ÖNEMLİ: AI sohbet input'unu HARİÇ tut, çünkü işveren kendi firması hakkında soru sorabilmeli
        document.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.type === 'text' && el.id === 'personel-ara') return; 
            if (el.closest('.arama-grubu') || el.closest('.arama-kutusu')) return;
            // ⭐ AI sohbet alanları yetkiden bağımsız olarak çalışmaya devam etmeli
            if (el.id === 'ai-sohbet-girdi') return;
            if (el.closest('.ai-sohbet-girdi-alan')) return;
            if (el.closest('.ai-sohbet-pencere')) return;
            el.disabled = true;
            el.style.backgroundColor = '#f1f5f9';
            el.style.cursor = 'not-allowed';
        });

        if (!document.getElementById('isveren-uyari-bandi')) {
            const uyari = document.createElement('div');
            uyari.id = 'isveren-uyari-bandi';
            uyari.style.cssText = `
                background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;
                color:#92400e;font-size:13px;font-weight:500;
                padding:10px 20px;text-align:center;margin-bottom:8px;
            `;
            uyari.innerHTML = '⚠️ Salt Okuma Modu — Bu hesap yalnızca görüntüleme yetkisine sahiptir. Değişiklik yapılamaz.';

            const header = document.querySelector('header.ust-bar');
            if (header && header.parentNode) header.parentNode.insertBefore(uyari, header.nextSibling);
            else {
                const anaIcerik = document.querySelector('.ana-icerik');
                if (anaIcerik) anaIcerik.prepend(uyari);
                else document.body.insertBefore(uyari, document.body.firstChild);
            }
        }
    }

    function tokenKontrol() {
        const token = tokenAl();
        const sayfa = window.location.pathname;
        const girisYollari = ['/', ''];
        if (!token && !girisYollari.some(y => sayfa === y || sayfa.endsWith(y))) {
            window.location.href = '/';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        tokenKontrol();
        headerDoldur();
        isverenKisitlamalariUygula();

        document.querySelectorAll('a[href="index"], a[href="/index"], a[href="/"]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                cikisYap();
            });
        });
    });

    return { tokenAl, kullaniciAl, kullaniciBilgisi: kullaniciAl, girisKaydet, cikisYap, rol, isverenMi, yetkiliMi, apiFetch, headerDoldur };

})();
