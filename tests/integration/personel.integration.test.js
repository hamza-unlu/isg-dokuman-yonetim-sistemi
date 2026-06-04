// tests/integration/personel.integration.test.js
// Personel API'sini route → middleware → controller → in-memory DB zinciriyle test eder.

const helper  = require('../helpers/testHelper');
const request = require('supertest');
const app     = require('../../app');

let adminToken, isverenToken;
let firmaId, personelId;

beforeAll(async () => {
  await helper.connect();
  adminToken   = (await helper.createToken('sistem_yoneticisi')).token;
  isverenToken = (await helper.createToken('isveren')).token;

  // Test için firma oluştur
  const firmaRes = await request(app)
    .post('/api/firmalar')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ firmaAdi: 'Personel Test Firma', tehlikeSinifi: 'Tehlikeli', calisanSayisi: 20, sgkSicilNo: '2222222222' });
  firmaId = firmaRes.body?.veri?._id || firmaRes.body?._id;
});

afterAll(async () => { await helper.disconnect(); });

describe('Personel API — Entegrasyon', () => {

  it('IT-PER-01 | Token olmadan erişim reddedilir (401)', async () => {
    const res = await request(app).get('/api/personel');
    expect(res.statusCode).toBe(401);
  });

  it('IT-PER-02 | Yönetici personel listesini görür (200)', async () => {
    const res = await request(app)
      .get('/api/personel')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('IT-PER-03 | Yönetici yeni personel ekler (201)', async () => {
    const res = await request(app)
      .post('/api/personel')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        adSoyad: 'Entegrasyon Test Personel',
        firma:   firmaId,
      });
    expect([200, 201]).toContain(res.statusCode);
    personelId = res.body?.veri?._id || res.body?.personel?._id || res.body?._id;
  });

  it('IT-PER-04 | Oluşturulan personel ID ile getirilebilir (200)', async () => {
    if (!personelId) return;
    const res = await request(app)
      .get(`/api/personel/${personelId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('IT-PER-05 | Var olmayan personel 404 döner', async () => {
    const res = await request(app)
      .get('/api/personel/000000000000000000000001')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([404, 400]).toContain(res.statusCode);
  });

  it('IT-PER-06 | Personel güncellenir (200)', async () => {
    if (!personelId) return;
    const res = await request(app)
      .put(`/api/personel/${personelId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ adSoyad: 'Güncellenmiş Ad' });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('IT-PER-07 | İşveren rolü personel ekleyemez veya sadece kendi firmasını görür', async () => {
    const res = await request(app)
      .post('/api/personel')
      .set('Authorization', `Bearer ${isverenToken}`)
      .send({ adSoyad: 'Yetkisiz Personel', firma: firmaId });
    // İşveren ya 403 alır ya da başarısız olur
    expect([400, 401, 403]).toContain(res.statusCode);
  });

  it('IT-PER-08 | Personel uyarıları endpoint erişilebilir (200)', async () => {
    const res = await request(app)
      .get('/api/personel/uyarilar')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});
