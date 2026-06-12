const _ENDPOINT_MAP = {
    'isg_firmalar':    '/api/firmalar',
    'isg_personeller': '/api/personel',  
    'isg_personel':    '/api/personel',
    'isg_egitimler':   '/api/egitim',
    'uzman_verileri':  '/api/dokumanlar/uzman',    
};

function _anahtarEndpoint(anahtar) {
    return _ENDPOINT_MAP[anahtar] || `/api/veri/${encodeURIComponent(anahtar)}`;
}

async function _veriOku(anahtar, varsayilan = null) {
    try {
        // 1. Önbellek (Cache) Kırıcı - Tarayıcıyı zorla günceller
        const endpoint = _anahtarEndpoint(anahtar);
        const url = endpoint.includes('?') ? `${endpoint}&_t=${new Date().getTime()}` : `${endpoint}?_t=${new Date().getTime()}`;
        
        const res = await AUTH.apiFetch(url);
        if (res.status === 404) return varsayilan;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        
        // 2. Backend paketini aç (Sadece "veri" kısmını al)
        let gercekVeri = data;
        if (data && data.veri !== undefined) {
            gercekVeri = data.veri;
        }

        // 3. SİHİRLİ ÇEVİRMEN: Eski 3500 satırlık kod bozulmasın diye veritabanı isimlerini eski haline dönüştür
        if (anahtar === 'isg_firmalar' && Array.isArray(gercekVeri)) {
            gercekVeri = gercekVeri.map(f => ({
                ...f,
                adi: f.firmaAdi || f.adi, // MongoDB'deki firmaAdi'ni, eski kodun beklediği 'adi' yapar
                sinif: f.tehlikeSinifi || f.sinif
            }));
        }
        if ((anahtar === 'isg_personeller' || anahtar === 'isg_personel') && Array.isArray(gercekVeri)) {
            gercekVeri = gercekVeri.map(p => ({
                ...p,
                ad: p.adSoyad || p.ad,
                tc: p.tcKimlik || p.tc,
                pozisyon: p.gorev || p.pozisyon,
                // Eğer firma obje olarak gelirse sadece adını al
                firma: p.firma ? (p.firma.firmaAdi || p.firma.adi || p.firma) : ''
            }));
        }

        return gercekVeri;
        
    } catch (e) {
        console.warn(`[_veriOku] Backend erişilemedi (${anahtar}), localStorage kullanılıyor:`, e.message);
        try {
            const ham = localStorage.getItem(anahtar);
            if (ham === null) return varsayilan;
            return JSON.parse(ham);
        } catch {
            return varsayilan;
        }
    }
}

async function _veriYaz(anahtar, deger) {
    const koleksiyonAnahtarlari = Object.keys(_ENDPOINT_MAP);
    try {
        let body;
        let endpoint = _anahtarEndpoint(anahtar);
        if (koleksiyonAnahtarlari.includes(anahtar)) {
            body = JSON.stringify(deger);
        } else {
            body = JSON.stringify(deger);
        }
        const res = await AUTH.apiFetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return true;
    } catch (e) {
        console.warn(`[_veriYaz] Backend erişilemedi (${anahtar}), localStorage:`, e.message);
        try {
            localStorage.setItem(anahtar, JSON.stringify(deger));
            return true;
        } catch {
            return false;
        }
    }
}

// ==========================================
// GLOBAL DURUM
// ==========================================
let aktifFirma    = null;
let aktifFirmaId  = null;
let aktifFirmaIdx = null;
let yuklenenDosyalar = {};
let bekleyenDosyalar = {};
let aktifKlasorKategori = null;
let aktifFirmaSinifi    = '';
let kurulGecmisToplantılar = [];

//Kategori → Tur eşlemesi
const _kategoriTurMap = {
    rv:       'risk_degerlendirmesi',
    adp:      'acil_eylem_plani',
    tatbikat: 'tatbikat_raporu',
    kurul:    'isg_kurul_toplantisi',
    olcum:    'cevre_olcumu',
};
function _kategoridenTur(k) { return _kategoriTurMap[k] || 'diger'; }
function _turdenKategori(t) {
    return Object.keys(_kategoriTurMap).find(k => _kategoriTurMap[k] === t) || 'diger';
}

const kartKontroller = {
    'kart-uzman': async () => {
    if (!aktifFirma) return false;
    try {
        const res  = await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(aktifFirma)}`);
        const veri = await res.json();
        return ['igu', 'hekim', 'dsp'].some(k => veri[k]?.ad && veri[k].ad.trim());
    } catch {
        return false;
    }
},
    'kart-temsilci':  async () => {
        if (!aktifFirma) return false;
        const data = await _veriOku('temsilci_verileri_' + aktifFirma, {});
        return Object.keys(data).length > 0;
    },
    'kart-destek':    async () => {
        if (!aktifFirma) return false;
        const data = await _veriOku('destek_verileri_' + aktifFirma, {});
        const ekipler = ['koruma', 'kurtarma', 'sondurme', 'ilkyardim'];
        return ekipler.some(ekip => data[ekip] && Object.keys(data[ekip]).length > 0);
    },
    'kart-kurul':     () => cb('kurul-zorunlu-degil') || !!v('kurul-toplanti'),
    'kart-muayene':   async () => {
        if (!aktifFirma) return false;
        const data = await _veriOku('muayene_verileri_' + aktifFirma, {});
        return Object.keys(data).length > 0;
    },
    'kart-egitim':    async () => {
        if (!aktifFirma) return false;
        const data = await _veriOku('egitim_verileri_' + aktifFirma, {});
        return Object.keys(data).length > 0;
    },
    'kart-ilkyardim': async () => {
        if (!aktifFirma) return false;
        const data = await _veriOku('ilkyardim_verileri_' + aktifFirma, {});
        const kayitSayisi = Object.keys(data).length;
        if (kayitSayisi === 0) return false;
        const gerekli = await ilkyardimZorunluSayiGetir();
        return kayitSayisi >= gerekli;
    },
    'kart-rv':        () => !!v('rv-tarih'),
    'kart-adp':       () => !!v('adp-tarih'),
    'kart-tatbikat':  () => !!v('tatbikat-son'),
    'kart-olcum':     async () => {
        if (!aktifFirma) return false;
        const ekipmanlar = await _veriOku('olcum_ekipman_verileri_' + aktifFirma, []);
        return ekipmanlar.length > 0;
    },
    'kart-denetim':   () => !!v('denetim-tarih'),
    'kart-kkd':       () => !!v('kkd-tarih'),
};

const kategoriEtiketMap = {
    uzman:     'Uzman/Hekim/DSP',
    temsilci:  'Çalışan Temsilcisi',
    destek:    'Destek Elemanları',
    kurul:     'İSG Kurulu',
    muayene:   'Sağlık Muayenesi',
    egitim:    'İSG Eğitimi',
    ilkyardim: 'İlkyardım',
    rv:        'Risk Değerlendirme',
    adp:       'Acil Durum Planı',
    tatbikat:  'Tatbikat',
    olcum:     'Ortam Ölçümü',
    denetim:   'DİF/DÖF',
    kkd:       'KKD',
};

const ikonMap = {
    PDF:  'fa-file-pdf',
    DOCX: 'fa-file-word',
    DOC:  'fa-file-word',
    JPG:  'fa-file-image',
    JPEG: 'fa-file-image',
    PNG:  'fa-file-image',
    XLSX: 'fa-file-excel',
    XLS:  'fa-file-excel',
};

const ikonRenkMap = {
    PDF:  'pdf-ikon',
    DOCX: 'word-ikon',
    DOC:  'word-ikon',
    JPG:  'img-ikon',
    JPEG: 'img-ikon',
    PNG:  'img-ikon',
    XLSX: 'excel-ikon',
    XLS:  'excel-ikon',
};

function v(id)  { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
function cb(id) { const el = document.getElementById(id); return el ? el.checked : false; }

// ==========================================
// BAŞLATMA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const anasayfaTablo = document.getElementById('anasayfa-acil-tablo');
    if (anasayfaTablo) {
        anasayfaMantiği(anasayfaTablo);
    } else {
        firmaKlasorleriYukle();
    }
});

// ==========================================
// ANASAYFA — kritik doküman tablosu
// ==========================================
async function anasayfaMantiği(tablo) {
    const tumDokumanlar = await tumDokumanlariGetir();
    let kritikSayac = 0;
    tablo.innerHTML = "";

    tumDokumanlar.forEach(({ ad, firma, tarih, tur }) => {
        const gun = farkHesapla(tarih);
        if (gun > 30) return;
        kritikSayac++;
        const [yil, ay, g] = (tarih || '').split('-');
        const gorselTarih = yil ? `${g}.${ay}.${yil}` : '-';
        const kalanYazi   = gun <= 0 ? 'SÜRESİ DOLDU' : gun + ' Gün';
        const ikon        = ikonMap[tur] || 'fa-file';
        const renkStyle   = gun <= 10
            ? 'color:#dc2626;font-weight:bold;'
            : 'color:#ea580c;font-weight:bold;';

        tablo.insertAdjacentHTML('beforeend', `
            <tr>
                <td><i class="fa-regular ${ikon}"></i> <strong>${ad}</strong><br>
                    <small style="color:#64748b;">${firma}</small></td>
                <td>${gorselTarih}</td>
                <td style="${renkStyle}">${kalanYazi}</td>
            </tr>`);
    });

    await _anasayfaISGKayitlariEkle(tablo);

    const ozetSayi = document.getElementById('ozet-tehlike-sayisi');
    if (ozetSayi) ozetSayi.textContent = kritikSayac;
    if (kritikSayac === 0)
        tablo.innerHTML = "<tr><td colspan='3' style='text-align:center;'>✅ Tüm dokümanlar güncel.</td></tr>";
}

async function _anasayfaISGKayitlariEkle(tablo) {
    const firmalar = await _veriOku('isg_firmalar', []);
    for (const firma of firmalar) {
        const isg = firma.isg || {};

        // ISG doküman tarihleri
        const kontroller = [
            { tarih: isg.rvRevizyon,        ad: 'Risk Değerlendirmesi Revizyonu', firma: firma.adi },
            { tarih: isg.adpRevizyon,       ad: 'Acil Durum Planı Revizyonu',     firma: firma.adi },
            { tarih: isg.tatbikatSonraki,   ad: 'Acil Durum Tatbikatı',           firma: firma.adi },
            { tarih: isg.denetimGecerlilik, ad: 'DİF/DÖF Takibi',                firma: firma.adi },
        ];

        kontroller.forEach(({ tarih, ad, firma: firmaAdi }) => {
            if (!tarih) return;
            const gun = farkHesapla(tarih);
            if (gun > 30) return;
            const [yil, ay, g] = tarih.split('-');
            const gorselTarih = `${g}.${ay}.${yil}`;
            const kalanYazi   = gun <= 0 ? 'SÜRESİ DOLDU' : gun + ' Gün';
            const renkStyle   = gun <= 10 ? 'color:#dc2626;font-weight:bold;' : 'color:#ea580c;font-weight:bold;';
            tablo.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><i class="fa-solid fa-shield-halved" style="color:#2563eb;"></i> <strong>${ad}</strong><br>
                        <small style="color:#64748b;">${firmaAdi}</small></td>
                    <td>${gorselTarih}</td>
                    <td style="${renkStyle}">${kalanYazi}</td>
                </tr>`);
        });

        // Ortam ölçüm ekipmanları
        const ekipmanlar = await _veriOku('olcum_ekipman_verileri_' + firma.adi, []);
        ekipmanlar.forEach(ekipman => {
            if (!ekipman.gecerlilikTarihi) return;
            const gun = farkHesapla(ekipman.gecerlilikTarihi);
            if (gun > 30) return;
            const [yil, ay, g] = ekipman.gecerlilikTarihi.split('-');
            const gorselTarih = `${g}.${ay}.${yil}`;
            const kalanYazi   = gun <= 0 ? 'SÜRESİ DOLDU' : gun + ' Gün';
            const renkStyle   = gun <= 10 ? 'color:#dc2626;font-weight:bold;' : 'color:#ea580c;font-weight:bold;';
            tablo.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><i class="fa-solid fa-chart-line" style="color:#16a34a;"></i> <strong>Ortam Ölçümü — ${_htmlEsc(ekipman.ekipmanAdi)}</strong><br>
                        <small style="color:#64748b;">${_htmlEsc(firma.adi)}</small></td>
                    <td>${gorselTarih}</td>
                    <td style="${renkStyle}">${kalanYazi}</td>
                </tr>`);
        });

        // Personel bazlı eğitim geçerlilik tarihleri
        const egitimVeri = await _veriOku('egitim_verileri_' + firma.adi, {});
        Object.entries(egitimVeri).forEach(([key, kayit]) => {
            if (!kayit.gecerliTarih) return;
            const gun = farkHesapla(kayit.gecerliTarih);
            if (gun > 30) return;
            const adHam = key.replace(/_[^_]+$/, '').replace(/_/g, ' ');
            const [yil, ay, g] = kayit.gecerliTarih.split('-');
            const gorselTarih = `${g}.${ay}.${yil}`;
            const kalanYazi   = gun <= 0 ? 'SÜRESİ DOLDU' : gun + ' Gün';
            const renkStyle   = gun <= 10 ? 'color:#dc2626;font-weight:bold;' : 'color:#ea580c;font-weight:bold;';
            tablo.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><i class="fa-solid fa-graduation-cap" style="color:#7c3aed;"></i> <strong>Eğitim — ${_htmlEsc(adHam)}</strong><br>
                        <small style="color:#64748b;">${_htmlEsc(firma.adi)}</small></td>
                    <td>${gorselTarih}</td>
                    <td style="${renkStyle}">${kalanYazi}</td>
                </tr>`);
        });

        // Personel bazlı sağlık muayenesi geçerlilik tarihleri
        const muayeneVeri = await _veriOku('muayene_verileri_' + firma.adi, {});
        Object.entries(muayeneVeri).forEach(([key, kayit]) => {
            if (!kayit.gecerliTarih) return;
            const gun = farkHesapla(kayit.gecerliTarih);
            if (gun > 30) return;
            const adHam = key.replace(/_[^_]+$/, '').replace(/_/g, ' ');
            const [yil, ay, g] = kayit.gecerliTarih.split('-');
            const gorselTarih = `${g}.${ay}.${yil}`;
            const kalanYazi   = gun <= 0 ? 'SÜRESİ DOLDU' : gun + ' Gün';
            const renkStyle   = gun <= 10 ? 'color:#dc2626;font-weight:bold;' : 'color:#ea580c;font-weight:bold;';
            tablo.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><i class="fa-solid fa-stethoscope" style="color:#0891b2;"></i> <strong>Muayene — ${_htmlEsc(adHam)}</strong><br>
                        <small style="color:#64748b;">${_htmlEsc(firma.adi)}</small></td>
                    <td>${gorselTarih}</td>
                    <td style="${renkStyle}">${kalanYazi}</td>
                </tr>`);
        });

        // İlkyardımcı eğitim geçerlilik tarihleri
        const ilkyardimVeri = await _veriOku('ilkyardim_verileri_' + firma.adi, {});
        Object.entries(ilkyardimVeri).forEach(([key, kayit]) => {
            if (!kayit.gecerliTarih) return;
            const gun = farkHesapla(kayit.gecerliTarih);
            if (gun > 30) return;
            const adHam = kayit.personelAd
                ? kayit.personelAd.replace(/ — .*$/, '').trim()
                : key.replace(/_[^_]+$/, '').replace(/_/g, ' ');
            const [yil, ay, g] = kayit.gecerliTarih.split('-');
            const gorselTarih = `${g}.${ay}.${yil}`;
            const kalanYazi   = gun <= 0 ? 'SÜRESİ DOLDU' : gun + ' Gün';
            const renkStyle   = gun <= 10 ? 'color:#dc2626;font-weight:bold;' : 'color:#ea580c;font-weight:bold;';
            tablo.insertAdjacentHTML('beforeend', `
                <tr>
                    <td><i class="fa-solid fa-kit-medical" style="color:#dc2626;"></i> <strong>İlkyardım — ${_htmlEsc(adHam)}</strong><br>
                        <small style="color:#64748b;">${_htmlEsc(firma.adi)}</small></td>
                    <td>${gorselTarih}</td>
                    <td style="${renkStyle}">${kalanYazi}</td>
                </tr>`);
        });
    }
}

async function tumDokumanlariGetir() {
    const firmalar = await _veriOku('isg_firmalar', []);
    let sonuc = [];
    for (const firma of firmalar) {
        const isgDocs = await _veriOku('isg_dosyalar_' + firma.adi, {});
        Object.keys(isgDocs).forEach(kat => {
            (isgDocs[kat] || []).forEach(doc => {
                sonuc.push({ ...doc, firma: firma.adi });
            });
        });
    }
    return sonuc;
}

// FİRMA KLASÖR GÖRÜNÜMÜ
async function firmaKlasorleriYukle() {
    const grid = document.getElementById('firma-klasor-grid');
    if (!grid) return;

    grid.innerHTML = '<div style="text-align:center; grid-column:1/-1; padding:20px;">Firmalar yükleniyor...</div>';

    try {
        // Gerçek API'den (MongoDB'den) firmaları çekiyoruz
        const res = await AUTH.apiFetch('/api/firmalar');
        if (!res.ok) throw new Error('Firmalar alınamadı');
        
        const data = await res.json();
        const firmalar = data.veri || []; // Senin firmaController'ın 'veri' objesi içinde döndürüyor

        grid.innerHTML = '';

        if (firmalar.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:50px 20px;color:#94a3b8;">
                    <i class="fa-solid fa-building" style="font-size:2.5rem;margin-bottom:12px;display:block;"></i>
                    <p>Henüz firma eklenmemiş veya görme yetkiniz yok.
                       <a href="firmalar" style="color:#2563eb;font-weight:600;">Firmalar sayfasına gidin.</a>
                    </p>
                </div>`;
            return;
        }

        for (const [idx, firma] of firmalar.entries()) {
            // firma.firmaAdi, MongoDB modelindeki alan adıdır
            const firmaAdi = firma.firmaAdi || firma.adi || 'İsimsiz Firma'; 
            
            const isgDocs   = await _veriOku('isg_dosyalar_' + firmaAdi, {});
            const toplamDoc = Object.values(isgDocs).reduce((t, arr) => t + (arr ? arr.length : 0), 0);

            const tamam  = await _isgTamamSayisi(firmaAdi);
            const toplam = Object.keys(kartKontroller).length;
            const yuzde  = Math.round((tamam / toplam) * 100);
            const renkStyle = yuzde === 100
                ? 'background:#dcfce7;color:#16a34a;'
                : yuzde >= 50 ? 'background:#fef9c3;color:#92400e;'
                : 'background:#fee2e2;color:#b91c1c;';
            const isgRozet = `<span style="font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:10px;${renkStyle}">İSG %${yuzde}</span>`;

            let sinifClass = 'etiket basarili';
            if (firma.tehlikeSinifi && firma.tehlikeSinifi.toLowerCase().includes('çok tehlikeli')) sinifClass = 'etiket tehlike';
            else if (firma.tehlikeSinifi && firma.tehlikeSinifi.toLowerCase().includes('tehlikeli')) sinifClass = 'etiket uyari';

            const sinifYazi = firma.tehlikeSinifi ? firma.tehlikeSinifi.toUpperCase() : 'BELİRSİZ';

            grid.insertAdjacentHTML('beforeend', `
                <div class="firma-klasor-karti"
                     onclick="firmaKlasorAc('${firmaAdi.replace(/'/g, "\\'")}', '${firma._id}')">
                    <div class="firma-klasor-ust">
                        <div class="klasor-ikon-kutu">
                            <i class="fa-solid fa-folder-open"></i>
                        </div>
                        <div class="firma-klasor-bilgi">
                            <h4>${firmaAdi}</h4>
                            <span>${firma.yetkiliKisi || ''}</span>
                        </div>
                    </div>
                    <div class="firma-klasor-alt">
                        <span class="firma-dokuman-sayisi">${toplamDoc} Belge</span>
                        ${isgRozet}
                        <span class="${sinifClass}" style="font-size:0.68rem;padding:2px 8px; border-radius:8px;">${sinifYazi}</span>
                    </div>
                </div>`);
        }
    } catch (err) {
        console.error("Firma klasörleri yüklenirken hata:", err);
        grid.innerHTML = '<div style="text-align:center; color:red; grid-column:1/-1;">Firmalar yüklenirken bir hata oluştu.</div>';
    }
}

async function _isgTamamSayisi(firmaAdi) {
    const firmalar = await _veriOku('isg_firmalar', []);
    const firma = firmalar.find(f => f.adi === firmaAdi);
    if (!firma || !firma.isg) return 0;
    const isg = firma.isg;
    let tamam = 0;

    if (isg.igu && isg.hekim) tamam++;

    const temsilciVeri = await _veriOku('temsilci_verileri_' + firmaAdi, {});
    if (Object.keys(temsilciVeri).length > 0) tamam++;

    const destekVeri   = await _veriOku('destek_verileri_' + firmaAdi, {});
    const destekEkipler = ['koruma', 'kurtarma', 'sondurme', 'ilkyardim'];
    if (destekEkipler.some(e => destekVeri[e] && Object.keys(destekVeri[e]).length > 0)) tamam++;

    if (isg.kurulZorunluDegil || isg.kurulToplanti) tamam++;

    const muayeneVeri = await _veriOku('muayene_verileri_' + firmaAdi, {});
    if (Object.keys(muayeneVeri).length > 0) tamam++;

    const egitimVeri = await _veriOku('egitim_verileri_' + firmaAdi, {});
    if (Object.keys(egitimVeri).length > 0) tamam++;

    const ilkyardimVeri = await _veriOku('ilkyardim_verileri_' + firmaAdi, {});
    if (Object.keys(ilkyardimVeri).length >= 1) tamam++;

    if (isg.rvTarih)       tamam++;
    if (isg.adpTarih)      tamam++;
    if (isg.tatbikatSon)   tamam++;

    const olcumEkipmanlar = await _veriOku('olcum_ekipman_verileri_' + firmaAdi, []);
    if (olcumEkipmanlar.length > 0) tamam++;

    if (isg.denetimTarih) tamam++;
    if (isg.kkdTarih)     tamam++;
    return tamam;
}

