// middleware/profilFotoUpload.js
// Multer ile profil fotoğrafı yükleme konfigürasyonu

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Profil fotoğrafları için dizin
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads', 'profil');

// Klasör yoksa oluştur
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log('✅ Profil fotoğrafı klasörü oluşturuldu:', UPLOAD_DIR);
}

// Dosyanın nereye ve hangi isimle kaydedileceğini belirle
const depolama = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Benzersiz dosya adı: user_<kullaniciId>_<timestamp>.<uzanti>
        // Her kullanıcının yalnızca tek aktif fotoğrafı olur, controller eskisini siler
        const uzanti = path.extname(file.originalname).toLowerCase();
        const kullaniciId = req.kullanici?._id || 'bilinmeyen';
        const zamanDamgasi = Date.now();
        cb(null, `user_${kullaniciId}_${zamanDamgasi}${uzanti}`);
    }
});

// Dosya türü kontrolü — sadece resim dosyaları
const dosyaFiltresi = (req, file, cb) => {
    const izinliTurler = /jpeg|jpg|png|webp/;
    const uzantiUygun  = izinliTurler.test(path.extname(file.originalname).toLowerCase());
    const mimeUygun    = izinliTurler.test(file.mimetype);

    if (uzantiUygun && mimeUygun) {
        return cb(null, true);
    }
    cb(new Error('Sadece JPG, JPEG, PNG veya WEBP formatındaki fotoğraflar yüklenebilir.'));
};

// Multer örneği
const profilFotoUpload = multer({
    storage:    depolama,
    fileFilter: dosyaFiltresi,
    limits: {
        fileSize: 2 * 1024 * 1024 // Max 2 MB
    }
});

module.exports = profilFotoUpload;