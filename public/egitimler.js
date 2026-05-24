

// --- GLOBAL DEĞİŞKENLER ---
const ekleModal    = document.getElementById("egitim-ekle-modali");
const detayModal   = document.getElementById("egitim-detay-modali");
const tabloGovdesi = document.querySelector(".tablo-bolumu tbody");

let egitimListesi  = [];
let aktifEgitimId  = null;

// --- SAYFA YÜKLENİNCE ---
document.addEventListener("DOMContentLoaded", async () => {
    const stil = document.createElement("style");
    stil.textContent = `
        .etiket.tarih-gecti { background-color:#fce7f3; color:#9d174d; border:1px solid #f9a8d4; font-weight:700; }
        .satir-gecti   { background:linear-gradient(90deg,#fce7f3 0%,#fff 100%); border-left:4px solid #9d174d; }
        .satir-kritik  { background:linear-gradient(90deg,#fee2e2 0%,#fff 100%); border-left:4px solid #dc2626; }
        .satir-uyari   { background:linear-gradient(90deg,#fff7ed 0%,#fff 100%); border-left:4px solid #ea580c; }
        .sure-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700; }
        .sure-badge.gecti   { background:#fce7f3; color:#9d174d; animation:badgePulse 1.2s infinite; }
        .sure-badge.kirmizi { background:#fee2e2; color:#dc2626; animation:badgePulse 1.2s infinite; }
        .sure-badge.turuncu { background:#fff7ed; color:#ea580c; animation:badgePulse 2s infinite; }
        .sure-badge.yesil   { background:#f0fdf4; color:#16a34a; }
        @keyframes badgePulse { 0%,100%{opacity:1} 50%{opacity:.65} }
        .mail-gonder-satir { display:flex; align-items:center; gap:10px; padding:10px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; margin-top:12px; }
        .mail-gonder-satir label { font-size:0.88rem; font-weight:600; color:#1e40af; cursor:pointer; margin:0; }
        .mail-gonder-satir input[type=checkbox] { width:16px!important; height:16px!important; accent-color:#2563eb; cursor:pointer; flex-shrink:0; }
    `;
    document.head.appendChild(stil);

    await firmaDropdownlariniDoldur();
    await egitimTurleriniDoldur();
    await egitimListesiYukle();
    tabloyuGuncelle();
    filtrelemeEkle();
    yaklasanEgitimBannerGoster();
});

// ─── EĞİTİM TÜRLERİNİ BACKEND'DEN YÜKLE ───
async function egitimTurleriniDoldur() {
    try {
        const response = await AUTH.apiFetch(`/api/egitim-turleri?_t=${Date.now()}`);
        if (!response.ok) throw new Error("Eğitim türleri alınamadı");

        const data   = await response.json();
        const turler = data.veri || [];

        const select = document.getElementById("egitim-adi-select");
        if (!select) return;

        // Mevcut seçimi koru, sadece option'ları yeniden oluştur
        const onceki = select.value;
        select.innerHTML = '<option value="">Eğitim Seçiniz...</option>';

        turler.forEach(tur => {
            const opt   = document.createElement("option");
            opt.value   = tur.ad;
            opt.text    = tur.sureSaat > 0 ? `${tur.ad} (${tur.sureSaat} Saat)` : tur.ad;
            select.appendChild(opt);
        });

        if (onceki) select.value = onceki;
    } catch (e) {
        console.warn("Eğitim türleri yüklenemedi:", e);
    }
}

// ─── YENİ EĞİTİM TÜRÜ EKLEME MODAL ───
function egitimTuruEkleModalAc() {
    const m = document.getElementById("egitim-turu-ekle-modali");
    if (m) m.style.display = "flex";
}
function egitimTuruEkleModalKapat() {
    const m = document.getElementById("egitim-turu-ekle-modali");
    if (m) {
        m.style.display = "none";
        document.querySelector("#egitim-turu-ekle-modali form")?.reset();
    }
}

