// tests/egitimController.test.js
process.env.JWT_SECRET     = 'test_gizli_anahtar';
process.env.NODE_ENV       = 'test';
process.env.OPENAI_API_KEY = 'test-key';
process.env.GEMINI_API_KEY = 'test-key';
process.env.EMAIL_USER     = 'test@example.com';
process.env.EMAIL_PASS     = 'test-pass';
process.env.SMTP_HOST      = 'smtp.example.com';

jest.mock('../models/Egitim');
jest.mock('../models/Firma');
jest.mock('../utils/emailGonder', () => ({
  emailGonder: jest.fn().mockResolvedValue(true),
}));

const Egitim = require('../models/Egitim');
const Firma  = require('../models/Firma');

const {
  tumEgitimler,
  egitimEkle,
  egitimGuncelle,
  egitimSil,
} = require('../controllers/egitimController');

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ─── tumEgitimler ────────────────────────────────────────────────────────────
describe('tumEgitimler()', () => {
  test('sistem yöneticisi tüm eğitimleri görür', async () => {
    Egitim.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue([{ konu: 'Yangın', durum: 'planlandi' }]),
    });

    const req = { kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await tumEgitimler(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });

  test('isg_uzmani kendi firmalarının eğitimlerini görür', async () => {
    Firma.find = jest.fn().mockResolvedValue([{ _id: 'f1' }, { _id: 'f2' }]);
    Egitim.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue([]),
    });

    const req = { kullanici: { _id: 'uzman1', rol: 'isg_uzmani' } };
    const res = mockRes();
    await tumEgitimler(req, res);

    expect(Firma.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });

  test('isveren kendi firmasının eğitimlerini görür', async () => {
    Egitim.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue([]),
    });

    const req = { kullanici: { _id: 'isv1', rol: 'isveren', isverenFirma: 'f1' } };
    const res = mockRes();
    await tumEgitimler(req, res);

    expect(Egitim.find).toHaveBeenCalledWith(expect.objectContaining({ firma: 'f1' }));
  });

  test('DB hatası 500 döner', async () => {
    Egitim.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockReturnThis(),
      lean:     jest.fn().mockRejectedValue(new Error('DB hatası')),
    });

    const req = { kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await tumEgitimler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── egitimEkle ──────────────────────────────────────────────────────────────
describe('egitimEkle()', () => {
  test('yeni eğitim oluşturulur → 201', async () => {
    Egitim.create = jest.fn().mockResolvedValue({
      _id: 'e1',
      konu: 'Yangın Eğitimi',
      firma: 'f1',
      durum: 'planlandi',
    });

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: { konu: 'Yangın Eğitimi', firma: 'f1', planlananTarih: '2026-07-01' },
    };
    const res = mockRes();
    await egitimEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });

  test('DB hatası 400 döner', async () => {
    Egitim.create = jest.fn().mockRejectedValue(new Error('Validation failed'));
    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: {},
    };
    const res = mockRes();
    await egitimEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ─── egitimGuncelle ──────────────────────────────────────────────────────────
describe('egitimGuncelle()', () => {
  test('bulunamayan eğitim 404 döner', async () => {
    Egitim.findById = jest.fn().mockResolvedValue(null);
    const req = {
      params: { id: 'e_yok' },
      body: { konu: 'Yeni Konu' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await egitimGuncelle(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('yetkisiz kullanıcı 403 döner', async () => {
    const egitimObj = { _id: 'e1', firma: 'f1' };
    Egitim.findById = jest.fn().mockResolvedValue(egitimObj);
    Firma.findById  = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue({ ekleyenKullanici: 'baska_uzman' }) }) });

    const req = {
      params: { id: 'e1' },
      body: { konu: 'Güncelleme' },
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
    };
    const res = mockRes();
    await egitimGuncelle(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('sistem yöneticisi eğitimi güncelleyebilir', async () => {
    const egitimObj = { _id: 'e1', firma: 'f1' };
    Egitim.findById = jest.fn().mockResolvedValue(egitimObj);
    Egitim.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: 'e1', konu: 'Güncellendi', firma: 'f1' });

    const req = {
      params: { id: 'e1' },
      body: { konu: 'Güncellendi' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await egitimGuncelle(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

// ─── egitimSil ───────────────────────────────────────────────────────────────
describe('egitimSil()', () => {
  test('bulunamayan eğitim 404 döner', async () => {
    Egitim.findById = jest.fn().mockResolvedValue(null);
    const req = {
      params: { id: 'e_yok' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await egitimSil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('sistem yöneticisi başarıyla siler', async () => {
    const egitimObj = { _id: 'e1', firma: 'f1' };
    Egitim.findById = jest.fn().mockResolvedValue(egitimObj);
    Egitim.findByIdAndDelete = jest.fn().mockResolvedValue(egitimObj);

    const req = {
      params: { id: 'e1' },
      kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
    };
    const res = mockRes();
    await egitimSil(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});
