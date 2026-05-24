// raporlar.js — İSG Raporlar Sayfası (MongoDB Backend Entegreli)

const TOPLAM_KART = 13;

const _RAPOR_ENDPOINT_MAP = {
    'isg_firmalar':    '/api/firmalar',
    'isg_personeller': '/api/personel', // API yolları düzeltildi
    'isg_personel':    '/api/personel',
};

async function _raporVeriOku(anahtar, varsayilan = null) {
    const baseEndpoint = _RAPOR_ENDPOINT_MAP[anahtar] || `/api/veri/${encodeURIComponent(anahtar)}`;
    
    // SİHİRLİ KISIM BURASI (Cache Buster)
    const endpoint = `${baseEndpoint}?_t=${new Date().getTime()}`;
    
    try {
        const res = await AUTH.apiFetch(endpoint);
        if (res.status === 404) return varsayilan;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        if(data.veri) return data.veri;
        return data; 
    } catch (e) {
        console.warn(`[raporlar] Backend erişilemedi (${anahtar}), Boş dönülüyor:`, e.message);
        return varsayilan;
    }
}

// Aynı key'i defalarca çekmemek için basit istek cache'i
const _raporCache = {};
async function _raporVeriOkuCache(anahtar, varsayilan = null) {
    if (_raporCache[anahtar] !== undefined) return _raporCache[anahtar];
    const veri = await _raporVeriOku(anahtar, varsayilan);
    _raporCache[anahtar] = veri;
    return veri;
}
function _raporCacheSifirla() {
    Object.keys(_raporCache).forEach(k => delete _raporCache[k]);
}

// KART KONTROL FONKSİYONLARI (MongoDB alanlarıyla uyumlu)
const kartKontrollerRapor = {
    'kart-uzman': async (isg, firmaAdi) => {
        try {
            const res  = await AUTH.apiFetch(`/api/dokumanlar/uzman/${encodeURIComponent(firmaAdi)}`);
            const veri = await res.json();
            return ['igu', 'hekim', 'dsp'].some(k => veri[k]?.ad && veri[k].ad.trim());
        } catch {
            return false;
        }
    },
    'kart-temsilci':  async (isg, firmaAdi) => {
        const data = await _raporVeriOkuCache('temsilci_verileri_' + firmaAdi, {});
        return Object.keys(data).length > 0;
    },
    'kart-destek':    async (isg, firmaAdi) => {
        const data    = await _raporVeriOkuCache('destek_verileri_' + firmaAdi, {});
        const ekipler = ['koruma', 'kurtarma', 'sondurme', 'ilkyardim'];
        return ekipler.some(e => data[e] && Object.keys(data[e]).length > 0);
    },
    'kart-kurul':     async (isg)           => !!(isg.kurulZorunluDegil || isg.kurulToplanti),
    'kart-muayene':   async (isg, firmaAdi) => {
        const data = await _raporVeriOkuCache('muayene_verileri_' + firmaAdi, {});
        return Object.keys(data).length > 0;
    },
    'kart-egitim':    async (isg, firmaAdi) => {
        const data = await _raporVeriOkuCache('egitim_verileri_' + firmaAdi, {});
        return Object.keys(data).length > 0;
    },
    'kart-ilkyardim': async (isg, firmaAdi) => {
        const data = await _raporVeriOkuCache('ilkyardim_verileri_' + firmaAdi, {});
        return Object.keys(data).length >= 1;
    },
    'kart-rv':        async (isg)           => !!isg.rvTarih,
    'kart-adp':       async (isg)           => !!isg.adpTarih,
    'kart-tatbikat':  async (isg)           => !!isg.tatbikatSon,
    'kart-olcum':     async (isg, firmaAdi) => {
        const ekipmanlar = await _raporVeriOkuCache('olcum_ekipman_verileri_' + firmaAdi, []);
        return ekipmanlar.length > 0;
    },
    'kart-denetim':   async (isg)           => !!isg.denetimTarih,
    'kart-kkd':       async (isg)           => !!isg.kkdTarih,
};

// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================
function _farkHesapla(tarihStr) {
    if (!tarihStr) return 999;
    const bitis = new Date(tarihStr).setHours(0, 0, 0, 0);
    const bugun = new Date().setHours(0, 0, 0, 0);
    return Math.ceil((bitis - bugun) / 86400000);
}

function _htmlEsc(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function _tarihGorsel(tarihStr) {
    if (!tarihStr) return '—';
    const [y, m, d] = tarihStr.split('-');
    return `${d}.${m}.${y}`;
}

function _donutRenk(yuzde) {
    if (yuzde >= 80) return '#22c55e';
    if (yuzde >= 50) return '#f59e0b';
    return '#ef4444';
}

function _sinifEtiketGetir(sinif) {
    if (!sinif) return { sinifClass: 'sinif-belirsiz', sinifYazi: 'BELİRSİZ' };
    const s = sinif.toLowerCase();
    if (s.includes('çok tehlikeli')) return { sinifClass: 'sinif-cok-tehlikeli', sinifYazi: 'ÇOK TEHLİKELİ' };
    if (s.includes('tehlikeli'))     return { sinifClass: 'sinif-tehlikeli',     sinifYazi: 'TEHLİKELİ' };
    if (s.includes('az tehlikeli'))  return { sinifClass: 'sinif-az-tehlikeli',  sinifYazi: 'AZ TEHLİKELİ' };
    return { sinifClass: 'sinif-belirsiz', sinifYazi: sinif.toUpperCase() };
}

function _personelKeyRapor(personel) {
    const ad = (personel.adSoyad || personel.ad || '').replace(/\s+/g, '_');
    const tc = (personel.tc || personel.tcKimlik || String(personel.id || '')).trim();
    return (ad + '_' + tc).replace(/[^a-zA-Z0-9_ğüşıöçĞÜŞİÖÇ]/g, '');
}

function _firmaPersonelSayisi(firmaAdi, personeller) {
    const hedef = (firmaAdi || '').trim().toLowerCase();
    return personeller.filter(p => {
        const pFirma = p.firma && p.firma.firmaAdi ? p.firma.firmaAdi.trim().toLowerCase() : (p.firma || '').trim().toLowerCase();
        return pFirma === hedef || pFirma.includes(hedef) || hedef.includes(pFirma);
    }).length;
}

async function _firmaBelgeSayisi(firmaAdi) {
    const isgDocs = await _raporVeriOkuCache('isg_dosyalar_' + firmaAdi, {});
    return Object.values(isgDocs).reduce((t, arr) => t + (arr ? arr.length : 0), 0);
}

async function _firmaTamamSayisi(firmaAdi, firmalar) {
    const firma = firmalar.find(f => (f.firmaAdi || f.adi) === firmaAdi);
    if (!firma) return 0;
    const isg = firma.isg || {};
    let tamam = 0;
    for (const key of Object.keys(kartKontrollerRapor)) {
        if (await kartKontrollerRapor[key](isg, firmaAdi)) tamam++;
    }
    return tamam;
}

// ==========================================
// SVG DONUT GRAFİK
// ==========================================
function _donutSVGOlustur(yuzde, firma) {
    const r     = 45;
    const cevre = 2 * Math.PI * r;
    const renk  = _donutRenk(yuzde);
    return `
    <div class="donut-sarici">
        <svg viewBox="0 0 100 100">
            <circle class="donut-bg" cx="50" cy="50" r="${r}" />
            <circle class="donut-dolgu" cx="50" cy="50" r="${r}"
                stroke="${renk}"
                stroke-dasharray="${cevre}"
                stroke-dashoffset="${cevre}" />
        </svg>
        <div class="donut-yuzde">
            <span class="donut-yuzde-sayi">%${yuzde}</span>
            <span class="donut-yuzde-yazi">Tamamlanma</span>
        </div>
    </div>`;
}

function _donutAnimasyonBaslat() {
    const circles = document.querySelectorAll('.donut-dolgu');
    const cevre   = 2 * Math.PI * 45;
    circles.forEach(circle => {
        const sarici  = circle.closest('.donut-sarici');
        const yuzdeEl = sarici ? sarici.querySelector('.donut-yuzde-sayi') : null;
        const yuzde   = parseInt((yuzdeEl?.textContent || '0').replace('%', '')) || 0;
        const hedef   = cevre - cevre * (yuzde / 100);
        circle.style.strokeDashoffset = cevre;
        circle.style.transition = 'none';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            circle.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
            circle.style.strokeDashoffset = hedef;
        }));
    });
}