async function egitimTuruKaydet() {
    const ad         = document.getElementById("yeni-tur-ad").value.trim();
    const sureSaat   = document.getElementById("yeni-tur-sure").value;
    const gecerlilik = document.getElementById("yeni-tur-gecerlilik").value;
    const tehlike    = document.getElementById("yeni-tur-tehlike").value;
    const aciklama   = document.getElementById("yeni-tur-aciklama").value;

    if (!ad) { alert("⚠️ Eğitim adı zorunludur!"); return; }

    try {
        const res = await AUTH.apiFetch('/api/egitim-turleri', {
            method: 'POST',
            body: JSON.stringify({
                ad,
                sureSaat:           parseInt(sureSaat) || 0,
                gecerlilikSuresiAy: parseInt(gecerlilik) || 12,
                tehlikeSinifi:      tehlike,
                aciklama
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.hata || err.detay || `HTTP ${res.status}`);
        }

        alert(`✅ "${ad}" eğitim türü eklendi!`);
        egitimTuruEkleModalKapat();
        await egitimTurleriniDoldur();
        // Yeni eklenen türü otomatik seç
        const select = document.getElementById("egitim-adi-select");
        if (select) select.value = ad;
    } catch (err) {
        alert("Hata: " + err.message);
    }
}

// --- FİRMALARI BACKEND'DEN YÜKlE ---
async function firmaDropdownlariniDoldur() {
    try {
        const response = await AUTH.apiFetch(`/api/firmalar?_t=${Date.now()}`);
        if (!response.ok) throw new Error("Firmalar alınamadı");

        const data    = await response.json();
        const firmalar = data.veri || [];

        const firmaSelect = document.getElementById("firma-secimi");
        if (!firmaSelect || firmalar.length === 0) return;

        firmaSelect.innerHTML = '<option value="">Firma Seçiniz...</option>';

        firmalar.forEach(firma => {
            const opt   = document.createElement("option");
            opt.value   = firma._id;
            opt.text    = firma.firmaAdi;
            firmaSelect.appendChild(opt);
        });
    } catch (e) {
        console.warn("Firma listesi yüklenemedi:", e);
    }
}

// --- EĞİTİMLERİ BACKEND'DEN YÜKlE ---
async function egitimListesiYukle() {
    try {
        const response = await AUTH.apiFetch(`/api/egitimler?_t=${Date.now()}`);
        if (!response.ok) throw new Error("Backend yanıt vermedi");

        const data = await response.json();
        const ham  = data.veri || data;

        egitimListesi = ham.map(e => _backenddenFrontende(e));
    } catch (err) {
        console.error("Eğitimler yüklenemedi:", err);
        egitimListesi = [];
        tabloGovdesi.innerHTML = `<tr><td colspan="7" style="text-align:center;color:red;">Eğitimler yüklenemedi.</td></tr>`;
    }
}

// Backend → Frontend format dönüşümü
function _backenddenFrontende(e) {
    const tarih = e.planlananTarih
        ? _isoFormatla(e.planlananTarih)
        : (e.tarih || '');

    const durumMap = { planlandi: "PLANLANDI", tamamlandi: "TAMAMLANDI", iptal: "İPTAL" };
    const durumOn  = durumMap[e.durum] || (e.durum || "PLANLANDI").toUpperCase();

    return {
        _id:       e._id,
        id:        e._id,
        ad:        e.konu || e.ad || '',
        firma:     e.firma?.firmaAdi || e.firma || '',
        firmaId:   e.firma?._id || e.firma || '',
        egitmen:   e.egitmen || '',
        tarih,
        katilimci: (e.katilimcilar && e.katilimcilar.length > 0)
            ? e.katilimcilar.length
            : (e.katilimci || 0),
        durum:     durumOn,
        durumClass: durumClassGetir(durumOn),
        notlar:    e.notlar || '',
    };
}

function _isoFormatla(isoStr) {
    const d = new Date(isoStr);
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

// --- YARDIMCI: Mail sonucu kullanıcıya bildir ---
function _mailSonucUyarisi(mailSonuc) {
    if (!mailSonuc) return '';
    if (mailSonuc.gonderildi) {
        return `\n📧 Bildirim e-postası gönderildi: ${mailSonuc.eposta}`;
    }
    return `\n⚠️ E-posta gönderilemedi: ${mailSonuc.sebep}`;
}

// --- EĞİTİM KAYDET (POST) ---
async function egitimKaydet() {
    const egitimAdi    = document.getElementById("egitim-adi-select").value;
    const egitmen      = document.getElementById("egitmen-input").value.trim();
    const tarih        = document.getElementById("tarih-input").value;
    const katilimci    = parseInt(document.getElementById("katilimci-input").value);
    const firmaSelect  = document.getElementById("firma-secimi");
    const firmaId      = firmaSelect.value;

    if (!egitimAdi || !egitmen || !tarih || !katilimci || !firmaId) {
        alert("⚠️ Lütfen tüm alanları doldurun!");
        return;
    }

    const mailCb = document.getElementById('ekle-mail-at');
    const mailGonder = !!mailCb?.checked;

    const payload = {
        firma:          firmaId,
        konu:           egitimAdi,
        egitmen,
        planlananTarih: tarih,
        durum:          'planlandi',
        katilimci,                     // backend mail şablonuna geçirsin diye
        mailGonder,                    // ✅ backend bunu görürse mail gönderir
    };

    try {
        const res = await AUTH.apiFetch('/api/egitimler', {
            method: 'POST',
            body:   JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.hata || err.mesaj || `HTTP ${res.status}`);
        }

        const sonuc = await res.json().catch(() => ({}));
        alert(`✅ Eğitim başarıyla planlandı!${_mailSonucUyarisi(sonuc.mail)}`);

        ekleModalKapat();
        await egitimListesiYukle();
        tabloyuGuncelle();
        yaklasanEgitimBannerGoster();
    } catch (err) {
        alert("Hata: " + err.message);
    }
}

// --- EĞİTİM GÜNCELLE (PUT) ---
async function detayGuncelle() {
    if (!aktifEgitimId) return;

    const yeniTarihRaw = document.getElementById("detay-tarih").value;
    const yeniDurum    = document.getElementById("detay-durum-select").value;
    const durumTers    = { "PLANLANDI": "planlandi", "TAMAMLANDI": "tamamlandi", "İPTAL": "iptal", "ERTELENDİ": "planlandi", "DEVAM EDİYOR": "planlandi" };

    const mailCb = document.getElementById('detay-mail-at');
    const mailGonder = !!mailCb?.checked;

    const payload = {
        konu:          document.getElementById("detay-egitim-adi").value,
        egitmen:       document.getElementById("detay-egitmen").value,
        planlananTarih: yeniTarihRaw,
        durum:         durumTers[yeniDurum] || 'planlandi',
        notlar:        document.getElementById("detay-notlar").value,
        katilimci:     parseInt(document.getElementById("detay-katilimci").value) || undefined,
        mailGonder,    // ✅ backend bunu görürse mail gönderir
    };

    try {
        const res = await AUTH.apiFetch(`/api/egitimler/${aktifEgitimId}`, {
            method: 'PUT',
            body:   JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.hata || err.mesaj || `HTTP ${res.status}`);
        }

        const sonuc = await res.json().catch(() => ({}));
        alert(`✅ Eğitim bilgileri güncellendi!${_mailSonucUyarisi(sonuc.mail)}`);

        detayKapat();
        await egitimListesiYukle();
        tabloyuGuncelle();
        yaklasanEgitimBannerGoster();
    } catch (err) {
        alert("Hata: " + err.message);
    }
}

// --- EĞİTİM SİL (DELETE) ---
async function egitimSil() {
    if (!aktifEgitimId) return;
    if (!confirm("Bu eğitimi kalıcı olarak silmek istediğinize emin misiniz?")) return;

    try {
        const res = await AUTH.apiFetch(`/api/egitimler/${aktifEgitimId}`, { method: 'DELETE' });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.hata || err.mesaj || `HTTP ${res.status}`);
        }
        alert("🗑️ Eğitim silindi!");
        detayKapat();
        await egitimListesiYukle();
        tabloyuGuncelle();
        yaklasanEgitimBannerGoster();
    } catch (err) {
        alert("Hata: " + err.message);
    }
}

// --- YARDIMCI FONKSİYONLAR ---
function gunFarkiHesapla(egitimTarihi) {
    const p = egitimTarihi.split(".");
    const egitimDate = new Date(p[2], p[1] - 1, p[0]);
    const bugun = new Date();
    egitimDate.setHours(0,0,0,0);
    bugun.setHours(0,0,0,0);
    return Math.ceil((egitimDate - bugun) / (1000*60*60*24));
}

function tarihiFormataDonustur(tarih) {
    const p = tarih.split(".");
    return `${p[2]}-${p[1]}-${p[0]}`;
}

function _sureBadgeHtml(g) {
    if (g < 0)  return `<span class="sure-badge gecti"><i class="fa-solid fa-circle-exclamation"></i>${Math.abs(g)} GÜN GECİKTİ</span>`;
    if (g === 0) return `<span class="sure-badge kirmizi"><i class="fa-solid fa-circle-exclamation"></i>BUGÜN</span>`;
    if (g <= 10) return `<span class="sure-badge kirmizi"><i class="fa-solid fa-circle-exclamation"></i>${g} GÜN</span>`;
    if (g <= 30) return `<span class="sure-badge turuncu"><i class="fa-solid fa-clock"></i>${g} GÜN</span>`;
    return `<span class="sure-badge yesil"><i class="fa-solid fa-calendar-check"></i>${g} GÜN</span>`;
}

function _satirSinifi(g) {
    if (g < 0)   return 'satir-gecti';
    if (g <= 10) return 'satir-kritik';
    if (g <= 30) return 'satir-uyari';
    return '';
}

function durumClassGetir(durum) {
    const m = { "PLANLANDI":"bilgi","TAMAMLANDI":"basarili","ERTELENDİ":"ertelendi","İPTAL":"tehlike","DEVAM EDİYOR":"devam","TARİH GEÇTİ":"tarih-gecti" };
    return m[durum] || "bilgi";
}

// --- TABLO ---
function tabloyuGuncelle(filtrelenmisListe = null) {
    const liste = filtrelenmisListe || egitimListesi;
    if (!tabloGovdesi) return;
    tabloGovdesi.innerHTML = "";

    if (liste.length === 0) {
        tabloGovdesi.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#64748b;"><i class="fa-solid fa-inbox" style="font-size:48px;margin-bottom:15px;display:block;"></i>Henüz eğitim kaydı bulunmamaktadır.</td></tr>`;
        return;
    }

    liste.forEach(egitim => {
        let satirSinif = '', yakinlikHtml = '';
        let durumEtiketClass = egitim.durumClass;
        let durumEtiketMetni = egitim.durum;

        if (egitim.durum === "PLANLANDI") {
            const g = gunFarkiHesapla(egitim.tarih);
            satirSinif   = _satirSinifi(g);
            yakinlikHtml = `<br>${_sureBadgeHtml(g)}`;
            if (g < 0) { durumEtiketClass = "tarih-gecti"; durumEtiketMetni = "TARİH GEÇTİ"; }
        }

        tabloGovdesi.insertAdjacentHTML('beforeend', `
            <tr data-id="${egitim._id}" class="${satirSinif}">
                <td><strong>${egitim.ad}</strong>${yakinlikHtml}</td>
                <td>${egitim.firma}</td>
                <td>${egitim.egitmen}</td>
                <td>${egitim.tarih}</td>
                <td>${egitim.katilimci} Kişi</td>
                <td><span class="etiket ${durumEtiketClass}">${durumEtiketMetni}</span></td>
                <td><button class="btn-islem" onclick="detayAc('${egitim._id}')" title="Detay ve Düzenle"><i class="fa-solid fa-edit"></i> Detay</button></td>
            </tr>`);
    });
}

// --- FİLTRELEME ---
function filtrelemeEkle() {
    const aramaInput = document.querySelector(".arama-grubu input");
    if (!aramaInput) return;
    aramaInput.addEventListener("keyup", () => {
        const k = aramaInput.value.toLowerCase().trim();
        tabloyuGuncelle(egitimListesi.filter(e => !k || e.ad.toLowerCase().includes(k) || e.firma.toLowerCase().includes(k)));
    });
}

// --- BANNER ---
function yaklasanEgitimBannerGoster() {
    ['yaklasan-egitim-banner','yaklasan-egitim-banner-gecmis'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    const gecmis    = egitimListesi.filter(e => e.durum === "PLANLANDI" && gunFarkiHesapla(e.tarih) < 0);
    const yaklasan  = egitimListesi.filter(e => e.durum === "PLANLANDI" && gunFarkiHesapla(e.tarih) >= 0 && gunFarkiHesapla(e.tarih) <= 10);
    const islemCub  = document.querySelector('.islem-cubugu');

    if (gecmis.length > 0) {
        gecmis.sort((a,b) => gunFarkiHesapla(b.tarih) - gunFarkiHesapla(a.tarih));
        const en = gecmis[0];
        const gecenGun = Math.abs(gunFarkiHesapla(en.tarih));
        const div = document.createElement('div');
        div.id = "yaklasan-egitim-banner-gecmis";
        div.className = "uyari-banner uyari-kritik";
        div.style.cssText = "border-left-color:#9d174d;background:linear-gradient(135deg,#fce7f3,#fff0f6);";
        div.innerHTML = `<div class="uyari-ikon">⚠️</div><div class="uyari-icerik"><div class="uyari-baslik" style="color:#9d174d;">PLANLI EĞİTİM TARİHİ GEÇTİ!</div><div class="uyari-mesaj"><strong>${en.ad}</strong> - ${en.firma}<span class="uyari-tarih">📅 ${en.tarih} (${gecenGun} gün önce geçti)</span></div>${gecmis.length > 1 ? `<div class="uyari-ekstra">+${gecmis.length-1} eğitim daha geçmiş</div>` : ''}</div><button class="uyari-kapat" onclick="gecmisBannerKapat()">&times;</button>`;
        if (islemCub) islemCub.after(div);
    }

    if (yaklasan.length > 0) {
        yaklasan.sort((a,b) => gunFarkiHesapla(a.tarih) - gunFarkiHesapla(b.tarih));
        const en = yaklasan[0];
        const g  = gunFarkiHesapla(en.tarih);
        const uyari = uyariSeviyesiGetir(g);
        const div = document.createElement('div');
        div.id = "yaklasan-egitim-banner";
        div.className = `uyari-banner uyari-${uyari.seviye}`;
        div.innerHTML = `<div class="uyari-ikon">${uyari.ikon}</div><div class="uyari-icerik"><div class="uyari-baslik">${uyari.baslik}</div><div class="uyari-mesaj"><strong>${en.ad}</strong> - ${en.firma}<span class="uyari-tarih">📅 ${en.tarih}</span></div>${yaklasan.length > 1 ? `<div class="uyari-ekstra">+${yaklasan.length-1} eğitim daha yaklaşıyor</div>` : ''}</div><button class="uyari-kapat" onclick="bannerKapat()">&times;</button>`;
        if (islemCub) islemCub.after(div);
    }
}

function uyariSeviyesiGetir(g) {
    if (g < 0)   return { seviye: "kritik", ikon: "❌", baslik: "SÜRESİ DOLDU! Eğitim Gecikti" };
    if (g === 0) return { seviye: "kritik", ikon: "🔴", baslik: "ACİL! Eğitim BUGÜN!" };
    if (g <= 10) return { seviye: "kritik", ikon: "🔴", baslik: `DİKKAT! Eğitime ${g} Gün Kaldı` };
    if (g <= 30) return { seviye: "uyari",  ikon: "🟠", baslik: `Yaklaşan Eğitim: ${g} Gün Kaldı` };
    return              { seviye: "hafif",  ikon: "🟢", baslik: `Planlanan Eğitim: ${g} Gün Sonra` };
}

function bannerKapat()      { const el = document.getElementById("yaklasan-egitim-banner"); if (el) el.style.display='none'; }
function gecmisBannerKapat(){ const el = document.getElementById("yaklasan-egitim-banner-gecmis"); if (el) el.style.display='none'; }

// --- MODAL ---
function ekleModalAc()  { if (ekleModal) ekleModal.style.display = "flex"; }
function ekleModalKapat() {
    if (ekleModal) {
        ekleModal.style.display = "none";
        document.querySelector("#egitim-ekle-modali form")?.reset();
        const cb = document.getElementById('ekle-mail-at');
        if (cb) cb.checked = false;
    }
}

function detayAc(id) {
    aktifEgitimId = id;
    const egitim = egitimListesi.find(e => e._id === id);
    if (!egitim || !detayModal) return;

    document.getElementById("detay-egitim-adi").value   = egitim.ad;
    document.getElementById("detay-firma").value        = egitim.firma;
    document.getElementById("detay-egitmen").value      = egitim.egitmen;
    document.getElementById("detay-tarih").value        = tarihiFormataDonustur(egitim.tarih);
    document.getElementById("detay-katilimci").value    = egitim.katilimci;
    document.getElementById("detay-notlar").value       = egitim.notlar || '';
    document.getElementById("detay-durum-select").value = egitim.durum;
    const mailCb = document.getElementById('detay-mail-at');
    if (mailCb) mailCb.checked = false;

    durumBadgeGuncelle(egitim.durum);

    if (egitim.durum === "PLANLANDI") {
        const g = gunFarkiHesapla(egitim.tarih);
        if (g >= 0 && g <= 10) detayYakinlikUyarisiGoster(g);
    }
    detayModal.style.display = "flex";
}

function detayYakinlikUyarisiGoster(g) {
    document.getElementById("detay-yakinlik-uyari")?.remove();
    const uyari = uyariSeviyesiGetir(g);
    const div = document.createElement('div');
    div.id = "detay-yakinlik-uyari";
    div.className = `detay-uyari uyari-${uyari.seviye}`;
    div.innerHTML = `<span class="uyari-ikon">${uyari.ikon}</span><strong>${uyari.baslik}</strong>`;
    const ilk = document.querySelector("#egitim-detay-modali .modal-icerik div");
    if (ilk) ilk.after(div);
}

function detayKapat() {
    if (detayModal) { detayModal.style.display = "none"; aktifEgitimId = null; }
}

function durumDegistir()       { durumBadgeGuncelle(document.getElementById("detay-durum-select").value); }
function durumBadgeGuncelle(d) {
    const b = document.getElementById("detay-durum-badge");
    if (!b) return;
    b.className   = `etiket ${durumClassGetir(d)}`;
    b.textContent = d;
}

// --- MODAL DIŞINA TIKLA ---
window.addEventListener("click", e => {
    if (e.target === ekleModal)  ekleModalKapat();
    if (e.target === detayModal) detayKapat();
    if (e.target.id === "egitim-turu-ekle-modali") egitimTuruEkleModalKapat();
});

// --- GLOBAL SCOPE ---
window.ekleModalAc       = ekleModalAc;
window.ekleModalKapat    = ekleModalKapat;
window.egitimKaydet      = egitimKaydet;
window.detayAc           = detayAc;
window.detayKapat        = detayKapat;
window.detayGuncelle     = detayGuncelle;
window.durumDegistir     = durumDegistir;
window.egitimSil         = egitimSil;
window.bannerKapat       = bannerKapat;
window.gecmisBannerKapat = gecmisBannerKapat;
window.egitimTuruEkleModalAc    = egitimTuruEkleModalAc;
window.egitimTuruEkleModalKapat = egitimTuruEkleModalKapat;
window.egitimTuruKaydet         = egitimTuruKaydet;