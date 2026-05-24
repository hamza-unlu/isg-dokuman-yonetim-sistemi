// tests/authMiddleware.test.js
const jwt = require('jsonwebtoken');

// Kullanici modelini mockla — gerçek DB bağlantısı gerekmez
jest.mock('../models/User');
const Kullanici = require('../models/User');

const kimlikDogrula = require('../middleware/authMiddleware');

// Her testten önce mock'ları temizle
beforeEach(() => jest.clearAllMocks());

// ─── Yardımcı: sahte req/res/next nesneleri ──────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1) TOKEN YOK
// ─────────────────────────────────────────────────────────────────────────────
describe('Token gönderilmediğinde', () => {
  test('401 döner ve hata mesajı içerir', async () => {
    const req  = { headers: {} };
    const res  = mockRes();
    const next = jest.fn();

    await kimlikDogrula(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ basari: false })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2) GEÇERSİZ TOKEN
// ─────────────────────────────────────────────────────────────────────────────
describe('Geçersiz token gönderildiğinde', () => {
  test('401 döner', async () => {
    const req  = { headers: { authorization: 'Bearer gecersiz.token.xyz' } };
    const res  = mockRes();
    const next = jest.fn();

    process.env.JWT_SECRET = 'test_gizli_anahtar';
    await kimlikDogrula(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3) SÜRESİ DOLMUŞ TOKEN
// ─────────────────────────────────────────────────────────────────────────────
describe('Süresi dolmuş token gönderildiğinde', () => {
  test('401 döner ve "Oturum süresi doldu" mesajı içerir', async () => {
    process.env.JWT_SECRET = 'test_gizli_anahtar';

    // 1 ms önce süresi dolacak token üret
    const eskiToken = jwt.sign(
      { id: 'kullanici123' },
      process.env.JWT_SECRET,
      { expiresIn: -1 }
    );

    const req  = { headers: { authorization: `Bearer ${eskiToken}` } };
    const res  = mockRes();
    const next = jest.fn();

    await kimlikDogrula(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mesaj: expect.stringContaining('Oturum süresi doldu') })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4) GEÇERLİ TOKEN AMA KULLANICI VERİTABANINDA YOK
// ─────────────────────────────────────────────────────────────────────────────
describe('Token geçerli ama kullanıcı DB\'de bulunamadığında', () => {
  test('401 döner', async () => {
    process.env.JWT_SECRET = 'test_gizli_anahtar';

    const token = jwt.sign({ id: 'silinmis_id' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    Kullanici.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null) // kullanıcı bulunamadı
    });

    const req  = { headers: { authorization: `Bearer ${token}` } };
    const res  = mockRes();
    const next = jest.fn();

    await kimlikDogrula(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5) GEÇERLİ TOKEN AMA HESAP DEVRE DIŞI
// ─────────────────────────────────────────────────────────────────────────────
describe('Hesabı devre dışı bırakılmış kullanıcı', () => {
  test('403 döner', async () => {
    process.env.JWT_SECRET = 'test_gizli_anahtar';

    const token = jwt.sign({ id: 'pasif_kullanici' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    Kullanici.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: 'pasif_kullanici', aktif: false })
    });

    const req  = { headers: { authorization: `Bearer ${token}` } };
    const res  = mockRes();
    const next = jest.fn();

    await kimlikDogrula(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mesaj: expect.stringContaining('devre dışı') })
    );
    expect(next).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6) HER ŞEY DOĞRU — BAŞARILI GEÇİŞ
// ─────────────────────────────────────────────────────────────────────────────
describe('Geçerli token ve aktif kullanıcı', () => {
  test('next() çağrılır ve req.kullanici set edilir', async () => {
    process.env.JWT_SECRET = 'test_gizli_anahtar';

    const aktifKullanici = {
      _id: 'aktif123',
      ad: 'Hamza',
      rol: 'isg_uzmani',
      aktif: true,
    };

    const token = jwt.sign({ id: aktifKullanici._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    Kullanici.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(aktifKullanici)
    });

    const req  = { headers: { authorization: `Bearer ${token}` } };
    const res  = mockRes();
    const next = jest.fn();

    await kimlikDogrula(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.kullanici).toEqual(aktifKullanici);
    expect(res.status).not.toHaveBeenCalled();
  });
});