// ==========================================
// FİRMA KLASÖRÜ AÇ → direkt İSG
// ==========================================
async function firmaKlasorAc(firmaAdi, gelenIdVeyaIdx) {
    aktifFirma   = firmaAdi;  // geçici
    aktifFirmaId = gelenIdVeyaIdx;

    const firmalar = await _veriOku('isg_firmalar', []);
    
    let gercekIdx = firmalar.findIndex(f => 
        (f._id && f._id === gelenIdVeyaIdx) || f.adi === firmaAdi
    );
    if (gercekIdx === -1 && typeof gelenIdVeyaIdx === 'number') gercekIdx = gelenIdVeyaIdx;
    if (gercekIdx === -1) gercekIdx = 0;

    // 🔧 Firma objesini AYRI bir değişkende tut — aktifFirma her zaman STRING kalmalı
    const aktifFirmaObj = firmalar[gercekIdx] || { adi: firmaAdi, firmaAdi: firmaAdi };

    aktifFirmaIdx    = gercekIdx;
    aktifFirma       = firmaAdi;                                  // ✅ STRING (geri eski hali)
    aktifFirmaId     = aktifFirmaObj._id || gelenIdVeyaIdx;
    aktifFirmaSinifi = aktifFirmaObj.sinif || aktifFirmaObj.tehlikeSinifi || '';
    kurulGecmisToplantılar = aktifFirmaObj.isg?.kurulGecmisToplantılar || [];

    document.getElementById('katman-klasorler').style.display = 'none';
    document.getElementById('katman-firma').style.display     = 'block';
    breadcrumbGuncelle([
        { ad: 'Anasayfa',   link: '/anasayfa' },
        { ad: 'Dokümanlar', tiklama: 'klasorGer()' },
        { ad: firmaAdi }
    ]);
    document.getElementById('aktif-firma-baslik').innerHTML =
        `<i class="fa-solid fa-folder-open" style="color:#f59e0b;"></i> ${firmaAdi}`;

    yuklenenDosyalar = {};
    bekleyenDosyalar = {};
    
    await isgVerileriniYukle(firmaAdi, aktifFirmaIdx);
    await muayeneFirmaSelectDoldur();
    await egitimFirmaSelectDoldur();
    await ilkyardimFirmaSelectDoldur();
    await temsilciFirmaSelectDoldur();
    await destekFirmaSelectDoldur();
    await uzmanVerileriYukle();
}

function klasorGer() {
    aktifFirma           = null;
    aktifFirmaIdx        = null;
    aktifFirmaSinifi     = '';
    yuklenenDosyalar     = {};
    bekleyenDosyalar     = {};
    aktifKlasorKategori  = null;
    kurulGecmisToplantılar = [];

    document.getElementById('katman-klasorler').style.display = 'block';
    document.getElementById('katman-firma').style.display     = 'none';
    breadcrumbGuncelle([
        { ad: 'Anasayfa',   link: '/anasayfa' },
        { ad: 'Dokümanlar' }
    ]);
    document.getElementById('genel-arama').value = '';
    firmaKlasorleriYukle();
}

// ==========================================
// ARAMA
// ==========================================
function aramaYap(kelime) {
    const aranan = kelime.toLowerCase().trim();
    document.querySelectorAll('.firma-klasor-karti').forEach(kart => {
        const ad = kart.querySelector('h4')?.textContent.toLowerCase() || '';
        kart.style.display = ad.includes(aranan) ? '' : 'none';
    });
}

// ==========================================
// DESTEK ELEMANLARI — PERSONEL BAZLI
// ==========================================

const DESTEK_EKIPLER = {
    koruma:    { label: 'Koruma Ekibi',   ikon: 'fa-shield',           renk: '#1d4ed8' },
    kurtarma:  { label: 'Kurtarma Ekibi', ikon: 'fa-person-drowning',  renk: '#0369a1' },
    sondurme:  { label: 'Söndürme Ekibi', ikon: 'fa-fire-extinguisher', renk: '#b45309' },
    ilkyardim: { label: 'İlkyardım Ekibi', ikon: 'fa-kit-medical',      renk: '#dc2626' },
};

async function destekFirmaSelectDoldur() {
    if (!aktifFirma) return;

    const [personeller1, personeller2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel = _personelBirlestir(personeller1, personeller2);

    const firmaPersonel = _firmaPersonelFiltrele(tumPersonel, aktifFirma);
    const destekData    = await _veriOku('destek_verileri_' + aktifFirma, {});
    let toplamAtanan = 0;

    Object.keys(DESTEK_EKIPLER).forEach(ekip => {
        const sel = document.getElementById('destek-' + ekip + '-secim');
        if (!sel) return;

        sel.innerHTML = '<option value="">— Personel Seçin —</option>';
        firmaPersonel.forEach(p => {
            const ad    = p.adSoyad || p.ad || '';
            const gorev = p.gorev || p.pozisyon || '';
            const opt   = document.createElement('option');
            opt.value       = _personelKey(p);
            opt.textContent = ad + (gorev ? ' — ' + gorev : '');
            sel.appendChild(opt);
        });

        const ekipData = destekData[ekip] || {};
        toplamAtanan  += Object.keys(ekipData).length;
        _destekPersonelDurumGuncelle(ekip, destekData);
    });

    const btnGoruntule = document.getElementById('btn-destek-goruntule');
    const sayiEl       = document.getElementById('destek-btn-sayi');
    if (btnGoruntule) btnGoruntule.style.display = toplamAtanan > 0 ? 'flex' : 'none';
    if (sayiEl) sayiEl.textContent = toplamAtanan;
}

async function _destekPersonelDurumGuncelle(ekip, destekDataParam) {
    const destekData = destekDataParam || await _veriOku('destek_verileri_' + aktifFirma, {});
    const ekipData   = destekData[ekip] || {};
    const keys = Object.keys(ekipData);

    const durum = document.getElementById('destek-' + ekip + '-durum');
    if (!durum) return;

    if (keys.length > 0) {
        durum.className = 'muayene-personel-durum gecerli';
        durum.style.display = 'flex';
        durum.innerHTML = '✓ ' + keys.length + ' kişi atandı';
    } else {
        durum.style.display = 'none';
    }
}

async function destekPersonelSecildi(ekip) {
    const sel    = document.getElementById('destek-' + ekip + '-secim');
    const alan   = document.getElementById('destek-' + ekip + '-tarih-alani');
    const kaydet = document.getElementById('btn-destek-' + ekip + '-kaydet');
    if (!sel) return;

    const key = sel.value;
    if (!key || !aktifFirma) {
        if (alan)   alan.style.display   = 'none';
        if (kaydet) kaydet.style.display = 'none';
        return;
    }

    const destekData   = await _veriOku('destek_verileri_' + aktifFirma, {});
    const ekipData     = destekData[ekip] || {};
    const kayit        = ekipData[key] || {};
    const atamaTarihEl = document.getElementById('destek-' + ekip + '-atama-tarih');
    if (atamaTarihEl) atamaTarihEl.value = kayit.atamaTarih || '';

    if (alan)   alan.style.display   = 'block';
    if (kaydet) kaydet.style.display = 'flex';
}

async function destekPersonelKaydet(ekip) {
    const sel = document.getElementById('destek-' + ekip + '-secim');
    if (!sel || !aktifFirma || !sel.value) return;

    const key          = sel.value;
    const atamaTarihEl = document.getElementById('destek-' + ekip + '-atama-tarih');
    const atamaTarih   = atamaTarihEl ? atamaTarihEl.value : '';
    const selectedOpt  = sel.options[sel.selectedIndex];
    const personelAd   = selectedOpt ? selectedOpt.textContent : key;

    const storageKey = 'destek_verileri_' + aktifFirma;
    const destekData = await _veriOku(storageKey, {});
    if (!destekData[ekip]) destekData[ekip] = {};
    destekData[ekip][key] = { atamaTarih, personelAd };
    await _veriYaz(storageKey, destekData);

    await _destekPersonelDurumGuncelle(ekip, destekData);
    await kartGuncelle('kart-destek');

    const sayiEl = document.getElementById('destek-btn-sayi');
    const btnGoruntule = document.getElementById('btn-destek-goruntule');
    if (btnGoruntule) btnGoruntule.style.display = 'flex';
    if (sayiEl) {
        let toplam = 0;
        Object.keys(DESTEK_EKIPLER).forEach(e => {
            toplam += Object.keys(destekData[e] || {}).length;
        });
        sayiEl.textContent = toplam;
    }

    const btn = document.getElementById('btn-destek-' + ekip + '-kaydet');
    if (btn) {
        const orijinal = btn.innerHTML;
        btn.innerHTML  = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
        btn.style.background = '#15803d';
        setTimeout(() => { btn.innerHTML = orijinal; btn.style.background = ''; }, 1800);
    }
}

async function destekModalAc() {
    if (!aktifFirma) { alert('Lütfen önce bir firma klasörü açın.'); return; }
    const baslikEl = document.getElementById('destek-modal-baslik');
    if (baslikEl) baslikEl.textContent = `Destek Elemanları Durumu — ${aktifFirma}`;
    await _destekModalTablosunuDoldur();
    document.getElementById('destek-modal').classList.add('acik');
}

async function _destekModalTablosunuDoldur() {
    if (!aktifFirma) return;

    const destekData = await _veriOku('destek_verileri_' + aktifFirma, {});
    const [p1, p2]   = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel = _personelBirlestir(p1, p2);

    const tablo = document.getElementById('destek-modal-tablo');
    const body  = document.getElementById('destek-modal-tablo-body');
    const bos   = document.getElementById('destek-modal-bos-mesaj');

    let toplamKayit = 0;
    let atananSayac = 0;
    Object.keys(DESTEK_EKIPLER).forEach(ekip => {
        toplamKayit += Object.keys(destekData[ekip] || {}).length;
    });

    if (toplamKayit === 0) {
        if (tablo) tablo.style.display = 'none';
        if (bos)   bos.style.display   = 'block';
        _destekOzetGuncelle(0, 0);
        return;
    }

    if (tablo) tablo.style.display = 'table';
    if (bos)   bos.style.display   = 'none';
    if (body)  body.innerHTML = '';

    let satirNo = 0;
    Object.keys(DESTEK_EKIPLER).forEach(ekip => {
        const ekipBilgi = DESTEK_EKIPLER[ekip];
        const ekipData  = destekData[ekip] || {};
        const keys      = Object.keys(ekipData);

        keys.forEach(key => {
            satirNo++;
            const kayit      = ekipData[key];
            const atamaTarih = kayit.atamaTarih || '';

            const personelAdHam = kayit.personelAd || key.replace(/_/g, ' ');
            const sepIdx        = personelAdHam.indexOf(' — ');
            const personelAd    = sepIdx !== -1 ? personelAdHam.substring(0, sepIdx).trim() : personelAdHam;
            const gorevKismi    = sepIdx !== -1 ? personelAdHam.substring(sepIdx + 3).trim() : '—';

            const personelObj = tumPersonel.find(p => _personelKey(p) === key);
            const pozisyon    = personelObj
                ? (personelObj.gorev || personelObj.pozisyon || personelObj.unvan || gorevKismi)
                : gorevKismi;

            if (atamaTarih) atananSayac++;
            const baslarf = personelAd.substring(0, 2).toUpperCase();

            if (body) body.insertAdjacentHTML('beforeend', `
                <tr>
                    <td style="color:#94a3b8;font-size:11px;">${satirNo}</td>
                    <td>
                        <div style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:12px;background:#f1f5f9;font-size:10px;font-weight:700;color:${ekipBilgi.renk};">
                            <i class="fa-solid ${ekipBilgi.ikon}" style="font-size:9px;"></i>
                            ${ekipBilgi.label}
                        </div>
                    </td>
                    <td>
                        <div class="personel-ad-hucre">
                            <div class="personel-avatar-mini" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);">${baslarf}</div>
                            <div style="font-weight:700;font-size:12px;">${_htmlEsc(personelAd)}</div>
                        </div>
                    </td>
                    <td style="font-size:11px;color:#64748b;">${_htmlEsc(pozisyon)}</td>
                    <td>
                        <input type="date" class="muayene-tarih-input"
                               value="${atamaTarih}"
                               onchange="destekTarihGuncelle('${ekip}','${key}',this.value)">
                    </td>
                    <td>
                        <button onclick="destekModalSil('${ekip}','${key}')"
                            style="background:#fee2e2;border:1px solid #fecaca;color:#dc2626;border-radius:6px;padding:4px 9px;cursor:pointer;font-size:11px;font-weight:600;display:flex;align-items:center;gap:4px;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`);
        });
    });

    _destekOzetGuncelle(toplamKayit, atananSayac);
}

async function destekTarihGuncelle(ekip, key, deger) {
    if (!aktifFirma) return;
    const storageKey = 'destek_verileri_' + aktifFirma;
    const destekData = await _veriOku(storageKey, {});
    if (!destekData[ekip]) destekData[ekip] = {};
    if (!destekData[ekip][key]) destekData[ekip][key] = {};
    destekData[ekip][key].atamaTarih = deger;
    await _veriYaz(storageKey, destekData);
}

async function destekModalSil(ekip, key) {
    if (!confirm('Bu destek elemanı kaydını silmek istediğinize emin misiniz?')) return;
    const storageKey = 'destek_verileri_' + aktifFirma;
    const destekData = await _veriOku(storageKey, {});
    if (destekData[ekip]) delete destekData[ekip][key];
    await _veriYaz(storageKey, destekData);

    await kartGuncelle('kart-destek');
    await _destekPersonelDurumGuncelle(ekip, destekData);

    let toplam = 0;
    Object.keys(DESTEK_EKIPLER).forEach(e => {
        toplam += Object.keys(destekData[e] || {}).length;
    });
    const sayiEl = document.getElementById('destek-btn-sayi');
    if (sayiEl) sayiEl.textContent = toplam;
    const btnGoruntule = document.getElementById('btn-destek-goruntule');
    if (btnGoruntule) btnGoruntule.style.display = toplam > 0 ? 'flex' : 'none';

    await _destekModalTablosunuDoldur();
    firmaKlasorleriYukle();
}

function _destekOzetGuncelle(toplam, atanan) {
    const chipToplam  = document.getElementById('destek-chip-toplam');
    const chipGecerli = document.getElementById('destek-chip-gecerli');
    if (chipToplam)  chipToplam.textContent  = `Toplam: ${toplam}`;
    if (chipGecerli) chipGecerli.textContent = `✓ Atandı: ${atanan}`;
}

function destekModalKapat() {
    const modal = document.getElementById('destek-modal');
    if (modal) modal.classList.remove('acik');
}

function destekPNGIndir() {
    const el = document.getElementById('destek-tablo-sarici');
    if (!el) return;
    const _do = () => html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        const a = document.createElement('a');
        a.download = 'destek_elemanlari_durumu.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
    if (typeof html2canvas === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = _do;
        document.head.appendChild(s);
    } else { _do(); }
}

function destekPDFIndir() {
    const el = document.getElementById('destek-tablo-sarici');
    if (!el) return;
    const _doIndir = () => {
        html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const imgW = 277;
            const imgH = (canvas.height * imgW) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgW, imgH);
            pdf.save('destek_elemanlari_durumu.pdf');
        });
    };
    _scriptYukleVeCalistir(
        ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
         'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'],
        () => typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined',
        _doIndir
    );
}

// ═══════════════════════════════════════════════════════════════════════
// UZMAN / HEKİM / DSP YÖNETİMİ
// ═══════════════════════════════════════════════════════════════════════

async function uzmanKaydet() {
    if (!aktifFirma) { alert('Lütfen önce bir firma klasörü açın.'); return; }

    const igu        = (v('igu')   || '').trim();
    const hekim      = (v('hekim') || '').trim();
    const dsp        = (v('dsp')   || '').trim();
    const iguTarih   = v('igu-tarih')   || null;
    const hekimTarih = v('hekim-tarih') || null;
    const dspTarih   = v('dsp-tarih')   || null;

    if (!igu && !hekim && !dsp) { alert('Lütfen en az bir ad giriniz.'); return; }

    const res = await AUTH.apiFetch(`/api/dokumanlar/uzman/${aktifFirma}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            igu:   { ad: igu,   atamaTarihi: iguTarih   },
            hekim: { ad: hekim, atamaTarihi: hekimTarih },
            dsp:   { ad: dsp,   atamaTarihi: dspTarih   },
        })
    });

    if (res.ok) {
        if (typeof showToast === 'function') showToast('Kaydedildi.', 'basarili');
        else alert('✓ Bilgiler kaydedildi.');
        await kartGuncelle('kart-uzman');
        await _uzmanGoruntuleButonuGuncelle();
    } else {
        alert('Kayıt sırasında hata oluştu.');
    }
}

async function uzmanVerileriYukle() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    
    if (!aktifFirma) {
        ['igu','igu-tarih','hekim','hekim-tarih','dsp','dsp-tarih'].forEach(id => set(id, ''));
        await _uzmanGoruntuleButonuGuncelle();
        return;
    }

    try {
        const res  = await AUTH.apiFetch(`/api/dokumanlar/uzman/${aktifFirma}`);
        const veri = await res.json();

        set('igu',         veri.igu?.ad);
        set('igu-tarih',   veri.igu?.atamaTarihi);
        set('hekim',       veri.hekim?.ad);
        set('hekim-tarih', veri.hekim?.atamaTarihi);
        set('dsp',         veri.dsp?.ad);
        set('dsp-tarih',   veri.dsp?.atamaTarihi);
    } catch (e) {
        console.warn('Uzman verisi yüklenemedi:', e.message);
    }

    await _uzmanGoruntuleButonuGuncelle();
}

async function _uzmanGoruntuleButonuGuncelle() {
    const btn  = document.getElementById('btn-uzman-goruntule');
    const sayi = document.getElementById('uzman-btn-sayi');
    if (!btn || !sayi) return;

    if (!aktifFirma) {
        btn.style.display = 'none';
        sayi.textContent = '0';
        return;
    }

    try {
        const res  = await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(aktifFirma)}`);
        const veri = await res.json();
        const adliSayi = ['igu', 'hekim', 'dsp']
            .filter(k => veri[k]?.ad && veri[k].ad.trim()).length;

        btn.style.display = adliSayi > 0 ? 'flex' : 'none';
        sayi.textContent = adliSayi;
    } catch (e) {
        btn.style.display = 'none';
        sayi.textContent = '0';
    }
}

async function uzmanModalAc() {
    if (!aktifFirma) {
        alert('Lütfen önce bir firma klasörü açın.');
        return;
    }
    const baslikEl = document.getElementById('uzman-modal-baslik');
    if (baslikEl) baslikEl.textContent = `Uzman / Hekim / DSP Durumu — ${aktifFirma}`;
    await _uzmanModalTablosunuDoldur();
    const modal = document.getElementById('uzman-modal');
    modal.style.display = 'flex';
    modal.classList.add('acik');
}

async function _uzmanModalTablosunuDoldur() {
    const tbody = document.getElementById('uzman-modal-tbody');
    if (!tbody) return;

    const res  = await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(aktifFirma)}`);
    const veri = await res.json();

    const roller = [
        { key: 'igu',   etiket: 'İş Güvenliği Uzmanı', ikon: 'fa-shield-halved' },
        { key: 'hekim', etiket: 'İşyeri Hekimi',        ikon: 'fa-stethoscope'   },
        { key: 'dsp',   etiket: 'DSP',                   ikon: 'fa-user-tie'      },
    ];

    tbody.innerHTML = roller.map(r => {
        const kayit  = veri[r.key] || {};
        const ad     = (kayit.ad || '').trim();
        const tarih  = kayit.atamaTarihi || '';
        const adHtml = ad ? ad : '<span class="bos-kayit">Atanmamış</span>';
        const dis    = ad ? '' : 'disabled';

        return `
        <tr>
            <td><i class="fa-solid ${r.ikon}" style="margin-right:6px;color:#dc2626;"></i>${r.etiket}</td>
            <td>${adHtml}</td>
            <td>
                <input type="date" value="${tarih}" ${dis}
                       onchange="uzmanTarihGuncelle('${r.key}', this.value)">
            </td>
            <td>
                <button class="btn-sil-mini" ${dis} onclick="uzmanModalSil('${r.key}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

async function uzmanTarihGuncelle(key, deger) {
    if (!aktifFirma) return;

    const res  = await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(aktifFirma)}`);
    const veri = await res.json();

    if (!veri[key]) veri[key] = { ad: '', atamaTarihi: null };
    veri[key].atamaTarihi = deger || null;

    await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(aktifFirma)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veri)
    });

    const kartTarih = document.getElementById(`${key}-tarih`);
    if (kartTarih) kartTarih.value = deger || '';
}

async function uzmanModalSil(key) {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;

    const res  = await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(aktifFirma)}`);
    const veri = await res.json();

    if (veri[key]) {
        veri[key].ad = '';
        veri[key].atamaTarihi = null;
    }

    await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(aktifFirma)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veri)
    });

    const kartAd    = document.getElementById(key);
    const kartTarih = document.getElementById(`${key}-tarih`);
    if (kartAd)    kartAd.value    = '';
    if (kartTarih) kartTarih.value = '';

    await _uzmanModalTablosunuDoldur();
    await kartGuncelle('kart-uzman');
    await _uzmanGoruntuleButonuGuncelle();
}
// ==========================================
// ÇALIŞAN TEMSİLCİSİ — PERSONEL BAZLI
// ==========================================

