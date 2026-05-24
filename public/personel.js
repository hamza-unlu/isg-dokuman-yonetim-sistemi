// ─── TC KİMLİK ANLIK FORMAT KONTROLÜ (Mernis) ───
function tcKimlikDogrulaFE(tc) {
    if (!tc || tc.length !== 11) return false;
    if (tc[0] === '0') return false;
    if (!/^\d{11}$/.test(tc)) return false;

    const h = tc.split('').map(Number);
    const tek  = h[0] + h[2] + h[4] + h[6] + h[8];
    const cift = h[1] + h[3] + h[5] + h[7];

    if (((tek * 7) - cift) % 10 !== h[9]) return false;
    if (h.slice(0, 10).reduce((a, b) => a + b, 0) % 10 !== h[10]) return false;

    return true;
}

function tcInputKontrol() {
    const input = document.getElementById('form-tc');
    if (!input) return;
    const tc = input.value.trim();
    let mesajEl = document.getElementById('form-tc-mesaj');
    if (!mesajEl) {
        mesajEl = document.createElement('small');
        mesajEl.id = 'form-tc-mesaj';
        mesajEl.style.cssText = 'display:block; margin-top:4px; font-size:12px;';
        input.parentNode.appendChild(mesajEl);
    }

    if (!tc) {
        input.style.borderColor = '';
        mesajEl.textContent = '';
        return;
    }

    if (tc.length < 11) {
        input.style.borderColor = '#f59e0b';
        mesajEl.style.color     = '#f59e0b';
        mesajEl.textContent     = `⏳ ${tc.length}/11 hane`;
        return;
    }

    if (tcKimlikDogrulaFE(tc)) {
        input.style.borderColor = '#16a34a';
        mesajEl.style.color     = '#16a34a';
        mesajEl.textContent     = '✅ Geçerli TC Kimlik No';
    } else {
        input.style.borderColor = '#dc2626';
        mesajEl.style.color     = '#dc2626';
        mesajEl.textContent     = '❌ Geçersiz TC Kimlik No';
    }
}

const tekilModal = document.getElementById("personel-ekleme");
const excelModal = document.getElementById("excel-yukleme-modal");

function modalAc() { tekilModal.style.display = "flex"; }

function modalKapat() {
    tekilModal.style.display = "none";
    document.getElementById("personel-formu").reset();
    document.getElementById("duzenlenen-id").value = "";
    document.getElementById("modal-baslik-metni").innerText = "Yeni Personel Ekle";
    document.getElementById("form-buton").innerText = "PERSONELİ KAYDET";
}

function excelModalAc() { excelModal.style.display = "flex"; }
function excelModalKapat() {
    excelModal.style.display = "none";
    // Modal kapanınca dosya inputunu ve UI'yi sıfırla
    const dosyaInput = document.getElementById("excel-dosya-input");
    if (dosyaInput) dosyaInput.value = "";
    const yaziEl = document.querySelector("#excel-yukleme-modal .surukle-birak-alani p");
    if (yaziEl) {
        yaziEl.innerHTML = "Dosyayı buraya sürükleyin veya tıklayın";
        yaziEl.style.color = "";
    }
}

window.onclick = function(olay) {
    if (olay.target == tekilModal) modalKapat();
    if (olay.target == excelModal) excelModalKapat();
    const isgModal = document.getElementById("isg-durum-modal");
    if (isgModal && olay.target == isgModal) isgModalKapat();
}

// --- BACKEND İŞLEMLERİ (MongoDB) ---

