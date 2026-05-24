document.addEventListener("DOMContentLoaded", async () => {
    
    const kullanici = AUTH.kullaniciBilgisi();
    const kullaniciMenu = document.getElementById('menu-kullanicilar');

    if (kullaniciMenu) {
        if (kullanici && kullanici.rol === 'sistem_yoneticisi') {
            kullaniciMenu.style.display = 'flex';
        } else {
            kullaniciMenu.style.display = 'none';
        }
    }

    // Header bilgilerini doldur
    if (kullanici) {
    const isimEl = document.getElementById('hosgeldin-isim');
    const ad = kullanici.adSoyad || kullanici.ad || kullanici.email || '?';
    if (isimEl) isimEl.textContent = ad.split(' ')[0];

    // Eğer profilFoto varsa ve profil.js yüklenmişse, header'da avatar otomatik güncellenir
    if (typeof PROFIL !== 'undefined' && PROFIL.headerAvatariGuncelle) {
        PROFIL.headerAvatariGuncelle();
    }
}

    await acilDokumanlariGoster();
    await yaklasanEgitimleriGoster();

    // Tablolar dolduktan sonra arama aktif et
    _aramaBaslat();
});

// ==========================================
// ARAMA FONKSİYONU
// ==========================================

function _aramaBaslat() {
    const aramaInput = document.querySelector('.arama-kutusu input');
    if (!aramaInput) return;

    aramaInput.addEventListener('input', () => {
        const q = aramaInput.value.trim().toLocaleLowerCase('tr-TR');
        _tabloFiltrele('anasayfa-acil-tablo',       q);
        _tabloFiltrele('anasayfa-yaklasan-egitimler', q);
    });
}

function _tabloFiltrele(tabloId, q) {
    const tablo = document.getElementById(tabloId);
    if (!tablo) return;

    const satirlar = tablo.querySelectorAll('tr');
    let gorunenSatir = 0;

    satirlar.forEach(satir => {
        // Ayraç satırlarını (KRİTİK / UYARI başlıkları) daima gizle/göster
        const ayrac = satir.classList.contains('ayrac-kritik') || satir.classList.contains('ayrac-uyari');
        if (ayrac) {
            satir.style.display = q ? 'none' : '';
            return;
        }

        if (!q) {
            satir.style.display = '';
            return;
        }

        // Satırın tüm metin içeriğinde ara
        const metin = satir.textContent.toLocaleLowerCase('tr-TR');
        const eslesme = metin.includes(q);
        satir.style.display = eslesme ? '' : 'none';
        if (eslesme) gorunenSatir++;
    });

    // Eğer hiç sonuç yoksa bilgi satırı göster
    const mevcutBilgi = tablo.querySelector('.arama-sonucsuz');
    if (!q) {
        if (mevcutBilgi) mevcutBilgi.remove();
        return;
    }
    if (gorunenSatir === 0) {
        if (!mevcutBilgi) {
            const kolonSayisi = tabloId === 'anasayfa-acil-tablo' ? 5 : 4;
            tablo.insertAdjacentHTML('beforeend', `
                <tr class="arama-sonucsuz">
                    <td colspan="${kolonSayisi}" style="text-align:center;color:#94a3b8;padding:24px;font-size:0.85rem;">
                        <i class="fa-solid fa-magnifying-glass" style="margin-right:6px;"></i>
                        "<strong>${_escHtml(q)}</strong>" ile eşleşen kayıt bulunamadı.
                    </td>
                </tr>`);
        }
    } else {
        if (mevcutBilgi) mevcutBilgi.remove();
    }
}

function rolEtiket(rol) {
    const map = {
        sistem_yoneticisi: 'Sistem Yöneticisi',
        isg_uzmani:        'İSG Uzmanı',
        isveren:           'İşveren',
        isyeri_hekimi:     'İşyeri Hekimi',
    };
    return map[rol] || rol || '';
}

// ==========================================
// API KATMANI
// ==========================================

async function apiFetch(key, fallback = null) {
    
    const endpointMap = {
        'isg_firmalar':    '/api/firmalar',
        'isg_personel':    '/api/personel',
        'isg_egitimler':   '/api/egitimler', 
    };

    const endpoint = endpointMap[key] || `/api/veri/${encodeURIComponent(key)}`;

    try {
        const res = await AUTH.apiFetch(endpoint);
        
        if (res.status === 404) {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        }
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        let gercekVeri = data.veri ?? data;
        
        if (key === 'isg_firmalar' && Array.isArray(gercekVeri)) {
            gercekVeri = gercekVeri.map(f => ({ ...f, adi: f.firmaAdi || f.adi }));
        }
        if (key === 'isg_personel' && Array.isArray(gercekVeri)) {
            gercekVeri = gercekVeri.map(p => ({ ...p, ad: p.adSoyad || p.ad, tc: p.tcKimlik || p.tc }));
        }

        return gercekVeri;

    } catch (e) {
        console.warn(`[apiFetch] Backend'e ulaşılamadı (${key}), localStorage deneniyor...`, e.message);
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch { return fallback; }
    }
}