async function temsilciFirmaSelectDoldur() {
    const sel = document.getElementById('temsilci-personel-secim');
    if (!sel) return;

    const [p1, p2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel   = _personelBirlestir(p1, p2);
    const firmaPersonel = _firmaPersonelFiltrele(tumPersonel, aktifFirma);

    sel.innerHTML = '<option value="">— Personel Seçin —</option>';
    firmaPersonel.forEach(p => {
        const ad    = p.adSoyad || p.ad || '';
        const gorev = p.gorev || p.pozisyon || '';
        const opt   = document.createElement('option');
        opt.value       = _personelKey(p);
        opt.textContent = ad + (gorev ? ' — ' + gorev : '');
        sel.appendChild(opt);
    });

    const temsilciData = await _veriOku('temsilci_verileri_' + aktifFirma, {});
    const mevcutSayi   = Object.keys(temsilciData).length;

    const btnGoruntule = document.getElementById('btn-temsilci-goruntule');
    const sayiEl       = document.getElementById('temsilci-btn-sayi');
    if (btnGoruntule) {
        btnGoruntule.style.display = (firmaPersonel.length > 0 || mevcutSayi > 0) ? 'flex' : 'none';
    }
    if (sayiEl) sayiEl.textContent = mevcutSayi;

    await temsilciPersonelSecildi();
}

async function temsilciPersonelSecildi() {
    const sel    = document.getElementById('temsilci-personel-secim');
    const alan   = document.getElementById('temsilci-tarih-alani');
    const kaydet = document.getElementById('btn-temsilci-kaydet');
    const durum  = document.getElementById('temsilci-personel-durum');
    const atamaTarihEl = document.getElementById('temsilci-atama-tarih');
    if (!sel) return;

    const key = sel.value;
    if (!key || !aktifFirma) {
        if (alan)   alan.style.display   = 'none';
        if (kaydet) kaydet.style.display = 'none';
        if (durum)  durum.style.display  = 'none';
        return;
    }

    const temsilciData = await _veriOku('temsilci_verileri_' + aktifFirma, {});
    const kayit = temsilciData[key] || {};

    if (atamaTarihEl) atamaTarihEl.value = kayit.atamaTarih || '';
    if (alan)   alan.style.display   = 'grid';
    if (kaydet) kaydet.style.display = 'flex';

    if (durum && kayit.atamaTarih) {
        durum.className = 'muayene-personel-durum gecerli';
        durum.style.display = 'flex';
        durum.innerHTML = '✓ Atama tarihi: ' + _tarihGorsel(kayit.atamaTarih);
    } else if (durum) {
        durum.style.display = 'none';
    }
}

async function temsilciPersonelKaydet() {
    const sel          = document.getElementById('temsilci-personel-secim');
    const atamaTarihEl = document.getElementById('temsilci-atama-tarih');
    if (!sel || !aktifFirma || !sel.value) return;

    const key        = sel.value;
    const atamaTarih = atamaTarihEl ? atamaTarihEl.value : '';
    const selectedOpt = sel.options[sel.selectedIndex];
    const personelAd  = selectedOpt ? selectedOpt.textContent : key;

    const storageKey   = 'temsilci_verileri_' + aktifFirma;
    const temsilciData = await _veriOku(storageKey, {});
    temsilciData[key]  = { atamaTarih, personelAd };
    await _veriYaz(storageKey, temsilciData);

    const durum = document.getElementById('temsilci-personel-durum');
    if (durum && atamaTarih) {
        durum.className     = 'muayene-personel-durum gecerli';
        durum.style.display = 'flex';
        durum.innerHTML     = '✓ Atama tarihi: ' + _tarihGorsel(atamaTarih);
    }

    await uzmanVerileriYukle();
    await kartGuncelle('kart-temsilci');

    const btnGoruntule = document.getElementById('btn-temsilci-goruntule');
    if (btnGoruntule) {
        btnGoruntule.style.display = 'flex';
        const sayiEl = document.getElementById('temsilci-btn-sayi');
        if (sayiEl) sayiEl.textContent = Object.keys(temsilciData).length;
    }

    const btn = document.getElementById('btn-temsilci-kaydet');
    if (btn) {
        const orijinal = btn.innerHTML;
        btn.innerHTML  = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
        btn.style.background = '#15803d';
        setTimeout(() => { btn.innerHTML = orijinal; btn.style.background = ''; }, 1800);
    }
}

async function temsilciModalAc() {
    if (!aktifFirma) { alert('Lütfen önce bir firma klasörü açın.'); return; }
    const baslikEl = document.getElementById('temsilci-modal-baslik');
    if (baslikEl) baslikEl.textContent = `Çalışan Temsilcisi Durumu — ${aktifFirma}`;
    await _temsilciModalTablosunuDoldur();
    document.getElementById('temsilci-modal').classList.add('acik');
}

async function _temsilciModalTablosunuDoldur() {
    if (!aktifFirma) return;

    const temsilciData = await _veriOku('temsilci_verileri_' + aktifFirma, {});
    const keys = Object.keys(temsilciData);

    const tablo = document.getElementById('temsilci-modal-tablo');
    const body  = document.getElementById('temsilci-modal-tablo-body');
    const bos   = document.getElementById('temsilci-modal-bos-mesaj');

    if (keys.length === 0) {
        if (tablo) tablo.style.display = 'none';
        if (bos)   bos.style.display   = 'block';
        _temsilciOzetGuncelle(0, 0);
        return;
    }

    if (tablo) tablo.style.display = 'table';
    if (bos)   bos.style.display   = 'none';
    if (body)  body.innerHTML = '';

    const [p1, p2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel = _personelBirlestir(p1, p2);
    let atananSayac = 0;

    keys.forEach((key, idx) => {
        const kayit      = temsilciData[key];
        const atamaTarih = kayit.atamaTarih || '';

        const personelAdHam = kayit.personelAd || key.replace(/_/g, ' ');
        const sepIdx        = personelAdHam.indexOf(' — ');
        const personelAd    = sepIdx !== -1 ? personelAdHam.substring(0, sepIdx).trim() : personelAdHam;
        const gorevKismi    = sepIdx !== -1 ? personelAdHam.substring(sepIdx + 3).trim() : '—';

        const personelObj = tumPersonel.find(p => _personelKey(p) === key);
        const pozisyon    = personelObj
            ? (personelObj.gorev || personelObj.pozisyon || personelObj.unvan || gorevKismi)
            : gorevKismi;

        if (atamaTarih) atananSayac++;
        const baslarf = personelAd.substring(0, 2).toUpperCase();

        if (body) body.insertAdjacentHTML('beforeend', `
            <tr>
                <td style="color:#94a3b8;font-size:11px;">${idx + 1}</td>
                <td>
                    <div class="personel-ad-hucre">
                        <div class="personel-avatar-mini" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);">${baslarf}</div>
                        <div>
                            <div style="font-weight:700;font-size:12px;">${_htmlEsc(personelAd)}</div>
                        </div>
                    </div>
                </td>
                <td style="font-size:11px;color:#64748b;">${_htmlEsc(pozisyon)}</td>
                <td>
                    <input type="date" class="muayene-tarih-input"
                           value="${atamaTarih}"
                           onchange="temsilciTarihGuncelle('${key}', this.value)">
                </td>
                <td>
                    <button onclick="temsilciModalSil('${key}')"
                        style="background:#fee2e2;border:1px solid #fecaca;color:#dc2626;border-radius:6px;padding:4px 9px;cursor:pointer;font-size:11px;font-weight:600;display:flex;align-items:center;gap:4px;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`);
    });

    _temsilciOzetGuncelle(keys.length, atananSayac);
}

async function temsilciTarihGuncelle(key, deger) {
    if (!aktifFirma) return;
    const storageKey   = 'temsilci_verileri_' + aktifFirma;
    const temsilciData = await _veriOku(storageKey, {});
    if (!temsilciData[key]) temsilciData[key] = {};
    temsilciData[key].atamaTarih = deger;
    await _veriYaz(storageKey, temsilciData);
}

async function temsilciModalSil(key) {
    if (!confirm('Bu çalışan temsilcisi kaydını silmek istediğinize emin misiniz?')) return;
    const storageKey   = 'temsilci_verileri_' + aktifFirma;
    const temsilciData = await _veriOku(storageKey, {});
    delete temsilciData[key];
    await _veriYaz(storageKey, temsilciData);

    await kartGuncelle('kart-temsilci');

    const sayiEl = document.getElementById('temsilci-btn-sayi');
    if (sayiEl) sayiEl.textContent = Object.keys(temsilciData).length;

    const btnGoruntule = document.getElementById('btn-temsilci-goruntule');
    if (btnGoruntule && Object.keys(temsilciData).length === 0) {
        btnGoruntule.style.display = 'none';
    }

    await _temsilciModalTablosunuDoldur();
    firmaKlasorleriYukle();
}

function _temsilciOzetGuncelle(toplam, atanan) {
    const chipToplam  = document.getElementById('temsilci-chip-toplam');
    const chipGecerli = document.getElementById('temsilci-chip-gecerli');
    if (chipToplam)  chipToplam.textContent  = `Toplam: ${toplam}`;
    if (chipGecerli) chipGecerli.textContent = `✓ Atandı: ${atanan}`;
}

function temsilciModalKapat() {
    const modal = document.getElementById('temsilci-modal');
    if (modal) modal.classList.remove('acik');
}

function temsilciPNGIndir() {
    const el = document.getElementById('temsilci-tablo-sarici');
    if (!el) return;
    const _do = () => html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        const a = document.createElement('a');
        a.download = 'temsilci_durumu.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
    if (typeof html2canvas === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = _do;
        document.head.appendChild(s);
    } else { _do(); }
}

function temsilciPDFIndir() {
    const el = document.getElementById('temsilci-tablo-sarici');
    if (!el) return;
    const _doIndir = () => {
        html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const imgW = 277;
            const imgH = (canvas.height * imgW) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgW, imgH);
            pdf.save('temsilci_durumu.pdf');
        });
    };
    _scriptYukleVeCalistir(
        ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
         'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'],
        () => typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined',
        _doIndir
    );
}

// ==========================================
// PERİYODİK MUAYENE — KİŞİ BAZLI
// ==========================================

async function muayeneFirmaSelectDoldur() {
    const sel = document.getElementById('muayene-personel-secim');
    if (!sel) return;

    const [p1, p2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel   = _personelBirlestir(p1, p2);
    const firmaPersonel = _firmaPersonelFiltrele(tumPersonel, aktifFirma);

    sel.innerHTML = '<option value="">— Personel Seçin —</option>';
    firmaPersonel.forEach(p => {
        const ad    = p.adSoyad || p.ad || '';
        const gorev = p.gorev || p.pozisyon || '';
        const opt   = document.createElement('option');
        opt.value       = _personelKey(p);
        opt.textContent = ad + (gorev ? ' — ' + gorev : '');
        sel.appendChild(opt);
    });

    const btn    = document.getElementById('btn-muayene-goruntule');
    const sayiEl = document.getElementById('muayene-btn-sayi');
    if (btn)    btn.style.display  = firmaPersonel.length > 0 ? 'flex' : 'none';
    if (sayiEl) sayiEl.textContent = firmaPersonel.length;

    const muayeneData = await _veriOku('muayene_verileri_' + aktifFirma, {});
    if (btn && Object.keys(muayeneData).length > 0 && firmaPersonel.length === 0) {
        btn.style.display = 'flex';
    }

    await muayenePersonelSecildi();
}

async function muayenePersonelSecildi() {
    const sel       = document.getElementById('muayene-personel-secim');
    const alan      = document.getElementById('muayene-tarih-alani');
    const kaydet    = document.getElementById('btn-muayene-kaydet');
    const durum     = document.getElementById('muayene-personel-durum');
    const sonEl     = document.getElementById('muayene-son-tarih');
    const sonrakiEl = document.getElementById('muayene-sonraki-tarih');
    if (!sel) return;

    const key = sel.value;
    if (!key || !aktifFirma) {
        if (alan)   alan.style.display   = 'none';
        if (kaydet) kaydet.style.display = 'none';
        if (durum)  durum.style.display  = 'none';
        return;
    }

    const muayeneData = await _veriOku('muayene_verileri_' + aktifFirma, {});
    const kayit = muayeneData[key] || {};

    if (sonEl)     sonEl.value     = kayit.muayeneTarih || '';
    if (sonrakiEl) sonrakiEl.value = kayit.gecerliTarih || '';
    if (alan)   alan.style.display   = 'grid';
    if (kaydet) kaydet.style.display = 'flex';

    if (durum && kayit.gecerliTarih) {
        const d = _muayeneDurumHesapla(kayit.gecerliTarih);
        durum.className = 'muayene-personel-durum ' + d.sinif;
        durum.style.display = 'flex';
        durum.innerHTML = d.ikon + ' Geçerlilik: ' + _tarihGorsel(kayit.gecerliTarih) + ' — ' + d.yazi;
    } else if (durum) {
        durum.style.display = 'none';
    }
}

function muayeneSonrakiOtomatikHesapla() {
    const sonEl     = document.getElementById('muayene-son-tarih');
    const sonrakiEl = document.getElementById('muayene-sonraki-tarih');
    if (!sonEl || !sonrakiEl || !sonEl.value) return;

    // Önce cache'e sor
    let yil = null;
    const kural = (typeof MevzuatCache !== 'undefined') &&
                  MevzuatCache.kuralAl('Periyodik Sağlık Muayenesi', aktifFirmaSinifi);
    if (kural && kural.birim === 'yıl') yil = kural.deger;

    // Cache yoksa sabit değerlere düş
    if (yil === null) {
        const sinif = (aktifFirmaSinifi || '').toLowerCase();
        yil = 5;
        if (sinif.includes('çok tehlikeli')) yil = 1;
        else if (sinif.includes('tehlikeli')) yil = 3;
    }

    const baslangic = new Date(sonEl.value);
    baslangic.setFullYear(baslangic.getFullYear() + yil);
    sonrakiEl.value = _tarihFormatla(baslangic);
}

async function muayenePersonelKaydet() {
    const sel       = document.getElementById('muayene-personel-secim');
    const sonEl     = document.getElementById('muayene-son-tarih');
    const sonrakiEl = document.getElementById('muayene-sonraki-tarih');
    if (!sel || !aktifFirma || !sel.value) return;

    const key          = sel.value;
    const muayeneTarih = sonEl ? sonEl.value : '';
    const gecerliTarih = sonrakiEl ? sonrakiEl.value : '';

    const storageKey  = 'muayene_verileri_' + aktifFirma;
    const muayeneData = await _veriOku(storageKey, {});
    muayeneData[key]  = { muayeneTarih, gecerliTarih };
    await _veriYaz(storageKey, muayeneData);

    const durum = document.getElementById('muayene-personel-durum');
    if (durum && gecerliTarih) {
        const d = _muayeneDurumHesapla(gecerliTarih);
        durum.className     = 'muayene-personel-durum ' + d.sinif;
        durum.style.display = 'flex';
        durum.innerHTML     = d.ikon + ' Geçerlilik: ' + _tarihGorsel(gecerliTarih) + ' — ' + d.yazi;
    }

    await kartGuncelle('kart-muayene');

    const btnGoruntule = document.getElementById('btn-muayene-goruntule');
    if (btnGoruntule) {
        btnGoruntule.style.display = 'flex';
        const sayiEl = document.getElementById('muayene-btn-sayi');
        if (sayiEl) sayiEl.textContent = Object.keys(muayeneData).length;
    }

    const btn = document.getElementById('btn-muayene-kaydet');
    if (btn) {
        const orijinal = btn.innerHTML;
        btn.innerHTML  = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
        btn.style.background = '#15803d';
        setTimeout(() => { btn.innerHTML = orijinal; btn.style.background = ''; }, 1800);
    }
}

function _personelKey(personel) {
    const ad = ((personel.adSoyad || personel.ad || '')).replace(/\s+/g, '_');
    const tc = (personel.tc || personel.tcKimlik || String(personel.id || '')).trim();
    return (ad + '_' + tc).replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]/g, '');
}

function _muayeneDurumHesapla(gecerliTarih) {
    if (!gecerliTarih) return { sinif: 'yok', ikon: '—', yazi: 'Tarih Yok' };
    const gun = farkHesapla(gecerliTarih);
    if (gun <= 0)  return { sinif: 'kritik', ikon: '✗', yazi: 'Süresi Doldu' };
    if (gun <= 10) return { sinif: 'kritik', ikon: '🔴', yazi: `${gun} Gün` };
    if (gun <= 30) return { sinif: 'uyari',  ikon: '🟠', yazi: `${gun} Gün` };
    return { sinif: 'gecerli', ikon: '✓', yazi: `${gun} Gün` };
}

function _muayeneOzetGuncelle(sayilar, personeller) {
    const [gecerli = 0, uyari = 0, kritik = 0] = sayilar;
    const toplam = (personeller || []).length;
    const chipToplam  = document.getElementById('chip-toplam');
    const chipGecerli = document.getElementById('chip-gecerli');
    const chipUyari   = document.getElementById('chip-uyari');
    const chipKritik  = document.getElementById('chip-kritik');
    if (chipToplam)  chipToplam.textContent  = `Toplam: ${toplam}`;
    if (chipGecerli) chipGecerli.textContent = `✓ Geçerli: ${gecerli}`;
    if (chipUyari)   chipUyari.textContent   = `⚠ Uyarı: ${uyari}`;
    if (chipKritik)  chipKritik.textContent  = `✗ Kritik: ${kritik}`;
}

async function muayeneTarihKaydet(firmaAdi, key, alan, deger) {
    const storageKey  = 'muayene_verileri_' + firmaAdi;
    const muayeneData = await _veriOku(storageKey, {});
    if (!muayeneData[key]) muayeneData[key] = {};
    muayeneData[key][alan] = deger;
    await _veriYaz(storageKey, muayeneData);
}

function muayeneSatirGuncelle(inputEl, key) {
    const durum = _muayeneDurumHesapla(inputEl.value);
    const etiket = document.getElementById('muayene-durum-' + key);
    if (etiket) {
        etiket.className  = 'muayene-durum-etiketi ' + durum.sinif;
        etiket.textContent = durum.ikon + ' ' + durum.yazi;
    }
    _muayeneOzetYenile();
}

function _muayeneOzetYenile() {
    const etiketler = document.querySelectorAll('.muayene-durum-etiketi');
    let gecerli = 0, uyari = 0, kritik = 0;
    etiketler.forEach(el => {
        if (el.classList.contains('gecerli')) gecerli++;
        else if (el.classList.contains('uyari')) uyari++;
        else if (el.classList.contains('kritik')) kritik++;
    });
    _muayeneOzetGuncelle([gecerli, uyari, kritik], { length: etiketler.length });
}

async function muayeneModalMuayeneTarihDegisti(inputEl, key, firmaAdi) {
    if (!inputEl.value) return;

    // Önce cache'e sor
    let yil = null;
    const kural = (typeof MevzuatCache !== 'undefined') &&
                  MevzuatCache.kuralAl('Periyodik Sağlık Muayenesi', aktifFirmaSinifi);
    if (kural && kural.birim === 'yıl') yil = kural.deger;

    // Cache yoksa sabit değerlere düş
    if (yil === null) {
        const sinif = (aktifFirmaSinifi || '').toLowerCase();
        yil = 5;
        if (sinif.includes('çok tehlikeli')) yil = 1;
        else if (sinif.includes('tehlikeli')) yil = 3;
    }

    const b = new Date(inputEl.value);
    b.setFullYear(b.getFullYear() + yil);
    const yeniGecerli = _tarihFormatla(b);

    const satirEl = inputEl.closest('tr');
    if (satirEl) {
        const inputs = satirEl.querySelectorAll('input[type="date"]');
        if (inputs[1]) {
            inputs[1].value = yeniGecerli;
            muayeneSatirGuncelle(inputs[1], key);
        }
    }

    await muayeneTarihKaydet(firmaAdi, key, 'gecerliTarih', yeniGecerli);
}

