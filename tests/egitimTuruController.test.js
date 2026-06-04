// tests/egitimTuruController.test.js
process.env.JWT_SECRET = 'test_gizli_anahtar';
process.env.NODE_ENV   = 'test';

jest.mock('../models/EgitimTuru');
const EgitimTuru = require('../models/EgitimTuru');

const {
  tumEgitimTurleri,
  egitimTuruEkle,
  egitimTuruSil,
} = require('../controllers/egitimTuruController');

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ─── tumEgitimTurleri ────────────────────────────────────────────────────────
describe('tumEgitimTurleri()', () => {
  test('aktif eğitim türlerini listeler', async () => {
    EgitimTuru.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue([{ ad: 'Yangın Güvenliği' }]),
    });

    const req = {};
    const res = mockRes();
    await tumEgitimTurleri(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });

  test('DB hatası 500 döner', async () => {
    EgitimTuru.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockReturnThis(),
      lean:     jest.fn().mockRejectedValue(new Error('DB hatası')),
    });

    const req = {};
    const res = mockRes();
    await tumEgitimTurleri(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── egitimTuruEkle ──────────────────────────────────────────────────────────
describe('egitimTuruEkle()', () => {
  test('ad olmadan 400 döner', async () => {
    const req = {
      body: { sureSaat: 8 },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await egitimTuruEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('aynı isim zaten varsa 400 döner', async () => {
    EgitimTuru.findOne = jest.fn().mockResolvedValue({ _id: 'tur1', ad: 'Yangın' });
    const req = {
      body: { ad: 'Yangın', sureSaat: 8 },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await egitimTuruEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('başarılı ekleme → 201', async () => {
    EgitimTuru.findOne = jest.fn().mockResolvedValue(null);
    EgitimTuru.create  = jest.fn().mockResolvedValue({ _id: 'tur2', ad: 'İlk Yardım' });
    const req = {
      body: { ad: 'İlk Yardım', sureSaat: 4 },
      kullanici: { _id: 'u1' },
    };
    const res = mockRes();
    await egitimTuruEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

// ─── egitimTuruSil ───────────────────────────────────────────────────────────
describe('egitimTuruSil()', () => {
  test('bulunamayan tür 404 döner', async () => {
    EgitimTuru.findById = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 'yok' }, kullanici: { _id: 'u1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await egitimTuruSil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('başka birinin türünü silmeye çalışan isg_uzmani 403 döner', async () => {
    EgitimTuru.findById = jest.fn().mockResolvedValue({
      _id: 'tur1',
      ekleyenKullanici: 'baska_uzman',
    });
    const req = { params: { id: 'tur1' }, kullanici: { _id: 'uzman1', rol: 'isg_uzmani' } };
    const res = mockRes();
    await egitimTuruSil(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('sistem yöneticisi başarıyla siler', async () => {
    const turObj = {
      _id: 'tur1',
      ekleyenKullanici: 'baska_uzman',
      aktif: true,
      save: jest.fn().mockResolvedValue(true),
    };
    EgitimTuru.findById = jest.fn().mockResolvedValue(turObj);
    const req = { params: { id: 'tur1' }, kullanici: { _id: 'admin1', rol: 'sistem_yoneticisi' } };
    const res = mockRes();
    await egitimTuruSil(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});