// ==========================================
// TARİH HESAPLAMA
// ==========================================

function farkGunHesapla(tarihStr) {
    if (!tarihStr) return 999;
    const bitis = new Date(tarihStr).setHours(0, 0, 0, 0);
    const bugun = new Date().setHours(0, 0, 0, 0);
    return Math.ceil((bitis - bugun) / 86400000);
}

function gunFarkiHesapla(tarih) {
    if (!tarih) return 0;
    if (tarih.includes('.')) {
        const [gun, ay, yil] = tarih.split(".");
        const hedef = new Date(yil, ay - 1, gun);
        hedef.setHours(0,0,0,0);
        const bugun = new Date(); bugun.setHours(0,0,0,0);
        return Math.ceil((hedef - bugun) / 86400000);
    }
    return farkGunHesapla(tarih);
}

function tarihGorsel(tarihStr) {
    if (!tarihStr) return '-';
    if (tarihStr.includes('T') || tarihStr.includes('-')) {
        const d = new Date(tarihStr);
        return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
    }
    return tarihStr;
}

// ==========================================
// SABİTLER
// ==========================================

const kategoriEtiketlerAnasayfa = {
    uzman:'Uzman/Hekim/DSP', temsilci:'Çalışan Temsilcisi', kurul:'İSG Kurulu',
    muayene:'Sağlık Muayenesi', egitim:'İSG Eğitimi', ilkyardim:'İlkyardım',
    rv:'Risk Değerlendirme', adp:'Acil Durum Planı', tatbikat:'Tatbikat',
    olcum:'Ortam Ölçümü', denetim:'DİF/DÖF Takibi', kkd:'KKD',
};

const turIkonMapAnasayfa = {
    'DOSYA':     '<i class="fa-solid fa-file" style="color:#64748b;"></i>',
    'MUAYENE':   '<i class="fa-solid fa-stethoscope" style="color:#7c3aed;"></i>',
    'EĞİTİM':    '<i class="fa-solid fa-graduation-cap" style="color:#d97706;"></i>',
    'İLKYARDIM': '<i class="fa-solid fa-kit-medical" style="color:#dc2626;"></i>',
    'KURUL':     '<i class="fa-solid fa-people-group" style="color:#2563eb;"></i>',
    'RV':        '<i class="fa-solid fa-shield-halved" style="color:#2563eb;"></i>',
    'ADP':       '<i class="fa-solid fa-shield-halved" style="color:#2563eb;"></i>',
    'TATBIKAT':  '<i class="fa-solid fa-fire-extinguisher" style="color:#ea580c;"></i>',
    'ÖLÇÜM':     '<i class="fa-solid fa-chart-line" style="color:#16a34a;"></i>',
    'DÖF':       '<i class="fa-solid fa-magnifying-glass-chart" style="color:#2563eb;"></i>',
    'KKD':       '<i class="fa-solid fa-hard-hat" style="color:#d97706;"></i>',
};

// ==========================================
// ACİL DOKÜMANLAR
// ==========================================