async function muayeneModalAc() {
    if (!aktifFirma) { alert('Lütfen önce bir firma klasörü açın.'); return; }

    const firmalar = await _veriOku('isg_firmalar', []);
    const firma    = firmalar.find(f => f.adi === aktifFirma);
    if (!firma) return;

    document.getElementById('muayene-modal-baslik').textContent =
        `Periyodik Sağlık Muayenesi — ${firma.adi}`;

    const [p1, p2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel   = _personelBirlestir(p1, p2);
    const firmaPersonel = _firmaPersonelFiltrele(tumPersonel, firma.adi);
    const muayeneData   = await _veriOku('muayene_verileri_' + firma.adi, {});

    const tablo = document.getElementById('muayene-tablo');
    const body  = document.getElementById('muayene-tablo-body');
    const bos   = document.getElementById('muayene-bos-mesaj');

    if (firmaPersonel.length === 0) {
        tablo.style.display = 'none';
        bos.style.display   = 'block';
        _muayeneOzetGuncelle([], []);
    } else {
        tablo.style.display = 'table';
        bos.style.display   = 'none';
        body.innerHTML = '';

        let gecerliSayac = 0, uyariSayac = 0, kritikSayac = 0;

        firmaPersonel.forEach((personel, idx) => {
            const key          = _personelKey(personel);
            const kayit        = muayeneData[key] || {};
            const muayeneTarih = kayit.muayeneTarih || '';
            const gecerliTarih = kayit.gecerliTarih || '';

            const durum = _muayeneDurumHesapla(gecerliTarih);
            if      (durum.sinif === 'gecerli') gecerliSayac++;
            else if (durum.sinif === 'uyari')   uyariSayac++;
            else if (durum.sinif === 'kritik')  kritikSayac++;

            const baslarf = (personel.adSoyad || personel.ad || '').substring(0, 2).toUpperCase();

            body.insertAdjacentHTML('beforeend', `
                <tr>
                    <td style="color:#94a3b8;font-size:11px;">${idx + 1}</td>
                    <td>
                        <div class="personel-ad-hucre">
                            <div class="personel-avatar-mini">${baslarf}</div>
                            <div>
                                <div style="font-weight:700;font-size:12px;">${_htmlEsc(personel.adSoyad || personel.ad || '')}</div>
                                <div style="font-size:10px;color:#94a3b8;">${_htmlEsc(personel.tcKimlik || personel.tc || '')}</div>
                            </div>
                        </div>
                    </td>
                    <td style="font-size:11px;color:#64748b;">${_htmlEsc(personel.gorev || personel.pozisyon || personel.unvan || '—')}</td>
                    <td>
                        <input type="date" class="muayene-tarih-input"
                               value="${muayeneTarih}"
                               onchange="muayeneTarihKaydet('${_htmlEsc(firma.adi)}','${key}','muayeneTarih',this.value); muayeneModalMuayeneTarihDegisti(this,'${key}','${_htmlEsc(firma.adi)}')">
                    </td>
                    <td>
                        <input type="date" class="muayene-tarih-input"
                               value="${gecerliTarih}"
                               onchange="muayeneTarihKaydet('${_htmlEsc(firma.adi)}','${key}','gecerliTarih',this.value); muayeneSatirGuncelle(this, '${key}')">
                    </td>
                    <td>
                        <span class="muayene-durum-etiketi ${durum.sinif}" id="muayene-durum-${key}">
                            ${durum.ikon} ${durum.yazi}
                        </span>
                    </td>
                </tr>`);
        });

        _muayeneOzetGuncelle([gecerliSayac, uyariSayac, kritikSayac], firmaPersonel);
    }

    document.getElementById('muayene-modal').classList.add('acik');
}

function muayeneModalKapat() {
    document.getElementById('muayene-modal').classList.remove('acik');
}

function muayenePNGIndir() {
    const el = document.getElementById('muayene-tablo-sarici');
    if (!el) return;
    const _go = () => html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        const a = document.createElement('a');
        a.download = 'muayene_durumu.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
    if (typeof html2canvas === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = _go;
        document.head.appendChild(s);
    } else { _go(); }
}

function muayenePDFIndir() {
    const el = document.getElementById('muayene-tablo-sarici');
    if (!el) return;
    const _doIndir = () => {
        html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const imgW = 277;
            const imgH = (canvas.height * imgW) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgW, imgH);
            pdf.save('muayene_durumu.pdf');
        });
    };
    _scriptYukleVeCalistir(
        ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
         'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'],
        () => typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined',
        _doIndir
    );
}

// ==========================================
// EĞİTİM — KİŞİ BAZLI
// ==========================================

function egitimPeriyotGetir() {
    // Önce cache'e sor (mevzuat yönetiminden güncellenen değer)
    const kural = (typeof MevzuatCache !== 'undefined') &&
                  MevzuatCache.kuralAl('Temel İSG Eğitimi Periyodu', aktifFirmaSinifi);
    if (kural && kural.birim === 'yıl') return kural.deger;

    // Cache yoksa sabit değerlere düş (geri dönüş güvenliği)
    const sinif = (aktifFirmaSinifi || '').toLowerCase();
    if (sinif.includes('çok tehlikeli')) return 1;
    if (sinif.includes('tehlikeli'))     return 2;
    return 3;
}

async function egitimFirmaSelectDoldur() {
    const sel = document.getElementById('egitim-personel-secim');
    if (!sel) return;

    const [p1, p2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel   = _personelBirlestir(p1, p2);
    const firmaPersonel = _firmaPersonelFiltrele(tumPersonel, aktifFirma);

    sel.innerHTML = '<option value="">— Personel Seçin —</option>';
    firmaPersonel.forEach(p => {
        const ad    = p.adSoyad || p.ad || '';
        const gorev = p.gorev || p.pozisyon || '';
        const opt   = document.createElement('option');
        opt.value       = _personelKey(p);
        opt.textContent = ad + (gorev ? ' — ' + gorev : '');
        sel.appendChild(opt);
    });

    const btn    = document.getElementById('btn-egitim-goruntule');
    const sayiEl = document.getElementById('egitim-btn-sayi');
    if (btn)    btn.style.display  = firmaPersonel.length > 0 ? 'flex' : 'none';
    if (sayiEl) sayiEl.textContent = firmaPersonel.length;

    const egitimData = await _veriOku('egitim_verileri_' + aktifFirma, {});
    if (btn && Object.keys(egitimData).length > 0 && firmaPersonel.length === 0) {
        btn.style.display = 'flex';
    }

    await egitimPersonelSecildi();
}

async function egitimPersonelSecildi() {
    const sel       = document.getElementById('egitim-personel-secim');
    const alan      = document.getElementById('egitim-tarih-alani');
    const kaydet    = document.getElementById('btn-egitim-kaydet');
    const durum     = document.getElementById('egitim-personel-durum');
    const sonEl     = document.getElementById('egitim-son-tarih-p');
    const sonrakiEl = document.getElementById('egitim-sonraki-tarih-p');
    if (!sel) return;

    const key = sel.value;
    if (!key || !aktifFirma) {
        if (alan)   alan.style.display   = 'none';
        if (kaydet) kaydet.style.display = 'none';
        if (durum)  durum.style.display  = 'none';
        return;
    }

    const egitimData = await _veriOku('egitim_verileri_' + aktifFirma, {});
    const kayit = egitimData[key] || {};

    if (sonEl)     sonEl.value     = kayit.egitimTarih  || '';
    if (sonrakiEl) sonrakiEl.value = kayit.gecerliTarih || '';
    if (alan)   alan.style.display   = 'grid';
    if (kaydet) kaydet.style.display = 'flex';

    if (durum && kayit.gecerliTarih) {
        const d = _egitimDurumHesapla(kayit.gecerliTarih);
        durum.className = 'muayene-personel-durum ' + d.sinif;
        durum.style.display = 'flex';
        durum.innerHTML = d.ikon + ' Geçerlilik: ' + _tarihGorsel(kayit.gecerliTarih) + ' — ' + d.yazi;
    } else if (durum) {
        durum.style.display = 'none';
    }
}

function egitimSonrakiOtomatikHesapla() {
    const sonEl     = document.getElementById('egitim-son-tarih-p');
    const sonrakiEl = document.getElementById('egitim-sonraki-tarih-p');
    if (!sonEl || !sonrakiEl || !sonEl.value) return;

    const yil = egitimPeriyotGetir();
    const baslangic = new Date(sonEl.value);
    baslangic.setFullYear(baslangic.getFullYear() + yil);
    sonrakiEl.value = _tarihFormatla(baslangic);

    const durum = document.getElementById('egitim-personel-durum');
    if (durum) {
        const d = _egitimDurumHesapla(sonrakiEl.value);
        durum.className = 'muayene-personel-durum ' + d.sinif;
        durum.style.display = 'flex';
        durum.innerHTML = d.ikon + ' Geçerlilik: ' + _tarihGorsel(sonrakiEl.value) + ' — ' + d.yazi;
    }
}

async function egitimPersonelKaydet() {
    const sel       = document.getElementById('egitim-personel-secim');
    const sonEl     = document.getElementById('egitim-son-tarih-p');
    const sonrakiEl = document.getElementById('egitim-sonraki-tarih-p');
    if (!sel || !aktifFirma || !sel.value) return;

    const key          = sel.value;
    const egitimTarih  = sonEl ? sonEl.value : '';
    const gecerliTarih = sonrakiEl ? sonrakiEl.value : '';

    const storageKey = 'egitim_verileri_' + aktifFirma;
    const egitimData = await _veriOku(storageKey, {});
    egitimData[key]  = { egitimTarih, gecerliTarih };
    await _veriYaz(storageKey, egitimData);

    const durum = document.getElementById('egitim-personel-durum');
    if (durum && gecerliTarih) {
        const d = _egitimDurumHesapla(gecerliTarih);
        durum.className     = 'muayene-personel-durum ' + d.sinif;
        durum.style.display = 'flex';
        durum.innerHTML     = d.ikon + ' Geçerlilik: ' + _tarihGorsel(gecerliTarih) + ' — ' + d.yazi;
    }

    await kartGuncelle('kart-egitim');

    const btnGoruntule = document.getElementById('btn-egitim-goruntule');
    if (btnGoruntule) {
        btnGoruntule.style.display = 'flex';
        const sayiEl = document.getElementById('egitim-btn-sayi');
        if (sayiEl) sayiEl.textContent = Object.keys(egitimData).length;
    }

    const btn = document.getElementById('btn-egitim-kaydet');
    if (btn) {
        const orijinal = btn.innerHTML;
        btn.innerHTML  = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
        btn.style.background = '#15803d';
        setTimeout(() => { btn.innerHTML = orijinal; btn.style.background = ''; }, 1800);
    }
}

function _egitimDurumHesapla(gecerliTarih) {
    if (!gecerliTarih) return { sinif: 'yok', ikon: '—', yazi: 'Tarih Yok' };
    const gun = farkHesapla(gecerliTarih);
    if (gun <= 0)  return { sinif: 'kritik', ikon: '✗', yazi: 'Süresi Doldu' };
    if (gun <= 10) return { sinif: 'kritik', ikon: '🔴', yazi: `${gun} Gün` };
    if (gun <= 30) return { sinif: 'uyari',  ikon: '🟠', yazi: `${gun} Gün` };
    return { sinif: 'gecerli', ikon: '✓', yazi: `${gun} Gün` };
}

async function egitimModalEgitimTarihDegisti(inputEl, key, firmaAdi) {
    if (!inputEl.value) return;

    const yil = egitimPeriyotGetir();
    const b   = new Date(inputEl.value);
    b.setFullYear(b.getFullYear() + yil);
    const yeniGecerli = _tarihFormatla(b);

    const satirEl = inputEl.closest('tr');
    if (satirEl) {
        const inputs = satirEl.querySelectorAll('input[type="date"]');
        if (inputs[1]) {
            inputs[1].value = yeniGecerli;
            egitimSatirGuncelle(inputs[1], key);
        }
    }

    await egitimTarihKaydet(firmaAdi, key, 'gecerliTarih', yeniGecerli);
}

async function egitimModalAc() {
    if (!aktifFirma) { alert('Lütfen önce bir firma klasörü açın.'); return; }

    const firmalar = await _veriOku('isg_firmalar', []);
    const firma    = firmalar.find(f => f.adi === aktifFirma);
    if (!firma) return;

    document.getElementById('egitim-modal-baslik').textContent =
        `İSG Eğitim Durumu — ${firma.adi}`;

    const [p1, p2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel   = _personelBirlestir(p1, p2);
    const firmaPersonel = _firmaPersonelFiltrele(tumPersonel, firma.adi);
    const egitimData    = await _veriOku('egitim_verileri_' + firma.adi, {});

    const tablo     = document.getElementById('egitim-modal-tablo');
    const body      = document.getElementById('egitim-modal-tablo-body');
    const bos       = document.getElementById('egitim-modal-bos-mesaj');
    

    if (firmaPersonel.length === 0) {
        tablo.style.display = 'none';
        bos.style.display   = 'block';
        _egitimOzetGuncelle([], []);
    } else {
        tablo.style.display = 'table';
        bos.style.display   = 'none';
        body.innerHTML = '';

        let gecerliSayac = 0, uyariSayac = 0, kritikSayac = 0;

        firmaPersonel.forEach((personel, idx) => {
            const key          = _personelKey(personel);
            const kayit        = egitimData[key] || {};
            const egitimTarih  = kayit.egitimTarih  || '';
            const gecerliTarih = kayit.gecerliTarih || '';

            const durum = _egitimDurumHesapla(gecerliTarih);
            if      (durum.sinif === 'gecerli') gecerliSayac++;
            else if (durum.sinif === 'uyari')   uyariSayac++;
            else if (durum.sinif === 'kritik')  kritikSayac++;

            const baslarf = (personel.adSoyad || personel.ad || '').substring(0, 2).toUpperCase();

            body.insertAdjacentHTML('beforeend', `
                <tr>
                    <td style="color:#94a3b8;font-size:11px;">${idx + 1}</td>
                    <td>
                        <div class="personel-ad-hucre">
                            <div class="personel-avatar-mini" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);">${baslarf}</div>
                            <div>
                                <div style="font-weight:700;font-size:12px;">${_htmlEsc(personel.adSoyad || personel.ad || '')}</div>
                                <div style="font-size:10px;color:#94a3b8;">${_htmlEsc(personel.tcKimlik || personel.tc || '')}</div>
                            </div>
                        </div>
                    </td>
                    <td style="font-size:11px;color:#64748b;">${_htmlEsc(personel.gorev || personel.pozisyon || personel.unvan || '—')}</td>
                    <td>
                        <input type="date" class="muayene-tarih-input"
                               value="${egitimTarih}"
                               onchange="egitimTarihKaydet('${_htmlEsc(firma.adi)}','${key}','egitimTarih',this.value); egitimModalEgitimTarihDegisti(this,'${key}','${_htmlEsc(firma.adi)}')">
                    </td>
                    <td>
                        <input type="date" class="muayene-tarih-input"
                               value="${gecerliTarih}"
                               onchange="egitimTarihKaydet('${_htmlEsc(firma.adi)}','${key}','gecerliTarih',this.value); egitimSatirGuncelle(this, '${key}')">
                    </td>
                    <td>
                        <span class="muayene-durum-etiketi ${durum.sinif}" id="egitim-durum-${key}">
                            ${durum.ikon} ${durum.yazi}
                        </span>
                    </td>
                </tr>`);
        });

        _egitimOzetGuncelle([gecerliSayac, uyariSayac, kritikSayac], firmaPersonel);
    }

    document.getElementById('egitim-modal').classList.add('acik');
}

function _egitimOzetGuncelle(sayilar, personeller) {
    const [gecerli = 0, uyari = 0, kritik = 0] = sayilar;
    const toplam = (personeller || []).length;
    const chipToplam  = document.getElementById('egitim-chip-toplam');
    const chipGecerli = document.getElementById('egitim-chip-gecerli');
    const chipUyari   = document.getElementById('egitim-chip-uyari');
    const chipKritik  = document.getElementById('egitim-chip-kritik');
    if (chipToplam)  chipToplam.textContent  = `Toplam: ${toplam}`;
    if (chipGecerli) chipGecerli.textContent = `✓ Geçerli: ${gecerli}`;
    if (chipUyari)   chipUyari.textContent   = `⚠ Uyarı: ${uyari}`;
    if (chipKritik)  chipKritik.textContent  = `✗ Kritik: ${kritik}`;
}

async function egitimTarihKaydet(firmaAdi, key, alan, deger) {
    const storageKey = 'egitim_verileri_' + firmaAdi;
    const egitimData = await _veriOku(storageKey, {});
    if (!egitimData[key]) egitimData[key] = {};
    egitimData[key][alan] = deger;
    await _veriYaz(storageKey, egitimData);
}

function egitimSatirGuncelle(inputEl, key) {
    const durum = _egitimDurumHesapla(inputEl.value);
    const etiket = document.getElementById('egitim-durum-' + key);
    if (etiket) {
        etiket.className  = 'muayene-durum-etiketi ' + durum.sinif;
        etiket.textContent = durum.ikon + ' ' + durum.yazi;
    }
    _egitimOzetYenile();
}

function _egitimOzetYenile() {
    const etiketler = document.querySelectorAll('#egitim-modal-tablo .muayene-durum-etiketi');
    let gecerli = 0, uyari = 0, kritik = 0;
    etiketler.forEach(el => {
        if (el.classList.contains('gecerli')) gecerli++;
        else if (el.classList.contains('uyari')) uyari++;
        else if (el.classList.contains('kritik')) kritik++;
    });
    _egitimOzetGuncelle([gecerli, uyari, kritik], { length: etiketler.length });
}

function egitimModalKapat() {
    document.getElementById('egitim-modal').classList.remove('acik');
}

function egitimPNGIndir() {
    const el = document.getElementById('egitim-tablo-sarici');
    if (!el) return;
    const _go = () => html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        const a = document.createElement('a'); a.download = 'egitim_durumu.png';
        a.href = canvas.toDataURL('image/png'); a.click();
    });
    if (typeof html2canvas === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = _go; document.head.appendChild(s);
    } else { _go(); }
}

function egitimPDFIndir() {
    const el = document.getElementById('egitim-tablo-sarici');
    if (!el) return;
    const _doIndir = () => {
        html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const imgW = 277; const imgH = (canvas.height * imgW) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgW, imgH);
            pdf.save('egitim_durumu.pdf');
        });
    };
    _scriptYukleVeCalistir(
        ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
         'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'],
        () => typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined',
        _doIndir
    );
}

// ==========================================
// İLKYARDIMCI EĞİTİMİ — PERSONEL BAZLI
// ==========================================

