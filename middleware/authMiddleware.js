// middleware/authMiddleware.js
const jwt        = require('jsonwebtoken');
const Kullanici  = require('../models/User');

/**
 * JWT doğrulama — her korumalı route'un başına ekle
 * Token Authorization header'dan (Bearer) veya cookie'den okunur
 */
const kimlikDogrula = async (req, res, next) => {
  try {
    let token;

    // 1) Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2) Cookie (isteğe bağlı — cookie-parser eklenirse)
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ basari: false, mesaj: 'Erişim yetkisi yok. Lütfen giriş yapın.' });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcının hâlâ var olup olmadığını kontrol et
    const kullanici = await Kullanici.findById(decoded.id).select('-sifre');
    if (!kullanici) {
      return res.status(401).json({ basari: false, mesaj: 'Bu hesap artık mevcut değil.' });
    }
    if (!kullanici.aktif) {
      return res.status(403).json({ basari: false, mesaj: 'Hesabınız devre dışı bırakılmış.' });
    }

    // Kullanıcıyı request'e ekle
    req.kullanici = kullanici;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ basari: false, mesaj: 'Oturum süresi doldu. Tekrar giriş yapın.' });
    }
    return res.status(401).json({ basari: false, mesaj: 'Geçersiz token.' });
  }
};

module.exports = kimlikDogrula;