async function acilDokumanlariGoster() {
    const tablo  = document.getElementById('anasayfa-acil-tablo');
    const baslik = document.getElementById('acil-dokuman-baslik');
    if (!tablo) return;

    let kritikDosyalar = [];
    let uyariDosyalar  = [];

    const [firmalar, personelListesi] = await Promise.all([
        apiFetch('isg_firmalar', []),
        _tumPersonelGetir(),
    ]);

    await Promise.all(firmalar.map(async (firma) => {
        const firmaAdi = firma.firmaAdi || firma.adi || firma.ad || '';

        const [isgDocs, muayeneData, egitimData, ilkyardimData, ekipmanlarRaw] = await Promise.all([
    apiFetch('isg_dosyalar_' + firmaAdi, {}),
    apiFetch('muayene_verileri_' + firmaAdi, {}),
    apiFetch('egitim_verileri_' + firmaAdi, {}),
    apiFetch('ilkyardim_verileri_' + firmaAdi, {}),
    apiFetch('olcum_ekipman_verileri_' + firmaAdi, []),
]);
const ekipmanlar = Array.isArray(ekipmanlarRaw) ? ekipmanlarRaw : [];

        const pushEntry = (entry) => {
            entry.gun <= 10 ? kritikDosyalar.push(entry) : uyariDosyalar.push(entry);
        };

        Object.keys(isgDocs).forEach(kat => {
            (isgDocs[kat] || []).forEach(doc => {
                if (!doc.tarih) return;
                const gun = farkGunHesapla(doc.tarih);
                if (gun > 30) return;
                pushEntry({ ad: doc.ad, firma: firmaAdi, tarih: doc.tarih, tur: 'DOSYA', kategori: kategoriEtiketlerAnasayfa[kat] || kat, gun });
            });
        });

        Object.keys(muayeneData).forEach(key => {
            const gecerliTarih = muayeneData[key]?.gecerliTarih || muayeneData[key]?.sonrakiTarih || '';
            if (!gecerliTarih) return;
            const gun = farkGunHesapla(gecerliTarih);
            if (gun > 30) return;
            pushEntry({ ad: 'Muayene: ' + _keydenAdCoz(key, personelListesi), firma: firmaAdi, tarih: gecerliTarih, tur: 'MUAYENE', kategori: 'Sağlık Muayenesi', gun });
        });

        Object.keys(egitimData).forEach(key => {
            const gecerliTarih = egitimData[key]?.gecerliTarih || '';
            if (!gecerliTarih) return;
            const gun = farkGunHesapla(gecerliTarih);
            if (gun > 30) return;
            pushEntry({ ad: 'Eğitim: ' + _keydenAdCoz(key, personelListesi), firma: firmaAdi, tarih: gecerliTarih, tur: 'EĞİTİM', kategori: 'İSG Eğitimi', gun });
        });

        Object.keys(ilkyardimData).forEach(key => {
            const kayit = ilkyardimData[key];
            const gecerliTarih = kayit?.gecerliTarih || '';
            if (!gecerliTarih) return;
            const gun = farkGunHesapla(gecerliTarih);
            if (gun > 30) return;
            pushEntry({ ad: 'İlkyardım: ' + (kayit.personelAd || _keydenAdCoz(key, personelListesi)), firma: firmaAdi, tarih: gecerliTarih, tur: 'İLKYARDIM', kategori: 'İlkyardım', gun });
        });

        const isgAlanlari = [
            { key: 'kurulToplanti',     ad: 'İSG Kurul Toplantısı',           tur: 'KURUL',    kat: 'İSG Kurulu'         },
            { key: 'rvRevizyon',        ad: 'Risk Değerlendirmesi — Revizyon', tur: 'RV',       kat: 'Risk Değerlendirme' },
            { key: 'adpRevizyon',       ad: 'Acil Durum Planı — Revizyon',     tur: 'ADP',      kat: 'Acil Durum Planı'   },
            { key: 'tatbikatSonraki',   ad: 'Acil Durum Tatbikatı',            tur: 'TATBIKAT', kat: 'Tatbikat'           },
            { key: 'denetimGecerlilik', ad: 'DİF/DÖF Takibi',                 tur: 'DÖF',      kat: 'DİF/DÖF Takibi'    },
            { key: 'kkdGecerlilik',     ad: 'KKD Takibi — Son Geçerlilik',     tur: 'KKD',      kat: 'KKD'                },
        ];

        isgAlanlari.forEach(({ key, ad, tur, kat }) => {
            const tarih = firma.isg?.[key];
            if (!tarih) return;
            const gun = farkGunHesapla(tarih);
            if (gun > 30) return;
            pushEntry({ ad, firma: firmaAdi, tarih, tur, kategori: kat, gun });
        });



        ekipmanlar.forEach(ekipman => {
            const tarih = ekipman.gecerlilikTarihi || '';
            if (!tarih) return;
            const gun = farkGunHesapla(tarih);
            if (gun > 30) return;
            pushEntry({ ad: 'Ortam Ölçümü: ' + (ekipman.ekipmanAdi || 'Ekipman'), firma: firmaAdi, tarih, tur: 'ÖLÇÜM', kategori: 'Ortam Ölçümü', gun });
        });
    }));

    kritikDosyalar.sort((a, b) => a.gun - b.gun);
    uyariDosyalar.sort((a, b)  => a.gun - b.gun);

    tablo.innerHTML = '';
    const toplam = kritikDosyalar.length + uyariDosyalar.length;

    if (toplam === 0) {
        tablo.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#16a34a;padding:30px;">✅ Tüm dokümanlar güncel — 30 gün içinde geçerlilik süresi dolacak belge yok.</td></tr>`;
        if (baslik) { baslik.style.color = '#16a34a'; baslik.innerHTML = '<i class="fa-solid fa-file-circle-check"></i> Acil Dokümanlar — Geçerlilik Uyarısı'; }
        return;
    }

    if (baslik) {
        baslik.style.color = kritikDosyalar.length > 0 ? '#dc2626' : '#d97706';
        baslik.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Acil Dokümanlar — Geçerlilik Uyarısı';
    }

    if (kritikDosyalar.length > 0) {
        tablo.insertAdjacentHTML('beforeend', `<tr class="ayrac-kritik"><td colspan="5">🔴 KRİTİK — 10 Gün İçinde Geçerlilik Süresi Dolacak / Süresi Dolmuş (${kritikDosyalar.length} kayıt)</td></tr>`);
        kritikDosyalar.forEach((item, idx) => {
            const kalanYazi = item.gun <= 0 ? 'SÜRESİ DOLDU' : `${item.gun} Gün`;
            const ikonHTML  = turIkonMapAnasayfa[item.tur] || turIkonMapAnasayfa['DOSYA'];
            tablo.insertAdjacentHTML('beforeend', `
                <tr class="acil-satir-kritik" onclick="window.location.href='dokumanlar'" style="cursor:pointer;">
                    <td style="color:#94a3b8;font-size:11px;width:30px;">${idx + 1}</td>
                    <td><strong class="dokuman-adi">${_escHtml(item.ad)}</strong><br><small>${_escHtml(item.firma)}</small></td>
                    <td>${ikonHTML} <span class="kategori-etiket">${_escHtml(item.kategori)}</span></td>
                    <td style="color:#1e293b;font-weight:500;font-size:11px;">${tarihGorsel(item.tarih)}</td>
                    <td><span class="kalan-sure-badge kritik"><i class="fa-solid fa-circle-exclamation"></i> ${kalanYazi}</span></td>
                </tr>`);
        });
    }

    if (uyariDosyalar.length > 0) {
        tablo.insertAdjacentHTML('beforeend', `<tr class="ayrac-uyari"><td colspan="5">🟠 UYARI — 30 Gün İçinde Geçerlilik Süresi Dolacak (${uyariDosyalar.length} kayıt)</td></tr>`);
        uyariDosyalar.forEach((item, idx) => {
            const ikonHTML = turIkonMapAnasayfa[item.tur] || turIkonMapAnasayfa['DOSYA'];
            tablo.insertAdjacentHTML('beforeend', `
                <tr class="acil-satir-uyari" onclick="window.location.href='dokumanlar'" style="cursor:pointer;">
                    <td style="color:#94a3b8;font-size:11px;width:30px;">${kritikDosyalar.length + idx + 1}</td>
                    <td><strong class="dokuman-adi">${_escHtml(item.ad)}</strong><br><small>${_escHtml(item.firma)}</small></td>
                    <td>${ikonHTML} <span class="kategori-etiket">${_escHtml(item.kategori)}</span></td>
                    <td style="color:#1e293b;font-weight:500;font-size:11px;">${tarihGorsel(item.tarih)}</td>
                    <td><span class="kalan-sure-badge uyari"><i class="fa-solid fa-clock"></i> ${item.gun} Gün</span></td>
                </tr>`);
        });
    }
}

// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================

async function _tumPersonelGetir() {
    const liste = await apiFetch('isg_personel', []);
    return Array.isArray(liste) ? liste : [];
}

function _personelKeyAnasayfa(personel) {
    const ad = (personel.adSoyad || personel.ad || '').replace(/\s+/g, '_');
    const tc = (personel.tc || personel.tcKimlik || String(personel.id || '')).trim();
    return (ad + '_' + tc).replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]/g, '');
}

function _keydenAdCoz(key, personelListesi) {
    const bulunan = personelListesi.find(p => _personelKeyAnasayfa(p) === key);
    if (bulunan) return bulunan.adSoyad || bulunan.ad || key;
    return key.replace(/_\d{11}$/, '').replace(/_\d+$/, '').replace(/_/g, ' ').trim();
}

function _escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ==========================================
// YAKLAŞAN EĞİTİMLER
// ==========================================

async function yaklasanEgitimleriGoster() {
    const tablo  = document.getElementById("anasayfa-yaklasan-egitimler");
    const baslik = document.getElementById("egitim-tablo-baslik");
    if (!tablo) return;

    tablo.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;color:#64748b;">Yükleniyor...</td></tr>`;

    const ham = await apiFetch('isg_egitimler', []);
    const egitimler = Array.isArray(ham) ? ham : [];

    let kritikler = [];
    let uyarilar  = [];

    egitimler.forEach(e => {
        const durum = (e.durum || '').toLowerCase();
        if (durum === 'tamamlandi' || durum === 'iptal') return;

        const tarihRaw = e.planlananTarih || e.tarih || '';
        const gun      = farkGunHesapla(tarihRaw);
        if (gun > 30) return;

        const entry = {
            ad:    e.konu || e.ad || 'İsimsiz Eğitim',
            firma: e.firma?.firmaAdi || e.firma?.adi || (typeof e.firma === 'string' ? e.firma : '') || 'Firma',
            tarih: tarihGorsel(tarihRaw),
            gun,
        };

        gun <= 10 ? kritikler.push(entry) : uyarilar.push(entry);
    });

    kritikler.sort((a, b) => a.gun - b.gun);
    uyarilar.sort((a, b)  => a.gun - b.gun);

    tabloGuncelle(kritikler, uyarilar);
}

