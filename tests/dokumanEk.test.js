// tests/dokumanEk.test.js
// Dokumancontroller'in kapsamı dışında kalan fonksiyonları test eder:
// mobilBelgeSil, mobilBelgeIcerik, uzmanGetir, uzmanKaydet, dokumanMailGonder
process.env.JWT_SECRET     = 'test_gizli_anahtar';
process.env.NODE_ENV       = 'test';
process.env.OPENAI_API_KEY = 'test-key';
process.env.GEMINI_API_KEY = 'test-key';
process.env.EMAIL_USER     = 'test@example.com';
process.env.EMAIL_PASS     = 'test-pass';
process.env.SMTP_HOST      = 'smtp.example.com';

jest.mock('../models/Dokuman');
jest.mock('../models/User');
jest.mock('../models/Firma');
jest.mock('../models/VeriDepo');
jest.mock('../models/Egitim');
jest.mock('../utils/emailGonder', () => ({
  emailGonder: jest.fn().mockResolvedValue(true),
}));

const Firma    = require('../models/Firma');
const VeriDepo = require('../models/VeriDepo');
const Dokuman  = require('../models/Dokuman');

const {
  mobilBelgeSil,
  mobilBelgeIcerik,
  uzmanGetir,
  uzmanKaydet,
  dokumanMailGonder,
} = require('../controllers/dokumanController');

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ─── mobilBelgeSil ───────────────────────────────────────────────────────────
describe('mobilBelgeSil()', () => {
  test('eksik veri gelince 400 doner', async () => {
    const req = { body: { firmaId: 'f1' }, kullanici: { _id: 'u1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await mobilBelgeSil(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('firma bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = {
      body: { firmaId: 'f1', kategori: 'rv', belgeId: 'b1' },
      kullanici: { _id: 'u1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeSil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('yetkisiz kullanici 403 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test Firma', ekleyenKullanici: 'baska' }),
    });
    const req = {
      body: { firmaId: 'f1', kategori: 'rv', belgeId: 'b1' },
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
    };
    const res = mockRes();
    await mobilBelgeSil(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('veriDepo yoksa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test Firma', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockResolvedValue(null);
    const req = {
      body: { firmaId: 'f1', kategori: 'rv', belgeId: 'b1' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeSil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('belge bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test Firma', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockResolvedValue({ deger: { rv: [] }, markModified: jest.fn(), save: jest.fn() });
    const req = {
      body: { firmaId: 'f1', kategori: 'rv', belgeId: 'b_yok' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeSil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('basarili silme 200 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test Firma', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockResolvedValue({
      deger: { rv: [{ _id: 'b1', ad: 'Belge' }] },
      markModified: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    });
    const req = {
      body: { firmaId: 'f1', kategori: 'rv', belgeId: 'b1' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeSil(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basari: true }));
  });
});

// ─── mobilBelgeIcerik ────────────────────────────────────────────────────────
describe('mobilBelgeIcerik()', () => {
  test('firma bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = {
      params: { firmaId: 'f_yok', kategori: 'rv', belgeAdi: 'test.pdf' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeIcerik(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('yetkisiz kullanici 403 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'baska' }),
    });
    const req = {
      params: { firmaId: 'f1', kategori: 'rv', belgeAdi: 'test.pdf' },
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
    };
    const res = mockRes();
    await mobilBelgeIcerik(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('rv kategorisinde belge bulunursa doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        deger: { rv: [{ ad: 'test.pdf', dataUrl: 'data:pdf', tur: 'PDF' }] },
      }),
    });
    const req = {
      params: { firmaId: 'f1', kategori: 'rv', belgeAdi: 'test.pdf' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeIcerik(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basari: true }));
  });

  test('rv kategorisinde belge bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ deger: { rv: [] } }),
    });
    const req = {
      params: { firmaId: 'f1', kategori: 'rv', belgeAdi: 'yok.pdf' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeIcerik(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('desteklenmeyen kategori 400 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'admin1' }),
    });
    const req = {
      params: { firmaId: 'f1', kategori: 'desteksiz_kat', belgeAdi: 'test.pdf' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeIcerik(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ─── uzmanGetir ──────────────────────────────────────────────────────────────
describe('uzmanGetir()', () => {
  test('uzman verileri doner', async () => {
    Firma.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ uzmanVerileri: { igu: 'Ali' } }),
    });
    const req = { params: { firmaId: encodeURIComponent('Test Firma') } };
    const res = mockRes();
    await uzmanGetir(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ igu: 'Ali' }));
  });

  test('firma yoksa bos obje doner', async () => {
    Firma.findOne = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    const req = { params: { firmaId: encodeURIComponent('Yok Firma') } };
    const res = mockRes();
    await uzmanGetir(req, res);
    expect(res.json).toHaveBeenCalledWith({});
  });
});

// ─── uzmanKaydet ─────────────────────────────────────────────────────────────
describe('uzmanKaydet()', () => {
  test('uzman verileri kaydedilir', async () => {
    Firma.findOneAndUpdate = jest.fn().mockResolvedValue({ firmaAdi: 'Test', uzmanVerileri: {} });
    const req = {
      params: { firmaId: encodeURIComponent('Test Firma') },
      body: { igu: 'Ali', hekim: 'Veli', dsp: 'Ayse' },
    };
    const res = mockRes();
    await uzmanKaydet(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });

  test('DB hatasi 500 doner', async () => {
    Firma.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('DB hatasi'));
    const req = {
      params: { firmaId: encodeURIComponent('Test Firma') },
      body: {},
    };
    const res = mockRes();
    await uzmanKaydet(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── dokumanMailGonder ───────────────────────────────────────────────────────
describe('dokumanMailGonder()', () => {
  test('firma bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = {
      body: { firmaId: 'f_yok', dokumanIdleri: [] },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await dokumanMailGonder(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('firma epostasi yoksa 400 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', eposta: null, email: null }),
    });
    const req = {
      body: { firmaId: 'f1', dokumanIdleri: [] },
      kullanici: { _id: 'admin1' },
    };
    const res = mockRes();
    await dokumanMailGonder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('basarili mail gonderimi', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', eposta: 'test@firma.com' }),
    });
    Dokuman.find = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });
    const req = {
      body: { firmaId: 'f1', dokumanIdleri: [], hazirlanmaTarihi: '2026-01-01', sonGecerlilikTarihi: '2027-01-01' },
      kullanici: { _id: 'admin1' },
    };
    const res = mockRes();
    await dokumanMailGonder(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basari: true }));
  });
});

// ─── mobilAnasayfaVerileri ───────────────────────────────────────────────────
const { mobilAnasayfaVerileri, mobilFirmaDetay, mobilKategoriBelgeleri,
        mobilBelgeGuncelle, mobilBelgeYeniSurum, mobilBelgeEkle } = require('../controllers/dokumanController');

describe('mobilAnasayfaVerileri()', () => {
  test('izleyici rolu erken donus yapar (bos liste)', async () => {
    const req = { kullanici: { _id: 'u1', rol: 'izleyici' } };
    const res = mockRes();
    await mobilAnasayfaVerileri(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true, kritik: [], uyari: [] })
    );
  });

  test('sistem_yoneticisi firmalar icin veri doner', async () => {
    const Egitim = require('../models/Egitim');
    Firma.find = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) });
    Egitim.find = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue([]) });
    const req = { kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await mobilAnasayfaVerileri(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basari: true }));
  });
});

