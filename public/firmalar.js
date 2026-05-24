

// Tarayıcıdaki eski sahte verileri zorla çöpe atar!
['isg_firmalar', 'isg_personeller', 'isg_personel', 'isg_firma_verileri'].forEach(k => localStorage.removeItem(k));

// ─── FORMAT DOĞRULAMA FONKSİYONLARI ───
function sgkSicilDogrulaFE(sgk) {
    if (!sgk) return { gecerli: true };
    const temiz = sgk.replace(/[\s\-\.]/g, '');
    if (!/^\d+$/.test(temiz)) return { gecerli: false, hata: 'Sadece rakam girilebilir.' };
    if (temiz.length < 20 || temiz.length > 26) return { gecerli: false, hata: '20-26 hane arası olmalı.' };
    return { gecerli: true };
}

function detsisNoDogrulaFE(detsis) {
    if (!detsis) return { gecerli: true };
    const temiz = detsis.replace(/[\s\-\.]/g, '');
    if (!/^\d{8}$/.test(temiz)) return { gecerli: false, hata: 'DETSİS 8 haneli rakam olmalı.' };
    return { gecerli: true };
}

function inputAnlikKontrol(inputId, kontrolFn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    let mesajEl = document.getElementById(`${inputId}-mesaj`);
    if (!mesajEl) {
        mesajEl = document.createElement('small');
        mesajEl.id = `${inputId}-mesaj`;
        mesajEl.style.cssText = 'display:block; margin-top:4px; font-size:12px;';
        input.parentNode.appendChild(mesajEl);
    }
    input.addEventListener('input', () => {
        const sonuc = kontrolFn(input.value.trim());
        if (!input.value.trim()) {
            input.style.borderColor = '';
            mesajEl.textContent = '';
        } else if (sonuc.gecerli) {
            input.style.borderColor = '#16a34a';
            mesajEl.style.color     = '#16a34a';
            mesajEl.textContent     = '✅ Geçerli format';
        } else {
            input.style.borderColor = '#dc2626';
            mesajEl.style.color     = '#dc2626';
            mesajEl.textContent     = `❌ ${sonuc.hata}`;
        }
    });
}

// Sayfa yüklenince anlık kontrolleri devreye al
document.addEventListener('DOMContentLoaded', () => {
    inputAnlikKontrol('inp-sgk-sicil', sgkSicilDogrulaFE);
    inputAnlikKontrol('inp-detsis-no', detsisNoDogrulaFE);
});
const modal        = document.getElementById("firma-ekle-modali");
const modalBaslik  = document.getElementById("modal-baslik-yazisi");
const kaydetButon  = document.getElementById("btn-form-kaydet");
const tabloGovdesi = document.getElementById("firma-listesi-govdesi");
const silButon     = document.getElementById("btn-firma-sil");
const aramaKutusu  = document.querySelector(".arama-grubu input");

let aktifMod        = 'yeni';
let duzenlenenSatir = null;
let duzenlenenId    = null;


// NACE KODLARI SESSION CACHE

let naceListesi = [];           // Cache — geriye uyumlu olsun diye aynı isim
let naceYukleniyor = null;      // Promise — eşzamanlı çağrıları tek istekte toplamak için

async function naceListesiniHazirla() {
    // Zaten doluysa hemen dön
    if (naceListesi.length > 0) return naceListesi;

    // Şu an yükleniyorsa aynı promise'ı paylaş (çift API çağrısını engeller)
    if (naceYukleniyor) return naceYukleniyor;

    naceYukleniyor = (async () => {
        try {
            const res = await AUTH.apiFetch('/api/nace');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            naceListesi = data.veri || [];
            console.log(`✅ ${naceListesi.length} NACE kodu API'den yüklendi`);
            return naceListesi;
        } catch (err) {
            console.error('[NACE] API hatası:', err);
            naceListesi = [];
            return [];
        } finally {
            naceYukleniyor = null;
        }
    })();

    return naceYukleniyor;
}