// ==========================================
// KRİTİK DOKÜMANLAR TOPLAYICI
// ==========================================
async function _kritikDokumanlariTopla(firmalar) {
    const kritikler = [];

    for (const firma of firmalar) {
        const isg      = firma.isg || {};
        const firmaAdi = firma.firmaAdi || firma.adi;

        // ISG tarih bazlı kontroller
        [
            { tarih: isg.rvRevizyon,        ad: 'Risk Değerlendirmesi Revizyonu', tur: 'İSG' },
            { tarih: isg.adpRevizyon,       ad: 'Acil Durum Planı Revizyonu',     tur: 'İSG' },
            { tarih: isg.tatbikatSonraki,   ad: 'Acil Durum Tatbikatı',           tur: 'İSG' },
            { tarih: isg.denetimGecerlilik, ad: 'DİF/DÖF Takibi',                tur: 'İSG' },
            { tarih: isg.kkdGecerlilik,     ad: 'KKD — Son Geçerlilik',          tur: 'İSG' },
        ].forEach(({ tarih, ad, tur }) => {
            if (!tarih) return;
            const gun = _farkHesapla(tarih);
            if (gun <= 30) kritikler.push({ firma: firmaAdi, ad, tarih, gun, tur });
        });

        // Ortam ölçüm ekipmanları
        const ekipmanlarRaw = await _raporVeriOkuCache('olcum_ekipman_verileri_' + firmaAdi, []);
const ekipmanlar = Array.isArray(ekipmanlarRaw) ? ekipmanlarRaw : [];
ekipmanlar.forEach(ekipman => {
            if (!ekipman.gecerlilikTarihi) return;
            const gun = _farkHesapla(ekipman.gecerlilikTarihi);
            if (gun <= 30) kritikler.push({
                firma: firmaAdi,
                ad:    'Ortam Ölçümü — ' + (ekipman.ekipmanAdi || ''),
                tarih: ekipman.gecerlilikTarihi, gun, tur: 'Ölçüm'
            });
        });

        // Periyodik muayene
        const muayeneData = await _raporVeriOkuCache('muayene_verileri_' + firmaAdi, {});
        Object.keys(muayeneData).forEach(key => {
            const kayit = muayeneData[key];
            if (!kayit.gecerliTarih) return;
            const gun = _farkHesapla(kayit.gecerliTarih);
            if (gun <= 30) {
                const personelAd = key.replace(/_/g, ' ').split(' ').slice(0, -1).join(' ') || key;
                kritikler.push({ firma: firmaAdi, ad: 'Muayene — ' + personelAd, tarih: kayit.gecerliTarih, gun, tur: 'Muayene' });
            }
        });

        // ISG eğitim
        const egitimData = await _raporVeriOkuCache('egitim_verileri_' + firmaAdi, {});
        Object.keys(egitimData).forEach(key => {
            const kayit = egitimData[key];
            if (!kayit.gecerliTarih) return;
            const gun = _farkHesapla(kayit.gecerliTarih);
            if (gun <= 30) {
                const personelAd = key.replace(/_/g, ' ').split(' ').slice(0, -1).join(' ') || key;
                kritikler.push({ firma: firmaAdi, ad: 'Eğitim — ' + personelAd, tarih: kayit.gecerliTarih, gun, tur: 'Eğitim' });
            }
        });

        // İlkyardımcı
        const ilkyardimData = await _raporVeriOkuCache('ilkyardim_verileri_' + firmaAdi, {});
        Object.keys(ilkyardimData).forEach(key => {
            const kayit = ilkyardimData[key];
            if (!kayit.gecerliTarih) return;
            const gun = _farkHesapla(kayit.gecerliTarih);
            if (gun <= 30) kritikler.push({
                firma: firmaAdi,
                ad:    'İlkyardım — ' + (kayit.personelAd || key).split(' — ')[0],
                tarih: kayit.gecerliTarih, gun, tur: 'İlkyardım'
            });
        });

        // Dosya bazlı
        const isgDocs = await _raporVeriOkuCache('isg_dosyalar_' + firmaAdi, {});
        Object.keys(isgDocs).forEach(kat => {
            (isgDocs[kat] || []).forEach(doc => {
                if (!doc.tarih) return;
                const gun = _farkHesapla(doc.tarih);
                if (gun <= 30) kritikler.push({ firma: firmaAdi, ad: doc.ad, tarih: doc.tarih, gun, tur: 'Belge' });
            });
        });
    }

    kritikler.sort((a, b) => a.gun - b.gun);
    return kritikler;
}

