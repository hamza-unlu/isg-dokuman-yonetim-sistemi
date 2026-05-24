// tests/firmaController.test.js
jest.mock('../models/Firma');
jest.mock('../models/Personel');
jest.mock('../models/Dokuman');
jest.mock('../models/User');

const Firma    = require('../models/Firma');
const Personel = require('../models/Personel');
const Dokuman  = require('../models/Dokuman');

const {
  tumFirmalar, firmaGetir, firmaEkle, firmaGuncelle, firmaSil, firmaIstatistik
} = require('../controllers/firmaController');

beforeEach(() => jest.clearAllMocks());

// ─── Yardımcılar ──────────────────────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

const adminReq = (extra = {}) => ({
  kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' },
  query: {},
  params: {},
  body: {},
  ...extra,
});

// ─── tumFirmalar ──────────────────────────────────────────────────────────────
describe('tumFirmalar()', () => {
  test('yönetici tüm firmaları getirir', async () => {
    const mockFirmalar = [{ firmaAdi: 'A' }, { firmaAdi: 'B' }];
    Firma.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue(mockFirmalar),
    });

    const req = adminReq();
    const res = mockRes();
    await tumFirmalar(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true, sayi: 2 })
    );
  });

  test('isg_uzmani sadece kendi firmalarını görür', async () => {
    Firma.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue([]),
    });

    const req = adminReq({
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      query: {},
    });
    const res = mockRes();
    await tumFirmalar(req, res);

    // filtre ekleyenKullanici: kullaniciId içermeli
    expect(Firma.find).toHaveBeenCalledWith(
      expect.objectContaining({ ekleyenKullanici: 'uzman1' })
    );
  });

  test('DB hatası 500 döner', async () => {
    Firma.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockRejectedValue(new Error('DB hatası')),
    });

    const req = adminReq();
    const res = mockRes();
    await tumFirmalar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── firmaGetir ───────────────────────────────────────────────────────────────
describe('firmaGetir()', () => {
  test('firma bulunamazsa 404 döner', async () => {
    const inner = { populate: jest.fn().mockResolvedValue(null) };
    Firma.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue(inner) });

    const req = adminReq({ params: { id: 'bilinmeyen' } });
    const res = mockRes();
    await firmaGetir(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('yönetici firmayı başarıyla getirir', async () => {
    const firma = { _id: 'f1', firmaAdi: 'Test A.Ş.', ekleyenKullanici: { _id: 'admin1' } };
    const inner = { populate: jest.fn().mockResolvedValue(firma) };
    Firma.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue(inner) });

    const req = adminReq({ params: { id: 'f1' } });
    const res = mockRes();
    await firmaGetir(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });
});

// ─── firmaEkle ────────────────────────────────────────────────────────────────
describe('firmaEkle()', () => {
  test('isveren rolü firma ekleyemez → 403', async () => {
    const req = adminReq({
      kullanici: { _id: 'iv1', rol: 'isveren' },
      body: { firmaAdi: 'X' },
    });
    const res = mockRes();
    await firmaEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('geçerli veriyle firma oluşturulur → 201', async () => {
    const yeniFirma = { _id: 'f2', firmaAdi: 'Yeni Ltd' };
    Firma.create = jest.fn().mockResolvedValue(yeniFirma);

    const Kullanici = require('../models/User');
    Kullanici.findOne = jest.fn().mockResolvedValue(null);
    Kullanici.create  = jest.fn().mockResolvedValue({});

    const req = adminReq({
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani' },
      body: { firmaAdi: 'Yeni Ltd', tehlikeSinifi: 'Az Tehlikeli' },
    });
    const res = mockRes();
    await firmaEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });
});

// ─── firmaSil ─────────────────────────────────────────────────────────────────
describe('firmaSil()', () => {
  test('geçersiz id → 400', async () => {
    const req = adminReq({ params: { id: 'undefined' } });
    const res = mockRes();
    await firmaSil(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('firma bulunamazsa 404 döner', async () => {
    Firma.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const req = adminReq({ params: { id: '507f1f77bcf86cd799439011' } });
    const res = mockRes();
    await firmaSil(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('başarılı soft delete', async () => {
    Firma.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: 'f1', aktif: false });

    const req = adminReq({ params: { id: '507f1f77bcf86cd799439011' } });
    const res = mockRes();
    await firmaSil(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });
});

// ─── firmaIstatistik ──────────────────────────────────────────────────────────
describe('firmaIstatistik()', () => {
  test('istatistikleri doğru döner', async () => {
    Personel.countDocuments = jest.fn().mockResolvedValue(10);
    Dokuman.countDocuments  = jest.fn().mockResolvedValue(5);

    const req = adminReq({ params: { id: 'f1' } });
    const res = mockRes();
    await firmaIstatistik(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });
});