async function personelleriYukle() {
    try {
        const tablo = document.getElementById("personel-tablo-govde");
        tablo.innerHTML = '<tr><td colspan="6" style="text-align:center;">Personeller yükleniyor...</td></tr>';
        
        const response = await AUTH.apiFetch(`/api/personel?_t=${new Date().getTime()}`); 
        if (!response.ok) throw new Error("Personel bilgileri alınamadı.");
        
        const data = await response.json();
        const liste = data.veri || []; 
        
        tablo.innerHTML = "";
        if(liste.length === 0) {
            tablo.innerHTML = '<tr><td colspan="6" style="text-align:center;">Kayıtlı personel bulunamadı.</td></tr>';
            return;
        }

        liste.forEach(p => {
            if (p.isg) isgVerileri[p._id] = p.isg; 
            
            const adSoyad = p.adSoyad || p.ad || "İsimsiz";
            const firma = p.firma && p.firma.firmaAdi ? p.firma.firmaAdi : (p.firma || "");
            const avatarHarfleri = adSoyad.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
            
            // 🛠️ Tarihi Ekranda Güzel Gösterme İşlemi
            const rawTarih = p.iseGirisTarihi || p.tarih || '';
            let gorselTarih = rawTarih;
            if (rawTarih && String(rawTarih).includes('T')) {
                const d = new Date(rawTarih);
                gorselTarih = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
            }

            const yeniSatir = document.createElement("tr");
            const id = p._id || p.id || "";
            yeniSatir.setAttribute("data-id", id); 
            
            yeniSatir.innerHTML = `
                <td>
                    <div class="kullanici-hucre">
                        <div class="kullanici-avatar-kucuk">${avatarHarfleri}</div>
                        <strong>${adSoyad}</strong>
                    </div>
                </td>
                <td>${p.tcKimlik || p.tc || ''}</td>
                <td>${p.gorev || p.pozisyon || p.unvan || ''}</td>
                <td>${firma}</td>
                <td>${gorselTarih}</td>
                <td>
                    <button class="btn-islem" onclick="personelDuzenle('${id}')">Düzenle</button>
                    <button class="btn-islem" style="background:#ef4444; margin-left:5px;" onclick="personelSil('${id}')">Sil</button>
                </td>
            `;
            tablo.appendChild(yeniSatir);
        });
    } catch (hata) {
        document.getElementById("personel-tablo-govde").innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Veriler yüklenemedi.</td></tr>';
    }
}

async function personelKaydet() {
    const id = document.getElementById("duzenlenen-id").value;

    const adSoyad = document.getElementById("form-ad").value.trim();
    const tcKimlik = document.getElementById("form-tc").value.trim();
    const gorev = document.getElementById("form-gorev").value.trim();
    const firmaSelect = document.getElementById("form-firma");
    
    const iseGirisTarihi = document.getElementById("form-tarih").value;

    if (tcKimlik && !tcKimlikDogrulaFE(tcKimlik)) {
        alert('❌ Geçersiz TC Kimlik No! Lütfen kontrol ediniz.');
        document.getElementById('form-tc').focus();
        return;
    }

    const payload = {
        adSoyad,
        tcKimlik,
        gorev,
        firma: firmaSelect.value, 
        iseGirisTarihi
    };

    try {
        if (id) {
            const res = await AUTH.apiFetch(`/api/personel/${id}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.mesaj || errData.message || `HTTP ${res.status}`);
            }
            alert('Personel Bilgileri Başarıyla Güncellendi!');
        } else {
            const res = await AUTH.apiFetch(`/api/personel`, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.mesaj || errData.message || `HTTP ${res.status}`);
            }
            alert('Yeni Personel Başarıyla Kaydedildi!');
        }
        
        modalKapat();
        await personelleriYukle(); 
    } catch (err) {
        alert("Hata: " + err.message);
    }
}

async function personelSil(id) {
    if (!confirm("Bu personeli silmek istediğinize emin misiniz?")) return;
    try {
        const res = await AUTH.apiFetch(`/api/personel/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.mesaj || errData.message || "Silme işlemi başarısız.");
        }
        alert("Personel silindi.");
        await personelleriYukle();
    } catch (err) {
        alert(err.message);
    }
}

