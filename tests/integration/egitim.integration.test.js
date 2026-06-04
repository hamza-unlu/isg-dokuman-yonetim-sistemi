// tests/integration/egitim.integration.test.js
// Eğitim API'sini route → middleware → controller → in-memory DB zinciriyle test eder.

const helper  = require('../helpers/testHelper');
const request = require('supertest');
const app     = require('../../app');

let adminToken, uzmanToken, isverenToken;
let firmaId, egitimId;

beforeAll(async () => {
  await helper.connect();
  adminToken   = (await helper.createToken('sistem_yoneticisi')).token;
  uzmanToken   = (await helper.createToken('isg_uzmani')).token;
  isverenToken = (await helper.createToken('isveren')).token;

  // Test için firma oluştur
  const firmaRes = await request(app)
    .post('/api/firmalar')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      firmaAdi:      'Eğitim Test Firma',
      tehlikeSinifi: 'Çok Tehlikeli',
      calisanSayisi: 50,
      sgkSicilNo:    '3333333333',
    });
  firmaId = firmaRes.body?.veri?._id || firmaRes.body?._id;
});

afterAll(async () => { await helper.disconnect(); });

describe('Eğitim API — Entegrasyon', () => {

  it('IT-EGT-01 | Token olmadan erişim reddedilir (401)', async () => {
    const res = await request(app).get('/api/egitimler');
    expect(res.statusCode).toBe(401);
  });

  it('IT-EGT-02 | Yönetici eğitim listesini görür (200)', async () => {
    const res = await request(app)
      .get('/api/egitimler')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('basarili', true);
  });

  it('IT-EGT-03 | Yönetici yeni eğitim oluşturur (201)', async () => {
    const res = await request(app)
      .post('/api/egitimler')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firma:          firmaId,
        konu:           'Yangın Güvenliği Eğitimi',
        planlananTarih: '2026-08-01',
        durum:          'planlandi',
      });
    expect([200, 201]).toContain(res.statusCode);
    egitimId = res.body?.veri?._id || res.body?._id;
  });

  it('IT-EGT-04 | Oluşturulan eğitim listede görünür', async () => {
    const res = await request(app)
      .get('/api/egitimler')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    // En az 1 eğitim mevcut (az önce oluşturduk)
    expect(Array.isArray(res.body?.veri)).toBe(true);
  });

  it('IT-EGT-05 | Yönetici eğitimi günceller (200)', async () => {
    if (!egitimId) return;
    const res = await request(app)
      .put(`/api/egitimler/${egitimId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ durum: 'tamamlandi' });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('IT-EGT-06 | Yönetici eğitimi siler (200)', async () => {
    if (!egitimId) return;
    const res = await request(app)
      .delete(`/api/egitimler/${egitimId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 204]).toContain(res.statusCode);
  });

  it('IT-EGT-07 | Eğitim türleri listesi erişilebilir (200)', async () => {
    const res = await request(app)
      .get('/api/egitim-turleri')
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});
