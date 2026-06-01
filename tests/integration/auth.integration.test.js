// tests/integration/auth.integration.test.js
// -----------------------------------------------------------------------------
// Kimlik doğrulama middleware zincirini GERÇEK uygulama üzerinde test eder.
// (route -> authMiddleware -> controller). Bellek-içi DB kullanır.
// -----------------------------------------------------------------------------

const helper  = require('../helpers/testHelper'); // EN ÜSTTE: env'leri ayarlar
const request = require('supertest');
const app     = require('../../app');             // server.js DEĞİL, app.js

beforeAll(async () => { await helper.connect(); });
afterAll(async () => { await helper.disconnect(); });

// Auth zincirini test etmek için korumalı bir endpoint seçiyoruz.
const KORUMALI = '/api/firmalar';

describe('Kimlik Doğrulama (authMiddleware) — Entegrasyon', () => {

  it('IT-02 | Token gönderilmezse erişim reddedilir (401)', async () => {
    const res = await request(app).get(KORUMALI);
    expect(res.statusCode).toBe(401);
  });

  it('Bozuk / sahte token reddedilir (401)', async () => {
    const res = await request(app)
      .get(KORUMALI)
      .set('Authorization', 'Bearer sahte.token.degeri');
    expect(res.statusCode).toBe(401);
  });

  it('Süresi dolmuş token reddedilir (401)', async () => {
    const res = await request(app)
      .get(KORUMALI)
      .set('Authorization', `Bearer ${helper.expiredToken()}`);
    expect(res.statusCode).toBe(401);
  });

  it('IT-01 | Geçerli token + aktif kullanıcı ile erişim açılır (200)', async () => {
    const { token } = await helper.createToken('sistem_yoneticisi');
    const res = await request(app)
      .get(KORUMALI)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});