function personelDuzenle(id) {
    const satir = document.querySelector(`#personel-tablo-govde tr[data-id="${id}"]`);
    if(!satir) return;

    const adSoyad = satir.querySelector("strong").innerText;
    const tcNo = satir.cells[1].innerText;
    const gorev = satir.cells[2].innerText;
    const firma = satir.cells[3].innerText;

    let formatliTarih = "";
    if(satir.cells[4].innerText.includes('.')) {
        const parcaTarih = satir.cells[4].innerText.split('.');
        formatliTarih = `${parcaTarih[2]}-${parcaTarih[1]}-${parcaTarih[0]}`;
    }

    document.getElementById("duzenlenen-id").value = id;
    document.getElementById("form-ad").value = adSoyad;
    document.getElementById("form-tc").value = tcNo;
    document.getElementById("form-gorev").value = gorev;
    document.getElementById("form-tarih").value = formatliTarih;

    const firmaSelect = document.getElementById("form-firma");
    for(let i=0; i<firmaSelect.options.length; i++){
        if(firmaSelect.options[i].text.includes(firma)){
            firmaSelect.selectedIndex = i;
            break;
        }
    }

    document.getElementById("modal-baslik-metni").innerText = "Personel Bilgilerini Düzenle";
    document.getElementById("form-buton").innerText = "DEĞİŞİKLİKLERİ KAYDET";

    modalAc();
}

// =====================================================
// --- EXCEL İLE TOPLU PERSONEL YÜKLEME ---
// =====================================================

// Firma adından _id bul (form-firma dropdown'undan)
function firmaIdBul(firmaAdi) {
    if (!firmaAdi) return null;
    const formFirma = document.getElementById("form-firma");
    if (!formFirma) return null;

    const aranan = String(firmaAdi).toLowerCase().trim();
    for (let i = 0; i < formFirma.options.length; i++) {
        const optText = formFirma.options[i].text.toLowerCase().trim();
        if (optText === aranan || optText.includes(aranan) || aranan.includes(optText)) {
            if (formFirma.options[i].value) return formFirma.options[i].value;
        }
    }
    return null;
}

