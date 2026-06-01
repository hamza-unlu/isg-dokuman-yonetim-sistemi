// tests/integration/firmalar.integration.test.js
// -----------------------------------------------------------------------------
// Firma API'sini katmanlar BİRLİKTE çalışırken test eder:
// route -> authMiddleware -> roleMiddleware -> controller -> Mongoose -> (in-memory) DB
// -----------------------------------------------------------------------------

const helper  = require('../helpers/testHelper');
const request = require('supertest');
const app     = require('../../app');

let adminToken, isverenToken;

beforeAll(async () => {
  await helper.connect();
  adminToken   = (await helper.createToken('sistem_yoneticisi')).token;
  isverenToken = (await helper.createToken('isveren')).token;
});
afterAll(async () => { await helper.disconnect(); });

describe('Firma API — Entegrasyon', () => {

  it('IT-06 | Yönetici firma listesini görür (200)', async () => {
    const res = await request(app)
      .get('/api/firmalar')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('IT-02 | Token olmadan firma listesi reddedilir (401)', async () => {
    const res = await request(app).get('/api/firmalar');
    expect(res.statusCode).toBe(401);
  });

  it('IT-03 | Yönetici yeni firma oluşturur (201)', async () => {
    const res = await request(app)
      .post('/api/firmalar')
      .set('Authorization', `Bearer ${adminToken}`)
      // ⚠️ Aşağıdaki alan adlarını KENDİ Firma şemana göre kontrol et.
      //    (zorunlu alanların hepsini gönderdiğinden emin ol)
      .send({
        firmaAdi: 'Test A.Ş.',
        tehlikeSinifi: 'Tehlikeli',
        calisanSayisi: 30,
        sgkSicilNo: '1234567890',
      });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('IT-05 | Eksik zorunlu alanla firma oluşturma reddedilir (400)', async () => {
    const res = await request(app)
      .post('/api/firmalar')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({}); // boş gövde -> validation devreye girmeli
    expect([400, 422]).toContain(res.statusCode);
  });

  it('IT-04 | İşveren rolü firma oluşturamaz (403)', async () => {
    // Beklenen: roleMiddleware controller'dan önce çalışır -> 403.
    const res = await request(app)
      .post('/api/firmalar')
      .set('Authorization', `Bearer ${isverenToken}`)
      .send({ firmaAdi: 'Yetkisiz A.Ş.' });
    expect([401, 403]).toContain(res.statusCode);
  });
});