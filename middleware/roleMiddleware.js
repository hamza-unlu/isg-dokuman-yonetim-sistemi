// middleware/roleMiddleware.js

/**
 * Rol bazlı erişim kontrolü
 * Kullanım: rolIzinVer('sistem_yoneticisi', 'isg_uzmani')
 */
const rolIzinVer = (...izinliRoller) => {
  return (req, res, next) => {
    if (!req.kullanici) {
      return res.status(401).json({ basari: false, mesaj: 'Kimlik doğrulanmamış.' });
    }
    if (!izinliRoller.includes(req.kullanici.rol)) {
      return res.status(403).json({
        basari: false,
        mesaj: `Bu işlem için yetkiniz yok. Gerekli roller: ${izinliRoller.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = rolIzinVer;