// ==========================================
// RENDER — Özet Kartlar
// ==========================================
async function ozetKartlariOlustur(firmalar, personeller, kritikSayac, toplamBelge) {
    const grid = document.getElementById('rapor-ozet-grid');
    if (!grid) return;

    grid.innerHTML = `
        <div class="rapor-ozet-kart">
            <div class="rapor-ozet-ikon mavi"><i class="fa-solid fa-building"></i></div>
            <div class="rapor-ozet-bilgi">
                <h4>${firmalar.length}</h4>
                <span>Toplam Firma</span>
            </div>
        </div>
        <div class="rapor-ozet-kart">
            <div class="rapor-ozet-ikon mor"><i class="fa-solid fa-users"></i></div>
            <div class="rapor-ozet-bilgi">
                <h4>${personeller.length}</h4>
                <span>Toplam Personel</span>
            </div>
        </div>
        <div class="rapor-ozet-kart">
            <div class="rapor-ozet-ikon yesil"><i class="fa-solid fa-file-circle-check"></i></div>
            <div class="rapor-ozet-bilgi">
                <h4>${toplamBelge}</h4>
                <span>Toplam Belge</span>
            </div>
        </div>
        <div class="rapor-ozet-kart">
            <div class="rapor-ozet-ikon kirmizi"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div class="rapor-ozet-bilgi">
                <h4>${kritikSayac}</h4>
                <span>Kritik Uyarı</span>
            </div>
        </div>`;
}

// ==========================================
// RENDER — Kritik Dokümanlar Tablosu
// ==========================================
async function kritikTablosuOlustur(kritikler) {
    const icerik = document.getElementById('kritik-tablo-icerik');
    const sayac  = document.getElementById('kritik-sayac');
    if (!icerik) return;
    if (sayac) sayac.textContent = kritikler.length;

    if (kritikler.length === 0) {
        icerik.innerHTML = `
            <div class="rapor-tablo-bos">
                <i class="fa-solid fa-circle-check" style="color:#22c55e;font-size:1.5rem;display:block;margin-bottom:8px;"></i>
                <p style="font-size:0.85rem;color:#64748b;">Tüm dokümanlar güncel. Kritik uyarı bulunmuyor.</p>
            </div>`;
        return;
    }

    const turIkonMap = {
        'İSG':       '<i class="fa-solid fa-shield-halved" style="color:#2563eb;"></i>',
        'Ölçüm':     '<i class="fa-solid fa-chart-line" style="color:#16a34a;"></i>',
        'Muayene':   '<i class="fa-solid fa-stethoscope" style="color:#7c3aed;"></i>',
        'Eğitim':    '<i class="fa-solid fa-graduation-cap" style="color:#d97706;"></i>',
        'İlkyardım': '<i class="fa-solid fa-kit-medical" style="color:#dc2626;"></i>',
        'Belge':     '<i class="fa-solid fa-file" style="color:#64748b;"></i>',
    };

    const gosterilecek = kritikler.slice(0, 20);
    const satirlar = gosterilecek.map((k, idx) => {
        const kalanYazi  = k.gun <= 0 ? 'SÜRESİ DOLDU' : `${k.gun} Gün`;
        const kalanSinif = k.gun <= 10 ? 'kritik' : 'uyari';
        const kalanIkon  = k.gun <= 0
            ? '<i class="fa-solid fa-circle-xmark"></i>'
            : '<i class="fa-solid fa-clock"></i>';
        return `
            <tr>
                <td style="color:#94a3b8;font-size:11px;">${idx + 1}</td>
                <td style="font-weight:600;">${_htmlEsc(k.ad)}</td>
                <td style="color:#64748b;">${_htmlEsc(k.firma)}</td>
                <td>${turIkonMap[k.tur] || ''} <span style="font-size:11px;color:#64748b;">${_htmlEsc(k.tur)}</span></td>
                <td style="font-size:11px;">${_tarihGorsel(k.tarih)}</td>
                <td><span class="rapor-kalan-etiket ${kalanSinif}">${kalanIkon} ${kalanYazi}</span></td>
            </tr>`;
    }).join('');

    icerik.innerHTML = `
        <table class="rapor-kritik-tablo">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Doküman / Kayıt</th>
                    <th>Firma</th>
                    <th>Tür</th>
                    <th>Son Tarih</th>
                    <th>Kalan</th>
                </tr>
            </thead>
            <tbody>${satirlar}</tbody>
        </table>
        ${kritikler.length > 20
            ? `<div style="text-align:center;padding:10px;color:#94a3b8;font-size:0.78rem;">… ve ${kritikler.length - 20} kayıt daha</div>`
            : ''}`;
}

