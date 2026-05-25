// server.js — ÜNLÜ İSG Yönetim Sistemi
require('dotenv').config();

const express       = require('express');
const mongoose      = require('mongoose');
const path          = require('path');
const cors          = require('cors'); // CORS hatasını önlemek için 
const swaggerUi     = require('swagger-ui-express');
const swaggerJsDoc  = require('swagger-jsdoc');

// Route importları
const authRouter     = require('./routes/authRoutes');
const apiRouter      = require('./routes/api');
const firmaRouter    = require('./routes/firmaRoutes');
const personelRouter = require('./routes/personelRoutes');
const dokumanRouter  = require('./routes/dokumanRoutes');
const egitimRouter   = require('./routes/egitimRoutes');
const naceRouter     = require('./routes/naceRoutes'); 
const mevzuatRouter  = require('./routes/mevzuatRoutes'); 
const mevzuatTakipRoutes = require('./routes/mevzuatTakipRoutes');
const egitimTuruRouter = require('./routes/egitimTuruRoutes');
const aiRoutes = require('./routes/aiRoutes');

// SMTP bağlantı testi (isteğe bağlı, başlangıçta ayarların doğruluğunu kontrol eder)
const { baglantiTest } = require('./utils/emailGonder');

const app = express();

// ─────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────
app.use(cors({origin: '*',credentials: true}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Statik Dosyalar
app.use(express.static(path.join(__dirname, 'public')));

/** * ÖNEMLİ: Dosyaların (PDF/Görsel) tarayıcıda görünebilmesi için 
 * yükleme klasörünü dışarı açıyoruz. Konsoldaki 404 hatasını çözer.
 */
app.use('/api/veri/isg_dosyalar', express.static(path.join(__dirname, 'isg_dosyalar')));

// Her bir doküman kategorisi için klasörleri dışarı açıyoruz
app.use('/api/veri/olcum_ekipman_verileri', express.static(path.join(__dirname, 'isg_dosyalar/olcum')));
app.use('/api/veri/temsilci_verileri',      express.static(path.join(__dirname, 'isg_dosyalar/temsilci')));
app.use('/api/veri/destek_verileri',        express.static(path.join(__dirname, 'isg_dosyalar/destek')));
app.use('/api/veri/muayene_verileri',       express.static(path.join(__dirname, 'isg_dosyalar/muayene')));
app.use('/api/veri/egitim_verileri',        express.static(path.join(__dirname, 'isg_dosyalar/egitim')));
app.use('/api/veri/ilkyardim_verileri',     express.static(path.join(__dirname, 'isg_dosyalar/ilkyardim')));

// ─────────────────────────────────────────
// VIEW ENGINE (EJS)
// ─────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─────────────────────────────────────────
// SWAGGER (OPENAPI) KONFİGÜRASYONU
// ─────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ÜNLÜ İSG Yönetim Sistemi API',
      version: '1.0.0',
      description: 'Yapay Zeka Destekli İSG Doküman Yönetim Sistemi REST API Dokümantasyonu',
      contact: {
        name: "İSG Geliştirici Ekibi"
      }
    },
    servers: [
      { 
        url: `http://localhost:${process.env.PORT || 5500}`, 
        description: 'Geliştirme Sunucusu' 
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: "Giriş yaptıktan sonra aldığınız Token'ı buraya yapıştırın."
        }
      }
    },
    // Tüm endpoint'lerin yanında kilit simgesi çıkması için global güvenlik
    security: [{ bearerAuth: [] }],
  },
  // Dokümantasyonun okunacağı dosyalar
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'ÜNLÜ İSG API Docs',
  swaggerOptions: {
    persistAuthorization: true, // Sayfa yenilense de Token'ı hafızada tutar
  }
}));

// ─────────────────────────────────────────
// MONGODB BAĞLANTISI
// ─────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/isg_veritabani';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB bağlantısı kuruldu → isg_veritabani');
    // MongoDB bağlandıktan sonra SMTP'yi de test et
    baglantiTest();
  })
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  });

