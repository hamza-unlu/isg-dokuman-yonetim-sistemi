// tests/naceController.test.js
process.env.JWT_SECRET = 'test_gizli_anahtar';
process.env.NODE_ENV   = 'test';

jest.mock('../models/Nace');
const Nace = require('../models/Nace');

const {
  tumNaceKodlari,
  naceGetir,
  naceEkle,
  naceGuncelle,
  naceSil,
} = require('../controllers/naceController');

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ─── tumNaceKodlari ──────────────────────────────────────────────────────────
describe('tumNaceKodlari()', () => {
  test('NACE kodlarını listeler', async () => {
    Nace.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([{ kod: '01.11', tanim: 'Tahıl üretimi' }]),
    });

    const req = { query: {} };
    const res = mockRes();
    await tumNaceKodlari(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true, sayi: 1 }));
  });

  test('sinif filtresiyle çalışır', async () => {
    Nace.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    const req = { query: { sinif: 'A' } };
    const res = mockRes();
    await tumNaceKodlari(req, res);
    expect(Nace.find).toHaveBeenCalledWith(expect.objectContaining({ sinif: 'A' }));
  });

  test('arama filtresiyle çalışır', async () => {
    Nace.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    const req = { query: { arama: 'tahıl' } };
    const res = mockRes();
    await tumNaceKodlari(req, res);
    expect(Nace.find).toHaveBeenCalledWith(expect.objectContaining({ $or: expect.any(Array) }));
  });

  test('DB hatası 500 döner', async () => {
    Nace.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockRejectedValue(new Error('DB hatası')),
    });
    const req = { query: {} };
    const res = mockRes();
    await tumNaceKodlari(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── naceGetir ───────────────────────────────────────────────────────────────
describe('naceGetir()', () => {
  test('bulunamazsa 404 döner', async () => {
    Nace.findById = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 'yok' } };
    const res = mockRes();
    await naceGetir(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('bulunursa 200 döner', async () => {
    Nace.findById = jest.fn().mockResolvedValue({ _id: 'n1', kod: '01.11' });
    const req = { params: { id: 'n1' } };
    const res = mockRes();
    await naceGetir(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

// ─── naceEkle ────────────────────────────────────────────────────────────────
describe('naceEkle()', () => {
  test('başarılı ekleme → 201', async () => {
    Nace.create = jest.fn().mockResolvedValue({ _id: 'n2', kod: '02.10' });
    const req = {
      body: { kod: '02.10', tanim: 'Ormancılık' },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await naceEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('duplicate kod 400 döner', async () => {
    Nace.create = jest.fn().mockRejectedValue({ code: 11000 });
    const req = { body: { kod: '01.11' }, kullanici: { _id: 'u1' } };
    const res = mockRes();
    await naceEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ─── naceGuncelle ────────────────────────────────────────────────────────────
describe('naceGuncelle()', () => {
  test('bulunamazsa 404 döner', async () => {
    Nace.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 'yok' }, body: { tanim: 'Yeni' } };
    const res = mockRes();
    await naceGuncelle(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('başarılı güncelleme → 200', async () => {
    Nace.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: 'n1', tanim: 'Güncel' });
    const req = { params: { id: 'n1' }, body: { tanim: 'Güncel' } };
    const res = mockRes();
    await naceGuncelle(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

// ─── naceSil ────────────────────────────────────────────────────────────────
describe('naceSil()', () => {
  test('bulunamazsa 404 döner', async () => {
    Nace.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 'yok' } };
    const res = mockRes();
    await naceSil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('başarılı silme → 200', async () => {
    Nace.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'n1' });
    const req = { params: { id: 'n1' } };
    const res = mockRes();
    await naceSil(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});