// ==========================================
// RENDER — Firma Kartları
// ==========================================
async function firmaKartlariOlustur(firmalar, personeller, tumKritikler) {
    const grid = document.getElementById('rapor-firma-grid');
    if (!grid) return;

    if (firmalar.length === 0) {
        grid.innerHTML = `
            <div class="rapor-bos" style="grid-column:1/-1;">
                <i class="fa-solid fa-building"></i>
                <p>Henüz firma eklenmemiş veya görme yetkiniz yok.</p>
            </div>`;
        return;
    }

    grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;color:#94a3b8;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size:1.5rem;margin-bottom:10px;display:block;"></i>
            <p style="font-size:0.85rem;">Firma verileri yükleniyor…</p>
        </div>`;

    const firmaVerileri = await Promise.all(firmalar.map(async firma => {
        const firmaAdi = firma.firmaAdi || firma.adi;
        const [tamam, belgeSayisi, muayeneData, egitimData, ilkyardimData] = await Promise.all([
            _firmaTamamSayisi(firmaAdi, firmalar),
            _firmaBelgeSayisi(firmaAdi),
            _raporVeriOkuCache('muayene_verileri_'   + firmaAdi, {}),
            _raporVeriOkuCache('egitim_verileri_'    + firmaAdi, {}),
            _raporVeriOkuCache('ilkyardim_verileri_' + firmaAdi, {}),
        ]);
        return {
            firma,
            firmaAdi,
            tamam,
            belgeSayisi,
            muayeneKayit:   Object.keys(muayeneData).length,
            egitimKayit:    Object.keys(egitimData).length,
            ilkyardimKayit: Object.keys(ilkyardimData).length,
        };
    }));

    grid.innerHTML = '';

    firmaVerileri.forEach(({ firma, firmaAdi, tamam, belgeSayisi, muayeneKayit, egitimKayit, ilkyardimKayit }) => {
        const eksik          = TOPLAM_KART - tamam;
        const yuzde          = Math.round((tamam / TOPLAM_KART) * 100);
        const personelSayisi = _firmaPersonelSayisi(firmaAdi, personeller);
        const sinifBilgi     = _sinifEtiketGetir(firma.tehlikeSinifi || firma.sinif);
        const firmaKritik    = tumKritikler.filter(k => k.firma === firmaAdi).length;

        const kritikSatir = firmaKritik > 0
            ? `<div class="rapor-istat-satir">
                    <div class="rapor-istat-nokta uyari"></div>
                    <span class="rapor-istat-etiket">Kritik Uyarı</span>
                    <span class="rapor-istat-deger" style="color:#ef4444;">${firmaKritik}</span>
               </div>`
            : `<div class="rapor-istat-satir">
                    <div class="rapor-istat-nokta tamam"></div>
                    <span class="rapor-istat-etiket">Kritik Uyarı</span>
                    <span class="rapor-istat-deger" style="color:#22c55e;">0</span>
               </div>`;

        const kart = document.createElement('div');
        kart.className = 'rapor-firma-kart';
        kart.setAttribute('data-firma', firmaAdi.toLowerCase());
        kart.onclick = () => { window.location.href = 'dokumanlar'; };

        kart.innerHTML = `
            <div class="rapor-kart-ust">
                <div class="rapor-firma-ikon"><i class="fa-solid fa-building"></i></div>
                <div class="rapor-firma-bilgi">
                    <h4 title="${_htmlEsc(firmaAdi)}">${_htmlEsc(firmaAdi)}</h4>
                    <div class="rapor-firma-etiketler">
                        <span class="rapor-etiket ${sinifBilgi.sinifClass}">${sinifBilgi.sinifYazi}</span>
                        <span class="rapor-etiket personel-etiket">
                            <i class="fa-solid fa-users" style="font-size:9px;"></i> ${personelSayisi} Personel
                        </span>
                        <span class="rapor-etiket belge-etiket">
                            <i class="fa-solid fa-file" style="font-size:9px;"></i> ${belgeSayisi} Belge
                        </span>
                    </div>
                </div>
            </div>
            <div class="rapor-kart-grafik">
                ${_donutSVGOlustur(yuzde, firmaAdi)}
                <div class="rapor-istatistik-liste">
                    <div class="rapor-istat-satir">
                        <div class="rapor-istat-nokta tamam"></div>
                        <span class="rapor-istat-etiket">Tamamlanan</span>
                        <span class="rapor-istat-deger">${tamam} / ${TOPLAM_KART}</span>
                    </div>
                    <div class="rapor-istat-satir">
                        <div class="rapor-istat-nokta eksik"></div>
                        <span class="rapor-istat-etiket">Eksik</span>
                        <span class="rapor-istat-deger">${eksik}</span>
                    </div>
                    ${kritikSatir}
                </div>
            </div>
            <div class="rapor-kart-alt">
                <div class="rapor-detay-grid">
                    <div class="rapor-detay-kutu${muayeneKayit   > 0 ? ' vurgulu' : ''}">
                        <div class="detay-sayi">${muayeneKayit}</div>
                        <div class="detay-etiket">Muayene</div>
                    </div>
                    <div class="rapor-detay-kutu${egitimKayit    > 0 ? ' vurgulu' : ''}">
                        <div class="detay-sayi">${egitimKayit}</div>
                        <div class="detay-etiket">Eğitim</div>
                    </div>
                    <div class="rapor-detay-kutu${ilkyardimKayit > 0 ? ' vurgulu' : ''}">
                        <div class="detay-sayi">${ilkyardimKayit}</div>
                        <div class="detay-etiket">İlkyardım</div>
                    </div>
                </div>
            </div>`;

        grid.appendChild(kart);
    });

    setTimeout(_donutAnimasyonBaslat, 100);
}

// ==========================================
// ARAMA
// ==========================================
function raporAramaYap(kelime) {
    const aranan = kelime.toLowerCase().trim();
    document.querySelectorAll('.rapor-firma-kart').forEach(kart => {
        const firma = kart.getAttribute('data-firma') || '';
        kart.style.display = firma.includes(aranan) ? '' : 'none';
    });
}

// ==========================================
// BAŞLATMA
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    _raporCacheSifirla();

    const [firmalar, personeller] = await Promise.all([
        _raporVeriOku('isg_firmalar',    []),
        _raporVeriOku('isg_personeller', []),
    ]);

    const kritikler = await _kritikDokumanlariTopla(firmalar);

    let toplamBelge = 0;
    for (const firma of firmalar) {
        toplamBelge += await _firmaBelgeSayisi(firma.firmaAdi || firma.adi);
    }

    await ozetKartlariOlustur(firmalar, personeller, kritikler.length, toplamBelge);
    await kritikTablosuOlustur(kritikler);
    await firmaKartlariOlustur(firmalar, personeller, kritikler);
});