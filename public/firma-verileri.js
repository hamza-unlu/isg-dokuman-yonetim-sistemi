/**
 * ÜNLÜ İSG - Firma Verileri
 * Firmalar arası paylaşılan merkezi veri deposu
 *
 * [GÜNCELLEME] Backend API öncelikli okunur.
 * Backend erişilemezse localStorage'daki isg_firma_verileri anahtarına,
 * o da yoksa statik fallback listeye düşer.
 * Firmalar sayfasında kayıt yapıldığında backend otomatik güncellenir.
 */

// Statik fallback listesi (localStorage ve backend yoksa kullanılır)
const _firmaListesiFallback = [
    { 
        id: "abc", 
        ad: "ABC İnşaat A.Ş.", 
        sinif: "TEHLİKELİ",
        email: "info@abcinsaat.com.tr",
        yetkili: "Mehmet Demir",
        telefon: "0212 555 0001",
        sgk: "",
        adres: ""
    },
    { 
        id: "rumeli", 
        ad: "Rumeli Yazılım",
        sinif: "AZ TEHLİKELİ",
        email: "ik@rumeliyazilim.com",
        yetkili: "Ayşe Yılmaz",
        telefon: "0216 555 0002",
        sgk: "",
        adres: ""
    },
    { 
        id: "unlu", 
        ad: "Ünlü Metal Sanayi",
        sinif: "TEHLİKELİ",
        email: "fabrika@unlumetal.com",
        yetkili: "Fatih Kaya",
        telefon: "0262 555 0003",
        sgk: "",
        adres: ""
    },
    { 
        id: "kiyi", 
        ad: "Kıyı Lojistik",
        sinif: "TEHLİKELİ",
        email: "operasyon@kiyilojistik.com",
        yetkili: "Zeynep Arslan",
        telefon: "0232 555 0004",
        sgk: "",
        adres: ""
    }
];

/**
 * localStorage'dan firma listesini döndürür.
 * Bulamazsa statik fallback listeyi kullanır.
 */
function _localFirmaListesiAl() {
    try {
        const kayitli = localStorage.getItem("isg_firma_verileri");
        if (kayitli) {
            const parsed = JSON.parse(kayitli);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.warn("firma-verileri: localStorage okunamadı", e);
    }
    return _firmaListesiFallback;
}

/**
 * Aktif firma listesini döndürür.
 * Önce backend API'ye bakar, erişilemezse localStorage'a,
 * o da yoksa statik fallback listeyi kullanır.
 */
async function _aktifFirmaListesiAl() {
    try {
        const response = await fetch("/api/firmalar");
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) return data;
        }
        throw new Error("Backend yanıt vermedi");
    } catch (fetchHatasi) {
        console.warn("firma-verileri: Backend'e erişilemedi, localStorage kullanılıyor:", fetchHatasi);
        return _localFirmaListesiAl();
    }
}

// Dışarıdan erişilen ana liste — sayfa yüklenirken backend/localStorage'dan doldurulur
let firmaListesi = _localFirmaListesiAl();

/**
 * firmaListesi'ni backend/localStorage'dan yükler.
 * Sayfa yüklenirken bir kez çağrılmalıdır.
 */
async function firmaListesiniYukle() {
    firmaListesi = await _aktifFirmaListesiAl();
}

// localStorage değişirse (başka sekmede güncelleme olursa) listeyi yenile
window.addEventListener("storage", async function(e) {
    if (e.key === "isg_firma_verileri") {
        firmaListesi = await _aktifFirmaListesiAl();
    }
});

// --- YARDIMCI FONKSİYONLAR ---

/**
 * Firma ID'sine göre firma bilgisi getir
 * @param {string} firmaId
 * @returns {Promise<object|undefined>}
 */
async function firmaGetir(firmaId) {
    const liste = await _aktifFirmaListesiAl();
    return liste.find(firma => firma.id === firmaId);
}

/**
 * Firma adına göre firma bilgisi getir (kısmi eşleşme desteklenir)
 * @param {string} firmaAdi
 * @returns {Promise<object|undefined>}
 */
async function firmaAdaGoreGetir(firmaAdi) {
    const liste = await _aktifFirmaListesiAl();
    const aranan = firmaAdi.toLowerCase();
    return liste.find(firma =>
        (firma.ad  || "").toLowerCase().includes(aranan) ||
        aranan.includes((firma.ad || "").toLowerCase())
    );
}

/**
 * Tüm firmaları döndürür (güncel liste)
 * @returns {Promise<Array>}
 */
async function tumFirmalariGetir() {
    return await _aktifFirmaListesiAl();
}