async function ilkyardimZorunluSayiGetir() {
    const sinif = (aktifFirmaSinifi || '').toLowerCase();
    const [p1, p2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel   = _personelBirlestir(p1, p2);
    const firmaPersonel = _firmaPersonelFiltrele(tumPersonel, aktifFirma);
    const personelSayisi = firmaPersonel.length || 1;

    // Önce cache'e sor
    let oran = null;
    const kural = (typeof MevzuatCache !== 'undefined') &&
                  MevzuatCache.kuralAl('İlkyardımcı Oranı', aktifFirmaSinifi);
    if (kural && kural.birim === 'oran') oran = kural.deger;

    // Cache yoksa sabit değerlere düş
    if (oran === null) {
        oran = 20;
        if (sinif.includes('çok tehlikeli')) oran = 10;
        else if (sinif.includes('tehlikeli')) oran = 15;
    }

    return Math.max(1, Math.ceil(personelSayisi / oran));
}

async function ilkyardimFirmaSelectDoldur() {
    const sel = document.getElementById('ilkyardim-personel-secim');
    if (!sel) return;

    const [p1, p2] = await Promise.all([
        _veriOku('isg_personeller', []),
        _veriOku('isg_personel', []),
    ]);
    const tumPersonel   = _personelBirlestir(p1, p2);
    const firmaPersonel = _firmaPersonelFiltrele(tumPersonel, aktifFirma);

    sel.innerHTML = '<option value="">— Personel Seçin —</option>';
    firmaPersonel.forEach(p => {
        const ad    = p.adSoyad || p.ad || '';
        const gorev = p.gorev || p.pozisyon || '';
        const opt   = document.createElement('option');
        opt.value       = _personelKey(p);
        opt.textContent = ad + (gorev ? ' — ' + gorev : '');
        sel.appendChild(opt);
    });

    const btnGoruntule  = document.getElementById('btn-ilkyardim-goruntule');
    const sayiEl        = document.getElementById('ilkyardim-btn-sayi');
    const ilkyardimData = await _veriOku('ilkyardim_verileri_' + aktifFirma, {});
    const mevcutSayi    = Object.keys(ilkyardimData).length;

    if (btnGoruntule) {
        btnGoruntule.style.display = (firmaPersonel.length > 0 || mevcutSayi > 0) ? 'flex' : 'none';
    }
    if (sayiEl) sayiEl.textContent = mevcutSayi;

    _ilkyardimListesiniYenile();
    await _ilkyardimUyariGuncelle();
}

async function ilkyardimPersonelSecildi() {
    const sel       = document.getElementById('ilkyardim-personel-secim');
    const alan      = document.getElementById('ilkyardim-tarih-alani');
    const kaydet    = document.getElementById('btn-ilkyardim-kaydet');
    const durum     = document.getElementById('ilkyardim-personel-durum');
    const sonEl     = document.getElementById('ilkyardim-son-tarih');
    const sonrakiEl = document.getElementById('ilkyardim-sonraki-tarih');
    if (!sel) return;

    const key = sel.value;
    if (!key || !aktifFirma) {
        if (alan)   alan.style.display   = 'none';
        if (kaydet) kaydet.style.display = 'none';
        if (durum)  durum.style.display  = 'none';
        return;
    }

    const ilkyardimData = await _veriOku('ilkyardim_verileri_' + aktifFirma, {});
    const kayit = ilkyardimData[key] || {};

    if (sonEl)     sonEl.value     = kayit.egitimTarih  || '';
    if (sonrakiEl) sonrakiEl.value = kayit.gecerliTarih || '';
    if (alan)   alan.style.display   = 'grid';
    if (kaydet) kaydet.style.display = 'flex';

    if (durum && kayit.gecerliTarih) {
        const d = _egitimDurumHesapla(kayit.gecerliTarih);
        durum.className = 'muayene-personel-durum ' + d.sinif;
        durum.style.display = 'flex';
        durum.innerHTML = d.ikon + ' Geçerlilik: ' + _tarihGorsel(kayit.gecerliTarih) + ' — ' + d.yazi;
    } else if (durum) {
        durum.style.display = 'none';
    }
}

function ilkyardimSonrakiOtomatikHesapla() {
    const sonEl     = document.getElementById('ilkyardim-son-tarih');
    const sonrakiEl = document.getElementById('ilkyardim-sonraki-tarih');
    if (!sonEl || !sonrakiEl || !sonEl.value) return;

    // İlkyardımcı eğitimi yenileme periyodu (her sınıfta aynı)
    let yil = 3;
    const kural = (typeof MevzuatCache !== 'undefined') &&
                  MevzuatCache.kuralAl('İlkyardımcı Eğitimi Yenileme', 'Tümü');
    if (kural && kural.birim === 'yıl') yil = kural.deger;

    const baslangic = new Date(sonEl.value);
    baslangic.setFullYear(baslangic.getFullYear() + yil);
    sonrakiEl.value = _tarihFormatla(baslangic);

    const durum = document.getElementById('ilkyardim-personel-durum');
    if (durum) {
        const d = _egitimDurumHesapla(sonrakiEl.value);
        durum.className = 'muayene-personel-durum ' + d.sinif;
        durum.style.display = 'flex';
        durum.innerHTML = d.ikon + ' Geçerlilik: ' + _tarihGorsel(sonrakiEl.value) + ' — ' + d.yazi;
    }
}

async function ilkyardimPersonelKaydet() {
    const sel       = document.getElementById('ilkyardim-personel-secim');
    const sonEl     = document.getElementById('ilkyardim-son-tarih');
    const sonrakiEl = document.getElementById('ilkyardim-sonraki-tarih');
    if (!sel || !aktifFirma || !sel.value) return;

    const key          = sel.value;
    const egitimTarih  = sonEl ? sonEl.value : '';
    const gecerliTarih = sonrakiEl ? sonrakiEl.value : '';
    const selectedOpt  = sel.options[sel.selectedIndex];
    const personelAd   = selectedOpt ? selectedOpt.textContent : key;

    const storageKey    = 'ilkyardim_verileri_' + aktifFirma;
    const ilkyardimData = await _veriOku(storageKey, {});
    ilkyardimData[key]  = { egitimTarih, gecerliTarih, personelAd };
    await _veriYaz(storageKey, ilkyardimData);

    const durum = document.getElementById('ilkyardim-personel-durum');
    if (durum && gecerliTarih) {
        const d = _egitimDurumHesapla(gecerliTarih);
        durum.className     = 'muayene-personel-durum ' + d.sinif;
        durum.style.display = 'flex';
        durum.innerHTML     = d.ikon + ' Geçerlilik: ' + _tarihGorsel(gecerliTarih) + ' — ' + d.yazi;
    }

    _ilkyardimListesiniYenile();
    await _ilkyardimUyariGuncelle();
    await kartGuncelle('kart-ilkyardim');

    const btnGoruntule = document.getElementById('btn-ilkyardim-goruntule');
    if (btnGoruntule) {
        btnGoruntule.style.display = 'flex';
        const sayiEl = document.getElementById('ilkyardim-btn-sayi');
        if (sayiEl) sayiEl.textContent = Object.keys(ilkyardimData).length;
    }

    const btn = document.getElementById('btn-ilkyardim-kaydet');
    if (btn) {
        const orijinal = btn.innerHTML;
        btn.innerHTML  = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
        btn.style.background = '#15803d';
        setTimeout(() => { btn.innerHTML = orijinal; btn.style.background = ''; }, 1800);
    }
}

function _ilkyardimListesiniYenile() {
    const liste = document.getElementById('ilkyardim-kayitli-liste');
    if (liste) liste.innerHTML = '';
}

async function ilkyardimSil(key) {
    if (!confirm('Bu ilkyardımcı kaydını silmek istediğinize emin misiniz?')) return;
    const storageKey    = 'ilkyardim_verileri_' + aktifFirma;
    const ilkyardimData = await _veriOku(storageKey, {});
    delete ilkyardimData[key];
    await _veriYaz(storageKey, ilkyardimData);

    _ilkyardimListesiniYenile();
    await _ilkyardimUyariGuncelle();
    await kartGuncelle('kart-ilkyardim');

    const sayiEl = document.getElementById('ilkyardim-btn-sayi');
    if (sayiEl) sayiEl.textContent = Object.keys(ilkyardimData).length;

    const modal = document.getElementById('ilkyardim-modal');
    if (modal && modal.classList.contains('acik')) {
        await _ilkyardimModalTablosunuDoldur();
    }
}

async function ilkyardimModalSil(key) {
    if (!confirm('Bu ilkyardımcı kaydını silmek istediğinize emin misiniz?')) return;
    const storageKey    = 'ilkyardim_verileri_' + aktifFirma;
    const ilkyardimData = await _veriOku(storageKey, {});
    delete ilkyardimData[key];
    await _veriYaz(storageKey, ilkyardimData);

    _ilkyardimListesiniYenile();
    await _ilkyardimUyariGuncelle();
    await kartGuncelle('kart-ilkyardim');

    const sayiEl = document.getElementById('ilkyardim-btn-sayi');
    if (sayiEl) sayiEl.textContent = Object.keys(ilkyardimData).length;

    await _ilkyardimModalTablosunuDoldur();
}

async function _ilkyardimUyariGuncelle() {
    const uyariEl = document.getElementById('ilkyardim-zorunlu-uyari');
    const sayacEl = document.getElementById('ilkyardim-btn-sayi');
    if (!uyariEl || !aktifFirma) return;

    const ilkyardimData = await _veriOku('ilkyardim_verileri_' + aktifFirma, {});
    const mevcutSayi    = Object.keys(ilkyardimData).length;
    const zorunluSayi   = await ilkyardimZorunluSayiGetir();

    if (sayacEl) sayacEl.textContent = mevcutSayi;

    const sinif = (aktifFirmaSinifi || '').toLowerCase();
    let sinifYazi = 'Az Tehlikeli'; let oranYazi = '20 kişide 1';
    if (sinif.includes('çok tehlikeli')) { sinifYazi = 'Çok Tehlikeli'; oranYazi = '10 kişide 1'; }
    else if (sinif.includes('tehlikeli')) { sinifYazi = 'Tehlikeli'; oranYazi = '15 kişide 1'; }

    if (mevcutSayi < zorunluSayi) {
        uyariEl.style.display = 'flex';
        uyariEl.className = 'muayene-personel-durum kritik';
        uyariEl.style.flexDirection = 'column';
        uyariEl.style.alignItems = 'flex-start';
        uyariEl.style.gap = '3px';
        uyariEl.innerHTML = `
            <div style="display:flex;align-items:center;gap:5px;font-size:10px;font-weight:800;">
                🔴 <span>${sinifYazi} işyeri — Eksik</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;font-size:9px;font-weight:700;color:#991b1b;">
                <span>Zorunlu: <strong>${zorunluSayi} kişi</strong> (${oranYazi})</span>
                <span style="margin:0 2px;">|</span>
                <span>Mevcut: <strong>${mevcutSayi} kişi</strong></span>
            </div>`;
    } else {
        uyariEl.style.display = 'flex';
        uyariEl.className = 'muayene-personel-durum gecerli';
        uyariEl.style.flexDirection = '';
        uyariEl.style.alignItems = '';
        uyariEl.style.gap = '';
        uyariEl.innerHTML = `✓ ${mevcutSayi}/${zorunluSayi} ilkyardımcı — Yeterli`;
    }
}

async function ilkyardimModalAc() {
    if (!aktifFirma) { alert('Lütfen önce bir firma klasörü açın.'); return; }

    const firmalar = await _veriOku('isg_firmalar', []);
    const firma    = firmalar.find(f => f.adi === aktifFirma);
    if (!firma) return;

    const baslikEl = document.getElementById('ilkyardim-modal-baslik');
    if (baslikEl) baslikEl.textContent = `İlkyardımcı Eğitim Durumu — ${firma.adi}`;

    const periyotEl  = document.getElementById('ilkyardim-modal-periyot');
    if (periyotEl) {
        const zorunlu    = await ilkyardimZorunluSayiGetir();
        const sinif      = (aktifFirmaSinifi || '').toLowerCase();
        let sinifYazi = 'Az Tehlikeli'; let oranYazi = '20 kişide 1';
        if (sinif.includes('çok tehlikeli')) { sinifYazi = 'Çok Tehlikeli'; oranYazi = '10 kişide 1'; }
        else if (sinif.includes('tehlikeli')) { sinifYazi = 'Tehlikeli'; oranYazi = '15 kişide 1'; }
        periyotEl.textContent = `${sinifYazi} — Zorunlu: ${zorunlu} kişi (${oranYazi}) | Periyot: 3 yılda 1`;
    }

    await _ilkyardimModalTablosunuDoldur();
    document.getElementById('ilkyardim-modal').classList.add('acik');
}

async function _ilkyardimModalTablosunuDoldur() {
    if (!aktifFirma) return;

    const ilkyardimData = await _veriOku('ilkyardim_verileri_' + aktifFirma, {});
    const keys = Object.keys(ilkyardimData);

    const tablo = document.getElementById('ilkyardim-modal-tablo');
    const body  = document.getElementById('ilkyardim-modal-tablo-body');
    const bos   = document.getElementById('ilkyardim-modal-bos-mesaj');

    if (keys.length === 0) {
        if (tablo) tablo.style.display = 'none';
        if (bos)   bos.style.display   = 'block';
        _ilkyardimOzetGuncelle([0, 0, 0], 0);
        return;
    }

    if (tablo) tablo.style.display = 'table';
    if (bos)   bos.style.display   = 'none';
    if (body)  body.innerHTML = '';

    let gecerliSayac = 0, uyariSayac = 0, kritikSayac = 0;

    keys.forEach((key, idx) => {
        const kayit       = ilkyardimData[key];
        const personelAd  = kayit.personelAd || key.replace(/_/g, ' ');
        const egitimTarih = kayit.egitimTarih  || '';
        const gecerliTarih = kayit.gecerliTarih || '';

        const durum = _egitimDurumHesapla(gecerliTarih);
        if      (durum.sinif === 'gecerli') gecerliSayac++;
        else if (durum.sinif === 'uyari')   uyariSayac++;
        else if (durum.sinif === 'kritik')  kritikSayac++;

        const baslarf = personelAd.substring(0, 2).toUpperCase();

        if (body) body.insertAdjacentHTML('beforeend', `
            <tr>
                <td style="color:#94a3b8;font-size:11px;">${idx + 1}</td>
                <td>
                    <div class="personel-ad-hucre">
                        <div class="personel-avatar-mini" style="background:linear-gradient(135deg,#dc2626,#ef4444);">${baslarf}</div>
                        <div>
                            <div style="font-weight:700;font-size:12px;">${_htmlEsc(personelAd)}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <input type="date" class="muayene-tarih-input"
                           value="${egitimTarih}"
                           onchange="ilkyardimTarihKaydet('${_esc(aktifFirma)}','${key}','egitimTarih',this.value)">
                </td>
                <td>
                    <input type="date" class="muayene-tarih-input"
                           value="${gecerliTarih}"
                           onchange="ilkyardimTarihKaydet('${_esc(aktifFirma)}','${key}','gecerliTarih',this.value); ilkyardimModalSatirGuncelle(this, '${key}')">
                </td>
                <td>
                    <span class="muayene-durum-etiketi ${durum.sinif}" id="ilkyardim-modal-durum-${key}">
                        ${durum.ikon} ${durum.yazi}
                    </span>
                </td>
                <td>
                    <button onclick="ilkyardimModalSil('${key}')"
                        style="background:#fee2e2;border:1px solid #fecaca;color:#dc2626;border-radius:6px;padding:4px 9px;cursor:pointer;font-size:11px;font-weight:600;display:flex;align-items:center;gap:4px;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`);
    });

    _ilkyardimOzetGuncelle([gecerliSayac, uyariSayac, kritikSayac], keys.length);
}

async function ilkyardimTarihKaydet(firmaAdi, key, alan, deger) {
    const storageKey    = 'ilkyardim_verileri_' + firmaAdi;
    const ilkyardimData = await _veriOku(storageKey, {});
    if (!ilkyardimData[key]) ilkyardimData[key] = {};
    ilkyardimData[key][alan] = deger;
    await _veriYaz(storageKey, ilkyardimData);
}

async function ilkyardimModalSatirGuncelle(inputEl, key) {
    const durum  = _egitimDurumHesapla(inputEl.value);
    const etiket = document.getElementById('ilkyardim-modal-durum-' + key);
    if (etiket) {
        etiket.className   = 'muayene-durum-etiketi ' + durum.sinif;
        etiket.textContent = durum.ikon + ' ' + durum.yazi;
    }
    _ilkyardimOzetYenile();
    _ilkyardimListesiniYenile();
    await _ilkyardimUyariGuncelle();
}

function _ilkyardimOzetYenile() {
    const etiketler = document.querySelectorAll('#ilkyardim-modal-tablo .muayene-durum-etiketi');
    let gecerli = 0, uyari = 0, kritik = 0;
    etiketler.forEach(el => {
        if (el.classList.contains('gecerli')) gecerli++;
        else if (el.classList.contains('uyari')) uyari++;
        else if (el.classList.contains('kritik')) kritik++;
    });
    _ilkyardimOzetGuncelle([gecerli, uyari, kritik], etiketler.length);
}

function _ilkyardimOzetGuncelle(sayilar, toplam) {
    const [gecerli = 0, uyari = 0, kritik = 0] = sayilar;
    const chipToplam  = document.getElementById('ilkyardim-chip-toplam');
    const chipGecerli = document.getElementById('ilkyardim-chip-gecerli');
    const chipUyari   = document.getElementById('ilkyardim-chip-uyari');
    const chipKritik  = document.getElementById('ilkyardim-chip-kritik');
    if (chipToplam)  chipToplam.textContent  = `Toplam: ${toplam}`;
    if (chipGecerli) chipGecerli.textContent = `✓ Geçerli: ${gecerli}`;
    if (chipUyari)   chipUyari.textContent   = `⚠ Uyarı: ${uyari}`;
    if (chipKritik)  chipKritik.textContent  = `✗ Kritik: ${kritik}`;
}

function ilkyardimModalKapat() {
    const modal = document.getElementById('ilkyardim-modal');
    if (modal) modal.classList.remove('acik');
}

function ilkyardimPNGIndir() {
    const el = document.getElementById('ilkyardim-tablo-sarici');
    if (!el) return;
    const _do = () => html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        const a = document.createElement('a'); a.download = 'ilkyardim_durumu.png';
        a.href = canvas.toDataURL('image/png'); a.click();
    });
    if (typeof html2canvas === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = _do; document.head.appendChild(s);
    } else { _do(); }
}

function ilkyardimPDFIndir() {
    const el = document.getElementById('ilkyardim-tablo-sarici');
    if (!el) return;
    const _doIndir = () => {
        html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const imgW = 277; const imgH = (canvas.height * imgW) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgW, imgH);
            pdf.save('ilkyardim_durumu.pdf');
        });
    };
    _scriptYukleVeCalistir(
        ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
         'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'],
        () => typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined',
        _doIndir
    );
}

function kurulPeriyotGetir() {
    // Önce cache'e sor (değer ay cinsinden)
    const kural = (typeof MevzuatCache !== 'undefined') &&
                  MevzuatCache.kuralAl('İSG Kurulu Toplantı Sıklığı', aktifFirmaSinifi);
    if (kural && kural.birim === 'ay') return kural.deger;

    // Cache yoksa sabit değerlere düş
    const sinif = (aktifFirmaSinifi || '').toLowerCase();
    if (sinif.includes('çok tehlikeli')) return 1;
    if (sinif.includes('tehlikeli'))     return 2;
    if (sinif.includes('az tehlikeli'))  return 3;
    return null;
}

function kurulSinifBilgisiGuncelle() {
    const bilgi = document.getElementById('kurul-sinif-bilgi');
    const yazi  = document.getElementById('kurul-sinif-yazi');
    if (!bilgi || !yazi) return;

    const periyot = kurulPeriyotGetir();
    bilgi.className = 'kurul-sinif-bilgi';

    if (periyot === 1) {
        bilgi.classList.add('cok-tehlikeli');
        yazi.textContent = '🔴 Çok Tehlikeli — Ayda 1 toplantı zorunlu';
    } else if (periyot === 2) {
        bilgi.classList.add('tehlikeli');
        yazi.textContent = '🟠 Tehlikeli — 2 ayda 1 toplantı zorunlu';
    } else if (periyot === 3) {
        bilgi.classList.add('az-tehlikeli');
        yazi.textContent = '🟢 Az Tehlikeli — 3 ayda 1 toplantı zorunlu';
    } else {
        bilgi.classList.add('belirsiz');
        yazi.textContent = 'ℹ️ Firmaya tehlike sınıfı atanmamış';
    }
}

function kurulGeriSayimGuncelle() {
    const tarihStr = v('kurul-toplanti');
    const el       = document.getElementById('kurul-geri-sayim');
    const yazi     = document.getElementById('kurul-geri-yazi');
    const ikon     = document.getElementById('kurul-geri-ikon');
    if (!el || !yazi) return;

    if (!tarihStr) { el.style.display = 'none'; return; }

    const gun = farkHesapla(tarihStr);
    const gorselTarih = _tarihGorsel(tarihStr);
    el.style.display = 'flex';
    el.className = 'kurul-geri-sayim';

    if (gun < 0) {
        el.classList.add('kritik');
        if (ikon) ikon.className = 'fa-solid fa-triangle-exclamation';
        yazi.textContent = `⚠️ Toplantı tarihi ${Math.abs(gun)} gün önce geçti! (${gorselTarih})`;
    } else if (gun === 0) {
        el.classList.add('kritik');
        if (ikon) ikon.className = 'fa-solid fa-triangle-exclamation';
        yazi.textContent = `🔔 Bugün toplantı günü! (${gorselTarih})`;
    } else if (gun <= 10) {
        el.classList.add('kritik');
        if (ikon) ikon.className = 'fa-solid fa-triangle-exclamation';
        yazi.textContent = `🔴 Toplantıya ${gun} gün kaldı! (${gorselTarih})`;
    } else if (gun <= 30) {
        el.classList.add('uyari');
        if (ikon) ikon.className = 'fa-solid fa-bell';
        yazi.textContent = `🟠 Toplantıya ${gun} gün kaldı. (${gorselTarih})`;
    } else {
        el.classList.add('normal');
        if (ikon) ikon.className = 'fa-solid fa-calendar-check';
        yazi.textContent = `Toplantıya ${gun} gün kaldı — ${gorselTarih}`;
    }
}

async function kurulTamamlandi() {
    const mevcutTarih = v('kurul-toplanti');
    if (!mevcutTarih) { alert('Önce planlanan toplantı tarihi giriniz.'); return; }

    kurulGecmisToplantılar.push(mevcutTarih);
    kurulGecmisListesiGuncelle();

    const periyot = kurulPeriyotGetir();
    const inputEl = document.getElementById('kurul-toplanti');

    if (periyot && inputEl) {
        const baslangic = new Date(mevcutTarih);
        const yeniTarih = new Date(baslangic);
        yeniTarih.setMonth(yeniTarih.getMonth() + periyot);
        inputEl.value = _tarihFormatla(yeniTarih);
    } else if (inputEl) {
        inputEl.value = '';
    }

    kurulGeriSayimGuncelle();
    await kartGuncelle('kart-kurul');
    await kurulKaydet(true);
}

async function kurulKaydet(sessiz) {
    if (!aktifFirma || aktifFirmaIdx === null) return;

    // ✅ _id kontrolü
    const firmaId = aktifFirma._id || aktifFirma.id;
    if (!firmaId || firmaId === 'undefined') {
        console.error('[kurulKaydet] Firma _id yok:', aktifFirma);
        return;
    }

    try {
        const res = await AUTH.apiFetch(`/api/firmalar/${firmaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                isg: {
                    ...(aktifFirma.isg || {}),          // mevcut isg verilerini koru
                    kurulZorunluDegil:      cb('kurul-zorunlu-degil'),
                    kurulToplanti:          v('kurul-toplanti'),
                    kurulGecmisToplantılar: [...kurulGecmisToplantılar],
                }
            })
        });

        if (!res.ok) {
            console.error('[kurulKaydet] Hata:', await res.text());
            return;
        }

        // ✅ Local state'i de güncelle
        aktifFirma.isg = {
            ...(aktifFirma.isg || {}),
            kurulZorunluDegil:      cb('kurul-zorunlu-degil'),
            kurulToplanti:          v('kurul-toplanti'),
            kurulGecmisToplantılar: [...kurulGecmisToplantılar],
        };

    } catch (err) {
        console.error('[kurulKaydet] Fetch hatası:', err);
        return;
    }

    await kartGuncelle('kart-kurul');
    firmaKlasorleriYukle();

    if (!sessiz) {
        const btn = document.getElementById('btn-kurul-kaydet');
        if (btn) {
            const orijinal = btn.innerHTML;
            btn.innerHTML  = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
            btn.style.background = '#15803d';
            setTimeout(() => { btn.innerHTML = orijinal; btn.style.background = ''; }, 1800);
        }
    }
}

function kurulGecmisListesiGuncelle() {
    const alan  = document.getElementById('kurul-gecmis-alani');
    const liste = document.getElementById('kurul-gecmis-liste');
    if (!alan || !liste) return;

    if (kurulGecmisToplantılar.length === 0) {
        alan.style.display = 'none';
        return;
    }

    alan.style.display = 'block';
    liste.innerHTML = '';

    [...kurulGecmisToplantılar].reverse().forEach((tarih, reversedIdx) => {
        const gercekIdx = kurulGecmisToplantılar.length - 1 - reversedIdx;
        const div = document.createElement('div');
        div.className = 'kurul-gecmis-satir';
        div.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span style="flex:1;">${_tarihGorsel(tarih)} — Gerçekleşti</span>
            <button onclick="kurulGecmisSil(${gercekIdx})" title="Bu kaydı sil"
                style="background:#fee2e2;border:1px solid #fecaca;color:#dc2626;border-radius:4px;width:20px;height:20px;padding:0;cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
                onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'">
                <i class="fa-solid fa-xmark"></i>
            </button>`;
        liste.appendChild(div);
    });
}

async function kurulGecmisSil(idx) {
    if (!confirm('Bu toplantı kaydını silmek istediğinize emin misiniz?')) return;
    kurulGecmisToplantılar.splice(idx, 1);
    kurulGecmisListesiGuncelle();
    await kurulKaydet(true);
}

function _tarihGorsel(tarihStr) {
    if (!tarihStr) return '-';
    const [y, m, d] = tarihStr.split('-');
    return `${d}.${m}.${y}`;
}

