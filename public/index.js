
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.giris-formu');
  const girisButonu = document.querySelector('.giris-butonu');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const eposta = document.getElementById('email').value.trim();
    const sifre = document.getElementById('password').value.trim();

    // Buton durumunu güncelle
    girisButonu.textContent = 'Giriş yapılıyor...';
    girisButonu.disabled = true;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eposta, sifre }),
      });

      const veri = await response.json();

      if (veri.basarili) {
        // Token'ı kaydet
        localStorage.setItem('token', veri.token);
        localStorage.setItem('kullanici', JSON.stringify(veri.kullanici));

        // Role göre yönlendir
        const rol = veri.kullanici.rol;

        if (rol === 'sistem_yoneticisi' || rol === 'isg_uzmani' || rol === 'isyeri_hekimi') {
          window.location.href = '/anasayfa';
        } else if (rol === 'isveren') {
          window.location.href = '/anasayfa';
        } else {
          window.location.href = '/anasayfa';
        }

      } else {
        hataGoster(veri.mesaj || 'Giriş başarısız.');
      }

    } catch (hata) {
      hataGoster('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
      console.error('Giriş hatası:', hata);
    } finally {
      girisButonu.textContent = 'GİRİŞ YAP';
      girisButonu.disabled = false;
    }
  });
});

// Hata mesajı göster
function hataGoster(mesaj) {
  // Varsa eski hata mesajını kaldır
  const eskiHata = document.querySelector('.hata-mesaji');
  if (eskiHata) eskiHata.remove();

  const hataDiv = document.createElement('div');
  hataDiv.className = 'hata-mesaji';
  hataDiv.style.cssText = `
    background: #fee2e2;
    color: #dc2626;
    padding: 10px 14px;
    border-radius: 6px;
    margin-top: 12px;
    font-size: 14px;
    text-align: center;
    border: 1px solid #fca5a5;
  `;
  hataDiv.textContent = mesaj;

  const form = document.querySelector('.giris-formu');
  form.appendChild(hataDiv);

  // 4 saniye sonra otomatik kaldır
  setTimeout(() => hataDiv.remove(), 4000);
}