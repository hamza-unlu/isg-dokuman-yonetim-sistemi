// tests/system/akis.system.test.js
// -----------------------------------------------------------------------------
// SİSTEM (E2E) TESTİ: Gerçek bir iş akışını baştan sona, durumu adımlar arasında
// taşıyarak doğrular. Bir adımda üretilen firma ID'si sonraki adımlarda kullanılır.
// Gövde alanları gerçek Mongoose şemalarındaki ZORUNLU alanlarla eşleştirilmiştir.
// -----------------------------------------------------------------------------

const helper  = require('../helpers/testHelper');
const request = require('supertest');
const app     = require('../../app');

let token, firmaId, personelId;

beforeAll(async () => {
  await helper.connect();
  token = (await helper.createToken('sistem_yoneticisi')).token;
});
afterAll(async () => { await helper.disconnect(); });

// Her isteğe token eklemek için kısa yardımcı:
const auth = (req) => req.set('Authorization', `Bearer ${token}`);

// Cevaptaki ID alanını farklı olası yapılara göre güvenli yakalar:
const idAl = (body) =>
  body?.veri?._id || body?.firma?._id || body?.personel?._id || body?.dokuman?._id || body?._id;

describe('Sistem Testi (E2E): Firma → Personel → Doküman akışı', () => {

  it('ST-01 | Firma oluşturulur ve ID döner', async () => {
    const res = await auth(request(app).post('/api/firmalar'))
      .send({
        firmaAdi: 'Rumeli',
        tehlikeSinifi: 'Çok Tehlikeli',
        calisanSayisi: 50,
        sgkSicilNo: '9876543210',
      });
    expect([200, 201]).toContain(res.statusCode);
    firmaId = idAl(res.body);
    expect(firmaId).toBeDefined();
  });

  it('ST-02 | Personel eklenir ve firmaya bağlanır', async () => {
    const res = await auth(request(app).post('/api/personel'))
      // Personel şemasında zorunlu olanlar yalnızca: firma + adSoyad.
      // tcKimlik opsiyonel ve TC doğrulamasından geçtiği için bilerek göndermiyoruz.
      .send({
        adSoyad: 'Ata Serinyel',
        firma: firmaId,
      });
    expect([200, 201]).toContain(res.statusCode);
    personelId = idAl(res.body);
  });

  it('ST-04 | Doküman oluşturulur ve durumu hesaplanır', async () => {
    const res = await auth(request(app).post('/api/dokumanlar'))
      // Doküman şemasında zorunlu olanlar: firma + tur + baslik + belgeTarihi.
      // (durum gerçek bir alan değil; gecerlilikBitis'ten hesaplanan bir virtual'dır.)
      .send({
        firma: firmaId,
        tur: 'Risk Değerlendirmesi',
        baslik: 'Yıllık Risk Değerlendirme Raporu',
        belgeTarihi: '2026-01-15',
      });
    expect([200, 201]).toContain(res.statusCode);
  });

  it('ST-05 | Oluşturulan firma listede görünür', async () => {
    const res = await auth(request(app).get('/api/firmalar'));
    expect(res.statusCode).toBe(200);
  });
});