// Excel'den gelen tarihi YYYY-MM-DD formatına çevir
function excelTarihFormatla(deger) {
    if (deger === null || deger === undefined || deger === '') return '';

    // Excel serial number (sayı) ise
    if (typeof deger === 'number') {
        // Excel'in epoch tarihi: 30 Aralık 1899
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const tarih = new Date(excelEpoch.getTime() + deger * 86400000);
        const y = tarih.getUTCFullYear();
        const m = String(tarih.getUTCMonth() + 1).padStart(2, '0');
        const g = String(tarih.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${g}`;
    }

    const str = String(deger).trim();

    // "15.03.2025" formatı (Türkçe)
    if (str.includes('.')) {
        const parcalar = str.split('.');
        if (parcalar.length === 3) {
            const g = parcalar[0].padStart(2, '0');
            const m = parcalar[1].padStart(2, '0');
            const y = parcalar[2].length === 2 ? '20' + parcalar[2] : parcalar[2];
            return `${y}-${m}-${g}`;
        }
    }

    // "15/03/2025" formatı
    if (str.includes('/')) {
        const parcalar = str.split('/');
        if (parcalar.length === 3) {
            const g = parcalar[0].padStart(2, '0');
            const m = parcalar[1].padStart(2, '0');
            const y = parcalar[2].length === 2 ? '20' + parcalar[2] : parcalar[2];
            return `${y}-${m}-${g}`;
        }
    }

    // "2025-03-15" zaten doğru format
    if (str.includes('-')) {
        const parcalar = str.split('-');
        if (parcalar.length === 3) {
            if (parcalar[0].length === 4) return str; // YYYY-MM-DD
            // DD-MM-YYYY ise çevir
            return `${parcalar[2]}-${parcalar[1].padStart(2,'0')}-${parcalar[0].padStart(2,'0')}`;
        }
    }

    return str;
}

// "YÜKLEMEYİ BAŞLAT" butonu tıklandığında çalışır
function excelYukle() {
    const dosyaInput = document.getElementById("excel-dosya-input");

    if (!dosyaInput || !dosyaInput.files || dosyaInput.files.length === 0) {
        alert("⚠️ Lütfen önce bir Excel dosyası seçin!");
        return;
    }

    if (typeof XLSX === 'undefined') {
        alert("❌ Excel okuma kütüphanesi (SheetJS) yüklenemedi. Sayfayı yenileyip tekrar deneyin.");
        return;
    }

    excelDosyasiOku(dosyaInput.files[0]);
}

// Excel dosyasını parse edip her satırı backend'e POST et
function excelDosyasiOku(dosya) {
    const reader = new FileReader();

    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellDates: false });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            // header: 1 -> her satır bir dizi (başlık dahil)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, defval: '' });

            if (!jsonData || jsonData.length < 2) {
                alert("⚠️ Excel dosyası boş veya yalnızca başlık satırı içeriyor!");
                return;
            }

            // İlk satır başlık, gerisi veri satırları
            const veriSatirlari = jsonData.slice(1).filter(s =>
                s && s.length > 0 && String(s[0] || '').trim() !== ''
            );

            if (veriSatirlari.length === 0) {
                alert("⚠️ Excel'de geçerli personel verisi bulunamadı!");
                return;
            }

            // Yükleme başlatıldı bildirimi (butonu devre dışı bırak)
            const yukleButonu = document.querySelector("#excel-form button[type='button']");
            const eskiYazi = yukleButonu ? yukleButonu.innerText : '';
            if (yukleButonu) {
                yukleButonu.disabled = true;
                yukleButonu.innerText = `⏳ ${veriSatirlari.length} kayıt işleniyor...`;
            }

            let basarili = 0;
            let basarisiz = 0;
            const hatalar = [];

            // Her satırı sırayla backend'e gönder
            for (let i = 0; i < veriSatirlari.length; i++) {
                const satir = veriSatirlari[i];
                const adSoyad = String(satir[0] || '').trim();
                const tcKimlik = String(satir[1] || '').trim();
                const gorev = String(satir[2] || '').trim();
                const firmaAdi = String(satir[3] || '').trim();
                const iseGirisTarihiRaw = satir[4];

                // Temel doğrulama
                if (!adSoyad || !tcKimlik || !gorev) {
                    basarisiz++;
                    hatalar.push(`Satır ${i + 2}: Eksik alan (Ad Soyad / TC / Görev zorunlu)`);
                    continue;
                }

                if (!tcKimlikDogrulaFE(tcKimlik)) {
                    basarisiz++;
                    hatalar.push(`Satır ${i + 2} (${adSoyad}): Geçersiz TC Kimlik No`);
                    continue;
                }

                // Firma _id'sini bul (yoksa adıyla gönder, backend karar versin)
                const firmaId = firmaIdBul(firmaAdi);

                const payload = {
                    adSoyad,
                    tcKimlik,
                    gorev,
                    firma: firmaId || firmaAdi,
                    iseGirisTarihi: excelTarihFormatla(iseGirisTarihiRaw)
                };

                try {
                    const res = await AUTH.apiFetch(`/api/personel`, {
                        method: "POST",
                        body: JSON.stringify(payload)
                    });
                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.mesaj || errData.message || `HTTP ${res.status}`);
                    }
                    basarili++;
                } catch (err) {
                    basarisiz++;
                    hatalar.push(`Satır ${i + 2} (${adSoyad}): ${err.message}`);
                }
            }

            // Butonu eski haline getir
            if (yukleButonu) {
                yukleButonu.disabled = false;
                yukleButonu.innerText = eskiYazi;
            }

            // Sonuç mesajı
            let mesaj = `✅ ${basarili} personel başarıyla eklendi.`;
            if (basarisiz > 0) {
                mesaj += `\n\n❌ ${basarisiz} kayıt eklenemedi:\n`;
                mesaj += hatalar.slice(0, 10).join('\n');
                if (hatalar.length > 10) {
                    mesaj += `\n... ve ${hatalar.length - 10} hata daha (Console'da tam liste)`;
                    console.error("Excel yükleme hataları:", hatalar);
                }
            }
            alert(mesaj);

            excelModalKapat();
            await personelleriYukle();

        } catch (hata) {
            console.error("Excel okuma hatası:", hata);
            alert("❌ Excel dosyası okunamadı: " + hata.message);
            const yukleButonu = document.querySelector("#excel-form button[type='button']");
            if (yukleButonu) {
                yukleButonu.disabled = false;
                yukleButonu.innerText = "YÜKLEMEYİ BAŞLAT";
            }
        }
    };

    reader.onerror = function() {
        alert("❌ Dosya okunurken bir hata oluştu!");
    };

    reader.readAsArrayBuffer(dosya);
}