function _rol()       { return AUTH.rol(); }
function _isverenMi() { return _rol() === 'isveren'; }

function _rolUygulayanlar() {
    if (_isverenMi()) {
        const ekleBtn = document.getElementById('btn-yeni-firma');
        if (ekleBtn) ekleBtn.style.display = 'none';
        document.querySelectorAll('.btn-islem').forEach(btn => btn.style.display = 'none');
    }
}

function getEtiketClass(sinifMetni) {
    if (!sinifMetni) return "";
    const m = sinifMetni.toLowerCase().trim();
    if (m.includes("cok tehlikeli") || m.includes("çok tehlikeli")) return "tehlike";
    if (m.includes("tehlikeli")) return "uyari";
    return "basarili";
}

function emailGecerliMi(email) {
    if(!email) return true; 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- BACKEND (MongoDB) İŞLEMLERİ ---

async function verileriYukle() {
    try {
        tabloGovdesi.innerHTML = '<tr><td colspan="8" style="text-align:center;">Veriler yükleniyor...</td></tr>';
        
        // Zaman damgası ile her seferinde taze veri çekilir
        const response = await AUTH.apiFetch(`/api/firmalar?_t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Backend yanıt vermedi");
        
        const data = await response.json();
        const firmalar = data.veri || []; 
        
        tabloGovdesi.innerHTML = "";
        firmalar.forEach((firma, index) => tabloyaSatirEkle(firma, index));
        _rolUygulayanlar();

    } catch (hata) {
        console.error("Firmalar yüklenemedi:", hata);
        tabloGovdesi.innerHTML = '<tr><td colspan="8" style="text-align:center; color:red;">Veriler yüklenirken bir hata oluştu.</td></tr>';
    }
}

async function islemTamamla() {
    if (_isverenMi()) return;

    const sgkInput    = document.getElementById("inp-sgk-sicil").value.trim();
    const detsisInput = document.getElementById("inp-detsis-no")?.value.trim() || '';

    //  FORMAT KONTROLLERİ
    const sgkKontrol = sgkSicilDogrulaFE(sgkInput);
    if (!sgkKontrol.gecerli) return alert('❌ SGK Sicil No: ' + sgkKontrol.hata);

    const detsisKontrol = detsisNoDogrulaFE(detsisInput);
    if (!detsisKontrol.gecerli) return alert('❌ DETSİS No: ' + detsisKontrol.hata);

    const firmaData = {
        firmaAdi:      document.getElementById("inp-firma-adi").value.trim(),
        yetkiliKisi:   document.getElementById("inp-yetkili").value.trim(),
        telefon:       document.getElementById("inp-telefon").value.trim(),
        calisanSayisi: document.getElementById("inp-personel").value || 0,
        eposta:        document.getElementById("inp-firma-mail").value.trim(),
        sgkNo:         sgkInput,
        detsisNo:      detsisInput,
        adres:         document.getElementById("inp-adres").value.trim(),
        tehlikeSinifi: document.getElementById("tehlike-sinifi-cikti").value.trim(),
    };

    if (!firmaData.firmaAdi) return alert("Firma adı zorunludur!");
    if (!firmaData.tehlikeSinifi) return alert("Lütfen önce NACE sorgusu yapın veya tehlike sınıfını belirleyin!");

    try {
        kaydetButon.disabled = true;
        kaydetButon.innerText = "Kaydediliyor...";

        if (aktifMod === 'yeni') {
            const res = await AUTH.apiFetch("/api/firmalar", {
                method: "POST",
                body: JSON.stringify(firmaData)
            });
            if (!res.ok) throw new Error("Ekleme başarısız");
            alert("Firma başarıyla eklendi.");
        } else {
            if(!duzenlenenId || duzenlenenId === "null" || duzenlenenId === "undefined") throw new Error("Geçersiz Firma Kimliği!");
            const res = await AUTH.apiFetch(`/api/firmalar/${duzenlenenId}`, {
                method: "PUT",
                body: JSON.stringify(firmaData)
            });
            if (!res.ok) throw new Error("Güncelleme başarısız");
            alert("Firma başarıyla güncellendi.");
        }

        modalKapat();
        await verileriYukle(); 

    } catch (err) {
        alert("İşlem sırasında hata: " + err.message);
    } finally {
        kaydetButon.disabled = false;
        kaydetButon.innerText = aktifMod === 'yeni' ? "FİRMAYI KAYDET" : "GÜNCELLEMELERİ KAYDET";
    }
}

silButon.onclick = async function () {
    if (_isverenMi()) return;
    
    // Hayalet veriyi silmeyi engelleme duvarı
    if (!duzenlenenId || duzenlenenId === "null" || duzenlenenId === "undefined") { 
        alert("Uyarı: Bu kayıt zaten silinmiş veya geçersiz bir deneme kaydı. Sayfa yenileniyor..."); 
        modalKapat();
        await verileriYukle();
        return; 
    }

    if (confirm("Bu firmayı silmek istediğinize emin misiniz?")) {
        try {
            const res = await AUTH.apiFetch(`/api/firmalar/${duzenlenenId}`, { method: "DELETE" });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.mesaj || "Silme başarısız!");
            }
            alert("Firma başarıyla silindi.");
            modalKapat();
            await verileriYukle();
        } catch (err) {
            alert("HATA: " + err.message);
        }
    }
};

async function modalAc(mod, butonElementi) {
    if (_isverenMi()) return;
    aktifMod = mod;
    const isYeni = (mod === 'yeni');
    modalBaslik.innerText             = isYeni ? "Yeni Firma Ekle" : "Firma Detayları / Güncelle";
    kaydetButon.innerText             = isYeni ? "FİRMAYI KAYDET" : "GÜNCELLEMELERİ KAYDET";
    kaydetButon.style.backgroundColor = isYeni ? "#2563eb" : "#16a34a";
    silButon.style.display            = isYeni ? "none" : "block";

    // NACE listesini arka planda hazırla (modal açılırken API çağrısı başlasın)
    // Kullanıcı "Sorgula" butonuna basana kadar zaten hazır olur.
    naceListesiniHazirla();

    if (isYeni) {
        duzenlenenSatir = null;
        duzenlenenId = null;
        formuTemizle();
    } else {
        duzenlenenSatir = butonElementi.closest("tr");
        duzenlenenId = duzenlenenSatir.getAttribute("data-id"); 
        
        const h = duzenlenenSatir.cells;
        document.getElementById("inp-firma-adi").value        = h[1].innerText.trim();
        document.getElementById("tehlike-sinifi-cikti").value = h[2].innerText.trim();
        document.getElementById("inp-personel").value         = h[3].innerText.replace(/[^0-9]/g, ""); 
        
        const yetkiliIsimEl = h[4].querySelector(".yetkili-isim");
        const yetkiliTelEl  = h[4].querySelector(".yetkili-tel");
        document.getElementById("inp-yetkili").value          = yetkiliIsimEl ? yetkiliIsimEl.innerText : "";
        document.getElementById("inp-telefon").value          = yetkiliTelEl ? yetkiliTelEl.innerText.trim() : "";
        
        document.getElementById("inp-firma-mail").value       = h[5].innerText.trim() === '—' ? '' : h[5].innerText.trim();
        
        const sgkEl   = h[6].querySelector(".sgk-deger");
        const adresEl = h[6].querySelector(".adres-deger");
        document.getElementById("inp-sgk-sicil").value        = sgkEl ? (sgkEl.innerText === '—' ? '' : sgkEl.innerText) : "";
        document.getElementById("inp-adres").value            = adresEl ? adresEl.innerText : "";
        
        renkleriAyarla(h[2].innerText.trim());
    }
    modal.style.display = "flex";
}

const modalKapat = () => { modal.style.display = "none"; };

function formuTemizle() {
    document.getElementById("firmaFormu").reset();
    document.getElementById("tehlike-sinifi-cikti").style.color      = "#334155";
    document.getElementById("tehlike-sinifi-cikti").style.fontWeight = "normal";
}

async function naceSorgula() {
    const girilenKod = document.getElementById("nace-kodu-input").value.trim();
    if (!girilenKod) return alert("Lütfen NACE kodu giriniz!");

    // Liste henüz yüklenmemişse bekle (kullanıcı hızlı bastıysa)
    const liste = await naceListesiniHazirla();
    if (!liste || liste.length === 0) {
        return alert("NACE listesi yüklenemedi! Lütfen sayfayı yenileyip tekrar deneyin.");
    }

    const sonuc = liste.find(v => v.kod === girilenKod);
    if (sonuc) {
        document.getElementById("faaliyet-alani-cikti").value = sonuc.tanim;
        document.getElementById("tehlike-sinifi-cikti").value = sonuc.sinif;
        renkleriAyarla(sonuc.sinif);
    } else {
        alert("NACE kodu bulunamadı!");
    }
}

function renkleriAyarla(sinif) {
    const kutu  = document.getElementById("tehlike-sinifi-cikti");
    const metin = sinif.toLowerCase();
    kutu.style.fontWeight = "bold";
    if      (metin.includes("cok tehlikeli") || metin.includes("çok tehlikeli")) kutu.style.color = "red";
    else if (metin.includes("tehlikeli"))     kutu.style.color = "orange";
    else                                      kutu.style.color = "green";
}

function yetkiliHucreHTML(yetkili, telefon) {
    return `<div class="yetkili-hucre"><span class="yetkili-isim">${yetkili || '\u2014'}</span>${telefon ? `<span class="yetkili-tel"><i class="fa-solid fa-phone" style="font-size:10px;"></i> ${telefon}</span>` : ''}</div>`;
}

function sgkAdresHucreHTML(sgk, adres) {
    return `<div class="sgk-adres-hucre"><span class="sgk-deger">${sgk || '\u2014'}</span>${adres ? `<span class="adres-deger">${adres}</span>` : ''}</div>`;
}

function tabloyaSatirEkle(data, index) {
    const yeniSatir = document.createElement("tr");
    const id = data._id || data.id || ""; 
    yeniSatir.setAttribute("data-id", id); 
    
    const sinif = data.tehlikeSinifi || 'Belirsiz';
    const eSinif = getEtiketClass(sinif);
    const duzenleBtnHtml = _isverenMi() ? '' : `<button class="btn-islem" onclick="modalAc('detay', this)">Düzenle</button>`;
        
    yeniSatir.innerHTML = `
        <td>${index !== undefined ? index + 1 : tabloGovdesi.rows.length + 1}</td>
        <td><strong>${data.firmaAdi}</strong></td>
        <td><span class="etiket ${eSinif}">${sinif.toUpperCase()}</span></td>
        <td>${data.calisanSayisi || 0} Kişi</td>
        <td class="td-yetkili">${yetkiliHucreHTML(data.yetkiliKisi, data.telefon)}</td>
        <td>${data.eposta || '\u2014'}</td>
        <td class="td-sgk-adres">${sgkAdresHucreHTML(data.sgkNo, data.adres)}</td>
        <td>${duzenleBtnHtml}</td>
    `;
    tabloGovdesi.appendChild(yeniSatir);
}

if (aramaKutusu) {
    aramaKutusu.addEventListener("keyup", function () {
        const aranan = aramaKutusu.value.toLowerCase().trim();
        Array.from(tabloGovdesi.rows).forEach(satir => {
            const firmaAdi = satir.cells[1].innerText.toLowerCase();
            satir.style.display = firmaAdi.includes(aranan) ? "" : "none";
        });
    });
}

window.onload = verileriYukle;
window.onclick = function (e) { if (e.target === modal) modalKapat(); };