// ==========================================
// ISG VERİLERİNİ YÜKLE
// ==========================================
async function isgVerileriniYukle(firmaAdi, firmaIdx) {
    _isgFormSifirla();
    yuklenenDosyalar = {};
    bekleyenDosyalar = {};

    const firmalar = await _veriOku('isg_firmalar', []);
    const firma    = firmalar[firmaIdx];
    if (!firma) return;

    const isg = firma.isg || {};

    _setVal('igu',   isg.igu);
    _setVal('hekim', isg.hekim);
    _setVal('dsp',   isg.dsp);

    if (isg.destek && Array.isArray(isg.destek))
        isg.destek.forEach(d => _destekSatirEkle(d));

    if (isg.kurulZorunluDegil) {
        document.getElementById('kurul-zorunlu-degil').checked = true;
        kurulZorunluToggle();
    }

    kurulSinifBilgisiGuncelle();
    _setVal('kurul-toplanti', isg.kurulToplanti);

    kurulGecmisToplantılar = Array.isArray(isg.kurulGecmisToplantılar)
        ? [...isg.kurulGecmisToplantılar] : [];
    kurulGecmisListesiGuncelle();
    setTimeout(kurulGeriSayimGuncelle, 50);

    _setVal('rv-tarih',    isg.rvTarih);
    _setVal('adp-tarih',   isg.adpTarih);
    _setVal('tatbikat-son', isg.tatbikatSon);

    if (isg.rvTarih) {
        const yilRv  = _rvAdpYilGetir();
        const bRv    = new Date(isg.rvTarih);
        bRv.setFullYear(bRv.getFullYear() + yilRv);
        const yeniRv = _tarihFormatla(bRv);
        _setVal('rv-revizyon', yeniRv);
        if (isg.rvRevizyon !== yeniRv) {
            firmalar[firmaIdx].isg.rvRevizyon = yeniRv;
            await _veriYaz('isg_firmalar', firmalar);
        }
    } else {
        _setVal('rv-revizyon', isg.rvRevizyon);
    }

    if (isg.adpTarih) {
        const yilAdp  = _rvAdpYilGetir();
        const bAdp    = new Date(isg.adpTarih);
        bAdp.setFullYear(bAdp.getFullYear() + yilAdp);
        const yeniAdp = _tarihFormatla(bAdp);
        _setVal('adp-revizyon', yeniAdp);
        if (isg.adpRevizyon !== yeniAdp) {
            firmalar[firmaIdx].isg.adpRevizyon = yeniAdp;
            await _veriYaz('isg_firmalar', firmalar);
        }
    } else {
        _setVal('adp-revizyon', isg.adpRevizyon);
    }

    _setVal('tatbikat-sonraki', isg.tatbikatSonraki);
    _setVal('denetim-tarih',      isg.denetimTarih);
    _setVal('denetim-gecerlilik', isg.denetimGecerlilik);
    if (isg.denetimMailAt) { const el = document.getElementById('denetim-mail-at'); if (el) el.checked = true; }
    _kartInlineListesiniGuncelle('denetim');

    _setVal('kkd-tarih',      isg.kkdTarih);
    _setVal('kkd-gecerlilik', isg.kkdGecerlilik);

    if (aktifFirmaId) {
        try {
         const res = await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(aktifFirma)}`);
         if (res.ok) {
            const data = await res.json();
            const docs = data.veri || [];
            docs.forEach(doc => {
                const kat = doc.kategori || _turdenKategori(doc.tur);
                if (!yuklenenDosyalar[kat]) yuklenenDosyalar[kat] = [];
                yuklenenDosyalar[kat].push({
                    _id:         doc._id,
                    ad:          doc.dosyaAdi || doc.baslik,
                    tur:         doc.dosyaTur || 'DOSYA',
                    tarih:       doc.gecerlilikBitis
                                    ? doc.gecerlilikBitis.split('T')[0] : '',
                    boyut:       doc.dosyaBoyut,
                    dataUrl:     doc.dosyaIcerik || '',
                    kayitTarihi: doc.olusturmaTarihi,
                });
            });
            console.log(`✅ MongoDB'den ${docs.length} doküman yüklendi`);
            // Mobilden yüklenenleri de ekle (VeriDepo'dan)
try {
    const veriDepoDoc = await _veriOku('isg_dosyalar_' + firmaAdi, {});
    Object.keys(veriDepoDoc).forEach(kat => {
        const dosyalar = veriDepoDoc[kat];
        if (!Array.isArray(dosyalar)) return;
        if (!yuklenenDosyalar[kat]) yuklenenDosyalar[kat] = [];
        dosyalar.forEach(d => {
            // Aynı dosya zaten eklenmediyse ekle
            const zatenVar = yuklenenDosyalar[kat].some(x => x.ad === d.ad);
            if (!zatenVar) {
                yuklenenDosyalar[kat].push({
                    _id:         d._id || null,
                    ad:          d.ad || 'İsimsiz',
                    tur:         d.tur || 'PDF',
                    tarih:       d.tarih || '',
                    boyut:       d.boyut || 0,
                    dataUrl:     d.dataUrl || '',
                    kayitTarihi: d.kayitTarihi || '',
                });
            }
        });
    });
    console.log('✅ VeriDepo dosyaları da yüklendi');
} catch(e) {
    console.warn('VeriDepo okunamadı:', e.message);
}
        }
        } catch (err) {
        console.warn('[isgVerileriniYukle] API hatası, localStorage:', err.message);
        yuklenenDosyalar = await _veriOku('isg_dosyalar_' + firmaAdi, {});
        }
    } else {
    yuklenenDosyalar = await _veriOku('isg_dosyalar_' + firmaAdi, {});
    }
    tumKlasorSayaclariniGuncelle();

    ['rv', 'adp', 'tatbikat', 'kkd'].forEach(kat => _kartInlineListesiniGuncelle(kat));

    await _olcumGoruntuleButonGuncelle();
    await tumKartlariGuncelle();
}

function _setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
}

// ==========================================
// RV & ADP — OTOMATİK REVİZYON TARİHİ
// ==========================================

function rvRevizyonOtomatik() {
    const tarihEl    = document.getElementById('rv-tarih');
    const revizyonEl = document.getElementById('rv-revizyon');
    if (!tarihEl || !revizyonEl || !tarihEl.value) return;
    const yil = _rvAdpYilGetir();
    const b   = new Date(tarihEl.value);
    b.setFullYear(b.getFullYear() + yil);
    revizyonEl.value = _tarihFormatla(b);
}

function adpRevizyonOtomatik() {
    const tarihEl    = document.getElementById('adp-tarih');
    const revizyonEl = document.getElementById('adp-revizyon');
    if (!tarihEl || !revizyonEl || !tarihEl.value) return;
    const yil = _rvAdpYilGetir();
    const b   = new Date(tarihEl.value);
    b.setFullYear(b.getFullYear() + yil);
    revizyonEl.value = _tarihFormatla(b);
}

function tatbikatSonrakiOtomatik() {
    const sonEl     = document.getElementById('tatbikat-son');
    const sonrakiEl = document.getElementById('tatbikat-sonraki');
    if (!sonEl || !sonrakiEl || !sonEl.value) return;

    // Tatbikat periyodu (her sınıfta aynı)
    let yil = 1;
    const kural = (typeof MevzuatCache !== 'undefined') &&
                  MevzuatCache.kuralAl('Acil Durum Tatbikatı', 'Tümü');
    if (kural && kural.birim === 'yıl') yil = kural.deger;

    const b = new Date(sonEl.value);
    b.setFullYear(b.getFullYear() + yil);
    sonrakiEl.value = _tarihFormatla(b);
}

function _rvAdpYilGetir() {
    // Risk Değerlendirmesi ve Acil Durum Planı yönetmelikte birebir
    // aynı periyotlara sahip — ikisi aynı kuralı paylaşır.
    const kural = (typeof MevzuatCache !== 'undefined') &&
                  MevzuatCache.kuralAl('Risk Değerlendirmesi Revizyon', aktifFirmaSinifi);
    if (kural && kural.birim === 'yıl') return kural.deger;

    // Cache yoksa sabit değerlere düş
    const sinif = (aktifFirmaSinifi || '').toLowerCase();
    if (sinif.includes('çok tehlikeli')) return 2;
    if (sinif.includes('tehlikeli'))     return 4;
    return 6;
}

function _tarihFormatla(d) {
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// ==========================================
// KART İÇİ INLINE DOSYA LİSTESİ
// ==========================================

function _kartInlineListesiniGuncelle(kategori) {
    const konteyner = document.getElementById('inline-dosyalar-' + kategori);
    if (!konteyner) return;

    const dosyalar = bekleyenDosyalar[kategori] || [];
    konteyner.innerHTML = '';
    if (dosyalar.length === 0) return;

    dosyalar.forEach((dosya, idx) => {
        const tur    = dosya.tur || 'DOSYA';
        const ikon   = ikonMap[tur] || 'fa-file';
        const adKisa = dosya.ad.length > 28 ? dosya.ad.substring(0, 25) + '...' : dosya.ad;
        const satir  = document.createElement('div');
        satir.className = 'inline-dosya-satir';
        satir.innerHTML = `
            <i class="fa-solid ${ikon}" style="font-size:12px;color:#475569;flex-shrink:0;"></i>
            <span class="inline-dosya-ad" title="${_htmlEsc(dosya.ad)}">${_htmlEsc(adKisa)}</span>
            <button class="inline-dosya-onizle-btn" onclick="_inlineOnizle('${kategori}', ${idx})" title="Önizle">
                <i class="fa-solid fa-eye"></i>
            </button>
            <button class="inline-dosya-sil-btn" onclick="_inlineSil('${kategori}', ${idx})" title="Sil">
                <i class="fa-solid fa-trash"></i>
            </button>`;
        konteyner.appendChild(satir);
    });
}

function _inlineOnizle(kategori, idx) {
    const dosya = (bekleyenDosyalar[kategori] || [])[idx];
    if (!dosya) return;
    _onizlemeGoster(dosya.ad, dosya.tur, dosya.dataUrl);
}

async function _inlineSil(kategori, idx) {
    if (!confirm('Bu belgeyi silmek istediğinize emin misiniz?')) return;

    const bekleyen = bekleyenDosyalar[kategori] || [];
    const dosya    = bekleyen[idx];
    if (!dosya) return;

    const gIdx = (yuklenenDosyalar[kategori] || [])
        .findIndex(d => d.ad === dosya.ad && d.boyut === dosya.boyut);

    bekleyen.splice(idx, 1);
    bekleyenDosyalar[kategori] = bekleyen;

    if (gIdx !== -1) {
        try {
            const res = await AUTH.apiFetch(
                `/api/dosya/${encodeURIComponent(aktifFirma)}/${encodeURIComponent(kategori)}/${gIdx}`,
                { method: 'DELETE' }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            yuklenenDosyalar[kategori].splice(gIdx, 1);
        } catch (e) {
            console.warn('[_inlineSil] API hatası, lokal silme yapılıyor:', e.message);
            yuklenenDosyalar[kategori].splice(gIdx, 1);
            await _isgDosyalariniKaydet();
        }
    }

    _klasorSayacGuncelle(kategori);
    _kartInlineListesiniGuncelle(kategori);
    firmaKlasorleriYukle();
}

// ==========================================
// RV, ADP, TATBİKAT, KKD, DENETİM KARTLARI
// ==========================================

function rvKartDosyaYukle(input) {
    if (!input.files || !input.files.length || !aktifFirma) return;
    _dosyaOku('rv', Array.from(input.files), () => {
        _klasorSayacGuncelle('rv');
        _kartInlineListesiniGuncelle('rv');
        firmaKlasorleriYukle();
    });
    input.value = '';
}

async function _isgAlaniKaydet(isgGuncelleme) {
    const firmaId = aktifFirmaId || aktifFirma?._id || aktifFirma?.id;
    if (!firmaId || firmaId === 'undefined') {
        console.error('[_isgAlaniKaydet] Firma _id yok:', aktifFirma, 'aktifFirmaId:', aktifFirmaId);
        throw new Error('Firma ID bulunamadı');
    }
    const res = await AUTH.apiFetch(`/api/firmalar/${firmaId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isg: isgGuncelleme }),
    });
    if (!res.ok) {
        const hata = await res.text();
        console.error('[_isgAlaniKaydet] Sunucu hatası:', hata);
        throw new Error(`HTTP ${res.status}`);
    }
    if (aktifFirma && typeof aktifFirma === 'object') {
        if (!aktifFirma.isg) aktifFirma.isg = {};
        Object.assign(aktifFirma.isg, isgGuncelleme);
    }
}

async function rvKaydet() {
    if (!aktifFirma || aktifFirmaIdx === null) return;
    const isgGuncelleme = {
        rvTarih:    v('rv-tarih'),
        rvRevizyon: v('rv-revizyon'),
    };
    try {
        await _isgAlaniKaydet(isgGuncelleme);
    } catch (err) {
        console.error('[rvKaydet]', err);
        return;
    }
    _bekleyenDosyalariTarihlendir('rv', v('rv-revizyon'));
    await kartGuncelle('kart-rv');
    firmaKlasorleriYukle();
    bekleyenDosyalar['rv'] = [];
    _kartInlineListesiniGuncelle('rv');
    _butonKaydedildiAnimasyon('btn-rv-kaydet', () => klasorModalAc('rv'));
}

function adpKartDosyaYukle(input) {
    if (!input.files || !input.files.length || !aktifFirma) return;
    _dosyaOku('adp', Array.from(input.files), () => {
        _klasorSayacGuncelle('adp');
        _kartInlineListesiniGuncelle('adp');
        firmaKlasorleriYukle();
    });
    input.value = '';
}

async function adpKaydet() {
    if (!aktifFirma || aktifFirmaIdx === null) return;
    const isgGuncelleme = {
        adpTarih:    v('adp-tarih'),
        adpRevizyon: v('adp-revizyon'),
    };
    try {
        await _isgAlaniKaydet(isgGuncelleme);
    } catch (err) {
        console.error('[adpKaydet]', err);
        return;
    }
    _bekleyenDosyalariTarihlendir('adp', v('adp-revizyon'));
    await kartGuncelle('kart-adp');
    firmaKlasorleriYukle();
    bekleyenDosyalar['adp'] = [];
    _kartInlineListesiniGuncelle('adp');
    _butonKaydedildiAnimasyon('btn-adp-kaydet', () => klasorModalAc('adp'));
}



function tatbikatKartDosyaYukle(input) {
    if (!input.files || !input.files.length || !aktifFirma) return;
    _dosyaOku('tatbikat', Array.from(input.files), () => {
        _klasorSayacGuncelle('tatbikat');
        _kartInlineListesiniGuncelle('tatbikat');
        firmaKlasorleriYukle();
    });
    input.value = '';
}

async function tatbikatKaydet() {
    if (!aktifFirma || aktifFirmaIdx === null) return;
    const isgGuncelleme = {
        tatbikatSon:     v('tatbikat-son'),
        tatbikatSonraki: v('tatbikat-sonraki'),
    };
    try {
        await _isgAlaniKaydet(isgGuncelleme);
    } catch (err) {
        console.error('[tatbikatKaydet]', err);
        return;
    }
    _bekleyenDosyalariTarihlendir('tatbikat', v('tatbikat-sonraki'));
    await kartGuncelle('kart-tatbikat');
    firmaKlasorleriYukle();
    bekleyenDosyalar['tatbikat'] = [];
    _kartInlineListesiniGuncelle('tatbikat');
    _butonKaydedildiAnimasyon('btn-tatbikat-kaydet', () => klasorModalAc('tatbikat'));
}
function kkdKartDosyaYukle(input) {
    if (!input.files || !input.files.length || !aktifFirma) return;
    _dosyaOku('kkd', Array.from(input.files), () => {
        _klasorSayacGuncelle('kkd');
        _kartInlineListesiniGuncelle('kkd');
        firmaKlasorleriYukle();
    });
    input.value = '';
}

async function kkdKaydet() {
    if (!aktifFirma || aktifFirmaIdx === null) return;
    const isgGuncelleme = {
        kkdTarih:      v('kkd-tarih'),
        kkdGecerlilik: v('kkd-gecerlilik'),
    };
    try {
        await _isgAlaniKaydet(isgGuncelleme);
    } catch (err) {
        console.error('[kkdKaydet]', err);
        return;
    }
    if (v('kkd-gecerlilik')) _bekleyenDosyalariTarihlendir('kkd', v('kkd-gecerlilik'));
    await kartGuncelle('kart-kkd');
    firmaKlasorleriYukle();
    bekleyenDosyalar['kkd'] = [];
    _kartInlineListesiniGuncelle('kkd');
    _butonKaydedildiAnimasyon('btn-kkd-kaydet', () => klasorModalAc('kkd'));
}



function denetimKartDosyaYukle(input) {
    if (!input.files || !input.files.length || !aktifFirma) return;
    _dosyaOku('denetim', Array.from(input.files), () => {
        _klasorSayacGuncelle('denetim');
        _kartInlineListesiniGuncelle('denetim');
        firmaKlasorleriYukle();
    });
    input.value = '';
}

function denetimGecerlilikOtomatik() { kartGuncelle('kart-denetim'); }

async function denetimKaydet() {
    if (!aktifFirma || aktifFirmaIdx === null) return;
    const isgGuncelleme = {
        denetimTarih:      v('denetim-tarih'),
        denetimGecerlilik: v('denetim-gecerlilik'),
        denetimMailAt:     cb('denetim-mail-at'),
    };
    try {
        await _isgAlaniKaydet(isgGuncelleme);
    } catch (err) {
        console.error('[denetimKaydet]', err);
        return;
    }
    if (v('denetim-gecerlilik')) _bekleyenDosyalariTarihlendir('denetim', v('denetim-gecerlilik'));
    if (cb('denetim-mail-at'))  await _denetimMailGonder();
    await kartGuncelle('kart-denetim');
    firmaKlasorleriYukle();
    bekleyenDosyalar['denetim'] = [];
    _kartInlineListesiniGuncelle('denetim');
    _butonKaydedildiAnimasyon('btn-denetim-kaydet', () => klasorModalAc('denetim'));
}

async function _denetimMailGonder() {
    if (!aktifFirmaId) {
        alert('⚠️ Firma ID bulunamadı, e-posta gönderilemedi.');
        return;
    }
    const yeniEklenenIdler = (bekleyenDosyalar['denetim'] || [])
        .filter(d => d._id)
        .map(d => d._id);
 
    const payload = {
        firmaId:             aktifFirmaId,
        dokumanIdleri:       yeniEklenenIdler,
        hazirlanmaTarihi:    v('denetim-tarih')      || '',
        sonGecerlilikTarihi: v('denetim-gecerlilik') || '',
    };
    try {
        const res   = await AUTH.apiFetch('/api/dokumanlar/mail-gonder', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        });
        const sonuc = await res.json().catch(() => ({}));
        if (res.ok && sonuc.basari) {
            const ekYazi = sonuc.ekSayisi > 0 ? ` (${sonuc.ekSayisi} ek ile)` : '';
            alert(`📧 Bildirim e-postası gönderildi: ${sonuc.eposta}${ekYazi}`);
        } else {
            alert(`⚠️ E-posta gönderilemedi: ${sonuc.mesaj || `HTTP ${res.status}`}`);
        }
    } catch (err) {
        console.error('[_denetimMailGonder] Hata:', err);
        alert('⚠️ E-posta gönderilirken bir hata oluştu: ' + err.message);
    }
}

// ==========================================
// BEKLEYEN DOSYALARA TARİH YAZ
// ==========================================
async function _bekleyenDosyalariTarihlendir(kategori, tarih) {
    if (!tarih) return;
    const bekleyen  = bekleyenDosyalar[kategori] || [];
    if (bekleyen.length === 0) return;

    const tumDosyalar = yuklenenDosyalar[kategori] || [];
    bekleyen.forEach(bekDosya => {
        bekDosya.tarih = tarih;
        const eslesen = tumDosyalar.find(d => d.ad === bekDosya.ad && d.boyut === bekDosya.boyut);
        if (eslesen) eslesen.tarih = tarih;
    });

    await _isgDosyalariniKaydet();
}

// ==========================================
// KAYDET ANİMASYONU
// ==========================================
function _butonKaydedildiAnimasyon(btnId, callback) {
    const btn = document.getElementById(btnId);
    if (!btn) { if (callback) callback(); return; }
    const orijinal = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
    btn.style.background = '#15803d';
    setTimeout(() => {
        btn.innerHTML = orijinal;
        btn.style.background = '';
        if (callback) callback();
    }, 1200);
}


// ORTAM ÖLÇÜMLERİ — EKİPMAN BAZLI

function olcumGecerlilikOtomatik() {
    const tarihEl   = document.getElementById('olcum-tarih');
    const gecerliEl = document.getElementById('olcum-sonraki');
    const periyotEl = document.getElementById('olcum-periyot');
    if (!tarihEl || !gecerliEl || !tarihEl.value) return;

    // Dropdown'dan seçilen periyot (kullanıcı yönetmelikteki standart değerleri seçer)
    const secilen = periyotEl ? periyotEl.value : '1yil';

    const PERIYOT_TABLOSU = {
        '6ay':   { deger: 6,  birim: 'ay'  },
        '1yil':  { deger: 1,  birim: 'yıl' },
        '3yil':  { deger: 3,  birim: 'yıl' },
        '5yil':  { deger: 5,  birim: 'yıl' },
        '10yil': { deger: 10, birim: 'yıl' },
    };

    const { deger, birim } = PERIYOT_TABLOSU[secilen] || PERIYOT_TABLOSU['1yil'];

    const b = new Date(tarihEl.value);
    if (birim === 'ay') {
        b.setMonth(b.getMonth() + deger);
    } else {
        b.setFullYear(b.getFullYear() + deger);
    }
    gecerliEl.value = _tarihFormatla(b);
}

async function olcumEkipmanKaydet() {
    if (!aktifFirma) { alert('Lütfen önce bir firma klasörü açın.'); return; }

    const ekipmanAdi  = v('olcum-ekipman-adi');
    const raporTarihi = v('olcum-tarih');
    if (!ekipmanAdi)  { alert('Ekipman adı zorunludur.'); return; }
    if (!raporTarihi) { alert('Rapor tarihi zorunludur.'); return; }

    const storageKey = 'olcum_ekipman_verileri_' + aktifFirma;
    const ekipmanlar = await _veriOku(storageKey, []);

    // Dropdown'dan seçilen periyodu oku
const periyotSecim = v('olcum-periyot') || '1yil';

// Seçimi insan tarafından okunabilir etikete çevir
const PERIYOT_ETIKET = {
    '6ay':   '6 Aylık',
    '1yil':  'Yıllık',
    '3yil':  '3 Yıllık',
    '5yil':  '5 Yıllık',
    '10yil': '10 Yıllık',
};
const periyotEtiket = PERIYOT_ETIKET[periyotSecim] || 'Yıllık';

ekipmanlar.push({
    id:               Date.now(),
    ekipmanAdi,
    seriNo:           v('olcum-seri-no'),
    raporNo:          v('olcum-rapor-no'),
    kontrolFirma:     v('olcum-kurum'),
    raporTarihi,
    gecerlilikTarihi: v('olcum-sonraki'),
    kontrolPeriyodu:  periyotSecim,    // "1yil", "3yil" gibi kod — mantık için
    periyotEtiket:    periyotEtiket,   // "Yıllık", "3 Yıllık" gibi gösterim için
    kayitTarihi:      new Date().toISOString(),
});

    await _veriYaz(storageKey, ekipmanlar);

    ['olcum-ekipman-adi','olcum-seri-no','olcum-rapor-no','olcum-kurum','olcum-tarih','olcum-sonraki']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

// Periyot dropdown'ını varsayılana (Yıllık) resetle
const periyotEl = document.getElementById('olcum-periyot');
if (periyotEl) periyotEl.value = '1yil';

    await kartGuncelle('kart-olcum');
    await _olcumGoruntuleButonGuncelle();
    firmaKlasorleriYukle();

    const btn = document.getElementById('btn-olcum-kaydet');
    if (btn) {
        const orijinal = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
        btn.style.background = '#15803d';
        setTimeout(() => { btn.innerHTML = orijinal; btn.style.background = ''; }, 1800);
    }
}

async function _olcumGoruntuleButonGuncelle() {
    if (!aktifFirma) return;
    const ekipmanlar = await _veriOku('olcum_ekipman_verileri_' + aktifFirma, []);
    const btn    = document.getElementById('btn-olcum-goruntule');
    const sayiEl = document.getElementById('olcum-btn-sayi');
    if (btn)    btn.style.display  = ekipmanlar.length > 0 ? 'flex' : 'none';
    if (sayiEl) sayiEl.textContent = ekipmanlar.length;
}

async function olcumModalAc() {
    if (!aktifFirma) { alert('Lütfen önce bir firma klasörü açın.'); return; }
    const baslikEl = document.getElementById('olcum-modal-baslik');
    if (baslikEl) baslikEl.textContent = `İş Ekipmanları Ölçüm Durumu — ${aktifFirma}`;
    await _olcumModalTablosunuDoldur();
    document.getElementById('olcum-modal').classList.add('acik');
}

async function _olcumModalTablosunuDoldur() {
    if (!aktifFirma) return;

    const ekipmanlar = await _veriOku('olcum_ekipman_verileri_' + aktifFirma, []);
    const tablo      = document.getElementById('olcum-modal-tablo');
    const body       = document.getElementById('olcum-modal-tablo-body');
    const bos        = document.getElementById('olcum-modal-bos-mesaj');

    if (ekipmanlar.length === 0) {
        if (tablo) tablo.style.display = 'none';
        if (bos)   bos.style.display   = 'block';
        _olcumOzetGuncelle(0, 0, 0, 0);
        return;
    }

    if (tablo) tablo.style.display = 'table';
    if (bos)   bos.style.display   = 'none';
    if (body)  body.innerHTML = '';

    let gecerliSayac = 0, uyariSayac = 0, kritikSayac = 0;

    ekipmanlar.forEach((ekipman, idx) => {
        const durum = _olcumDurumHesapla(ekipman.gecerlilikTarihi);
        if      (durum.sinif === 'gecerli') gecerliSayac++;
        else if (durum.sinif === 'uyari')   uyariSayac++;
        else if (durum.sinif === 'kritik')  kritikSayac++;

        const baslarf = (ekipman.ekipmanAdi || '').substring(0, 2).toUpperCase();

        if (body) body.insertAdjacentHTML('beforeend', `
            <tr>
                <td style="color:#94a3b8;font-size:11px;">${idx + 1}</td>
                <td>
                    <div class="personel-ad-hucre">
                        <div class="ekipman-avatar-mini">${baslarf}</div>
                        <div style="font-weight:700;font-size:12px;">${_htmlEsc(ekipman.ekipmanAdi)}</div>
                    </div>
                </td>
                <td style="font-size:11px;color:#64748b;">${_htmlEsc(ekipman.seriNo || '—')}</td>
                <td style="font-size:11px;color:#64748b;">${_htmlEsc(ekipman.raporNo || '—')}</td>
                <td style="font-size:11px;color:#64748b;">${_htmlEsc(ekipman.kontrolFirma || '—')}</td>
                <td style="font-size:11px;">${ekipman.raporTarihi ? _tarihGorsel(ekipman.raporTarihi) : '—'}</td>
                <td style="font-size:11px;">
                    ${ekipman.periyotEtiket
                        ? `<span style="background:#eff6ff;color:#2563eb;padding:3px 8px;border-radius:5px;font-weight:600;font-size:10.5px;white-space:nowrap;">${_htmlEsc(ekipman.periyotEtiket)}</span>`
                        : '<span style="color:#cbd5e1;font-size:10px;">—</span>'}
                </td>
                <td style="font-size:11px;">${ekipman.gecerlilikTarihi ? _tarihGorsel(ekipman.gecerlilikTarihi) : '—'}</td>
                <td><span class="muayene-durum-etiketi ${durum.sinif}">${durum.ikon} ${durum.yazi}</span></td>
                <td>
                    <button onclick="olcumModalSil(${ekipman.id})"
                        style="background:#fee2e2;border:1px solid #fecaca;color:#dc2626;border-radius:6px;padding:4px 9px;cursor:pointer;font-size:11px;font-weight:600;display:flex;align-items:center;gap:4px;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`);
    });

    _olcumOzetGuncelle(ekipmanlar.length, gecerliSayac, uyariSayac, kritikSayac);
}

async function olcumModalSil(id) {
    if (!confirm('Bu ekipman kaydını silmek istediğinize emin misiniz?')) return;
    const storageKey = 'olcum_ekipman_verileri_' + aktifFirma;
    let ekipmanlar   = await _veriOku(storageKey, []);
    ekipmanlar       = ekipmanlar.filter(e => e.id !== id);
    await _veriYaz(storageKey, ekipmanlar);

    await kartGuncelle('kart-olcum');
    await _olcumGoruntuleButonGuncelle();
    await _olcumModalTablosunuDoldur();
    firmaKlasorleriYukle();
}

function olcumModalKapat() {
    const modal = document.getElementById('olcum-modal');
    if (modal) modal.classList.remove('acik');
}

function _olcumDurumHesapla(gecerliTarih) {
    if (!gecerliTarih) return { sinif: 'yok', ikon: '—', yazi: 'Tarih Yok' };
    const gun = farkHesapla(gecerliTarih);
    if (gun <= 0)  return { sinif: 'kritik', ikon: '✗', yazi: 'Süresi Doldu' };
    if (gun <= 10) return { sinif: 'kritik', ikon: '🔴', yazi: `${gun} Gün` };
    if (gun <= 30) return { sinif: 'uyari',  ikon: '🟠', yazi: `${gun} Gün` };
    return { sinif: 'gecerli', ikon: '✓', yazi: `${gun} Gün` };
}

function _olcumOzetGuncelle(toplam, gecerli, uyari, kritik) {
    const chipToplam  = document.getElementById('olcum-chip-toplam');
    const chipGecerli = document.getElementById('olcum-chip-gecerli');
    const chipUyari   = document.getElementById('olcum-chip-uyari');
    const chipKritik  = document.getElementById('olcum-chip-kritik');
    if (chipToplam)  chipToplam.textContent  = `Toplam: ${toplam}`;
    if (chipGecerli) chipGecerli.textContent = `✓ Geçerli: ${gecerli}`;
    if (chipUyari)   chipUyari.textContent   = `⚠ Uyarı: ${uyari}`;
    if (chipKritik)  chipKritik.textContent  = `✗ Kritik: ${kritik}`;
}

function olcumPNGIndir() {
    const el = document.getElementById('olcum-tablo-sarici');
    if (!el) return;
    const _do = () => html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
        const a = document.createElement('a'); a.download = 'olcum_durumu.png';
        a.href = canvas.toDataURL('image/png'); a.click();
    });
    if (typeof html2canvas === 'undefined') {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = _do; document.head.appendChild(s);
    } else { _do(); }
}

