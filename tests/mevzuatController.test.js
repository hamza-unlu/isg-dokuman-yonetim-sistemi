// tests/mevzuatController.test.js
process.env.JWT_SECRET = 'test_gizli_anahtar';
process.env.NODE_ENV   = 'test';

jest.mock('../models/Mevzuat');
jest.mock('../models/MevzuatGecmisi');

const Mevzuat        = require('../models/Mevzuat');
const MevzuatGecmisi = require('../models/MevzuatGecmisi');

const {
  tumKurallar,
  kuralGetir,
  anahtarIleGetir,
  kuralEkle,
  kuralSil,
  kuralGecmisiGetir,
  tumGecmis,
} = require('../controllers/mevzuatController');

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('tumKurallar()', () => {
  test('tum kurallari listeler', async () => {
    Mevzuat.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([{ kuralAdi: 'Kural 1' }]),
    });
    const req = { query: {} };
    const res = mockRes();
    await tumKurallar(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true, sayi: 1 }));
  });

  test('grup filtresiyle calisir', async () => {
    Mevzuat.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });
    const req = { query: { grup: 'egitim' } };
    const res = mockRes();
    await tumKurallar(req, res);
    expect(Mevzuat.find).toHaveBeenCalledWith(expect.objectContaining({ grup: 'egitim' }));
  });

  test('DB hatasi 500 doner', async () => {
    Mevzuat.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockRejectedValue(new Error('DB hatasi')),
    });
    const req = { query: {} };
    const res = mockRes();
    await tumKurallar(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('kuralGetir()', () => {
  test('kural bulunamazsa 404 doner', async () => {
    Mevzuat.findById = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 'yok' } };
    const res = mockRes();
    await kuralGetir(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('kural bulunursa doner', async () => {
    Mevzuat.findById = jest.fn().mockResolvedValue({ _id: 'k1', kuralAdi: 'Kural' });
    const req = { params: { id: 'k1' } };
    const res = mockRes();
    await kuralGetir(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

describe('anahtarIleGetir()', () => {
  test('anahtar bulunamazsa 404 doner', async () => {
    Mevzuat.findOne = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const req = { params: { anahtar: 'olmayan_anahtar' } };
    const res = mockRes();
    await anahtarIleGetir(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('anahtar bulunursa doner', async () => {
    Mevzuat.findOne = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: 'k1', anahtar: 'egitim_temel' }),
    });
    const req = { params: { anahtar: 'egitim_temel' } };
    const res = mockRes();
    await anahtarIleGetir(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

describe('kuralEkle()', () => {
  test('basarili kural ekleme 201 doner', async () => {
    Mevzuat.create = jest.fn().mockResolvedValue({ _id: 'k2', kuralAdi: 'Yeni Kural' });
    const req = {
      body: { kuralAdi: 'Yeni Kural', anahtar: 'yeni_kural' },
      kullanici: { _id: 'admin1' },
    };
    const res = mockRes();
    await kuralEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('duplicate anahtar 400 doner', async () => {
    Mevzuat.create = jest.fn().mockRejectedValue({ code: 11000 });
    const req = {
      body: { anahtar: 'mevcut_anahtar' },
      kullanici: { _id: 'admin1' },
    };
    const res = mockRes();
    await kuralEkle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('kuralSil()', () => {
  test('bulunamayan kural 404 doner', async () => {
    Mevzuat.findByIdAndDelete = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 'yok' } };
    const res = mockRes();
    await kuralSil(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('basarili silme 200 doner', async () => {
    Mevzuat.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'k1' });
    const req = { params: { id: 'k1' } };
    const res = mockRes();
    await kuralSil(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

describe('kuralGecmisiGetir()', () => {
  test('gecmis kayitlarini doner', async () => {
    MevzuatGecmisi.find = jest.fn().mockReturnValue({
      sort:     jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue([{ degisiklik: 'X -> Y' }]),
    });
    const req = { params: { id: 'k1' } };
    const res = mockRes();
    await kuralGecmisiGetir(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});

describe('tumGecmis()', () => {
  test('tum gecmis kayitlarini doner', async () => {
    MevzuatGecmisi.find = jest.fn().mockReturnValue({
      sort:     jest.fn().mockReturnThis(),
      limit:    jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean:     jest.fn().mockResolvedValue([]),
    });
    const req = { query: {} };
    const res = mockRes();
    await tumGecmis(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ basarili: true }));
  });
});