// ─────────────────────────────────────────
// API ROTALARI
// ─────────────────────────────────────────
app.use('/api/auth',        authRouter);
app.use('/api/firmalar',    firmaRouter);
app.use('/api/personel',    personelRouter);
app.use('/api/dokumanlar',  dokumanRouter);
app.use('/api/egitimler',   egitimRouter);
app.use('/api/egitim-turleri', egitimTuruRouter);
app.use('/api/nace',        naceRouter);
app.use('/api/mevzuat',     mevzuatRouter);
app.use('/api/mevzuat-takip', mevzuatTakipRoutes);
app.use('/api/ai',          aiRoutes); 
app.use('/api',             apiRouter);


// ─────────────────────────────────────────
// SAYFA ROTALARI (EJS)
// ─────────────────────────────────────────

// Giriş sayfası (breadcrumb yok)
app.get('/', (req, res) => res.render('index'));
// Kayıt sayfası (breadcrumb yok, açık erişim)
app.get('/kayit', (req, res) => res.render('kayit'));

// Anasayfa
app.get('/anasayfa', (req, res) => {
    res.render('anasayfa', {
        baslik: 'Anasayfa',
        yol: [
            { ad: 'Anasayfa' }
        ]
    });
});

// Firmalar
app.get('/firmalar', (req, res) => {
    res.render('firmalar', {
        baslik: 'Firma Listesi',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'Firmalar', link: '/firmalar' },
            { ad: 'Tüm Firmalar' }
        ]
    });
});

// Personel
app.get('/personel', (req, res) => {
    res.render('personel', {
        baslik: 'Personel Yönetimi',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'Personel' }
        ]
    });
});

// Eğitimler
app.get('/egitimler', (req, res) => {
    res.render('egitimler', {
        baslik: 'Eğitim Takibi',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'Eğitimler' }
        ]
    });
});

// Dokümanlar
app.get('/dokumanlar', (req, res) => {
    res.render('dokumanlar', {
        baslik: 'Doküman Yönetimi',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'Dokümanlar' }
        ]
    });
});

// Raporlar
app.get('/raporlar', (req, res) => {
    res.render('raporlar', {
        baslik: 'Raporlar',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'Raporlar' }
        ]
    });
});

// Kullanıcılar
app.get('/kullanicilar', (req, res) => {
    res.render('kullanicilar', {
        baslik: 'Kullanıcı Yönetimi',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'Kullanıcılar' }
        ]
    });
});

// NACE Kodu Yönetimi (sadece sistem_yoneticisi)
app.get('/nace-yonetimi', (req, res) => {
    res.render('nace-yonetimi', {
        baslik: 'NACE Kodu Yönetimi',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'NACE Kodları' }
        ]
    });
});

// Mevzuat Yönetimi (sadece sistem_yoneticisi)
app.get('/mevzuat-yonetimi', (req, res) => {
    res.render('mevzuat-yonetimi', {
        baslik: 'Mevzuat Yönetimi',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'Mevzuat Kuralları' }
        ]
    });
});

// Mevzuat Otomatik Takip Sayfası
app.get('/mevzuat-takip', (req, res) => {
    res.render('mevzuat-takip', {
        baslik: 'Mevzuat Otomatik Takip',
        yol: [
            { ad: 'Anasayfa', link: '/anasayfa' },
            { ad: 'Mevzuat Takip' }
        ]
    });
});

// Şifre sıfırlama sayfası — e-postayla gelen bağlantıdan açılır
app.get('/sifre-sifirla/:token', (req, res) => {
  res.render('sifre-sifirla', { token: req.params.token });
});

// ─────────────────────────────────────────
// HATA YÖNETİMİ
// ─────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ basari: false, mesaj: 'API Endpoint bulunamadı.' });
  }
  res.status(404).render('index');
});

app.use((err, req, res, next) => {
  console.error('🔴 Sunucu hatası:', err.stack);
  res.status(err.status || 500).json({
    basari: false,
    mesaj: 'Sunucu hatası oluştu',
    detay: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});



// ─────────────────────────────────────────
// BAŞLATMA
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5500;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`📄 Swagger UI  → http://localhost:${PORT}/api-docs`);
});

// ─── Mevzuat Otomatik Takip Sistemi ──────────────────────────────────
const mevzuatScheduler = require('./services/mevzuatScheduler');
mevzuatScheduler.baslat();