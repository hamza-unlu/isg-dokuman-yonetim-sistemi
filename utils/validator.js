
// TC KİMLİK NO DOĞRULAMA (Mernis Algoritması)

function tcKimlikDogrula(tc) {
    if (!tc) return { gecerli: false, hata: 'TC Kimlik No boş olamaz.' };

    const tcStr = String(tc).trim();

    if (!/^\d{11}$/.test(tcStr)) {
        return { gecerli: false, hata: 'TC Kimlik No 11 haneli rakam olmalıdır.' };
    }
    if (tcStr[0] === '0') {
        return { gecerli: false, hata: 'TC Kimlik No 0 ile başlayamaz.' };
    }

    const haneler = tcStr.split('').map(Number);

    // Mernis kuralı 1: 1, 3, 5, 7, 9. hanelerin toplamı × 7
    //                  - 2, 4, 6, 8. hanelerin toplamı, mod 10 = 10. hane
    const tekToplam  = haneler[0] + haneler[2] + haneler[4] + haneler[6] + haneler[8];
    const ciftToplam = haneler[1] + haneler[3] + haneler[5] + haneler[7];
    const onuncuHane = ((tekToplam * 7) - ciftToplam) % 10;

    if (onuncuHane !== haneler[9]) {
        return { gecerli: false, hata: 'Geçersiz TC Kimlik No (algoritma uyumsuz).' };
    }

    // Mernis kuralı 2: İlk 10 hanenin toplamı mod 10 = 11. hane
    const ilkOnToplam = haneler.slice(0, 10).reduce((a, b) => a + b, 0);
    if ((ilkOnToplam % 10) !== haneler[10]) {
        return { gecerli: false, hata: 'Geçersiz TC Kimlik No (son hane uyumsuz).' };
    }

    return { gecerli: true };
}

// ─────────────────────────────────────────────────────────────
// SGK İŞYERİ SİCİL NO DOĞRULAMA
// Format: 26 hane sayı (Yeni İşyeri Bildirgesi)
// ─────────────────────────────────────────────────────────────
function sgkSicilDogrula(sgk) {
    if (!sgk || !String(sgk).trim()) return { gecerli: true }; // Opsiyonel alan

    const temiz = String(sgk).replace(/[\s\-\.]/g, '');

    if (!/^\d+$/.test(temiz)) {
        return { gecerli: false, hata: 'SGK Sicil No sadece rakamlardan oluşmalıdır.' };
    }
    if (temiz.length < 20 || temiz.length > 26) {
        return { gecerli: false, hata: 'SGK Sicil No 20-26 hane arasında olmalıdır.' };
    }

    return { gecerli: true };
}

// ─────────────────────────────────────────────────────────────
// DETSİS NUMARASI DOĞRULAMA
// Format: 8 haneli rakam (Devlet Teşkilatı Sicil Sistemi)
// Sadece kamu kurumları için, OPSİYONEL alan
// ─────────────────────────────────────────────────────────────
function detsisNoDogrula(detsis) {
    if (!detsis || !String(detsis).trim()) return { gecerli: true }; // Opsiyonel

    const temiz = String(detsis).replace(/[\s\-\.]/g, '');

    if (!/^\d{8}$/.test(temiz)) {
        return { gecerli: false, hata: 'DETSİS No 8 haneli rakam olmalıdır.' };
    }

    return { gecerli: true };
}

// ─────────────────────────────────────────────────────────────
// VERGİ NO DOĞRULAMA (10 hane)
// ─────────────────────────────────────────────────────────────
function vergiNoDogrula(vno) {
    if (!vno || !String(vno).trim()) return { gecerli: true };

    if (!/^\d{10}$/.test(String(vno).trim())) {
        return { gecerli: false, hata: 'Vergi No 10 haneli rakam olmalıdır.' };
    }
    return { gecerli: true };
}

// ─────────────────────────────────────────────────────────────
// TELEFON DOĞRULAMA (Türkiye formatı)
// ─────────────────────────────────────────────────────────────
function telefonDogrula(tel) {
    if (!tel || !String(tel).trim()) return { gecerli: true };

    const temiz = String(tel).replace(/[\s\-\(\)]/g, '');

    // 0XXX-XXX-XXXX (10 hane, 0 ile başlar) veya +90XXX-XXX-XXXX
    if (!/^(\+90|0)?[5-9]\d{9}$/.test(temiz)) {
        return { gecerli: false, hata: 'Geçerli bir Türkiye telefon numarası giriniz.' };
    }
    return { gecerli: true };
}

// ─────────────────────────────────────────────────────────────
// E-POSTA DOĞRULAMA
// ─────────────────────────────────────────────────────────────
function epostaDogrula(mail) {
    if (!mail || !String(mail).trim()) return { gecerli: true };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(mail).trim())) {
        return { gecerli: false, hata: 'Geçerli bir e-posta adresi giriniz.' };
    }
    return { gecerli: true };
}

module.exports = {
    tcKimlikDogrula,
    sgkSicilDogrula,
    detsisNoDogrula,
    vergiNoDogrula,
    telefonDogrula,
    epostaDogrula,
};