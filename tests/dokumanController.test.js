// tests/dokumanController.test.js
jest.mock('../models/Dokuman');
jest.mock('../models/User');

const Dokuman = require('../models/Dokuman');

const {
  tumDokumanlar, dokumanGetir, dokumanEkle, dokumanGuncelle, dokumanSil, kritikDokumanlar
} = require('../controllers/dokumanController');

beforeEach(() => jest.clearAllMocks());

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ─── tumDokumanlar ────────────────────────────────────────────────────────────
describe('tumDokumanlar()', () => {
  test('tüm dokümanları başarıyla listeler', async () => {
    const docs = [{ baslik: 'Risk Analizi', durum: 'gecerli' }];
    Dokuman.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue(docs),
    });

    const req = {
      kullanici: { rol: 'isg_uzmani' },
      query: {},
    };
    const res = mockRes();
    await tumDokumanlar(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true, sayi: 1 })
    );
  });

  test('isveren sadece kendi firmasını görür', async () => {
    Dokuman.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue([]),
    });

    const req = {
      kullanici: { rol: 'isveren', isverenFirma: 'firma1' },
      query: {},
    };
    const res = mockRes();
    await tumDokumanlar(req, res);

    expect(Dokuman.find).toHaveBeenCalledWith(
      expect.objectContaining({ firma: 'firma1' })
    );
  });

  test('durum filtresi JS tarafında uygulanır', async () => {
    const docs = [
      { baslik: 'A', durum: 'gecerli' },
      { baslik: 'B', durum: 'suresi_dolmus' },
    ];
    Dokuman.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue(docs),
    });

    const req = {
      kullanici: { rol: 'isg_uzmani' },
      query: { durum: 'suresi_dolmus' },
    };
    const res = mockRes();
    await tumDokumanlar(req, res);

    const cevap = res.json.mock.calls[0][0];
    expect(cevap.sayi).toBe(1);
    expect(cevap.veri[0].baslik).toBe('B');
  });

  test('DB hatası 500 döner', async () => {
    Dokuman.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockRejectedValue(new Error('Bağlantı hatası')),
    });

    const req = { kullanici: { rol: 'isg_uzmani' }, query: {} };
    const res = mockRes();
    await tumDokumanlar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─── dokumanGetir ─────────────────────────────────────────────────────────────
describe('dokumanGetir()', () => {
  test('doküman bulunamazsa 404 döner', async () => {
    const inner = { populate: jest.fn().mockResolvedValue(null) };
    Dokuman.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue(inner) });

    const req = { params: { id: 'yok' }, kullanici: { rol: 'isg_uzmani' } };
    const res = mockRes();
    await dokumanGetir(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('doküman bulunursa 200 döner', async () => {
    const doc = { _id: 'd1', baslik: 'Tatbikat Raporu' };
    const inner = { populate: jest.fn().mockResolvedValue(doc) };
    Dokuman.findById = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue(inner) });

    const req = { params: { id: 'd1' }, kullanici: { rol: 'isg_uzmani' } };
    const res = mockRes();
    await dokumanGetir(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });
});

// ─── dokumanEkle ─────────────────────────────────────────────────────────────
describe('dokumanEkle()', () => {
  test('geçerli veriyle doküman oluşturulur → 201', async () => {
    const yeniDoc = { _id: 'd2', baslik: 'ISG Kurul' };
    const mockPopulate = jest.fn().mockResolvedValue(yeniDoc);
    Dokuman.create = jest.fn().mockResolvedValue({
      ...yeniDoc,
      populate: mockPopulate,
    });

    const req = {
      kullanici: { _id: 'uzman1', rol: 'isg_uzmani', adSoyad: 'Test Uzman' },
      body: { baslik: 'ISG Kurul', firma: 'f1', belgeTarihi: new Date() },
    };
    const res = mockRes();
    await dokumanEkle(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

// ─── dokumanGuncelle ─────────────────────────────────────────────────────────
describe('dokumanGuncelle()', () => {
  test('doküman bulunamazsa 404 döner', async () => {
    const inner = { populate: jest.fn().mockResolvedValue(null) };
    Dokuman.findByIdAndUpdate = jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue(inner) });

    const req = {
      params: { id: 'yok' },
      body: { baslik: 'Yeni Başlık' },
      kullanici: { rol: 'isg_uzmani' },
    };
    const res = mockRes();
    await dokumanGuncelle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─── dokumanSil ───────────────────────────────────────────────────────────────
describe('dokumanSil()', () => {
  test('doküman bulunamazsa 404 döner', async () => {
    Dokuman.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    const req = { params: { id: 'yok' }, kullanici: { rol: 'isg_uzmani' } };
    const res = mockRes();
    await dokumanSil(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('başarılı silme işlemi', async () => {
    Dokuman.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: 'd1' });

    const req = { params: { id: 'd1' }, kullanici: { rol: 'isg_uzmani' } };
    const res = mockRes();
    await dokumanSil(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: true })
    );
  });
});

// ─── kritikDokumanlar ────────────────────────────────────────────────────────
describe('kritikDokumanlar()', () => {
  test('süresi dolmuş ve yaklaşan dokümanları filtreler', async () => {
    const docs = [
      { baslik: 'A', durum: 'suresi_dolmus', gecerlilikBitis: new Date() },
      { baslik: 'B', durum: 'yaklasan',      gecerlilikBitis: new Date() },
      { baslik: 'C', durum: 'gecerli',       gecerlilikBitis: new Date() },
    ];
    Dokuman.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort:     jest.fn().mockResolvedValue(docs),
    });

    const req = {
      kullanici: { rol: 'isg_uzmani' },
      query: {},
    };
    const res = mockRes();
    await kritikDokumanlar(req, res);

    const cevap = res.json.mock.calls[0][0];
    expect(cevap.basari).toBe(true);
    expect(cevap.sayi).toBe(2); // sadece suresi_dolmus + yaklasan
  });
});