function olcumPDFIndir() {
    const el = document.getElementById('olcum-tablo-sarici');
    if (!el) return;
    const _doIndir = () => {
        html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const imgW = 277; const imgH = (canvas.height * imgW) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgW, imgH);
            pdf.save('olcum_durumu.pdf');
        });
    };
    _scriptYukleVeCalistir(
        ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
         'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'],
        () => typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined',
        _doIndir
    );
}

// ==========================================
// ISG FORM SIFIRLA
// ==========================================
function _isgFormSifirla() {
    const ids = [
        'igu','hekim','dsp',
        'kurul-toplanti',
        'rv-tarih','rv-revizyon','adp-tarih','adp-revizyon',
        'tatbikat-son','tatbikat-sonraki',
        'olcum-ekipman-adi','olcum-seri-no','olcum-rapor-no','olcum-kurum',
        'olcum-tarih','olcum-sonraki',
        'denetim-tarih','denetim-gecerlilik','kkd-tarih','kkd-gecerlilik',
    ];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    ['kurul-zorunlu-degil','denetim-mail-at']
        .forEach(id => { const el = document.getElementById(id); if (el) el.checked = false; });

    ['koruma','kurtarma','sondurme','ilkyardim'].forEach(ekip => {
        const sel    = document.getElementById('destek-' + ekip + '-secim');
        const alan   = document.getElementById('destek-' + ekip + '-tarih-alani');
        const kaydet = document.getElementById('btn-destek-' + ekip + '-kaydet');
        const durum  = document.getElementById('destek-' + ekip + '-durum');
        if (sel)    sel.innerHTML = '<option value="">— Personel Seçin —</option>';
        if (alan)   alan.style.display   = 'none';
        if (kaydet) kaydet.style.display = 'none';
        if (durum)  durum.style.display  = 'none';
    });

    const sifirlaBtn = (id, display = 'none') => {
        const el = document.getElementById(id); if (el) el.style.display = display;
    };
    const sifirlaText = (id, text = '0') => {
        const el = document.getElementById(id); if (el) el.textContent = text;
    };
    const sifirlaHTML = (id) => {
        const el = document.getElementById(id); if (el) el.innerHTML = '';
    };

    sifirlaBtn('btn-destek-goruntule'); sifirlaText('destek-btn-sayi');
    ['temsilci-tarih-alani','btn-temsilci-kaydet','temsilci-personel-durum','btn-temsilci-goruntule']
        .forEach(id => sifirlaBtn(id));
    sifirlaText('temsilci-btn-sayi');
    const temsilciSel = document.getElementById('temsilci-personel-secim');
    if (temsilciSel) temsilciSel.innerHTML = '<option value="">— Personel Seçin —</option>';

    ['muayene-tarih-alani','btn-muayene-kaydet','muayene-personel-durum'].forEach(id => sifirlaBtn(id));
    ['egitim-tarih-alani','btn-egitim-kaydet','egitim-personel-durum'].forEach(id => sifirlaBtn(id));
    ['ilkyardim-tarih-alani','btn-ilkyardim-kaydet','ilkyardim-personel-durum','ilkyardim-zorunlu-uyari','btn-ilkyardim-goruntule']
        .forEach(id => sifirlaBtn(id));
    sifirlaText('ilkyardim-btn-sayi');
    sifirlaHTML('ilkyardim-kayitli-liste');

    sifirlaBtn('btn-olcum-goruntule'); sifirlaText('olcum-btn-sayi');

    const ka = document.getElementById('kurul-alanlari');
    if (ka) ka.style.display = 'block';
    sifirlaBtn('kurul-geri-sayim');

    kurulGecmisToplantılar = [];
    sifirlaBtn('kurul-gecmis-alani');
    sifirlaHTML('kurul-gecmis-liste');
    sifirlaHTML('destek-listesi');

    ['rv','adp','tatbikat','kkd','denetim'].forEach(kat => {
        const el = document.getElementById('inline-dosyalar-' + kat);
        if (el) el.innerHTML = '';
    });

    Object.keys(kartKontroller).forEach(kartId => {
        const kart = document.getElementById(kartId);
        if (!kart) return;
        kart.classList.remove('dolu');
        const durumEl = kart.querySelector('.isg-kart-durum');
        if (durumEl) durumEl.textContent = 'EKSİK';
    });

    Object.keys(kategoriEtiketMap).forEach(kat => {
        const el = document.getElementById('sayi-' + kat); if (el) el.textContent = '0';
    });

    sifirlaBtn('btn-muayene-goruntule');
    sifirlaBtn('btn-egitim-goruntule');
}

// ==========================================
// ISG KART GÜNCELLEME
// ==========================================
async function kartGuncelle(kartId) {
    const kart = document.getElementById(kartId);
    if (!kart) return;
    const kontrolFn = kartKontroller[kartId];
    if (!kontrolFn) return;
    const dolu = !!(await Promise.resolve(kontrolFn()));
    kart.classList.toggle('dolu', dolu);
    const durumEl = kart.querySelector('.isg-kart-durum');
    if (durumEl) durumEl.textContent = dolu ? 'TAMAM' : 'EKSİK';
}

async function tumKartlariGuncelle() {
    for (const kartId of Object.keys(kartKontroller)) {
        await kartGuncelle(kartId);
    }
}

// ==========================================
// KURUL ZORUNLU DEĞİL
// ==========================================
function kurulZorunluToggle() {
    const alanlar = document.getElementById('kurul-alanlari');
    if (alanlar) alanlar.style.display = cb('kurul-zorunlu-degil') ? 'none' : 'block';
    kartGuncelle('kart-kurul');
}

// ==========================================
// DESTEK ELEMANLARI (geriye dönük uyumluluk)
// ==========================================
function destekEkle() { _destekSatirEkle(''); }

function _destekSatirEkle(deger) {
    const liste = document.getElementById('destek-listesi');
    if (!liste) return;
    const div = document.createElement('div');
    div.className = 'iy-satir-kart';
    div.innerHTML = `
        <div class="iy-satir-ust">
            <input type="text" placeholder="Ad Soyad / Görev" value="${deger}"
                   oninput="kartGuncelle('kart-temsilci')">
            <button class="btn-iy-sil"
                onclick="this.closest('.iy-satir-kart').remove(); kartGuncelle('kart-temsilci')">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>`;
    liste.appendChild(div);
}

// ==========================================
// KLASÖR MODAL
// ==========================================
function klasorModalAc(kategori) {
    aktifKlasorKategori = kategori;
    const modal  = document.getElementById('klasor-modal');
    const baslik = document.getElementById('klasor-modal-baslik');
    baslik.textContent = (kategoriEtiketMap[kategori] || kategori) + ' Belgeleri';
    modal.classList.add('acik');
    klasorModalListesiYenile();
}

function klasorModalKapat() {
    document.getElementById('klasor-modal').classList.remove('acik');
    if (aktifKlasorKategori && ['rv','adp','tatbikat','kkd','denetim'].includes(aktifKlasorKategori)) {
        _kartInlineListesiniGuncelle(aktifKlasorKategori);
    }
    aktifKlasorKategori = null;
}

function klasorModalArkaKapat(e) {
    if (e.target.id === 'klasor-modal') klasorModalKapat();
}

// ==========================================
// KLASÖR MODAL LİSTESİ YENİLE
// ==========================================
function klasorModalListesiYenile() {
    if (!aktifKlasorKategori) return;
    const alan = document.getElementById('klasor-dosya-listesi-alan');
    alan.innerHTML = '';

    const dosyalar = (yuklenenDosyalar[aktifKlasorKategori] || []);

    if (dosyalar.length === 0) {
        alan.insertAdjacentHTML('beforeend', `
            <div class="klasor-bos" id="klasor-bos-mesaj">
                <i class="fa-solid fa-folder-open"></i>
                <p>Bu klasörde henüz belge yok.<br>Aşağıdaki alandan yeni belge ekleyebilirsiniz.</p>
            </div>`);
    } else {
        dosyalar.forEach((dosya, idx) => {
            const tur      = dosya.tur || 'DOSYA';
            const ikon     = ikonMap[tur] || 'fa-file';
            const ikonRenk = ikonRenkMap[tur] || 'diger-ikon';
            const tarih    = dosya.tarih || '';
            const gun      = tarih ? farkHesapla(tarih) : null;

            let gecerlilikHtml = '';
            if (tarih) {
                const [yil, ay, g] = tarih.split('-');
                const gorselTarih  = `${g}.${ay}.${yil}`;
                let etiketSinif = 'gecerli'; let etiketYazi = `Geçerli — ${gun} gün`;
                if (gun <= 0)       { etiketSinif = 'kritik'; etiketYazi = 'Süresi dolmuş!'; }
                else if (gun <= 10) { etiketSinif = 'kritik'; etiketYazi = `${gun} gün kaldı`; }
                else if (gun <= 30) { etiketSinif = 'uyari';  etiketYazi = `${gun} gün kaldı`; }
                gecerlilikHtml = `<span class="dosya-gecerlilik-etiketi ${etiketSinif}">${etiketYazi}</span>`;
            } else {
                gecerlilikHtml = `<span class="dosya-gecerlilik-etiketi belirsiz">Tarih yok</span>`;
            }

            const satirId = `dosya-satir-${aktifKlasorKategori}-${idx}`;
            const satir   = document.createElement('div');
            satir.className = 'klasor-dosya-satir';
            satir.id = satirId;
            satir.innerHTML = `
                <i class="fa-solid ${ikon} dosya-tip-ikon ${ikonRenk}"></i>
                <div class="klasor-dosya-bilgi">
                    <div class="dosya-ad" title="${_htmlEsc(dosya.ad)}">${_htmlEsc(dosya.ad)}</div>
                    <div class="dosya-meta"><span>${tur}</span>${gecerlilikHtml}</div>
                </div>
                <div class="klasor-dosya-aksiyonlar">
                    <button class="btn-dosya-onizle" onclick="modalDosyaOnizle(${idx})">
                        <i class="fa-solid fa-eye"></i> Önizle
                    </button>
                    <button class="btn-dosya-duzenle" onclick="dosyaDuzenleToggle('${satirId}', ${idx})">
                        <i class="fa-solid fa-pen"></i> Güncelle
                    </button>
                    <button class="btn-dosya-sil-k" onclick="modalDosyaSil(${idx})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>`;

            const form = document.createElement('div');
            form.className = 'dosya-duzenle-form';
            form.id = `form-${satirId}`;
            form.innerHTML = `
                <label>Dosya Adı</label>
                <input type="text" id="inp-ad-${idx}" value="${_htmlEsc(dosya.ad)}">
                <label style="margin-top:4px;">Son Geçerlilik Tarihi</label>
                <input type="date" id="inp-tarih-${idx}" value="${tarih}">
                <div class="dosya-duzenle-butonlar">
                    <button class="btn-duzenle-kaydet" onclick="dosyaDuzenlemeKaydet(${idx})">
                        <i class="fa-solid fa-check"></i> Kaydet
                    </button>
                    <button class="btn-duzenle-iptal" onclick="dosyaDuzenleToggle('${satirId}', ${idx})">
                        İptal
                    </button>
                </div>`;

            satir.appendChild(form);
            alan.appendChild(satir);
        });
    }

    alan.insertAdjacentHTML('beforeend', `
        <div class="klasor-yukle-bolumu">
            <input type="file" id="file-modal-yukle-inline"
                   accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.xlsx,.xls" multiple
                   onchange="dosyaYukleModaldan(this)" style="display:none;">
            <div class="klasor-yukle-alan"
                 onclick="document.getElementById('file-modal-yukle-inline').click()"
                 ondragover="event.preventDefault(); this.style.borderColor='#2563eb';"
                 ondragleave="this.style.borderColor='';"
                 ondrop="event.preventDefault(); this.style.borderColor=''; _modalDragDrop(event);">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size:1.6rem;color:#93c5fd;margin-bottom:6px;display:block;"></i>
                <div style="font-size:13px;font-weight:700;color:#1d4ed8;">Belge Ekle</div>
                <div style="font-size:11px;color:#64748b;margin-top:3px;">Tıklayın veya dosyayı sürükleyip bırakın</div>
                <div style="font-size:10px;color:#94a3b8;margin-top:2px;">PDF, DOCX, JPG, PNG, XLSX</div>
            </div>
        </div>`);

    _klasorSayacGuncelle(aktifKlasorKategori);
}

function _modalDragDrop(event) {
    const files = event.dataTransfer?.files;
    if (!files || !files.length || !aktifFirma || !aktifKlasorKategori) return;
    _dosyaOku(aktifKlasorKategori, Array.from(files), () => {
        _klasorSayacGuncelle(aktifKlasorKategori);
        klasorModalListesiYenile();
        if (['rv','adp','tatbikat','kkd','denetim'].includes(aktifKlasorKategori)) {
            _kartInlineListesiniGuncelle(aktifKlasorKategori);
        }
        firmaKlasorleriYukle();
    });
}