function tabloGuncelle(kritikler, uyarilar) {
    const tablo  = document.getElementById("anasayfa-yaklasan-egitimler");
    const baslik = document.getElementById("egitim-tablo-baslik");
    if (!tablo) return;

    tablo.innerHTML = "";
    const toplam = kritikler.length + uyarilar.length;

    if (toplam === 0) {
        tablo.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#16a34a;padding:30px;"><strong>✅ Yakın zamanda bekleyen eğitim yok</strong></td></tr>`;
        if (baslik) { baslik.style.color = "#16a34a"; baslik.innerHTML = '<i class="fa-solid fa-graduation-cap"></i> Eğitim Takibi'; }
        return;
    }

    if (baslik) {
        baslik.style.color = kritikler.length > 0 ? "#dc2626" : "#d97706";
        baslik.innerHTML = kritikler.length > 0
            ? '<i class="fa-solid fa-triangle-exclamation"></i> Eğitim Takibi'
            : '<i class="fa-solid fa-graduation-cap"></i> Eğitim Takibi';
    }

    if (kritikler.length > 0) {
        tablo.insertAdjacentHTML('beforeend', `<tr class="ayrac-kritik"><td colspan="4">🔴 KRİTİK — 10 Gün İçinde / Süresi Dolmuş (${kritikler.length} kayıt)</td></tr>`);
        kritikler.forEach((e, idx) => {
            const kalanYazi = e.gun <= 0 ? 'SÜRESİ DOLDU' : `${e.gun} Gün`;
            tablo.insertAdjacentHTML('beforeend', `
                <tr class="egitim-satir-gecmis" onclick="window.location.href='egitimler'" style="cursor:pointer;">
                    <td style="color:#94a3b8;font-size:11px;width:30px;">${idx + 1}</td>
                    <td><strong class="egitim-adi">${_escHtml(e.ad)}</strong><br><small style="color:#64748b;">${_escHtml(e.firma)}</small></td>
                    <td style="color:#dc2626;font-weight:500;font-size:11px;">${e.tarih}</td>
                    <td><span class="kalan-sure-badge kritik"><i class="fa-solid fa-circle-exclamation"></i> ${kalanYazi}</span></td>
                </tr>`);
        });
    }

    if (uyarilar.length > 0) {
        tablo.insertAdjacentHTML('beforeend', `<tr class="ayrac-uyari"><td colspan="4">🟠 UYARI — 30 Gün İçinde Planlanmış Eğitim (${uyarilar.length} kayıt)</td></tr>`);
        uyarilar.forEach((e, idx) => {
            tablo.insertAdjacentHTML('beforeend', `
                <tr class="egitim-satir" onclick="window.location.href='egitimler'" style="cursor:pointer;">
                    <td style="color:#94a3b8;font-size:11px;width:30px;">${kritikler.length + idx + 1}</td>
                    <td><strong class="egitim-adi">${_escHtml(e.ad)}</strong><br><small style="color:#64748b;">${_escHtml(e.firma)}</small></td>
                    <td style="color:#1e293b;font-weight:500;font-size:11px;">${e.tarih}</td>
                    <td><span class="kalan-sure-badge uyari"><i class="fa-solid fa-clock"></i> ${e.gun} Gün</span></td>
                </tr>`);
        });
    }
}

const style = document.createElement('style');
style.textContent = `@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`;
document.head.appendChild(style);