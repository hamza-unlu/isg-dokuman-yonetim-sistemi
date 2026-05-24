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