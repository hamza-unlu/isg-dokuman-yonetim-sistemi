// public/profil.js
// Profil modalı — tüm sayfalarda ortak kullanılır
// Bağımlılık: auth.js (AUTH nesnesi global)

const PROFIL = (() => {

    let secilenFotoDosya = null;

    // ═══════════════════════════════════════════
    // BAŞLATMA — DOMContentLoaded'da avatar'a tıklama bağla
    // ═══════════════════════════════════════════
    function baslat() {
        const avatar = document.getElementById('header-avatar');
        if (avatar) {
            avatar.style.cursor = 'pointer';
            avatar.title = 'Profil Bilgilerim';
            avatar.addEventListener('click', profilModalAc);
        }

        // Header'daki avatar'a profil fotoğrafı varsa onu yerleştir
        headerAvatariGuncelle();

        // Modal varsa sekme bar dinleyicileri
        document.querySelectorAll('.profil-sekme-btn').forEach(btn => {
            btn.addEventListener('click', () => sekmeDegistir(btn.dataset.sekme));
        });

        // Drag & drop
        const dropAlani = document.getElementById('profil-foto-drop-alani');
        if (dropAlani) {
            ['dragover', 'dragenter'].forEach(olay => {
                dropAlani.addEventListener(olay, (e) => {
                    e.preventDefault();
                    dropAlani.classList.add('profil-drag-aktif');
                });
            });
            ['dragleave', 'drop'].forEach(olay => {
                dropAlani.addEventListener(olay, (e) => {
                    e.preventDefault();
                    dropAlani.classList.remove('profil-drag-aktif');
                });
            });
            dropAlani.addEventListener('drop', (e) => {
                const dosyalar = e.dataTransfer?.files;
                if (dosyalar && dosyalar.length > 0) {
                    const input = document.getElementById('profil-foto-input');
                    input.files = dosyalar;
                    profilFotoSecildi(input);
                }
            });
        }

        // Modal dışına tıklama ile kapat
        const modal = document.getElementById('profil-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) profilModalKapat();
            });
        }

        // ESC ile kapat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('acik')) {
                profilModalKapat();
            }
        });
    }

    // ═══════════════════════════════════════════
    // HEADER AVATAR GÜNCELLEME
    // ═══════════════════════════════════════════
    function headerAvatariGuncelle() {
        const avatar = document.getElementById('header-avatar');
        if (!avatar) return;

        const k = AUTH.kullaniciAl();
        if (!k) return;

        if (k.profilFoto) {
            // Fotoğraf varsa resim göster
            avatar.innerHTML = `<img src="${k.profilFoto}?t=${Date.now()}" alt="Profil">`;
            avatar.classList.add('profil-var');
        } else {
            // Yoksa baş harfleri göster
            const parcalar = (k.adSoyad || '').split(' ').filter(Boolean);
            avatar.textContent = parcalar.map(p => p[0]).join('').substring(0, 2).toUpperCase();
            avatar.classList.remove('profil-var');
        }
    }

    // ═══════════════════════════════════════════
    // MODAL AÇ / KAPAT
    // ═══════════════════════════════════════════
    function profilModalAc() {
        const modal = document.getElementById('profil-modal');
        if (!modal) return;

        // Modal içindeki verileri yenile
        modalVerileriYenile();
        // Formları temizle
        formlariTemizle();
        // Foto sekmesini aktif et
        sekmeDegistir('foto');
        // Aç
        modal.classList.add('acik');
    }

    function profilModalKapat() {
        const modal = document.getElementById('profil-modal');
        if (modal) modal.classList.remove('acik');
        secilenFotoDosya = null;
    }

    function sekmeDegistir(sekmeAdi) {
        document.querySelectorAll('.profil-sekme-btn').forEach(btn => {
            btn.classList.toggle('aktif', btn.dataset.sekme === sekmeAdi);
        });
        document.querySelectorAll('.profil-sekme-panel').forEach(panel => {
            panel.classList.toggle('aktif', panel.dataset.panel === sekmeAdi);
        });
    }

    function modalVerileriYenile() {
        const k = AUTH.kullaniciAl();
        if (!k) return;

        const ROL_ETIKETLERI = {
            sistem_yoneticisi: 'Sistem Yöneticisi',
            isg_uzmani:        'İş Güvenliği Uzmanı',
            isyeri_hekimi:     'İşyeri Hekimi',
            isveren:           'İşveren / Firma Yöneticisi',
            izleyici:          'İzleyici'
        };

        const cerceve = document.getElementById('profil-foto-cerceve');
        const isimEl  = document.getElementById('profil-foto-isim');
        const rolEl   = document.getElementById('profil-foto-rol');

        if (isimEl) isimEl.textContent = k.adSoyad || '';
        if (rolEl)  rolEl.textContent  = ROL_ETIKETLERI[k.rol] || k.rol || '';

        if (cerceve) {
            if (k.profilFoto) {
                cerceve.innerHTML = `<img src="${k.profilFoto}?t=${Date.now()}" alt="Profil">`;
            } else {
                const parcalar = (k.adSoyad || '').split(' ').filter(Boolean);
                const basHarfler = parcalar.map(p => p[0]).join('').substring(0, 2).toUpperCase();
                cerceve.innerHTML = `<span class="profil-bas-harf">${basHarfler}</span>`;
            }
        }

        // "Fotoğrafı Kaldır" butonu sadece foto varsa görünsün
        const silBtn = document.getElementById('btn-profil-foto-sil');
        if (silBtn) silBtn.style.display = k.profilFoto ? 'inline-flex' : 'none';
    }

    function formlariTemizle() {
        ['profil-mevcut-sifre', 'profil-yeni-sifre', 'profil-yeni-sifre-tekrar'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        mesajGizle('profil-foto-mesaj');
        mesajGizle('profil-sifre-mesaj');
        profilFotoSeciminiIptal();
        const gucYazi = document.getElementById('profil-guc-yazi');
        const gucDolum = document.getElementById('profil-guc-dolum');
        if (gucYazi) gucYazi.textContent = 'Şifre giriniz';
        if (gucDolum) { gucDolum.style.width = '0%'; gucDolum.className = 'profil-guc-dolum'; }
        const eslesmeYazi = document.getElementById('profil-eslesme-yazi');
        if (eslesmeYazi) eslesmeYazi.textContent = '';
    }

    // ═══════════════════════════════════════════
    // FOTOĞRAF İŞLEMLERİ
    // ═══════════════════════════════════════════
    function profilFotoSecildi(input) {
        const dosya = input.files && input.files[0];
        if (!dosya) return;

        // Tür kontrolü
        const izinliTurler = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!izinliTurler.includes(dosya.type)) {
            mesajGoster('profil-foto-mesaj', 'Sadece JPG, PNG veya WEBP formatı kabul edilir.', 'hata');
            input.value = '';
            return;
        }

        // Boyut kontrolü (2 MB)
        if (dosya.size > 2 * 1024 * 1024) {
            mesajGoster('profil-foto-mesaj', 'Dosya boyutu 2 MB değerini aşamaz.', 'hata');
            input.value = '';
            return;
        }

        secilenFotoDosya = dosya;

        // Seçilen dosya bandını göster
        const bant   = document.getElementById('profil-secilen-dosya');
        const adEl   = document.getElementById('profil-secilen-dosya-adi');
        if (bant) bant.style.display = 'flex';
        if (adEl) adEl.textContent = dosya.name;

        // Önizlemeyi yerleştir
        const okuyucu = new FileReader();
        okuyucu.onload = (e) => {
            const cerceve = document.getElementById('profil-foto-cerceve');
            if (cerceve) cerceve.innerHTML = `<img src="${e.target.result}" alt="Önizleme">`;
        };
        okuyucu.readAsDataURL(dosya);

        // Kaydet butonunu aktif et
        const kaydetBtn = document.getElementById('btn-profil-foto-kaydet');
        if (kaydetBtn) kaydetBtn.disabled = false;

        mesajGizle('profil-foto-mesaj');
    }

    function profilFotoSeciminiIptal() {
        secilenFotoDosya = null;
        const input = document.getElementById('profil-foto-input');
        if (input) input.value = '';
        const bant = document.getElementById('profil-secilen-dosya');
        if (bant) bant.style.display = 'none';
        const kaydetBtn = document.getElementById('btn-profil-foto-kaydet');
        if (kaydetBtn) kaydetBtn.disabled = true;
        // Önizlemeyi tekrar eski hale getir
        modalVerileriYenile();
    }

    async function profilFotoYukle() {
        if (!secilenFotoDosya) return;

        const kaydetBtn = document.getElementById('btn-profil-foto-kaydet');
        const orijinalHTML = kaydetBtn.innerHTML;
        kaydetBtn.disabled = true;
        kaydetBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Yükleniyor...';

        const formData = new FormData();
        formData.append('profilFoto', secilenFotoDosya);

        try {
            // NOT: FormData gönderirken Content-Type header'ını ELLE SET ETMEYİN,
            // tarayıcı otomatik doğru boundary'yi ayarlar. Bu yüzden apiFetch değil,
            // manuel fetch kullanıyoruz.
            const token = AUTH.tokenAl();
            const res = await fetch('/api/auth/profil-foto', {
                method: 'POST',
                headers: token ? { 'Authorization': 'Bearer ' + token } : {},
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.hata || data.mesaj || 'Yükleme başarısız.');
            }

            // Başarılı — localStorage'daki kullanıcıyı güncelle
            const k = AUTH.kullaniciAl();
            k.profilFoto = data.profilFoto;
            localStorage.setItem('isg_kullanici', JSON.stringify(k));

            mesajGoster('profil-foto-mesaj', '✓ Profil fotoğrafınız başarıyla güncellendi.', 'basari');
            secilenFotoDosya = null;

            // Header avatarını güncelle
            headerAvatariGuncelle();
            // Modal içindeki önizlemeyi de güncelle
            modalVerileriYenile();

            // Seçili dosya bandını gizle
            const bant = document.getElementById('profil-secilen-dosya');
            if (bant) bant.style.display = 'none';

        } catch (err) {
            mesajGoster('profil-foto-mesaj', err.message || 'Yükleme sırasında bir hata oluştu.', 'hata');
        } finally {
            kaydetBtn.disabled = false;
            kaydetBtn.innerHTML = orijinalHTML;
        }
    }

    async function profilFotoSil() {
        if (!confirm('Profil fotoğrafınızı kaldırmak istediğinize emin misiniz?')) return;

        const silBtn = document.getElementById('btn-profil-foto-sil');
        const orijinalHTML = silBtn.innerHTML;
        silBtn.disabled = true;
        silBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Siliniyor...';

        try {
            const res = await AUTH.apiFetch('/api/auth/profil-foto', { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.hata || 'Silme başarısız.');

            // localStorage güncelle
            const k = AUTH.kullaniciAl();
            k.profilFoto = null;
            localStorage.setItem('isg_kullanici', JSON.stringify(k));

            mesajGoster('profil-foto-mesaj', '✓ Profil fotoğrafınız kaldırıldı.', 'basari');
            headerAvatariGuncelle();
            modalVerileriYenile();

        } catch (err) {
            mesajGoster('profil-foto-mesaj', err.message || 'Silme sırasında bir hata oluştu.', 'hata');
        } finally {
            silBtn.disabled = false;
            silBtn.innerHTML = orijinalHTML;
        }
    }

    // ═══════════════════════════════════════════
    // ŞİFRE İŞLEMLERİ
    // ═══════════════════════════════════════════
    function profilSifreGozToggle(inputId, btn) {
        const input = document.getElementById(inputId);
        if (!input) return;
        const yeniTip = input.type === 'password' ? 'text' : 'password';
        input.type = yeniTip;
        const ikon = btn.querySelector('i');
        if (ikon) ikon.className = yeniTip === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
    }

    function profilSifreGucluGuncelle() {
        const sifre = document.getElementById('profil-yeni-sifre')?.value || '';
        const dolum = document.getElementById('profil-guc-dolum');
        const yazi  = document.getElementById('profil-guc-yazi');
        if (!dolum || !yazi) return;

        let puan = 0;
        if (sifre.length >= 6)  puan++;
        if (sifre.length >= 10) puan++;
        if (/[A-Z]/.test(sifre)) puan++;
        if (/[0-9]/.test(sifre)) puan++;
        if (/[^A-Za-z0-9]/.test(sifre)) puan++;

        const seviyeler = [
            { yazi: 'Şifre giriniz', sinif: '',      genislik: 0 },
            { yazi: 'Zayıf',         sinif: 'zayif', genislik: 25 },
            { yazi: 'Orta',          sinif: 'orta',  genislik: 50 },
            { yazi: 'İyi',           sinif: 'iyi',   genislik: 75 },
            { yazi: 'Güçlü',         sinif: 'guclu', genislik: 90 },
            { yazi: 'Çok Güçlü',     sinif: 'guclu', genislik: 100 },
        ];

        const s = seviyeler[puan] || seviyeler[0];
        dolum.style.width = s.genislik + '%';
        dolum.className = 'profil-guc-dolum ' + s.sinif;
        yazi.textContent = sifre.length === 0 ? 'Şifre giriniz' : s.yazi;

        profilSifreEslesmeKontrol();
    }

    function profilSifreEslesmeKontrol() {
        const yeni   = document.getElementById('profil-yeni-sifre')?.value || '';
        const tekrar = document.getElementById('profil-yeni-sifre-tekrar')?.value || '';
        const yazi   = document.getElementById('profil-eslesme-yazi');
        if (!yazi) return;

        if (tekrar.length === 0) {
            yazi.textContent = '';
            yazi.className = 'profil-eslesme-yazi';
            return;
        }
        if (yeni === tekrar) {
            yazi.textContent = '✓ Şifreler eşleşiyor';
            yazi.className = 'profil-eslesme-yazi basari';
        } else {
            yazi.textContent = '✗ Şifreler eşleşmiyor';
            yazi.className = 'profil-eslesme-yazi hata';
        }
    }

    async function profilSifreDegistir() {
        const mevcutSifre     = document.getElementById('profil-mevcut-sifre')?.value || '';
        const yeniSifre       = document.getElementById('profil-yeni-sifre')?.value || '';
        const yeniSifreTekrar = document.getElementById('profil-yeni-sifre-tekrar')?.value || '';

        if (!mevcutSifre || !yeniSifre || !yeniSifreTekrar) {
            mesajGoster('profil-sifre-mesaj', 'Tüm alanları doldurunuz.', 'hata');
            return;
        }
        if (yeniSifre !== yeniSifreTekrar) {
            mesajGoster('profil-sifre-mesaj', 'Yeni şifreler birbirini tutmuyor.', 'hata');
            return;
        }
        if (yeniSifre.length < 6) {
            mesajGoster('profil-sifre-mesaj', 'Yeni şifre en az 6 karakter olmalıdır.', 'hata');
            return;
        }

        const btn = document.querySelector('#profil-sifre-formu button[type="submit"]');
        const orijinalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Değiştiriliyor...';

        try {
            const res = await AUTH.apiFetch('/api/auth/sifre-degistir', {
                method: 'POST',
                body: JSON.stringify({ mevcutSifre, yeniSifre, yeniSifreTekrar })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.hata || 'Şifre değiştirilemedi.');

            mesajGoster('profil-sifre-mesaj', '✓ Şifreniz başarıyla değiştirildi.', 'basari');
            // Formu temizle
            ['profil-mevcut-sifre', 'profil-yeni-sifre', 'profil-yeni-sifre-tekrar'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            // Güç göstergesini sıfırla
            profilSifreGucluGuncelle();
            profilSifreEslesmeKontrol();

            // 2 saniye sonra modal'ı kapat
            setTimeout(() => profilModalKapat(), 2000);

        } catch (err) {
            mesajGoster('profil-sifre-mesaj', err.message || 'Şifre değiştirme sırasında hata oluştu.', 'hata');
        } finally {
            btn.disabled = false;
            btn.innerHTML = orijinalHTML;
        }
    }

    // ═══════════════════════════════════════════
    // YARDIMCILAR
    // ═══════════════════════════════════════════
    function mesajGoster(elId, metin, tip) {
        const el = document.getElementById(elId);
        if (!el) return;
        el.textContent = metin;
        el.className = 'profil-mesaj ' + (tip || 'bilgi');
        el.style.display = 'block';
    }

    function mesajGizle(elId) {
        const el = document.getElementById(elId);
        if (el) el.style.display = 'none';
    }

    // DOM hazır olduğunda başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', baslat);
    } else {
        baslat();
    }

    // Global erişim için fonksiyonları window'a aç
    window.profilModalAc         = profilModalAc;
    window.profilModalKapat      = profilModalKapat;
    window.profilFotoSecildi     = profilFotoSecildi;
    window.profilFotoSeciminiIptal = profilFotoSeciminiIptal;
    window.profilFotoYukle       = profilFotoYukle;
    window.profilFotoSil         = profilFotoSil;
    window.profilSifreDegistir   = profilSifreDegistir;
    window.profilSifreGozToggle  = profilSifreGozToggle;
    window.profilSifreGucluGuncelle = profilSifreGucluGuncelle;
    window.profilSifreEslesmeKontrol = profilSifreEslesmeKontrol;

    return { profilModalAc, profilModalKapat, headerAvatariGuncelle };

})();