describe('mobilFirmaDetay()', () => {
  test('firma bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = { params: { firmaId: 'f_yok' }, kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await mobilFirmaDetay(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('yetkisiz kullanici 403 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'baska' }),
    });
    const req = { params: { firmaId: 'f1' }, kullanici: { _id: 'uzman1', rol: 'isg_uzmani' } };
    const res = mockRes();
    await mobilFirmaDetay(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('mobilKategoriBelgeleri()', () => {
  test('firma bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = { params: { firmaId: 'f_yok', kategori: 'rv' }, kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await mobilKategoriBelgeleri(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('yetkisiz kullanici 403 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'baska' }),
    });
    const req = { params: { firmaId: 'f1', kategori: 'rv' }, kullanici: { _id: 'uzman1', rol: 'isg_uzmani' } };
    const res = mockRes();
    await mobilKategoriBelgeleri(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('rv kategorisi bos liste doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = { params: { firmaId: 'f1', kategori: 'rv' }, kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await mobilKategoriBelgeleri(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basari: true }));
  });
});

describe('mobilBelgeGuncelle()', () => {
  test('eksik veri 400 doner', async () => {
    const req = { body: { firmaId: 'f1' }, kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await mobilBelgeGuncelle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('firma bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = {
      body: { firmaId: 'f_yok', kategori: 'rv', belgeId: 'b1' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeGuncelle(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('basarili guncelleme 200 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockResolvedValue({
      deger: { rv: [{ _id: 'b1', ad: 'Belge', belgeTarihi: '2026-01-01' }] },
      markModified: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    });
    const req = {
      body: { firmaId: 'f1', kategori: 'rv', belgeId: 'b1', belgeTarihi: '2026-06-01' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeGuncelle(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basari: true }));
  });
});

describe('mobilBelgeYeniSurum()', () => {
  test('eksik veri 400 doner', async () => {
    const req = { body: { firmaId: 'f1' }, kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await mobilBelgeYeniSurum(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('firma bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = {
      body: { firmaId: 'f_yok', kategori: 'rv', eskiBelgeId: 'b1', dosyaAdi: 'yeni.pdf', dataUrl: 'data:pdf' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeYeniSurum(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('basarili yeni surum ekleme 200 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockResolvedValue({
      deger: { rv: [{ _id: 'b1', ad: 'Eski.pdf' }] },
      markModified: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    });
    const req = {
      body: {
        firmaId: 'f1', kategori: 'rv', eskiBelgeId: 'b1',
        dosyaAdi: 'Yeni.pdf', dosyaBoyut: 1000, dosyaTur: 'PDF',
        belgeTarihi: '2026-01-01', dataUrl: 'data:application/pdf;base64,abc',
      },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi', adSoyad: 'Admin' },
    };
    const res = mockRes();
    await mobilBelgeYeniSurum(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basari: true }));
  });
});

describe('mobilBelgeEkle()', () => {
  test('eksik veri 400 doner', async () => {
    const req = { body: { firmaId: 'f1' }, kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await mobilBelgeEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('gecersiz kategori 400 doner', async () => {
    const req = {
      body: { firmaId: 'f1', kategori: 'gecersiz', dosyaAdi: 'test.pdf', dataUrl: 'data:pdf' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('firma bulunamazsa 404 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = {
      body: { firmaId: 'f_yok', kategori: 'rv', dosyaAdi: 'test.pdf', dataUrl: 'data:pdf' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await mobilBelgeEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('basarili belge ekleme 201 doner', async () => {
    Firma.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'f1', firmaAdi: 'Test', ekleyenKullanici: 'admin1' }),
    });
    VeriDepo.findOne = jest.fn().mockResolvedValue({
      deger: { rv: [] },
      markModified: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    });
    const req = {
      body: {
        firmaId: 'f1', kategori: 'rv',
        dosyaAdi: 'Risk.pdf', dosyaBoyut: 500, dosyaTur: 'PDF',
        belgeTarihi: '2026-01-01', gecerlilikTarihi: '2027-01-01',
        dataUrl: 'data:application/pdf;base64,abc',
      },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi', adSoyad: 'Admin' },
    };
    const res = mockRes();
    await mobilBelgeEkle(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basari: true }));
  });
});