function dosyaDuzenleToggle(satirId, idx) {
    const form = document.getElementById(`form-${satirId}`);
    if (form) form.classList.toggle('acik');
}

async function dosyaDuzenlemeKaydet(idx) {
    if (!aktifKlasorKategori || !aktifFirma) return;

    const dosyalar = yuklenenDosyalar[aktifKlasorKategori] || [];
    if (!dosyalar[idx]) return;

    const yeniAd    = document.getElementById(`inp-ad-${idx}`)?.value.trim();
    const yeniTarih = document.getElementById(`inp-tarih-${idx}`)?.value;

    const body = {};
    if (yeniAd)                  body.ad    = yeniAd;
    if (yeniTarih !== undefined) body.tarih = yeniTarih;

    try {
        const res = await AUTH.apiFetch(
            `/api/dosya/${encodeURIComponent(aktifFirma)}/${encodeURIComponent(aktifKlasorKategori)}/${idx}`,
            {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        if (yeniAd)                  dosyalar[idx].ad    = yeniAd;
        if (yeniTarih !== undefined) dosyalar[idx].tarih = yeniTarih;

    } catch (e) {
        console.warn('[dosyaDuzenlemeKaydet] API hatası, lokal kayıt yapılıyor:', e.message);
        if (yeniAd)                  dosyalar[idx].ad    = yeniAd;
        if (yeniTarih !== undefined) dosyalar[idx].tarih = yeniTarih;
        await _isgDosyalariniKaydet();
    }

    _klasorSayacGuncelle(aktifKlasorKategori);
    klasorModalListesiYenile();
    firmaKlasorleriYukle();

    if (['rv', 'adp', 'tatbikat', 'kkd', 'denetim'].includes(aktifKlasorKategori)) {
        _kartInlineListesiniGuncelle(aktifKlasorKategori);
    }
}

async function modalDosyaSil(idx) {
    if (!aktifKlasorKategori || !aktifFirma) return;
    if (!confirm('Bu belgeyi silmek istediğinize emin misiniz?')) return;

    try {
        const res = await AUTH.apiFetch(
            `/api/dosya/${encodeURIComponent(aktifFirma)}/${encodeURIComponent(aktifKlasorKategori)}/${idx}`,
            { method: 'DELETE' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const dosyalar = yuklenenDosyalar[aktifKlasorKategori] || [];
        dosyalar.splice(idx, 1);
        yuklenenDosyalar[aktifKlasorKategori] = dosyalar;

    } catch (e) {
        console.warn('[modalDosyaSil] API hatası, lokal silme yapılıyor:', e.message);
        const dosyalar = yuklenenDosyalar[aktifKlasorKategori] || [];
        dosyalar.splice(idx, 1);
        yuklenenDosyalar[aktifKlasorKategori] = dosyalar;
        await _isgDosyalariniKaydet();
    }

    _klasorSayacGuncelle(aktifKlasorKategori);
    klasorModalListesiYenile();

    if (['rv', 'adp', 'tatbikat', 'kkd', 'denetim'].includes(aktifKlasorKategori)) {
        _kartInlineListesiniGuncelle(aktifKlasorKategori);
    }

    firmaKlasorleriYukle();
}

function modalDosyaOnizle(idx) {
    if (!aktifKlasorKategori) return;
    const dosya = (yuklenenDosyalar[aktifKlasorKategori] || [])[idx];
    if (!dosya) return;
    _onizlemeGoster(dosya.ad, dosya.tur, dosya.dataUrl);
}

// ==========================================
// DOSYA YÜKLEME
// ==========================================
function klasorYukleTikla() {
    const el = document.getElementById('file-modal-yukle-inline') || document.getElementById('file-modal-yukle');
    if (el) el.click();
}

function dosyaYukleModaldan(input) {
    if (!input.files || !input.files.length || !aktifFirma || !aktifKlasorKategori) return;
    _dosyaOku(aktifKlasorKategori, Array.from(input.files), () => {
        _klasorSayacGuncelle(aktifKlasorKategori);
        klasorModalListesiYenile();
        if (['rv','adp','tatbikat','kkd','denetim'].includes(aktifKlasorKategori)) {
            _kartInlineListesiniGuncelle(aktifKlasorKategori);
        }
        firmaKlasorleriYukle();
    });
    input.value = '';
}

function dosyaYukleKlasore(kategori, input) {
    if (!input.files || !input.files.length || !aktifFirma) return;
    _dosyaOku(kategori, Array.from(input.files), () => {
        _klasorSayacGuncelle(kategori);
        firmaKlasorleriYukle();
    });
    input.value = '';
}

function _dosyaOku(kategori, dosyaListesi, tamKallback) {
    if (!yuklenenDosyalar[kategori]) yuklenenDosyalar[kategori] = [];
    let bekleyen = dosyaListesi.length;

    dosyaListesi.forEach(dosya => {
        const uzanti = dosya.name.split('.').pop().toUpperCase();
        const uzantiMap = { DOC: 'DOCX', JPEG: 'JPG', XLS: 'XLSX' };
        const tur = uzantiMap[uzanti] || uzanti;

        const reader = new FileReader();
        reader.onload = async function(e) {
            const now = new Date();
            const kayitTarihi = `${String(now.getDate()).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
            const dosyaObj = {
                ad: dosya.name, tur, tarih: '',
                boyut: dosya.size, dataUrl: e.target.result, kayitTarihi
            };

            // ✅ YENİ: MongoDB'ye kaydet
            if (aktifFirmaId) {
                try {
                    const res = await AUTH.apiFetch('/api/dokumanlar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            firma:       aktifFirmaId,
                            tur:         _kategoridenTur(kategori),
                            baslik:      dosya.name,
                            belgeTarihi: new Date().toISOString().split('T')[0],
                            dosyaAdi:    dosya.name,
                            dosyaBoyut:  dosya.size,
                            dosyaTur:    tur,
                            kategori,
                            dosyaIcerik: e.target.result,
                        })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        dosyaObj._id = data.veri?._id;
                        console.log(`✅ [${kategori}] MongoDB'ye kaydedildi:`, dosyaObj._id);
                    }
                } catch (err) {
                    console.warn('[_dosyaOku] API hatası, sadece lokal:', err.message);
                }
            }

            yuklenenDosyalar[kategori].push(dosyaObj);

            if (['rv','adp','tatbikat','kkd','denetim'].includes(kategori)) {
                if (!bekleyenDosyalar[kategori]) bekleyenDosyalar[kategori] = [];
                bekleyenDosyalar[kategori].push(dosyaObj);
            }

            bekleyen--;
            if (bekleyen === 0) {
                _isgDosyalariniKaydet();
                if (tamKallback) tamKallback();
            }
        };
        reader.readAsDataURL(dosya);
    });
}

async function _isgDosyalariniKaydet() {
    if (!aktifFirma) return;
    try {
        await _veriYaz('isg_dosyalar_' + aktifFirma, yuklenenDosyalar);
    } catch (e) {
        const meta = {};
        Object.keys(yuklenenDosyalar).forEach(kat => {
            meta[kat] = yuklenenDosyalar[kat].map(d => ({ ad: d.ad, tur: d.tur, tarih: d.tarih || '' }));
        });
        await _veriYaz('isg_dosyalar_' + aktifFirma, meta);
    }
}

function _klasorSayacGuncelle(kategori) {
    const el = document.getElementById('sayi-' + kategori);
    if (el) el.textContent = (yuklenenDosyalar[kategori] || []).length;
}

function tumKlasorSayaclariniGuncelle() {
    Object.keys(kategoriEtiketMap).forEach(kat => _klasorSayacGuncelle(kat));
}

// ==========================================
// DOSYA ÖNİZLEME
// ==========================================
function _onizlemeGoster(dosyaAdi, tur, dataUrl) {
    document.getElementById('onizleme-dosya-adi').textContent = dosyaAdi;
    const tipIkon = document.getElementById('onizleme-tip-ikon');
    tipIkon.className = 'fa-solid ' + (ikonMap[tur] || 'fa-file');

    const icerik = document.getElementById('onizleme-icerik');
    icerik.innerHTML = '';

    if (!dataUrl) {
        icerik.innerHTML = `
            <div class="onizleme-desteklenmiyor">
                <i class="fa-solid fa-file-circle-question"></i>
                <p>Bu dosya için önizleme verisi bulunamadı.</p>
            </div>`;
    } else if (['JPG','JPEG','PNG'].includes(tur)) {
        const img = document.createElement('img');
        img.src = dataUrl; img.alt = dosyaAdi;
        icerik.appendChild(img);
    } else if (tur === 'PDF') {
        const iframe = document.createElement('iframe');
        iframe.src = dataUrl;
        icerik.appendChild(iframe);
    } else {
        icerik.innerHTML = `
            <div class="onizleme-desteklenmiyor">
                <i class="fa-solid ${ikonMap[tur] || 'fa-file'}" style="color:#64748b;"></i>
                <p>${tur} dosyaları tarayıcıda önizlenemez.</p>
                <a href="${dataUrl}" download="${dosyaAdi}">
                    <i class="fa-solid fa-download"></i> İndir
                </a>
            </div>`;
    }

    const indirBtn = document.getElementById('onizleme-indir-btn');
    if (dataUrl) {
        indirBtn.style.display = 'flex';
        indirBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = dataUrl; a.download = dosyaAdi; a.click();
        };
    } else {
        indirBtn.style.display = 'none';
    }

    document.getElementById('onizleme-modal').classList.add('acik');
}

function onizlemeKapat() {
    document.getElementById('onizleme-modal').classList.remove('acik');
    document.getElementById('onizleme-icerik').innerHTML = '';
}

// ==========================================
// ISG KAYDET (Tüm Panel)
// ==========================================
async function isgKaydet() {
    if (!aktifFirma || aktifFirmaIdx === null) return;

    // ✅ Firma _id'sini al (aktifFirma artık obje)
    const firmaId = aktifFirma._id || aktifFirma.id;
    if (!firmaId || firmaId === 'undefined') {
        console.error('[isgKaydet] Firma _id yok:', aktifFirma);
        return;
    }

    const isgData = {
        kurulZorunluDegil:      cb('kurul-zorunlu-degil'),
        kurulToplanti:          v('kurul-toplanti'),
        kurulGecmisToplantılar: [...kurulGecmisToplantılar],
        rvTarih:                v('rv-tarih'),
        rvRevizyon:             v('rv-revizyon'),
        adpTarih:               v('adp-tarih'),
        adpRevizyon:            v('adp-revizyon'),
        tatbikatSon:            v('tatbikat-son'),
        tatbikatSonraki:        v('tatbikat-sonraki'),
        denetimTarih:           v('denetim-tarih'),
        denetimGecerlilik:      v('denetim-gecerlilik'),
        denetimMailAt:          cb('denetim-mail-at'),
        kkdTarih:               v('kkd-tarih'),
        kkdGecerlilik:          v('kkd-gecerlilik'),
    };

    try {
        // ✅ Doğrudan Firma MongoDB'ye yaz — kurulKaydet ile aynı endpoint
        const res = await AUTH.apiFetch(`/api/firmalar/${firmaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isg: isgData })
        });

        if (!res.ok) {
            const hata = await res.text();
            console.error('[isgKaydet] Sunucu hatası:', hata);
            return;
        }

        // ✅ Local state'i de güncelle
        if (!aktifFirma.isg) aktifFirma.isg = {};
        Object.assign(aktifFirma.isg, isgData);

    } catch (err) {
        console.error('[isgKaydet] Fetch hatası:', err);
        return;
    }

    await tumKartlariGuncelle();
    firmaKlasorleriYukle();

    const btn = document.querySelector('.btn-isg-kaydet-panel');
    if (!btn) return;
    const orijinal = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Kaydedildi!';
    btn.style.background = '#15803d';
    setTimeout(() => { btn.innerHTML = orijinal; btn.style.background = ''; }, 2000);
}
// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================

function _personelBirlestir(liste1, liste2) {
    const idSet = new Set();
    const sonuc = [];
    [...liste1, ...liste2].forEach(p => {
        const uid = p.id || _personelKey(p);
        if (!idSet.has(uid)) { idSet.add(uid); sonuc.push(p); }
    });
    return sonuc;
}

function _firmaPersonelFiltrele(tumPersonel, firmaAdi) {
    const hedef = (firmaAdi || '').trim().toLowerCase();
    return tumPersonel.filter(p => {
        const pFirma = (p.firma || '').trim().toLowerCase();
        return pFirma === hedef || pFirma.includes(hedef) || hedef.includes(pFirma);
    });
}

function farkHesapla(tarihStr) {
    if (!tarihStr) return 999;
    const bitis = new Date(tarihStr).setHours(0, 0, 0, 0);
    const bugun = new Date().setHours(0, 0, 0, 0);
    return Math.ceil((bitis - bugun) / 86400000);
}

function _htmlEsc(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function _esc(str) {
    return (str || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function _scriptYukleVeCalistir(kaynaklar, hazirMi, callback) {
    if (hazirMi()) { callback(); return; }
    let yuklenen = 0;
    kaynaklar.forEach(src => {
        if (document.querySelector(`script[src="${src}"]`)) { yuklenen++; if (yuklenen === kaynaklar.length && hazirMi()) callback(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => { yuklenen++; if (yuklenen === kaynaklar.length && hazirMi()) callback(); };
        document.head.appendChild(s);
    });
}

// BREADCRUMB DİNAMİK GÜNCELLEME
/**
 * Sayfa breadcrumb'ını dinamik olarak günceller.
 * @param {Array} yolListesi - [{ad, link?, tiklama?}]
 *   - link:    Normal yönlendirme (örn. '/anasayfa')
 *   - tiklama: JS fonksiyonu olarak çağır (örn. 'klasorGer()')
 *   - Son eleman otomatik olarak aktif sayfa olur (tıklanmaz)
 */
function breadcrumbGuncelle(yolListesi) {
    const nav = document.querySelector('.sayfa-yolu .yol');
    if (!nav) return;

    nav.innerHTML = yolListesi.map((item, index) => {
        const ayrac = index > 0 ? '<span class="ayrac">›</span>' : '';
        const son   = index === yolListesi.length - 1;
        const ad    = _htmlEsc(item.ad);

        if (son) {
            return `${ayrac}<span class="aktif-sayfa">${ad}</span>`;
        }
        if (item.tiklama) {
            return `${ayrac}<a href="#" onclick="${item.tiklama}; return false;">${ad}</a>`;
        }
        return `${ayrac}<a href="${item.link || '#'}">${ad}</a>`;
    }).join('');
}

// ─── KATEGORİ → KART ID EŞLEŞMESİ ─────────────────────────────────────────
// AI "Risk Değerlendirmesi" dediğinde, dokuman sayfasındaki hangi
// kart açılmalı? Bu tablo onu söyler.
const AI_KATEGORI_KART_ESLESMESI = {
    'Risk Değerlendirmesi':                          'kart-rv',
    'Acil Durum Planı':                              'kart-adp',
    'Acil Durum Tatbikatı':                          'kart-tatbikat',
    'İSG Eğitimi':                                   'kart-egitim',
    'İlkyardım Eğitimi / Sertifikası':               'kart-ilkyardim',
    'Periyodik Sağlık Muayenesi':                    'kart-muayene',
    'Ortam Ölçümü / Ekipman Kontrolü':               'kart-olcum',
    'DİF/DÖF (Düzeltici ve İyileştirici Faaliyet)':  'kart-denetim',
    'KKD (Kişisel Koruyucu Donanım)':                'kart-kkd',
    'İSG Temsilci Belgesi':                          'kart-temsilci',
    'Destek Elemanı Belgesi':                        'kart-destek',
    'İSG Kurulu Toplantı Tutanağı':                  'kart-kurul',
    // Son fallback kategori:
    'Diğer / Sınıflandırılamadı':                    null,
};
 
// Tüm kategori adlarını döndürür (manuel seçim dropdown'u için)
function _aiKategoriListesi() {
    return Object.keys(AI_KATEGORI_KART_ESLESMESI);
}
 
// AI state (modal boyunca geçici)
let _aiSonucVerisi = null;        // Backend'ten gelen son yanıt
let _aiDosyaAdi    = '';           // Analiz edilen dosyanın adı
 
 
// ─── ADIM 1: KULLANICI PDF SEÇTİĞİNDE ÇAĞRILIR ──────────────────────────
let _aiYuklenenDosya = null;   // YENİ: analiz edilen PDF'i saklar
 
async function aiBelgeyiAnalizEt(dosya) {
    if (!dosya) return;
 
    if (dosya.type !== 'application/pdf') {
        alert('Lütfen PDF formatında bir dosya seçin.');
        return;
    }
 
    if (dosya.size > 20 * 1024 * 1024) {
        alert('Dosya çok büyük (maks. 20 MB). Daha küçük bir PDF deneyin.');
        return;
    }
 
    _aiYuklenenDosya = dosya;    // YENİ — dosyayı sakla
    _aiDosyaAdi      = dosya.name;
 
   
    try {
        let metin   = '';
        let dataUrl = null;

        // 1. Önce pdf.js ile metin çıkarmaya çalış (hızlı yol)
        try {
            metin = await _aiPDFMetinCikar(dosya);
        } catch (pdfErr) {
            console.warn('[AI] pdf.js başarısız, OCR\'a düşülecek:', pdfErr.message);
        }

        // 2. Metin boş veya kısaysa, PDF'i Base64'e çevir (OCR için)
        if (!metin || metin.trim().length < 50) {
            console.log('[AI] Metin yetersiz, sunucu OCR\'ı için PDF hazırlanıyor...');
            _aiDurum('yukleniyor', 'Belge taranmış olabilir, OCR ile okumaya çalışıyoruz...');

            // PDF'i Base64'e çevir
            dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload  = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('PDF okunamadı'));
                reader.readAsDataURL(dosya);
            });
        } else {
            _aiDurum('yukleniyor', 'Yapay zeka belgeyi analiz ediyor...');
        }

        // 3. Backend'e gönder (metin varsa metin, yoksa dataUrl)
        const istekVerisi = metin && metin.trim().length >= 50
            ? { metin }
            : { dataUrl };

        const res = await AUTH.apiFetch('/api/ai/siniflandir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(istekVerisi),
        });
        const data = await res.json();
        if (!res.ok || !data.basarili) {
            throw new Error(data.hata || 'AI analizi başarısız');
        }
 
        _aiSonucVerisi = data;
        _aiSonucGoster(data);
    } catch (err) {
        console.error('[AI] Analiz hatası:', err);
        _aiHataGoster(err.message);
    } finally {
        const input = document.getElementById('ai-pdf-input');
        if (input) input.value = '';
    }
}
 

 
// ─── ADIM 2: PDF METİN ÇIKARMA (pdf.js ile, tarayıcıda) ─────────────────
async function _aiPDFMetinCikar(dosya) {
    if (typeof pdfjsLib === 'undefined') {
        throw new Error('PDF okuma kütüphanesi (pdf.js) yüklenemedi. Sayfayı yenileyin.');
    }
 
    const arrayBuffer = await dosya.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
 
    let tumMetin = '';
    const maxSayfa = Math.min(pdf.numPages, 20); // İlk 20 sayfa yeterli
 
    for (let i = 1; i <= maxSayfa; i++) {
        const sayfa  = await pdf.getPage(i);
        const icerik = await sayfa.getTextContent();
        const satir  = icerik.items.map(it => it.str).join(' ');
        tumMetin += satir + '\n';
    }
 
    return tumMetin.trim();
}
 
 
// ─── ADIM 3: SONUCU MODAL'DA GÖSTER ─────────────────────────────────────
function _aiSonucGoster(data) {
    _aiDurum('sonuc');
 
    // Dosya adı
    document.getElementById('ai-dosya-adi').textContent = _aiDosyaAdi;
 
    // Kategori
    const kategoriEl = document.getElementById('ai-kategori');
    kategoriEl.textContent = data.kategori || '—';
    kategoriEl.classList.toggle('bos',
        !data.kategori || data.kategori === 'Diğer / Sınıflandırılamadı');
 
    // Firma
    const firmaEl = document.getElementById('ai-firma');
    if (data.firma) {
        firmaEl.textContent = data.firma;
        firmaEl.classList.remove('bos');
    } else {
        firmaEl.textContent = 'Tespit edilemedi';
        firmaEl.classList.add('bos');
    }
 
    // Tarih
    const tarihEl = document.getElementById('ai-tarih');
    if (data.tarih) {
        const [y, a, g] = data.tarih.split('-');
        tarihEl.textContent = `${g}.${a}.${y}`;
        tarihEl.classList.remove('bos');
    } else {
        tarihEl.textContent = 'Tespit edilemedi';
        tarihEl.classList.add('bos');
    }
 
    // Güven rozeti
    const guvenEl = document.getElementById('ai-guven');
    const guvenYuzde = Math.round((data.guven || 0) * 100);
    guvenEl.textContent = `%${guvenYuzde}`;
    guvenEl.classList.remove('orta', 'dusuk');
    if      (data.guven < 0.5)  guvenEl.classList.add('dusuk');
    else if (data.guven < 0.75) guvenEl.classList.add('orta');
 
    // AI açıklaması
    document.getElementById('ai-aciklama').textContent =
        data.aciklama || 'Açıklama yok.';
 
    // AI firma VE kategori ikisini de buldu mu?
    const eksikBilgi = !data.firma ||
                       !data.kategori ||
                       data.kategori === 'Diğer / Sınıflandırılamadı';
 
    // Eksikse manuel seçim göster, dropdown'ları doldur
    if (eksikBilgi) {
        _aiManuelSecimHazirla(data);
    } else {
        document.getElementById('ai-manuel-secim').style.display = 'none';
    }
}
 