// =====================================================

document.addEventListener("DOMContentLoaded", async () => {
    async function firmalariYukle() {
        try {
            const response = await AUTH.apiFetch(`/api/firmalar?_t=${new Date().getTime()}`);
            if (!response.ok) throw new Error("Firmalar alınamadı");
            const data = await response.json();
            const firmalar = data.veri || [];

            const formFirma   = document.getElementById("form-firma");
            const filtreFirma = document.getElementById("firma-filtre");

            firmalar.forEach(firma => {
                const opt = document.createElement("option");
                opt.value = firma._id; 
                opt.text  = firma.firmaAdi;
                formFirma.appendChild(opt);

                const opt2 = document.createElement("option");
                opt2.value = firma.firmaAdi.toLowerCase(); 
                opt2.text  = firma.firmaAdi;
                filtreFirma.appendChild(opt2);
            });
        } catch (e) {
            console.warn("Firma listesi yüklenemedi:", e);
        }
    }

    await firmalariYukle();
    await personelleriYukle();

    const aramaInput = document.getElementById("personel-ara");
    const firmaSecim = document.getElementById("firma-filtre");

    const tabloyuFiltrele = () => {
        const arananKelime = aramaInput.value.toLowerCase().trim();
        const secilenFirma = firmaSecim.value.toLowerCase();

        const satirlar = document.querySelectorAll("#personel-tablo-govde tr");

        satirlar.forEach(satir => {
            const adSoyad = satir.cells[0].innerText.toLowerCase();
            const tcNo    = satir.cells[1].innerText.toLowerCase();
            const firma   = satir.cells[3].innerText.toLowerCase();

            const isimTcUyuyor = adSoyad.includes(arananKelime) || tcNo.includes(arananKelime);
            const firmaUyuyor  = secilenFirma === "" || firma.includes(secilenFirma);

            satir.style.display = (isimTcUyuyor && firmaUyuyor) ? "" : "none";
        });
    };

    aramaInput.addEventListener("keyup", tabloyuFiltrele);
    firmaSecim.addEventListener("change", tabloyuFiltrele);

    // --- Excel dosya seçildiğinde dosya adını göster ---
    const excelInput = document.getElementById("excel-dosya-input");
    if (excelInput) {
        excelInput.addEventListener("change", function(e) {
            const dosya = e.target.files[0];
            const yaziEl = document.querySelector("#excel-yukleme-modal .surukle-birak-alani p");
            if (dosya && yaziEl) {
                yaziEl.innerHTML = `<strong>📎 ${dosya.name}</strong><br><span style="font-size:12px; color:#64748b;">${(dosya.size / 1024).toFixed(1)} KB</span>`;
                yaziEl.style.color = "#16a34a";
            }
        });
    }
});

const tcInput = document.getElementById('form-tc');
    if (tcInput) {
        tcInput.setAttribute('maxlength', '11');
        tcInput.addEventListener('input', () => {
            tcInput.value = tcInput.value.replace(/\D/g, ''); // sadece rakam
            tcInputKontrol();
        });
    }


const isgVerileri = {};