// tests/authController.test.js
// Unit testler — gerçek DB bağlantısı yok, tüm modeller mock'lanır.

process.env.JWT_SECRET     = 'test_gizli_anahtar';
process.env.NODE_ENV       = 'test';
process.env.OPENAI_API_KEY = 'test-key';
process.env.GEMINI_API_KEY = 'test-key';
process.env.EMAIL_USER     = 'test@example.com';
process.env.EMAIL_PASS     = 'test-pass';
process.env.SMTP_HOST      = 'smtp.example.com';

jest.mock('../models/User');
jest.mock('../utils/emailGonder', () => ({
  emailGonder: jest.fn().mockResolvedValue(true),
  sifreSifirlamaSablonu: jest.fn().mockReturnValue('<html></html>'),
}));

const Kullanici = require('../models/User');
const {
  kayitOl,
  girisYap,
  mevcutKullanici,
  kullaniciEkle,
  rolGuncelle,
  kullaniciSil,
  kullanicilariListele,
} = require('../controllers/authController');

beforeEach(() => jest.clearAllMocks());

// ─── Yardımcılar ─────────────────────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────────────────────────────────────
// kayitOl
// ─────────────────────────────────────────────────────────────────────────────
describe('kayitOl()', () => {
  test('eksik alan gelince 400 döner', async () => {
    const req = { body: { eposta: 'test@test.com' } }; // sifre yok
    const res = mockRes();
    await kayitOl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('kısa şifre gelince 400 döner', async () => {
    const req = { body: { adSoyad: 'Ali', eposta: 'ali@a.com', sifre: '123' } };
    const res = mockRes();
    await kayitOl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('eşleşmeyen şifreler 400 döner', async () => {
    const req = {
      body: { adSoyad: 'Ali', eposta: 'ali@a.com', sifre: '123456', sifreTekrar: '654321' },
    };
    const res = mockRes();
    await kayitOl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('kayıtlı eposta 400 döner', async () => {
    Kullanici.findOne = jest.fn().mockResolvedValue({ _id: 'mevcut' });
    const req = {
      body: { adSoyad: 'Ali', eposta: 'ali@a.com', sifre: 'secret123' },
    };
    const res = mockRes();
    await kayitOl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('başarılı kayıt → 201 + token döner', async () => {
    Kullanici.findOne = jest.fn().mockResolvedValue(null);
    Kullanici.create = jest.fn().mockResolvedValue({
      _id: 'u1',
      adSoyad: 'Ali Veli',
      eposta: 'ali@a.com',
      rol: 'isg_uzmani',
      isverenFirma: null,
      profilFoto: null,
    });

    const req = {
      body: { adSoyad: 'Ali Veli', eposta: 'Ali@A.com', sifre: 'secret123', rol: 'isg_uzmani' },
    };
    const res = mockRes();
    await kayitOl(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });

  test('yasaklı rol (sistem_yoneticisi) → varsayılan isg_uzmani atanır', async () => {
    Kullanici.findOne = jest.fn().mockResolvedValue(null);
    let olusturulanRol;
    Kullanici.create = jest.fn().mockImplementation(async (data) => {
      olusturulanRol = data.rol;
      return { _id: 'u2', adSoyad: 'Test', eposta: 'test@a.com', rol: data.rol, isverenFirma: null };
    });

    const req = {
      body: { adSoyad: 'Test', eposta: 'test@a.com', sifre: 'secret123', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await kayitOl(req, res);
    expect(olusturulanRol).toBe('isg_uzmani');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// girisYap
// ─────────────────────────────────────────────────────────────────────────────
describe('girisYap()', () => {
  test('eksik alan 400 döner', async () => {
    const req = { body: { eposta: 'a@a.com' } };
    const res = mockRes();
    await girisYap(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('kullanıcı bulunamazsa 401 döner', async () => {
    Kullanici.findOne = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const req = { body: { eposta: 'yok@a.com', sifre: '123456' } };
    const res = mockRes();
    await girisYap(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('yanlış şifre 401 döner', async () => {
    const mockUser = {
      sifreKontrol: jest.fn().mockResolvedValue(false),
      aktif: true,
    };
    Kullanici.findOne = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    const req = { body: { eposta: 'a@a.com', sifre: 'yanlis' } };
    const res = mockRes();
    await girisYap(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('pasif kullanıcı 401 döner', async () => {
    const mockUser = {
      sifreKontrol: jest.fn().mockResolvedValue(true),
      aktif: false,
    };
    Kullanici.findOne = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    const req = { body: { eposta: 'a@a.com', sifre: 'dogru' } };
    const res = mockRes();
    await girisYap(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('başarılı giriş → 200 + token', async () => {
    const mockUser = {
      _id: 'u1',
      adSoyad: 'Ali',
      eposta: 'ali@a.com',
      rol: 'isg_uzmani',
      isverenFirma: null,
      profilFoto: null,
      aktif: true,
      sifreKontrol: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };
    Kullanici.findOne = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    const req = { body: { eposta: 'Ali@A.com', sifre: 'dogru' } };
    const res = mockRes();
    await girisYap(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true, token: expect.any(String) }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// mevcutKullanici
// ─────────────────────────────────────────────────────────────────────────────
describe('mevcutKullanici()', () => {
  test('req.kullanici bilgisini döner', async () => {
    const req = { kullanici: { _id: 'u1', rol: 'isg_uzmani' } };
    const res = mockRes();
    await mevcutKullanici(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// kullaniciEkle
// ─────────────────────────────────────────────────────────────────────────────
describe('kullaniciEkle()', () => {
  test('eksik alan 400 döner', async () => {
    const req = { body: { eposta: 'a@a.com' } };
    const res = mockRes();
    await kullaniciEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('mevcut eposta 400 döner', async () => {
    Kullanici.findOne = jest.fn().mockResolvedValue({ _id: 'm1' });
    const req = { body: { adSoyad: 'Ali', eposta: 'ali@a.com', sifre: '123456' } };
    const res = mockRes();
    await kullaniciEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('başarılı kullanıcı ekleme → 201', async () => {
    Kullanici.findOne = jest.fn().mockResolvedValue(null);
    Kullanici.create = jest.fn().mockResolvedValue({ _id: 'u3', adSoyad: 'Yeni', eposta: 'yeni@a.com' });
    const req = { body: { adSoyad: 'Yeni', eposta: 'yeni@a.com', sifre: '123456', rol: 'isg_uzmani' } };
    const res = mockRes();
    await kullaniciEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// rolGuncelle
// ─────────────────────────────────────────────────────────────────────────────
describe('rolGuncelle()', () => {
  test('geçersiz rol 400 döner', async () => {
    const req = { params: { id: 'u2' }, body: { rol: 'sahte_rol' }, kullanici: { _id: 'u1' } };
    const res = mockRes();
    await rolGuncelle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('kendi rolünü değiştirme girişimi 400 döner', async () => {
    const req = { params: { id: 'u1' }, body: { rol: 'isveren' }, kullanici: { _id: 'u1' } };
    const res = mockRes();
    await rolGuncelle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('başarılı rol güncelleme → 200', async () => {
    Kullanici.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    const req = { params: { id: 'u2' }, body: { rol: 'isveren' }, kullanici: { _id: 'u1' } };
    const res = mockRes();
    await rolGuncelle(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// kullaniciSil
// ─────────────────────────────────────────────────────────────────────────────
describe('kullaniciSil()', () => {
  test('kendi hesabını silme girişimi 400 döner', async () => {
    const req = { params: { id: 'u1' }, kullanici: { _id: 'u1' } };
    const res = mockRes();
    await kullaniciSil(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('bulunamayan kullanıcı 404 döner', async () => {
    Kullanici.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 'u99' }, kullanici: { _id: 'u1' } };
    const res = mockRes();
    await kullaniciSil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('başarılı silme → 200', async () => {
    Kullanici.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'u2' });
    const req = { params: { id: 'u2' }, kullanici: { _id: 'u1' } };
    const res = mockRes();
    await kullaniciSil(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// kullanicilariListele
// ─────────────────────────────────────────────────────────────────────────────
describe('kullanicilariListele()', () => {
  test('kullanıcı listesini döner', async () => {
    Kullanici.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ adSoyad: 'Ali' }]),
    });
    const req = {};
    const res = mockRes();
    await kullanicilariListele(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ adSoyad: 'Ali' })]));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// sifreDegistir
// ─────────────────────────────────────────────────────────────────────────────
const { sifreDegistir } = require('../controllers/authController');

describe('sifreDegistir()', () => {
  test('eksik alan 400 doner', async () => {
    const req = { body: { mevcutSifre: '123456' }, kullanici: { _id: 'u1' } };
    const res = mockRes();
    await sifreDegistir(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('yeni sifreler eslesmiyorsa 400 doner', async () => {
    const req = {
      body: { mevcutSifre: 'eskisi', yeniSifre: 'yeni123', yeniSifreTekrar: 'farkli' },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await sifreDegistir(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('kisa yeni sifre 400 doner', async () => {
    const req = {
      body: { mevcutSifre: 'eskisi', yeniSifre: '123', yeniSifreTekrar: '123' },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await sifreDegistir(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('mevcut sifre ile ayni yeni sifre 400 doner', async () => {
    const req = {
      body: { mevcutSifre: 'ayniSifre1', yeniSifre: 'ayniSifre1', yeniSifreTekrar: 'ayniSifre1' },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await sifreDegistir(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('yanlis mevcut sifre 401 doner', async () => {
    const mockUser = { sifreKontrol: jest.fn().mockResolvedValue(false) };
    Kullanici.findById = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    const req = {
      body: { mevcutSifre: 'yanlis', yeniSifre: 'yeniSifre1', yeniSifreTekrar: 'yeniSifre1' },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await sifreDegistir(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('basarili sifre degisimi 200 doner', async () => {
    const mockUser = {
      sifreKontrol: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
      sifre: 'eski',
    };
    Kullanici.findById = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    const req = {
      body: { mevcutSifre: 'eskiSifre1', yeniSifre: 'yeniSifre1', yeniSifreTekrar: 'yeniSifre1' },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await sifreDegistir(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
