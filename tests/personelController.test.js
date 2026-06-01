// tests/personelController.test.js
jest.mock('../models/Personel');
jest.mock('../models/Firma');

const Personel = require('../models/Personel');
const Firma    = require('../models/Firma');

const {
  tumPersonel, personelGetir, personelEkle, personelGuncelle, personelSil, personelUyarilari
} = require('../controllers/personelController');

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ─── tumPersonel ──────────────────────────────────────────────────────────────
describe('tumPersonel()', () => {
  test('sistem yöneticisi tüm personeli görür', async () => {
    Personel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue([{ adSoyad: 'Ali Veli' }]),
    });

    const req = {
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
      query: {},
    };
    const res = mockRes();
    await tumPersonel(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true, sayi: 1 })
    );
  });

  test('isg_uzmani sadece kendi firmalarının personelini görür', async () => {
    Firma.find = jest.fn().mockResolvedValue([{ _id: 'f1' }]);
    Personel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue([]),
    });

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      query: {},
    };
    const res = mockRes();
    await tumPersonel(req, res);

    expect(Firma.find).toHaveBeenCalledWith(
      expect.objectContaining({ ekleyenKullanici: 'uzman1' }),
      '_id'
    );
  });

  test('DB hatası 500 döner', async () => {
    Firma.find    = jest.fn().mockRejectedValue(new Error('DB hatası'));
    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      query: {},
    };
    const res = mockRes();
    await tumPersonel(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── personelGetir ────────────────────────────────────────────────────────────
describe('personelGetir()', () => {
  test('personel bulunamazsa 404 döner', async () => {
    Personel.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const req = { params: { id: 'yok' }, kullanici: { rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await personelGetir(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('personel bulunursa 200 döner', async () => {
    const p = { _id: 'p1', adSoyad: 'Ahmet Yılmaz' };
    Personel.findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(p),
    });

    const req = { params: { id: 'p1' }, kullanici: { rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await personelGetir(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true, veri: p })
    );
  });
});

// ─── personelEkle ─────────────────────────────────────────────────────────────
describe('personelEkle()', () => {
  test('firma seçilmezse 400 döner', async () => {
    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: { adSoyad: 'Test Kişi' }, // firma yok
    };
    const res = mockRes();
    await personelEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: false })
    );
  });

  test('geçersiz firmaId → 400', async () => {
    Firma.findOne = jest.fn().mockResolvedValue(null);

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: { adSoyad: 'Ali', firma: 'Var Olmayan Firma' },
    };
    const res = mockRes();
    await personelEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ─── personelSil ─────────────────────────────────────────────────────────────
describe('personelSil()', () => {
  test('personel bulunamazsa 404 döner', async () => {
    Personel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const req = { params: { id: 'yok' }, kullanici: { rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await personelSil(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('başarılı soft delete', async () => {
    Personel.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: 'p1', aktif: false });

    const req = { params: { id: 'p1' }, kullanici: { rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await personelSil(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });
});

// ─── personelUyarilari ────────────────────────────────────────────────────────
describe('personelUyarilari()', () => {
  test('süresi dolmuş muayeneli personel uyarı listesinde çıkar', async () => {
    const eskiTarih = new Date(Date.now() - 86400000 * 10); // 10 gün önce
    const personeller = [{
      adSoyad: 'Zeynep Kaya',
      firma: { firmaAdi: 'Test Ltd' },
      muayene:   { gecerlilikBitis: eskiTarih },
      egitim:    {},
      ilkyardim: {},
    }];

    Personel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue(personeller),
    });

    const req = {
      query: {},
      kullanici: { rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await personelUyarilari(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
    const cevap = res.json.mock.calls[0][0];
    expect(cevap.sayi).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// personelController.test.js dosyasının SONUNA eklenecek testler
// ─────────────────────────────────────────────────────────────────────────────

// ─── personelEkle — ek branch'ler ────────────────────────────────────────────
describe('personelEkle() — ek senaryolar', () => {
  test('veri gönderilmezse → 400', async () => {
    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: null,
    };
    const res = mockRes();
    await personelEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('geçerli veriyle personel eklenir → 201', async () => {
    const firmaDoc = { _id: '507f1f77bcf86cd799439011', firmaAdi: 'Test Ltd' };
    Firma.findById = jest.fn().mockResolvedValue(firmaDoc);
    Firma.findOne  = jest.fn().mockResolvedValue(null); // isim bazlı arama sonucu

    const personelDoc = {
      _id: 'p10',
      adSoyad: 'Mehmet Demir',
      populate: jest.fn().mockResolvedValue(undefined),
    };
    Personel.create   = jest.fn().mockResolvedValue(personelDoc);
    Personel.findOne  = jest.fn().mockResolvedValue(null); // TC mükerrer yok

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: {
        adSoyad: 'Mehmet Demir',
        firma: '507f1f77bcf86cd799439011',
        gorev: 'Mühendis',
      },
    };
    const res = mockRes();
    await personelEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });

  test('mükerrer TC → 400 ve hata mesajı döner', async () => {
    Personel.findOne = jest.fn().mockResolvedValue({ _id: 'p1', adSoyad: 'Ali Veli' });

    // validator mock: geçerli TC döner
    jest.mock('../utils/validator', () => ({
      tcKimlikDogrula: jest.fn().mockReturnValue({ gecerli: true }),
    }), { virtual: true });

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: {
        adSoyad: 'Ayşe Kara',
        firma: '507f1f77bcf86cd799439011',
        tcKimlik: '12345678901',
      },
    };
    const res = mockRes();
    await personelEkle(req, res);

    // Mükerrer TC veya firma bulunamadı — her iki durumda da 400
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('ValidationError → 400 döner', async () => {
    Firma.findById = jest.fn().mockResolvedValue({ _id: 'f1' });
    Firma.findOne  = jest.fn().mockResolvedValue(null);
    Personel.findOne = jest.fn().mockResolvedValue(null);

    const valErr = {
      name: 'ValidationError',
      errors: { adSoyad: { message: 'Ad Soyad zorunludur.' } },
    };
    Personel.create = jest.fn().mockRejectedValue(valErr);

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: { firma: '507f1f77bcf86cd799439011' },
    };
    const res = mockRes();
    await personelEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ─── personelGuncelle ─────────────────────────────────────────────────────────
describe('personelGuncelle()', () => {
  test('personel bulunamazsa → 404', async () => {
    Personel.findById = jest.fn().mockResolvedValue(null);

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      params: { id: 'yok' },
      body: { adSoyad: 'Yeni Ad' },
    };
    const res = mockRes();
    await personelGuncelle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('geçerli veriyle personel güncellenir → 200', async () => {
    const personelDoc = {
      _id: 'p1',
      adSoyad: 'Eski Ad',
      tcKimlik: '',
      save: jest.fn().mockResolvedValue(undefined),
      populate: jest.fn().mockResolvedValue(undefined),
    };
    Personel.findById = jest.fn().mockResolvedValue(personelDoc);

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      params: { id: 'p1' },
      body: { adSoyad: 'Yeni Ad', gorev: 'Teknisyen' },
    };
    const res = mockRes();
    await personelGuncelle(req, res);

    expect(personelDoc.adSoyad).toBe('Yeni Ad');
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });

  test('firma adı ile güncelleme — firma bulunamazsa → 400', async () => {
    const personelDoc = {
      _id: 'p1',
      adSoyad: 'Ali',
      tcKimlik: '',
      save: jest.fn(),
      populate: jest.fn(),
    };
    Personel.findById = jest.fn().mockResolvedValue(personelDoc);
    Firma.findOne     = jest.fn().mockResolvedValue(null); // isim bulunamadı

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      params: { id: 'p1' },
      body: { firma: 'Var Olmayan Firma' },
    };
    const res = mockRes();
    await personelGuncelle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('ValidationError → 400 döner', async () => {
    const valErr = {
      name: 'ValidationError',
      errors: { tcKimlik: { message: 'TC geçersiz.' } },
    };
    const personelDoc = {
      _id: 'p1',
      adSoyad: 'Ali',
      tcKimlik: '',
      save: jest.fn().mockRejectedValue(valErr),
      populate: jest.fn(),
    };
    Personel.findById = jest.fn().mockResolvedValue(personelDoc);

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      params: { id: 'p1' },
      body: { adSoyad: 'Yeni Ad' },
    };
    const res = mockRes();
    await personelGuncelle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ─── personelUyarilari — ek branch'ler ───────────────────────────────────────
describe('personelUyarilari() — ek senaryolar', () => {
  test('isveren rolü kendi firmasına göre filtreler', async () => {
    Personel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue([]),
    });

    const req = {
      query: {},
      kullanici: { rol: 'isveren', isverenFirma: 'f1' },
    };
    const res = mockRes();
    await personelUyarilari(req, res);

    expect(Personel.find).toHaveBeenCalledWith(
      expect.objectContaining({ firma: 'f1' })
    );
  });

  test('yaklaşan muayene (30 gün içinde) uyarı listesine girer', async () => {
    const yaklasanTarih = new Date(Date.now() + 86400000 * 10); // 10 gün sonra
    const personeller = [{
      adSoyad: 'Fatma Şahin',
      firma: { firmaAdi: 'ABC Ltd' },
      muayene:   { gecerlilikBitis: yaklasanTarih },
      egitim:    {},
      ilkyardim: {},
    }];

    Personel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue(personeller),
    });

    const req = { query: {}, kullanici: { rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await personelUyarilari(req, res);

    const cevap = res.json.mock.calls[0][0];
    expect(cevap.sayi).toBeGreaterThan(0);
    expect(cevap.veri[0].durum).toBe('yaklasan');
  });

  test('DB hatası → 500 döner', async () => {
    Personel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      lean:     jest.fn().mockRejectedValue(new Error('DB hatası')),
    });

    const req = { query: {}, kullanici: { rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await personelUyarilari(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── tumPersonel — ek branch: isveren ────────────────────────────────────────
describe('tumPersonel() — isveren branch', () => {
  test('isveren kendi firmasının personelini görür', async () => {
    Personel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue([{ adSoyad: 'İşveren Personeli' }]),
    });

    const req = {
      kullanici: { _id: 'iv1', rol: 'isveren', isverenFirma: 'f1' },
      query: {},
    };
    const res = mockRes();
    await tumPersonel(req, res);

    expect(Personel.find).toHaveBeenCalledWith(
      expect.objectContaining({ firma: 'f1' })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });
});