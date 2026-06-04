// tests/integration/dokumanlar.integration.test.js
// Doküman API'sini route → middleware → controller → in-memory DB zinciriyle test eder.

const helper  = require('../helpers/testHelper');
const request = require('supertest');
const app     = require('../../app');

let adminToken, isverenToken;
let firmaId, dokumanId;

beforeAll(async () => {
  await helper.connect();
  adminToken   = (await helper.createToken('sistem_yoneticisi')).token;
  isverenToken = (await helper.createToken('isveren')).token;

  // Test için firma oluştur
  const firmaRes = await request(app)
    .post('/api/firmalar')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ firmaAdi: 'Test Firma', tehlikeSinifi: 'Az Tehlikeli', calisanSayisi: 10, sgkSicilNo: '1111111111' });
  firmaId = firmaRes.body?.veri?._id || firmaRes.body?._id;
});

afterAll(async () => { await helper.disconnect(); });

describe('Doküman API — Entegrasyon', () => {

  it('IT-DOK-01 | Token olmadan erişim reddedilir (401)', async () => {
    const res = await request(app).get('/api/dokumanlar');
    expect(res.statusCode).toBe(401);
  });

  it('IT-DOK-02 | Yönetici doküman listesini görür (200)', async () => {
    const res = await request(app)
      .get('/api/dokumanlar')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('basari', true);
  });

  it('IT-DOK-03 | Yönetici yeni doküman oluşturur (201)', async () => {
    const payload = {
      firma:       firmaId,
      tur:         'Risk Değerlendirmesi',
      baslik:      'Entegrasyon Test Dokümanı',
      belgeTarihi: '2026-01-15',
    };
    const res = await request(app)
      .post('/api/dokumanlar')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);
    expect([200, 201]).toContain(res.statusCode);
    dokumanId = res.body?.veri?._id || res.body?._id;
  });

  it('IT-DOK-04 | Oluşturulan doküman ID ile getirilebilir (200)', async () => {
    if (!dokumanId) return; // önceki test atlandıysa geç
    const res = await request(app)
      .get(`/api/dokumanlar/${dokumanId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body?.veri?.baslik).toBe('Entegrasyon Test Dokümanı');
  });

  it('IT-DOK-05 | Var olmayan doküman 404 döner', async () => {
    const res = await request(app)
      .get('/api/dokumanlar/000000000000000000000001')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([404, 400]).toContain(res.statusCode);
  });

  it('IT-DOK-06 | Doküman güncellenir (200)', async () => {
    if (!dokumanId) return;
    const res = await request(app)
      .put(`/api/dokumanlar/${dokumanId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ baslik: 'Güncellenmiş Başlık' });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('IT-DOK-07 | Kritik dokümanlar listesi döner (200)', async () => {
    const res = await request(app)
      .get('/api/dokumanlar/kritik')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
